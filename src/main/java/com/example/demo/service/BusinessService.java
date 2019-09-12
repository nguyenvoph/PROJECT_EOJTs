package com.example.demo.service;

import com.example.demo.dto.Business_JobPostDTO;
import com.example.demo.dto.PagingDTO;
import com.example.demo.dto.Student_EvaluationDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.IBusinessRepository;
import com.example.demo.repository.IEvaluationRepository;
import com.example.demo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class BusinessService implements IBusinessService {
    @Autowired
    IBusinessRepository IBusinessRepository;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    IStudentService studentService;

    @Autowired
    IEvaluationRepository IEvaluationRepository;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    ISupervisorService iSupervisorService;


    @Autowired
    IEvaluationService iEvaluationService;

    @Autowired
    private RedisTemplate<Object, Object> template;

    @Override
    public void saveBusiness(Business business) {
        ValueOperations values = template.opsForValue();
        List<Business> businessList = (List<Business>) values.get("business");
        if (businessList != null) {
            businessList.add(business);
            values.set("business", businessList);
        }
        IBusinessRepository.save(business);

        Supervisor supervisor = new Supervisor();
        supervisor.setEmail(business.getEmail());
        supervisor.setAddress(business.getBusiness_address());
        supervisor.setName(business.getBusiness_eng_name());
        supervisor.setPhone(business.getBusiness_phone());
        iSupervisorService.createSupervisor(supervisor, null);
    }

    @Override
    public List<Business> getAllBusiness() {
        List<Business> businessList = IBusinessRepository.findAll();
        if (businessList != null) {
            return businessList;
        }
        return null;
    }


    @Override
    public List<Business> getAllBusinessBySemester() {
        ValueOperations values = template.opsForValue();
        List<Business> businesses = (List<Business>) values.get("business");
        if (businesses != null) {
            return businesses;
        } else {
            Semester semester = semesterService.getSemesterCurrent();

            List<Ojt_Enrollment> ojt_enrollmentList =
                    ojt_enrollmentService.getOjt_EnrollmentsBySemesterIdAndBusinessEmailNotNull(semester.getId());
            List<Business> businessList = new ArrayList<>();

            if(ojt_enrollmentList!=null && ojt_enrollmentList.size()!=0){
                for (int i = 0; i < ojt_enrollmentList.size(); i++) {
                    Business business = ojt_enrollmentList.get(i).getBusiness();
                    for (int j = 0; j < businessList.size(); j++) {
                        if (businessList.get(j).getEmail().equals(business.getEmail())) {
                            businessList.remove(j);
                        }
                    }
                    businessList.add(business);
                }

                if (businessList != null) {
                    values.set("business", businessList);
                    return businessList;
                }
            }
        }
        return null;
    }

    @Override
    public PagingDTO pagingBusiness(int currentPage, int rowsPerPage) {
        List<Business> businessList = getAllBusinessBySemester();
        Utils<Business> businessUtils = new Utils<>();
        return businessUtils.paging(businessList, currentPage, rowsPerPage);
    }

    @Override
    public Business getBusinessByEmail(String email) {
        Business business = IBusinessRepository.findBusinessByEmail(email);
        if (business != null) {
            return business;
        }
        return null;
    }

    @Override
    public boolean updateBusiness(String email, Business business) {
        Business businessFindByEmail = IBusinessRepository.findBusinessByEmail(email);
        if (businessFindByEmail != null) {
            if (email.equals(business.getEmail())) {
                IBusinessRepository.save(business);
                return true;
            }
        }
        return false;
    }

    @Override
    public Business findBusinessByName(String name) {
        Business business = IBusinessRepository.findBusinessByBusiness_eng_name(name);
        if (business != null) {
            return business;
        }
        return null;
    }

    @Override
    public List<Business> findTop5BusinessByRateAverage() {
        List<Business> businessList = IBusinessRepository.findTop5OrderByRateAverageDesc();
        List<Business> businessListTop5 = new ArrayList<>();

        Semester semester = semesterService.getSemesterCurrent();
        List<Ojt_Enrollment> ojt_enrollmentBusinessCurrent = new ArrayList<>();

        for (int i = 0; i < businessList.size(); i++) {
            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessList.get(i).getEmail(), semester.getId());
            if (ojt_enrollment != null) {
                ojt_enrollmentBusinessCurrent.add(ojt_enrollment);
            }
        }

        if (ojt_enrollmentBusinessCurrent != null) {
            for (int i = 0; i < ojt_enrollmentBusinessCurrent.size(); i++) {
                if (i < 5) {
                    businessListTop5.add(ojt_enrollmentBusinessCurrent.get(i).getBusiness());
                } else {
                    break;
                }
            }
            return businessListTop5;
        }
        return null;
    }

    // check semester // ok
    @Override
    public List<Student> getSuggestListStudent(String emailBusiness) {

//        Business business = businessRepository.findBusinessByEmail(emailBusiness);
//        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_enrollmentOfBusiness(business);

        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(emailBusiness, semesterCurrent.getId());
        List<Student> studentListSuggest = new ArrayList<>();

        //lay duoc list skill cua doanh nghiep
        //List<Skill> skillListBusiness = new ArrayList<>();
        List<Skill> skillListOfAJobPost = new ArrayList<>();

        List<Job_Post> job_postListOfBusiness = new ArrayList<>();
        for (int i = 0; i < ojt_enrollment.getJob_posts().size(); i++) {
            job_postListOfBusiness.add(ojt_enrollment.getJob_posts().get(i)); // lay duoc list job post
        }

        //List<Student> studentList = studentService.getAllStudents();
        List<Student> studentList = studentService.getAllStudentsBySemesterId();

        for (int i = 0; i < studentList.size(); i++) {
            List<Skill> skillListOfAStudent = studentList.get(i).getSkills();

            for (int j = 0; j < job_postListOfBusiness.size(); j++) {
                Job_Post job_post = job_postListOfBusiness.get(j);
                for (int k = 0; k < job_post.getJob_post_skills().size(); k++) {
                    Skill skill = job_post.getJob_post_skills().get(k).getSkill();
                    skillListOfAJobPost.add(skill);
                }
                //get ra list skill phu hop theo nganh cua tung thang student
                List<Skill> skills = getListSkillBySpecializedOfStudent(skillListOfAJobPost, studentList.get(i).getSpecialized().getId());

                float result = studentService.compareSkillsStudentAndSkillsJobPost(skillListOfAStudent, skills);

                if (result >= 0.5) {
                    if (!studentListSuggest.contains(studentList.get(i))) {
                        studentListSuggest.add(studentList.get(i));
                    }
                }
                skillListOfAJobPost = new ArrayList<>();
            }

        }
        return studentListSuggest;
    }

    @Override
    public List<Skill> getListSkillBySpecializedOfStudent(List<Skill> skillListOfBusiness, int specialized) {
        List<Skill> list = new ArrayList<>();
        for (int i = 0; i < skillListOfBusiness.size(); i++) {
            if (skillListOfBusiness.get(i).getSpecialized().getId() == specialized) {
                list.add(skillListOfBusiness.get(i));
            }
        }
        return list;
    }

    @Override
    public void updateRateNumber(String email, int rate) {
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(email);
        Business business = ojt_enrollment.getBusiness();

        int countRate = business.getRateCount();
        float currentRate = business.getRateAverage();
        if (currentRate == 0) {

        }
        float average = (currentRate + (float) rate) / 2;
        if (currentRate == 0) {
            business.setRateAverage(rate);
        } else {
            business.setRateAverage(average);
        }
        business.setRateCount(++countRate);

        IBusinessRepository.save(business);
    }

    //@Cacheable(value = "jobposts",unless= "#result.size() == 0")
    //check semester //ok
    @Override
    public List<Business_JobPostDTO> getAllJobPostOfBusinesses() {
        // List<Business> businessList = getAllBusiness();
        List<Business> businessList = getAllBusinessBySemester();
        List<Business_JobPostDTO> business_jobPostDTOList = new ArrayList<>();

        for (int i = 0; i < businessList.size(); i++) {
            Business_JobPostDTO business_jobPostDTO = new Business_JobPostDTO();
            business_jobPostDTO.setBusiness(businessList.get(i));

            //get instance ojt_enrollments

            Semester semesterCurrent = semesterService.getSemesterCurrent();
            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessList.get(i).getEmail(), semesterCurrent.getId());
            for (int j = 0; j < ojt_enrollment.getJob_posts().size(); j++) {
                Job_Post job_post = ojt_enrollment.getJob_posts().get(j);
                business_jobPostDTO.setJob_post(job_post);
                business_jobPostDTOList.add(business_jobPostDTO);

                business_jobPostDTO = new Business_JobPostDTO();
                business_jobPostDTO.setBusiness(businessList.get(i));
            }
        }

        Collections.sort(business_jobPostDTOList);
        return business_jobPostDTOList;
    }

    @Override
    public List<Job_Post> getAllJobPostOfBusiness(String email) {
        Business business = getBusinessByEmail(email);

        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(business.getEmail(), semesterCurrent.getId());

        List<Job_Post> job_postList = ojt_enrollment.getJob_posts();

        return job_postList;
    }

    @Override
    public List<Evaluation> getEvaluationsOfSupervisor(String email) {
        List<Evaluation> evaluationListResult = new ArrayList<>();

        Supervisor supervisor = iSupervisorService.findByEmail(email);
        List<Evaluation> evaluationList = supervisor.getEvaluations();

        if (evaluationList != null) {
            Semester semester = semesterService.getSemesterByStartDateAndEndDate();

            for (int i = 0; i < evaluationList.size(); i++) {
                Evaluation evaluation = evaluationList.get(i);
                boolean result = checkEvaluationListIsInSemester(semester, evaluation);
                if (result == true) {
                    evaluationListResult.add(evaluation);
                }
            }
            return evaluationListResult;
        }
        return null;
    }

    @Override
    public PagingDTO getEvaluationListOfBusiness(int specializedID, String email, int currentPage, int rowsPerPage) {
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(email);
        List<Student> filteredStudentList = new ArrayList<Student>();
        if (specializedID == -1) {
            filteredStudentList = studentList;
        } else {
            for (int i = 0; i < studentList.size(); i++) {
                if (studentList.get(i).getSpecialized().getId() == specializedID) {
                    filteredStudentList.add(studentList.get(i));
                }
            }
        }
        List<Student_EvaluationDTO> student_evaluationDTOS = new ArrayList<>();

        for (int i = 0; i < filteredStudentList.size(); i++) {
            List<Evaluation> evaluationList = iEvaluationService.getEvaluationsByStudentEmail(filteredStudentList.get(i).getEmail());
            Collections.sort(evaluationList);
            if (evaluationList.size() < 4) {
                for (int j = evaluationList.size(); j < 4; j++) {
                    evaluationList.add(null);
                }
            }
            evaluationList = iEvaluationService.checkSemesterOfListEvaluation(evaluationList);
            Student_EvaluationDTO student_evaluationDTO = new Student_EvaluationDTO();
            student_evaluationDTO.setEvaluationList(evaluationList);
            student_evaluationDTO.setStudent(filteredStudentList.get(i));

            student_evaluationDTOS.add(student_evaluationDTO);
        }

        if (student_evaluationDTOS != null) {
            Utils<Student_EvaluationDTO> utils = new Utils<>();
            return utils.paging(student_evaluationDTOS, currentPage, rowsPerPage);
        }
        return null;
    }

    public boolean checkEvaluationListIsInSemester(Semester semester, Evaluation evaluation) {
        Date dateStart = semester.getStart_date();

        Date dateEnd = semester.getEnd_date();

        Date taskDate = evaluation.getTimeCreated();

        return taskDate.after(dateStart) && taskDate.before(dateEnd);
    }
}
