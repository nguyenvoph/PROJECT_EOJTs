package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.repository.IStudentRepository;
import com.example.demo.repository.ISupervisorRepository;
import com.example.demo.repository.ITaskRepository;
import com.example.demo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.rmi.CORBA.Util;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

@Service
public class StudentService implements IStudentService {
    @Autowired
    IStudentRepository IStudentRepository;

    @Autowired
    ISupervisorRepository ISupervisorRepository;

    @Autowired
    IJob_PostService job_postService;

    @Autowired
    ISkillService skillService;

    @Autowired
    IBusinessService businessService;

    @Autowired
    ITaskService taskService;

    @Autowired
    ITaskRepository ITaskRepository;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IAnswerService iAnswerService;

    @Autowired
    IStudent_AnswerService iStudent_answerService;

    @Autowired
    IStudent_EventService iStudent_eventService;

    @Autowired
    IAdminService iAdminService;

    @Autowired
    IEventService iEventService;

    @Autowired
    IEvaluationService iEvaluationService;

    @Autowired
    private RedisTemplate<Object, Object> template;

    @Autowired
    IUsersService iUsersService;


    @Override
    public Student getStudentByEmail(String email) {
        Student student = IStudentRepository.findByEmail(email);
        return student;
    }

    @Override
    public boolean saveListStudent(List<Student> studentList) {
        IStudentRepository.saveAll(studentList);
        return true;
    }

    @Override
    public boolean saveStudent(Student student) {
        ValueOperations values = template.opsForValue();
        List<Student> studentList = (List<Student>) values.get("students");
        if (studentList != null) {
            studentList.add(student);
            values.set("students", studentList);
        }
        IStudentRepository.save(student);
        return true;
    }

    @Override
    public boolean updateStudent(Student student) {
        IStudentRepository.save(student);
        return true;
    }

    @Override
    public boolean updateStudentPassOrFailRedis(Student student) {
        ValueOperations values = template.opsForValue();
        List<Student> studentList = (List<Student>) values.get("students");
        int position = findPositionStudentInList(studentList, student);
        if (studentList != null) {
            studentList.remove(position);
            studentList.add(student);
            values.set("students", studentList);
        }
        IStudentRepository.save(student);
        return true;
    }

    public int findPositionStudentInList(List<Student> list, Student student) {
        for (int i = 0; i < list.size(); i++) {
            Student studentIsExisted = list.get(i);
            if (studentIsExisted.getEmail().equals(student.getEmail())) {
                return i;
            }
        }
        return -1;
    }

    //@Cacheable(value = "students")
    @Override
    public List<Student> getAllStudents() {
        return IStudentRepository.findAll();
    }

    //check semester //ok
    //@Cacheable("students")
    @Override
    public List<Student> getAllStudentsBySemesterId() {
        ValueOperations values = template.opsForValue();
        List<Student> studentList = (List<Student>) values.get("students");

        if (studentList == null || studentList.size() == 0) {
            studentList = new ArrayList<>();
            Semester semester = semesterService.getSemesterCurrent();
            List<Ojt_Enrollment> ojt_enrollmentList =
                    ojt_enrollmentService.getOjt_EnrollmentsBySemesterIdAndStudentEmailNotNull(semester.getId());
            if (ojt_enrollmentList != null && ojt_enrollmentList.size() != 0) {
                for (int i = 0; i < ojt_enrollmentList.size(); i++) {
                    Student student = ojt_enrollmentList.get(i).getStudent();
                    studentList.add(student);
                }
                if (studentList != null) {
                    values.set("students", studentList);
                    return studentList;
                }
            }
        }
        return studentList;
    }

    @Override
    public List<Student> getAllStudentsBySemesterIdAndNotYetInvitation(String businessEmail) {
        ValueOperations values = template.opsForValue();
        List<Student> studentList = (List<Student>) values.get("studentsIsInvitation" + businessEmail);

        if (studentList == null) {
            studentList = new ArrayList<>();
            Semester semester = semesterService.getSemesterCurrent();
            List<Ojt_Enrollment> ojt_enrollmentList =
                    ojt_enrollmentService.getOjt_EnrollmentsBySemesterIdAndStudentEmailNotNull(semester.getId());
            for (int i = 0; i < ojt_enrollmentList.size(); i++) {
                Student student = ojt_enrollmentList.get(i).getStudent();
                studentList.add(student);
            }
            if (studentList != null) {
                values.set("studentsIsInvitation" + businessEmail, studentList);
                return studentList;
            }
        }
        return studentList;
    }

