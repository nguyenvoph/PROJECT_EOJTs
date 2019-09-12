package com.example.demo.service;

import com.example.demo.config.ActionEnum;
import com.example.demo.config.StudentStatus;
import com.example.demo.entity.*;
import com.example.demo.repository.IInvitationRepository;
import com.example.demo.repository.IOjt_EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class Ojt_EnrollmentService implements IOjt_EnrollmentService {

    @Autowired
    IOjt_EnrollmentRepository ojtEnrollmentRepository;

    @Autowired
    IBusinessService businessService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IHistoryActionService historyActionService;

    @Autowired
    ISupervisorService iSupervisorService;

    @Autowired
    IStudentService iStudentService;

    @Autowired
    IHistoryActionService iHistoryActionService;

    @Override
    public boolean saveListOjtEnrollment(List<Ojt_Enrollment> ojtEnrollmentList) {
        ojtEnrollmentRepository.saveAll(ojtEnrollmentList);
        return true;
    }

    @Override
    public boolean saveOjtEnrollment(Ojt_Enrollment ojtEnrollment) {
        ojtEnrollmentRepository.save(ojtEnrollment);
        return true;
    }

    @Override
    public List<Ojt_Enrollment> getAllOjt_Enrollment() {
        return ojtEnrollmentRepository.findAll();
    }

    @Override
    public int getOjt_EnrollmentIdByBusinessEmail(String email) {
        Ojt_Enrollment ojt_enrollment = ojtEnrollmentRepository.getOjt_EnrollmentByBusiness_Email(email);
        return ojt_enrollment.getId();
    }

    @Override
    public Ojt_Enrollment getOjt_EnrollmentByStudentEmail(String email) {
        Ojt_Enrollment ojt_enrollment = ojtEnrollmentRepository.getOjt_EnrollmentByStudentEmail(email);
        return ojt_enrollment;
    }

    @Override
    public void updateStudentToBusinessPassOption1OrOption2(List<Student> studentList) {
        Semester semester = semesterService.getSemesterCurrent();

        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            if (student.isAcceptedOption1() == true) {
                Business businessOption1 = businessService.findBusinessByName(student.getOption1());

                // Ojt_Enrollment ojt_enrollment = getOjt_EnrollmentByStudentEmail(student.getEmail());
                Ojt_Enrollment ojt_enrollment = getOjtEnrollmentByStudentEmailAndSemesterId(student.getEmail(), semester.getId());
                ojt_enrollment.setBusiness(businessOption1);

                ojtEnrollmentRepository.save(ojt_enrollment);
            } else if (student.isAcceptedOption2() == true) {
                Business businessOption2 = businessService.findBusinessByName(student.getOption2());

                Ojt_Enrollment ojt_enrollment = getOjt_EnrollmentByStudentEmail(student.getEmail());

                ojt_enrollment.setBusiness(businessOption2);

                ojtEnrollmentRepository.save(ojt_enrollment);
            }
        }
    }

    @Override
    public Ojt_Enrollment getOjt_enrollmentOfBusiness(Business business) {
        List<Ojt_Enrollment> ojt_enrollmentList = ojtEnrollmentRepository.getOjt_EnrollmentsByBusiness_Email(business.getEmail());
        for (int i = 0; i < ojt_enrollmentList.size(); i++) {
            if (ojt_enrollmentList.get(i).getStudent() == null) {
                return ojt_enrollmentList.get(i);
            }
        }
        return null;
    }

    @Override
    public List<Student> getListStudentByBusiness(String email) {
        Semester semester = semesterService.getSemesterCurrent();
        //List<Ojt_Enrollment> ojt_enrollmentList = ojtEnrollmentRepository.getOjt_EnrollmentsByBusiness_Email(email);
        List<Ojt_Enrollment> ojt_enrollmentList =
                getOjt_EnrollmentsBySemesterIdAndBusinessNotNullAndStudentNotNull(semester.getId(), email);
        List<Student> studentList = new ArrayList<>();
        for (int i = 0; i < ojt_enrollmentList.size(); i++) {
            if (ojt_enrollmentList.get(i).getStudent() != null) {
                studentList.add(ojt_enrollmentList.get(i).getStudent());
            }
        }
        if (studentList != null) {
            return studentList;
        }
        return null;
    }

    @Override
    public Ojt_Enrollment getOjt_EnrollmentById(int id) {
        Ojt_Enrollment ojt_enrollment = ojtEnrollmentRepository.getOjt_EnrollmentById(id);
        if (ojt_enrollment != null) {
            return ojt_enrollment;
        }
        return null;
    }

    @Autowired
    IInvitationService iInvitationService;

    @Autowired
    IInvitationRepository iInvitationRepository;

    @Override
    public void updateBusinessForStudent(String emailBusiness, String emailStudent) {
        Supervisor supervisor=iSupervisorService.findByEmail(emailBusiness);
        Student student = iStudentService.getStudentByEmail(emailStudent);
        student.setStatus(StudentStatus.STARTED);
        student.setSupervisor(supervisor);

        Business business = businessService.getBusinessByEmail(emailBusiness);
        Date date = new Date(Calendar.getInstance().getTime().getTime());

        Semester semester = semesterService.getSemesterCurrent();

        //Ojt_Enrollment ojt_enrollment = getOjt_EnrollmentByStudentEmail(emailStudent);
        Ojt_Enrollment ojt_enrollment = getOjtEnrollmentByStudentEmailAndSemesterId(emailStudent, semester.getId());

        ojt_enrollment.setTimeEnroll(date);
        ojt_enrollment.setBusiness(business);

       // iStudentService.saveStudent(student);
        iStudentService.updateStudent(student);
        ojtEnrollmentRepository.save(ojt_enrollment);

        Invitation invitation = iInvitationService.getInvitationByBusinessEmailAndStudentEmail(emailBusiness, emailStudent);
        if (invitation != null) {
            invitation.setState(true);
            iInvitationRepository.save(invitation);
        }

        if (ojtEnrollmentRepository.save(ojt_enrollment) != null) {
            HistoryDetail historyDetail = new HistoryDetail(Ojt_Enrollment.class.getName(), "business_email", String.valueOf(ojt_enrollment.getId()), emailBusiness);
            HistoryAction action =
                    new HistoryAction(emailStudent
                            , "ROLE_STUDENT", ActionEnum.UPDATE, "StudentController", new Object() {
                    }
                            .getClass()
                            .getEnclosingMethod()
                            .getName(), null, new java.util.Date(), historyDetail);
            historyDetail.setHistoryAction(action);
            historyActionService.createHistory(action);
        }
    }

    //set business for student by student id and return result
    @Override
    public boolean setBusinessForStudent(String emailBusiness, String emailStudent) {
        Business business = businessService.getBusinessByEmail(emailBusiness);
        Date date = new Date(Calendar.getInstance().getTime().getTime());

        Semester semester = semesterService.getSemesterCurrent();

        //Ojt_Enrollment ojt_enrollment = getOjt_EnrollmentByStudentEmail(emailStudent);
        Ojt_Enrollment ojt_enrollment = getOjtEnrollmentByStudentEmailAndSemesterId(emailStudent, semester.getId());
        boolean flag = false;
        if (ojt_enrollment != null) {

            ojt_enrollment.setTimeEnroll(date);
            ojt_enrollment.setBusiness(business);

            ojtEnrollmentRepository.save(ojt_enrollment);

            HistoryDetail historyDetail = new HistoryDetail(Ojt_Enrollment.class.getName(), "business_email", String.valueOf(ojt_enrollment.getId()), emailBusiness);
            HistoryAction action =
                    new HistoryAction(getEmailFromToken()
                            , "ROLE_ADMIN", ActionEnum.UPDATE, "AdminController", new Object() {
                    }
                            .getClass()
                            .getEnclosingMethod()
                            .getName(), emailStudent, new java.util.Date(), historyDetail);
            historyDetail.setHistoryAction(action);
            iHistoryActionService.createHistory(action);

            flag = true;
        }
        return flag;
    }

    @Override
    public Ojt_Enrollment getOjtEnrollmentByBusinessEmailAndSemesterId(String email, int id) {
        Ojt_Enrollment ojt_enrollment = ojtEnrollmentRepository.getOjt_EnrollmentByBusiness_EmailAndSemesterIdAndStudentIsNull(email, id);
        if (ojt_enrollment != null) {
            return ojt_enrollment;
        }
        return null;
    }

    @Override
    public Ojt_Enrollment getOjtEnrollmentByStudentEmailAndSemesterId(String email, int id) {
        Ojt_Enrollment ojt_enrollment = ojtEnrollmentRepository.getOjt_EnrollmentByStudentEmailAndSemesterId(email, id);
        if (ojt_enrollment != null) {
            return ojt_enrollment;
        }
        return null;
    }

    @Override
    public List<Ojt_Enrollment> getOjt_EnrollmentsBySemesterIdAndStudentEmailNotNull(int id) {
        List<Ojt_Enrollment> ojt_enrollmentList = ojtEnrollmentRepository.getOjt_EnrollmentsBySemesterIdAndStudentEmailNotNull(id);
        if ((ojt_enrollmentList != null)) {
            return ojt_enrollmentList;
        }
        return null;
    }

    @Override
    public List<Ojt_Enrollment> getOjt_EnrollmentsBySemesterIdAndBusinessEmailNotNull(int id) {
        List<Ojt_Enrollment> ojt_enrollmentList = ojtEnrollmentRepository.getOjt_EnrollmentsBySemesterIdAndBusinessEmailIsNotNull(id);
        if ((ojt_enrollmentList != null)) {
            return ojt_enrollmentList;
        }
        return null;
    }

    @Override
    public List<Ojt_Enrollment> getOjt_EnrollmentsBySemesterIdAndBusinessNotNullAndStudentNotNull(int id, String email) {
        List<Ojt_Enrollment> ojt_enrollmentList =
                ojtEnrollmentRepository.getOjt_EnrollmentsBySemesterIdAndBusinessNotNullAndStudentNotNull(id, email);
        if ((ojt_enrollmentList != null)) {
            return ojt_enrollmentList;
        }
        return null;
    }

    @Override
    public int countOjt_EnrollmentsByBusinessEmailAndSemesterIdAndStudentEmailNotNull(String email, int id) {
        return ojtEnrollmentRepository.countOjt_EnrollmentsByBusinessEmailAndSemesterIdAndStudentEmailNotNull(email, id);
    }

    @Override
    public Ojt_Enrollment findOjt_EnrollmentByStudentEmailAndBusinessIsNull(String email) {
        return ojtEnrollmentRepository.findOjt_EnrollmentByStudentEmailAndBusinessIsNull(email);
    }

    @Override
    public Ojt_Enrollment findLastEnrollmentByStudentEmail(String email) {
        return ojtEnrollmentRepository.findLastEnrollmentByStudentEmail(email);
    }

    private String getEmailFromToken() {
        String email = "";
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return email;
    }
}
