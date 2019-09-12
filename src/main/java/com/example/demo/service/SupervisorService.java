package com.example.demo.service;

import com.example.demo.dto.PagingDTO;
import com.example.demo.dto.Student_EvaluationDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.ISupervisorRepository;
import com.example.demo.utils.Utils;
import io.netty.util.internal.logging.InternalLogger;

import java.util.logging.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class SupervisorService implements ISupervisorService {
    @Autowired
    ISupervisorRepository ISupervisorRepository;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    IBusinessService businessService;

    @Autowired
    IUsersService usersService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IStudentService iStudentService;

    @Autowired
    IEvaluationService iEvaluationService;

    Logger log = Logger.getLogger(
            SupervisorService.class.getName());

    @Override
    public Supervisor findByEmail(String email) {
        return ISupervisorRepository.findByEmail(email);
    }

    //check semester // ok
    @Override
    public List<Supervisor> getAllSupervisorOfABusiness(String emailBusiness) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(emailBusiness, semesterCurrent.getId());
        List<Supervisor> supervisors = ISupervisorRepository.findSupervisorsByBusinessEmail(ojt_enrollment.getBusiness().getEmail());

        if (supervisors != null) {
            return supervisors;
        }
        return null;
    }

    //check semester //ok
    @Override
    public boolean createSupervisor(Supervisor supervisor, String emailBusiness) {
        Supervisor supervisorFound = ISupervisorRepository.findByEmail(supervisor.getEmail());

        if (supervisorFound == null) {
            Semester semesterCurrent = semesterService.getSemesterCurrent();
            Ojt_Enrollment ojt_enrollment = null;
            if (emailBusiness == null) {
                ojt_enrollment = null;

            } else {
                ojt_enrollment =
                        ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(emailBusiness, semesterCurrent.getId());
            }
            if (ojt_enrollment != null) {
                supervisor.setBusiness(ojt_enrollment.getBusiness());
            }
            supervisor.setActive(true);
            ISupervisorRepository.save(supervisor);

            if (emailBusiness != null) {
                String password = usersService.getAlphaNumericString();

                Users users = new Users(supervisor.getEmail(), password);
                users.setActive(true);

                List<Role> roleList = new ArrayList<>();
                Role role = new Role();
                role.setId(4);
                role.setDescription("ROLE_SUPERVISOR");
                roleList.add(role);

                users.setRoles(roleList);

                try {
                    log.warning("Sending email to user " + supervisor.getName());
                    usersService.sendEmailToSupervisor(supervisor.getName(), supervisor.getEmail(), password);
                } catch (Exception e) {
                    log.warning("Email could not be sent to user " + supervisor.getName());
                }
                usersService.saveUser(users);
            }

            return true;
        }
        return false;
    }

    @Override
    public boolean updateStateSupervisor(String email, boolean isActive) {

        Supervisor supervisor = ISupervisorRepository.findByEmail(email);
        Users users = usersService.findUserByEmail(supervisor.getEmail());
        if (supervisor != null) {
            users.setActive(isActive);
            supervisor.setActive(isActive);
            ISupervisorRepository.save(supervisor);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateSupervisor(Supervisor supervisor) {
        Supervisor supervisorFindByEmail = ISupervisorRepository.findByEmail(supervisor.getEmail());
        if (supervisorFindByEmail != null) {
            ISupervisorRepository.save(supervisor);
            return true;
        }
        return false;
    }

    @Override
    public PagingDTO getEvaluationListOfSupervisor(String email, int currentPage, int rowsPerPage) {
        List<Student> studentList = iStudentService.getAllStudentOfASupervisor(email);
        List<Student_EvaluationDTO> student_evaluationDTOS = new ArrayList<>();

        for (int i = 0; i < studentList.size(); i++) {
            List<Evaluation> evaluationList = iEvaluationService.getEvaluationsByStudentEmail(studentList.get(i).getEmail());
            Collections.sort(evaluationList);
            if (evaluationList.size() < 4) {
                for (int j = evaluationList.size(); j < 4; j++) {
                    evaluationList.add(null);
                }
            }
            evaluationList = iEvaluationService.checkSemesterOfListEvaluation(evaluationList);
            Student_EvaluationDTO student_evaluationDTO = new Student_EvaluationDTO();
            student_evaluationDTO.setEvaluationList(evaluationList);
            student_evaluationDTO.setStudent(studentList.get(i));

            student_evaluationDTOS.add(student_evaluationDTO);
        }

        if (student_evaluationDTOS != null) {
            Utils<Student_EvaluationDTO> utils = new Utils<>();
            return utils.paging(student_evaluationDTOS, currentPage, rowsPerPage);
        }
        return null;
    }
}