    @Override
    public int getSpecializedIdByEmail(String email) {
        Student student = getStudentByEmail(email);
        int specializedId = student.getSpecialized().getId();

        return specializedId;
    }

    @Override
    public boolean updateInforStudent(String email, String objective, List<Skill> skillList) {
        ValueOperations values = template.opsForValue();
        List<Student> studentList = (List<Student>) values.get("students");

        Student student = getStudentByEmail(email);
        for (int i = 0; i < skillList.size(); i++) {
            Skill skill = skillList.get(i);
            if (skill.getSpecialized() == null) {
                Skill skillIsExited = skillService.getSkillById(skill.getId());
                if (skillIsExited == null) {
                    skill.setStatus(true);
                    skill.setSoftSkill(true);
                    skillService.saveSkill(skill);
                }
            }
        }
        if (student != null) {
            student.setObjective(objective);
            student.setSkills(skillList);

            if (studentList != null) {
                int position = findPositionStudentInList(studentList, student);
                studentList.remove(position);
                studentList.add(student);
                values.set("students", studentList);
            }

            IStudentRepository.save(student);
            return true;
        }
        return false;
    }

    @Override
    public String updateOption1Student(String email, String option1) {
        Student student = getStudentByEmail(email);
        if (student != null) {
            if (option1 != null || !option1.isEmpty()) {
                student.setOption1(option1);
            }
            IStudentRepository.save(student);
            return "success";
        }

        return "fail";
    }

    @Override
    public String updateOption2Student(String email, String option2) {
        Student student = getStudentByEmail(email);
        if (student != null) {
            if (option2 != null || !option2.isEmpty()) {
                student.setOption2(option2);
            }
            IStudentRepository.save(student);
            return "success";
        }
        return "fail";
    }

    @Override
    public Student getStudentIsInvited(String email) {
        Student student = IStudentRepository.findByEmail(email);
        if (student != null) {
            return student;
        }
        return null;
    }

    //check semester ok
    @Override
    public List<Student> findStudentByBusinessNameOption(String option1, String option2) {
        List<Student> studentList = IStudentRepository.findStudentByOption1OrOption2(option1, option2);

        Semester semester = semesterService.getSemesterCurrent();

        List<Ojt_Enrollment> ojt_enrollmentList = new ArrayList<>();
        for (int i = 0; i < studentList.size(); i++) {
            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(studentList.get(i).getEmail(), semester.getId());
            if (ojt_enrollment != null) {
                ojt_enrollmentList.add(ojt_enrollment);
            }
        }

        List<Student> studentListCurrent = new ArrayList<>();
        for (int i = 0; i < ojt_enrollmentList.size(); i++) {
            Student student = ojt_enrollmentList.get(i).getStudent();
            if (student != null) {
                studentListCurrent.add(student);
            }
        }
        if (studentListCurrent != null) {
            return studentListCurrent;
        }
        return null;
    }

