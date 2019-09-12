package com.example.demo.service;

import com.example.demo.config.ReportName;
import com.example.demo.config.StudentStatus;
import com.example.demo.entity.*;
import com.example.demo.repository.IBusinessRepository;
import com.example.demo.repository.IEvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class EvaluationService implements IEvaluationService {
    @Autowired
    IEvaluationRepository IEvaluationRepository;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    IBusinessRepository IBusinessRepository;

    @Autowired
    ISupervisorService supervisorService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IBusinessService iBusinessService;

    @Autowired
    IStudentService iStudentService;

    @Autowired
    ISupervisorService iSupervisorService;

    //check semester //ok
    @Override
    public void createNewEvaluation(Evaluation evaluation, String studentEmail) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(studentEmail, semesterCurrent.getId());

        Date date = new Date(Calendar.getInstance().getTime().getTime());
        evaluation.setOjt_enrollment(ojt_enrollment);
        evaluation.setTimeCreated(date);

        IEvaluationRepository.save(evaluation);

        //generate final report
        if (evaluation.getTitle().equals(ReportName.EVALUATION4)) {
            List<Evaluation> evaluationList = getEvaluationsByStudentEmail(ojt_enrollment.getStudent().getEmail());
            Evaluation evaluationFinal = generateFinalEvaluation(evaluationList);
            evaluationFinal.setOjt_enrollment(ojt_enrollment);
            evaluationFinal.setTimeCreated(date);
            evaluationFinal.setSupervisor(evaluation.getSupervisor());
            IEvaluationRepository.save(evaluationFinal);

            boolean studentPassOrFail = checkStudentPassOrFail(evaluationFinal);

            Student student = evaluationFinal.getOjt_enrollment().getStudent();
            if (studentPassOrFail == true) {
                student.setStatus(StudentStatus.PASS);
            } else {
                student.setStatus(StudentStatus.FAIL);
            }
            iStudentService.updateStudentPassOrFailRedis(student);
        }
    }

    public boolean checkStudentPassOrFail(Evaluation evaluation) {
        float scoreActivity = (float) (evaluation.getScore_activity() * 0.1);
        float scoreDiscipline = (float) (evaluation.getScore_discipline() * 0.4);
        float scoreWork = (float) (evaluation.getScore_work() * 0.5);

        float result = (scoreActivity + scoreDiscipline + scoreWork);
        if (result >= 5) {
            return true;
        } else {
            return false;

        }
    }

    public Evaluation generateFinalEvaluation(List<Evaluation> evaluations) {
        float scoreActivity = 0;
        float scoreDiscipline = 0;
        float scoreWork = 0;

        for (int i = 0; i < evaluations.size(); i++) {
            Evaluation evaluation = evaluations.get(i);
            scoreActivity += evaluation.getScore_activity();
            scoreDiscipline += evaluation.getScore_discipline();
            scoreWork += evaluation.getScore_work();
        }

        Evaluation evaluation = new Evaluation();
        evaluation.setScore_activity(scoreActivity / (float) 4);
        evaluation.setScore_discipline(scoreDiscipline / (float) 4);
        evaluation.setScore_work(scoreWork / (float) 4);
        evaluation.setTitle(ReportName.EVALUATIONFINAL);

        return evaluation;
    }

    //check semester // ok
    @Override
    public List<Evaluation> getEvaluationsBySupervisorEmail(String email) {
        List<Evaluation> evaluationList = IEvaluationRepository.findEvaluationsBySupervisorEmail(email);
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        for (int i = 0; i < evaluationList.size(); i++) {
            if (evaluationList.get(i).getOjt_enrollment().getSemester().getId() != semesterCurrent.getId()) {
                evaluationList.remove(evaluationList.get(i));
            }
        }
        if (evaluationList != null) {
            return evaluationList;
        }
        return null;
    }

    //check semester // ok
    @Override
    public List<Evaluation> getEvaluationsByStudentEmail(String email) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semesterCurrent.getId());

        List<Evaluation> evaluationList = IEvaluationRepository.findEvaluationsByOjt_enrollment(ojt_enrollment);

        for (int i = 0; i < evaluationList.size(); i++) {
            Evaluation evaluation = evaluationList.get(i);
            if (evaluation.getTitle().equals(ReportName.EVALUATIONFINAL)) {
                evaluationList.remove(evaluation);
                break;
            }
        }
        if (evaluationList != null) {
            return evaluationList;
        }
        return null;
    }

    //get all evaluation of business at semester
    @Override
    public List<Evaluation> getEvaluationsByBusinessEmail(String email) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();

        Business business = iBusinessService.getBusinessByEmail(email);
        List<Supervisor> supervisors = business.getSupervisors();

        if (supervisors == null) {
            Supervisor supervisorIsBusiness = iSupervisorService.findByEmail(business.getEmail());
            supervisors.add(supervisorIsBusiness);
        }

        if (supervisors != null) {
            Supervisor supervisorIsBusiness = iSupervisorService.findByEmail(business.getEmail());
            if (supervisorIsBusiness != null) {
                supervisors.add(supervisorIsBusiness);
            }
        }

        if (supervisors != null) {
            List<Evaluation> evaluationList = new ArrayList<>();
            for (int i = 0; i < supervisors.size(); i++) {
                Supervisor supervisor = supervisors.get(i);
                List<Evaluation> evaluationListOfSupervisor = supervisor.getEvaluations();
                if (evaluationListOfSupervisor.size() != 0) {
                    evaluationList.addAll(evaluationListOfSupervisor);
                }
            } //get all evaluation of a business

            if (evaluationList.size() != 0) {
                List<Evaluation> evaluationListResult = new ArrayList<>();
                for (int i = 0; i < evaluationList.size(); i++) {
                    Evaluation evaluation = evaluationList.get(i);
                    if (evaluation.getOjt_enrollment().getSemester().getId() == semesterCurrent.getId()) {
                        evaluationListResult.add(evaluation);
                    }
                } //get evaluation of a business by semester

                return evaluationListResult;
            }
        }
        return null;
    }

    //check semester // ok
    @Override
    public int countEvaluation(String email) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semesterCurrent.getId());

        int count = IEvaluationRepository.countEvaluationByOjt_enrollment(ojt_enrollment);

        return count;
    }

    @Override
    public Evaluation getEvaluationById(int id) {
        Evaluation evaluation = IEvaluationRepository.findById(id);
        if (evaluation != null) {
            return evaluation;
        }
        return null;
    }

    //check semester // ok
    @Override
    public List<Evaluation> getListEvaluationOfBusiness(String email) {
        List<Supervisor> supervisorList = supervisorService.getAllSupervisorOfABusiness(email);//get all supervisor at this semester

        Semester semester = semesterService.getSemesterCurrent();

        List<Evaluation> evaluations = new ArrayList<>();
        for (int i = 0; i < supervisorList.size(); i++) {
            List<Evaluation> list = IEvaluationRepository.findEvaluationsBySupervisorEmail(supervisorList.get(i).getEmail());
            evaluations.addAll(list);// get all evaluation of a supervisor
        }
        evaluations = checkSemesterOfEvaluation(evaluations, semester.getId());

        if (evaluations != null) {
            return evaluations;
        }
        return null;
    }

    @Override
    public List<Evaluation> checkSemesterOfEvaluation(List<Evaluation> evaluations, int semesterId) {
        for (int i = 0; i < evaluations.size(); i++) {
            if (evaluations.get(i).getOjt_enrollment().getSemester().getId() != semesterId) {
                evaluations.remove(evaluations.get(i));
            }
        }
        if (evaluations != null) {
            return evaluations;
        }
        return null;
    }

    @Override
    public boolean updateEvaluation(int id, Evaluation evaluation) {
        Evaluation evaluationFindById = IEvaluationRepository.findById(id);
        evaluation.setOjt_enrollment(evaluationFindById.getOjt_enrollment());
        evaluation.setSupervisor(evaluationFindById.getSupervisor());
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        evaluation.setTimeCreated(date);
        if (evaluationFindById != null) {
            if (id == evaluation.getId()) {
                IEvaluationRepository.save(evaluation);
                return true;
            }
        }
        return false;
    }

    @Override
    public List<Evaluation> getEvaluationListOfStudentList(List<Student> studentList) {
        List<Evaluation> evaluationList = new ArrayList<Evaluation>();
        for (int i = 0; i < studentList.size(); i++) {
            evaluationList.addAll(getEvaluationsByStudentEmail(studentList.get(i).getEmail()));
        }

        List<Evaluation> overviewEvaluationList = new ArrayList<Evaluation>();
        int flag = 0;
        for (int i = 0; i < studentList.size(); i++) {
            flag = 0;
            for (int j = 0; j < evaluationList.size(); j++) {
                if (studentList.get(i).getCode().equals(evaluationList.get(j).getOjt_enrollment().getStudent().getCode())) {
                    overviewEvaluationList.add(evaluationList.get(j));
                    if (flag > 0) {
                        for (int k = 1; k <= flag; k++) {
                            Date date1 = overviewEvaluationList.get(overviewEvaluationList.size() - k).getTimeStart();
                            Date date2 = overviewEvaluationList.get(overviewEvaluationList.size() - 1 - k).getTimeStart();
                            if (date1.before(date2)) {
                                Evaluation tmpEvaluation = overviewEvaluationList.get(overviewEvaluationList.size() - 1 - k);
                                overviewEvaluationList.set(overviewEvaluationList.size() - 1 - k, overviewEvaluationList.get(overviewEvaluationList.size() - k));
                                overviewEvaluationList.set(overviewEvaluationList.size() - k, tmpEvaluation);
                            }
                        }
                    }
                    flag++;
                }
            }
            if (flag < 4) {
                for (int l = flag; l < 4; l++) {
                    overviewEvaluationList.add(null);
                }
            }
        }
        overviewEvaluationList = checkSemesterOfListEvaluation(overviewEvaluationList);
//        Semester semester = semesterService.getSemesterCurrent();
//        for (int i = 0; i < overviewEvaluationList.size(); i++) {
//            Evaluation evaluation=overviewEvaluationList.get(i);
//            if(evaluation!=null){
//                if (evaluation.getOjt_enrollment().getSemester().getId() != semester.getId()) {
//                    overviewEvaluationList.set(i, null);
//                }
//            }
//        }
        if (!overviewEvaluationList.isEmpty()) {
            return overviewEvaluationList;
        }
        return null;
    }

    @Override
    public List<Evaluation> checkSemesterOfListEvaluation(List<Evaluation> evaluationList) {
        Semester semester = semesterService.getSemesterCurrent();
        for (int i = 0; i < evaluationList.size(); i++) {
            Evaluation evaluation = evaluationList.get(i);
            if (evaluation != null) {
                if (evaluation.getOjt_enrollment().getSemester().getId() != semester.getId()) {
                    evaluationList.set(i, null);
                }
            }
        }
        return evaluationList;
    }

    @Override
    public List<Evaluation> getEvaluations() {
        Semester semester = semesterService.getSemesterCurrent();
        List<Evaluation> evaluationList = IEvaluationRepository.findEvaluationsByOjt_enrollmentSemesterId(semester.getId());
        return evaluationList;
    }

    @Override
    public List<Evaluation> getEvaluationsByTitle(ReportName title) {
        List<Evaluation> evaluationList = IEvaluationRepository.findEvaluationsByTitle(title);
        return evaluationList;
    }

}