    @Override
    public boolean updateLinkFileResumeForStudent(String email, String resumeLink) {
        ValueOperations values = template.opsForValue();
        List<Student> studentList = (List<Student>) values.get("students");

        Student student = getStudentByEmail(email);
        if (student != null) {
            if (resumeLink != null) {
                student.setResumeLink(resumeLink);
                int position = findPositionStudentInList(studentList, student);
                if (studentList != null) {
                    studentList.remove(position);
                    studentList.add(student);
                    values.set("students", studentList);
                }
                IStudentRepository.save(student);
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean updateStatusOptionOfStudent(List<Integer> numberOfOption, boolean statusOfOption, String emailStudent) {
        Student student = getStudentByEmail(emailStudent);
        boolean flag = false;

        if (student != null) {
            for (int i = 0; i < numberOfOption.size(); i++) {
                if (numberOfOption.get(i) == 1) {
                    student.setAcceptedOption1(statusOfOption);
                    student.setInterviewed1(true);
                    IStudentRepository.save(student);
                    flag = true;
                }
                if (numberOfOption.get(i) == 2) {
                    student.setAcceptedOption2(statusOfOption);
                    student.setInterviewed2(true);
                    IStudentRepository.save(student);
                    flag = true;
                }
            }
        }

        if (flag) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<Student> getAllStudentByStatusOption(int typeGetStatus) {
        List<Student> studentList;
        if (typeGetStatus == 1) {// get all sv pass  option 1
            studentList = IStudentRepository.findStudentsByAcceptedOption1TrueAndAcceptedOption2False();
            return studentList;
        } else if (typeGetStatus == 2) {// get all sv pass  option 2
            studentList = IStudentRepository.findStudentsByAcceptedOption2TrueAndAcceptedOption1False();
            return studentList;
        } else if (typeGetStatus == 3) {// get all sv pass 2 option
            studentList = IStudentRepository.findStudentsByAcceptedOption1TrueAndAcceptedOption2True();
            return studentList;
        } else if (typeGetStatus == 4) {// get all sv fail 2 option
            studentList = IStudentRepository.findStudentsByAcceptedOption1FalseAndAcceptedOption2False();
            return studentList;
        }
        return null;
    }

    @Override
    public boolean updateTokenDeviceForStudent(String emailStudent, String token) {
        Student student = getStudentByEmail(emailStudent);
        if (student != null) {
            student.setToken(token);
            IStudentRepository.save(student);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateLinkTranscriptForStudent(Student student) {
        IStudentRepository.save(student);
        return true;
    }

    @Override
    public boolean assignSupervisorForStudent(List<Student> studentList) {
        if (studentList.size() != 0) {
            IStudentRepository.saveAll(studentList);
            return true;
        }
        return false;
    }

    //check semester //chua test
    @Override
    public List<Job_Post> getSuggestListJobPost(String emailStudent) {
        Student student = IStudentRepository.findByEmail(emailStudent);
        List<Job_Post> job_postListSuggest = new ArrayList<>();
        List<Skill> skillListOfJobPost;

        List<Skill> skillListStudent = student.getSkills();

        List<Job_Post> job_postList = job_postService.getAllJobPost();

        for (int i = 0; i < job_postList.size(); i++) {

            Job_Post job_post = job_postList.get(i);

            skillListOfJobPost = skillService.getListSkillJobPost(job_post);

            float result = compareSkillsStudentAndSkillsJobPost(skillListStudent, skillListOfJobPost);
            if (result >= 0.5) {
                job_postListSuggest.add(job_postList.get(i));
            }
        }
        Semester semester = semesterService.getSemesterCurrent();

        List<Job_Post> job_postListSuggestCurrentSemester = new ArrayList<>();

        for (int i = 0; i < job_postListSuggest.size(); i++) {
            Job_Post job_post = job_postListSuggest.get(i);
            if (semester.getId() == job_post.getOjt_enrollment().getSemester().getId()) {
                job_postListSuggestCurrentSemester.add(job_post);
            }
        }
        return job_postListSuggestCurrentSemester;
        //return job_postListSuggest;
    }

    @Override
    public float compareSkillsStudentAndSkillsJobPost(List<Skill> skillListStudent, List<Skill> skillListJobPost) {
        int similar = 0;
        for (int i = 0; i < skillListStudent.size(); i++) {
            Skill studentSkill = skillListStudent.get(i);
            for (int j = 0; j < skillListJobPost.size(); j++) {
                Skill jobPostSkill = skillListJobPost.get(j);
                if (studentSkill.getName().equals(jobPostSkill.getName())) {
                    similar = similar + 1;
                }
            }
        }

        // float indexSimilarAndStudentSkills = (float) similar / (float) skillListStudent.size();
        float indexSimilarAndJobPostSkills = (float) similar / (float) skillListJobPost.size();

        float result = indexSimilarAndJobPostSkills;
        //   float result = (indexSimilarAndStudentSkills + indexSimilarAndJobPostSkills) / 2;

        return result;
    }

    @Override
    public boolean updateLinkAvatar(String emailStudent, String linkAvatar) {
        Student student = IStudentRepository.findByEmail(emailStudent);
        if (student != null) {
            student.setAvatarLink(linkAvatar);
            IStudentRepository.save(student);
            return true;
        }
        return false;
    }

    @Override
    public Business getBusinessOfStudent(String studentEmail) {
        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_EnrollmentByStudentEmail(studentEmail);
        Business business = ojt_enrollment.getBusiness();
        if (business != null) {
            return business;
        }
        return null;
    }

    @Override
    public List<Business> getBusinessByOptionStudent(String studentEmail) {

        Student student = IStudentRepository.findByEmail(studentEmail);

        String option1 = student.getOption1();
        String option2 = student.getOption2();

        Business businessOption1 = businessService.findBusinessByName((option1));
        Business businessOption2 = businessService.findBusinessByName((option2));

        List<Business> businessList = new ArrayList<>();
        if (businessOption1 != null) {
            businessList.add(businessOption1);
        }
        if (businessOption2 != null) {
            businessList.add(businessOption2);
        }
        return businessList;
    }

    //check semester //ok
    @Override
    public List<Student> getAllStudentOfASupervisor(String email) {
        List<Student> studentList = IStudentRepository.findStudentsBySupervisorEmail(email);

        if (studentList != null) {
            Semester semester = semesterService.getSemesterCurrent();

            List<Ojt_Enrollment> ojt_enrollmentListStudentAtSemester = new ArrayList<>();

            for (int i = 0; i < studentList.size(); i++) {
                Student student = studentList.get(i);
                Ojt_Enrollment ojt_enrollment =
                        ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(student.getEmail(), semester.getId());
                if (ojt_enrollment != null) {
                    ojt_enrollmentListStudentAtSemester.add(ojt_enrollment);
                }
            }
            List<Student> studentsBySemester = new ArrayList<>();

            for (int i = 0; i < ojt_enrollmentListStudentAtSemester.size(); i++) {
                Student student = ojt_enrollmentListStudentAtSemester.get(i).getStudent();
                if (student != null) {
                    studentsBySemester.add(student);
                }
            }
            if (studentsBySemester != null) {
                return studentsBySemester;
            }
        }
        return null;
    }

    @Override
    public boolean updateInformationStudent(String email, String name, String phone, boolean gender, String address, String birthDate) throws ParseException {
        Student student = IStudentRepository.findByEmail(email);
        if (student != null) {
            student.setName(name);
            student.setPhone(phone);
            student.setGender(gender);
            student.setAddress(address);

            SimpleDateFormat sdf1 = new SimpleDateFormat("dd-MM-yyyy");
            java.util.Date date = sdf1.parse(birthDate);
            java.sql.Date dob = new java.sql.Date(date.getTime());

            student.setDob(dob);
            IStudentRepository.save(student);
            return true;
        }
        return false;
    }

    @Override
    public void postFeedBack(String email, String content) {
        Student student = getStudentByEmail(email);

        Answer answer = new Answer();
        answer.setContent(content);

        iAnswerService.saveAnswer(answer);
        iStudent_answerService.saveFeedback(student, answer);

        Date date = new Date(Calendar.getInstance().getTime().getTime());
        Admin admin = iAdminService.findAdminByEmail("admin@gmail.com");
        Event event = new Event();
        event.setTitle("Có feedback mới từ sinh viên");
        event.setDescription(content);
        event.setAdmin(admin);
        event.setTime_created(date);
        event.setRead(false);

        iEventService.createEvent(event);

        Student_Event student_event = new Student_Event();
        student_event.setStudent(student);
        student_event.setEvent(event);
        student_event.setStudent(true);
        iStudent_eventService.saveStudentEvent(student_event);
    }

    @Override
    public List<StudentAnswerDTO> findListStudentAnswer(String email) {
        List<StudentAnswerDTO> answerDTOS = new ArrayList<>();

        List<Student_Answer> student_answers = iStudent_answerService.findStudentAnswersByEmail(email);

        for (int i = 0; i < student_answers.size(); i++) {
            Student student = student_answers.get(i).getStudent();
            //phải có super trc khi có survey
            Business business = student.getSupervisor().getBusiness();

            if (business == null) {
                business = businessService.getBusinessByEmail(student.getSupervisor().getEmail());
            }
            Answer answer = student_answers.get(i).getAnswer();
            Question question = answer.getQuestion();

            if (question != null) {
                StudentAnswerDTO studentAnswerDTO = new StudentAnswerDTO();
                studentAnswerDTO.setStudentEmail(student.getEmail());
                studentAnswerDTO.setBusinessEmail(business.getEmail());

                List<Answer> answers = getListAnswerOfQuestion(student.getEmail(), question.getId(), student_answers);
                studentAnswerDTO.setAnswers(answers);
                studentAnswerDTO.setQuestion(question);

                answerDTOS.add(studentAnswerDTO);
            }
        }
        return answerDTOS;
    }

    public List<Answer> getListAnswerOfQuestion(String emailStudent, int idQuestion, List<Student_Answer> student_answers) {
        List<Answer> answers = new ArrayList<>();
        for (int i = 0; i < student_answers.size(); i++) {
            Student_Answer student_answer = student_answers.get(i);
            if (student_answer.getStudent().getEmail().equals(emailStudent)) {
                Question question = student_answer.getAnswer().getQuestion();
                if (question != null) {
                    if (question.getId() == idQuestion) {
                        answers.add(student_answers.get(i).getAnswer());
                    }
                }
            }
        }
        return answers;
    }

    @Override
    public void studentCreateInformMessage(String email, Event event) {
        Semester semester = semesterService.getSemesterCurrent();
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        Student student = getStudentByEmail(email);
        Student_Event student_event = new Student_Event();

        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semester.getId());
        Business business = ojt_enrollment.getBusiness();

        event.setBusiness(business);
        event.setTime_created(date);
        student_event.setStudent(student);
        student_event.setEvent(event);
        student_event.setStudent(true);

        iEventService.createEvent(event);
        iStudent_eventService.saveStudentEvent(student_event);
    }

    @Override
    public PagingDTO pagingStudent(int currentPage, int rowsPerPage) {
        List<Student> studentList = getAllStudentsBySemesterId();
        Utils<Student> studentUtils = new Utils<>();
        return studentUtils.paging(studentList, currentPage, rowsPerPage);
    }

    @Override
    public PagingDTO getStudentsWithNoCompany(int currentPage, int rowsPerPage) {
        Semester semester = semesterService.getSemesterCurrent();
        List<Student> studentList = getAllStudentsBySemesterId();

        List<Student_OjtenrollmentDTO> student_ojtenrollmentDTOList = new ArrayList<>();
        List<Student_OjtenrollmentDTO> student_ojtenrollmentDTOWithNoCompanyList = new ArrayList<>();

        for (int i = 0; i < studentList.size(); i++) {
            Student_OjtenrollmentDTO student_ojtenrollmentDTO = new Student_OjtenrollmentDTO();
            student_ojtenrollmentDTO.setStudent(studentList.get(i));
            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(studentList.get(i).getEmail(), semester.getId());
            if (ojt_enrollment.getBusiness() != null) {
                student_ojtenrollmentDTO.setBusinessEnroll(ojt_enrollment.getBusiness().getBusiness_eng_name());
            } else {
                if (studentList.get(i).isInterviewed1() == true && studentList.get(i).isInterviewed2() == true) {
                    if (studentList.get(i).isAcceptedOption1() == false && studentList.get(i).isAcceptedOption2() == false) {
                        student_ojtenrollmentDTO.setBusinessEnroll("Rớt");
                    }
                }
            }
            student_ojtenrollmentDTOList.add(student_ojtenrollmentDTO);
        }
        for (int i = 0; i < student_ojtenrollmentDTOList.size(); i++) {
            if (student_ojtenrollmentDTOList.get(i).getBusinessEnroll() == null || student_ojtenrollmentDTOList.get(i).getBusinessEnroll().equals("Rớt")) {
                student_ojtenrollmentDTOWithNoCompanyList.add(student_ojtenrollmentDTOList.get(i));
            }
        }
        Utils<Student_OjtenrollmentDTO> utils = new Utils<>();

        return utils.paging(student_ojtenrollmentDTOWithNoCompanyList, currentPage, rowsPerPage);
    }

    @Override
    public List<Student_OjtenrollmentDTO> getStudentsWithHope() {
        Semester semester = semesterService.getSemesterCurrent();
        List<Student> studentList = getAllStudentsBySemesterId();

        List<Student_OjtenrollmentDTO> student_ojtenrollmentDTOList = new ArrayList<>();

        for (int i = 0; i < studentList.size(); i++) {
            Student_OjtenrollmentDTO student_ojtenrollmentDTO = new Student_OjtenrollmentDTO();
            student_ojtenrollmentDTO.setStudent(studentList.get(i));
            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(studentList.get(i).getEmail(), semester.getId());
            if (ojt_enrollment.getBusiness() != null) {
                student_ojtenrollmentDTO.setBusinessEnroll(ojt_enrollment.getBusiness().getBusiness_eng_name());
            } else {
                if (studentList.get(i).isInterviewed1() == true && studentList.get(i).isInterviewed2() == true) {
                    if (studentList.get(i).isAcceptedOption1() == false && studentList.get(i).isAcceptedOption2() == false) {
                        student_ojtenrollmentDTO.setBusinessEnroll("Rớt");
                    }
                }
            }
            student_ojtenrollmentDTOList.add(student_ojtenrollmentDTO);
        }
        return student_ojtenrollmentDTOList;
    }

    @Override
    public PagingDTO getEvaluationsOfStudents(int specializedID, int currentPage, int rowsPerPage) {
        List<Student> studentList = getAllStudentsBySemesterId();
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

    @Override
    public StudentIsExistedAndNotYet getStudentsIsExisted(List<Student_ImportFileDTO> students) {
        List<Student> studentListIsExisted = new ArrayList<>();
        List<Student> studentNotYet = new ArrayList<>();
        for (int i = 0; i < students.size(); i++) {
            Student_ImportFileDTO student = students.get(i);
            Student studentIsExisted = getStudentByEmail(student.getEmail()); // da co trong ds cu
            if (studentIsExisted != null) {
                studentListIsExisted.add(studentIsExisted);
            } else if (studentIsExisted == null) {
                Student studentParameter = new Student();
                Student studentIsParse = parseStudentImportFileToStudent(student, studentParameter);
                studentNotYet.add(studentIsParse);
            }
        }
        StudentIsExistedAndNotYet existedAndNotYets = new StudentIsExistedAndNotYet();
        existedAndNotYets.setStudentsIsExisted(studentListIsExisted);
        existedAndNotYets.setStudentsNotYet(studentNotYet);
        return existedAndNotYets;
    }

    public Student parseStudentImportFileToStudent(Student_ImportFileDTO student_importFileDTO, Student student) {
        student.setCode(student_importFileDTO.getCode());
        student.setName(student_importFileDTO.getName());
        student.setDob(student_importFileDTO.getDob());
        student.setGender(student_importFileDTO.isGender());
        student.setPhone(student_importFileDTO.getPhone());
        student.setEmail(student_importFileDTO.getEmail());
        student.setAddress(student_importFileDTO.getAddress());
        student.setSpecialized(student_importFileDTO.getSpecialized());
        student.setGpa(student_importFileDTO.getGpa());

        return student;
    }

    @Override
    public void handlerStudentIsExisted(List<Student> students, String semesterName) {
        try {
            Semester semester = semesterService.getSemesterByName(semesterName);

            for (int i = 0; i < students.size(); i++) {
                Student student = students.get(i);
                Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
                ojt_enrollment.setSemester(semester);
                ojt_enrollment.setStudent(student);
                ojt_enrollmentService.saveOjtEnrollment(ojt_enrollment);

                saveStudent(student);

                iUsersService.sendEmailToStudentIsExisted(student.getName(), student.getEmail());
            }
        } catch (Exception e) {
            Logger.getLogger(e.getMessage());
        }
    }
}

