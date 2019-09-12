package com.example.demo.controller;

import com.example.demo.config.ActionEnum;
import com.example.demo.config.Status;
import com.example.demo.config.StudentStatus;
import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import com.example.demo.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.util.TextEscapeUtils;
import org.springframework.web.bind.annotation.*;

import javax.persistence.PersistenceException;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.sql.Date;
import java.text.ParseException;
import java.util.*;


@RestController
@RequestMapping("/api/student")
public class StudentController {
    private final String TAG = "StudentController";

    @Autowired
    IStudentService studentService;

    @Autowired
    IUsersService usersService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    ISpecializedService specializedService;

    @Autowired
    ISkillService skillService;

    @Autowired
    IInvitationService invitationService;

    @Autowired
    IBusinessService businessService;

    @Autowired
    IJob_PostService job_postService;

    @Autowired
    ITaskService taskService;

    @Autowired
    IEvaluationService evaluationService;

    @Autowired
    IEventService eventService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IBusiness_ProposedService iBusiness_proposedService;

    @Autowired
    IQuestionService iQuestionService;

    @Autowired
    IStudent_AnswerService iStudent_answerService;

    @Autowired
    IHistoryActionService iHistoryActionService;

    @Autowired
    ISpecializedService iSpecializedService;

    private final Logger LOG = LoggerFactory.getLogger(getClass());

    //check semester //ok
    @PostMapping
    public ResponseEntity<Void> addListStudent(@RequestBody List<Student_ImportFileDTO> studentList) throws Exception {
        String semesterName = studentList.get(0).getSemesterName();
        List<Student> students = new ArrayList<>();

        List<Role> roleList = new ArrayList<>();
        Role role = new Role();
        role.setId(2);
        roleList.add(role);
        List<Users> usersList = new ArrayList<>();
        List<Ojt_Enrollment> ojtEnrollmentList = new ArrayList<>();
        List<String> nameList = new ArrayList<>();

        StudentIsExistedAndNotYet studentIsExistedAndNotYet = studentService.getStudentsIsExisted(studentList);

        List<Student> studentListIsExisted = studentIsExistedAndNotYet.getStudentsIsExisted();
        studentService.handlerStudentIsExisted(studentListIsExisted, semesterName); // handle xong may dua da ton tai

        List<Student> studentListNotYet = studentIsExistedAndNotYet.getStudentsNotYet();
        List<HistoryDetail> details = new ArrayList<>();
        HistoryAction action =
                new HistoryAction(getEmailFromToken()
                        , "ROLE_ADMIN", ActionEnum.INSERT, TAG, new Object() {
                }
                        .getClass()
                        .getEnclosingMethod()
                        .getName(), null, new java.util.Date());
        HistoryDetail detail = null;
        for (int i = 0; i < studentListNotYet.size(); i++) {
            Users users = new Users();
            Specialized specialized = new Specialized();
            String specializedName = "";
            int specializedID = 0;

            users.setEmail(studentListNotYet.get(i).getEmail());
            String password = usersService.getAlphaNumericString();
            users.setPassword(password);
            nameList.add(studentListNotYet.get(i).getName());
            users.setRoles(roleList);
            users.setActive(true);

            specializedName = studentListNotYet.get(i).getSpecialized().getName();
            specializedID = specializedService.getIdByName(specializedName);
            specialized.setId(specializedID);
            studentListNotYet.get(i).setSpecialized(specialized);

            usersList.add(users);

            Semester semester = semesterService.getSemesterByName(semesterName);

            Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
//            Student student = studentService.getStudentByEmail(studentList.get(i).getEmail());
            Student student = new Student();
            student.setEmail(studentListNotYet.get(i).getEmail());
            student.setSpecialized(studentListNotYet.get(i).getSpecialized());
            student.setStatus(StudentStatus.NOTSTART);
            student.setAddress(studentListNotYet.get(i).getAddress());
            student.setDob(studentListNotYet.get(i).getDob());
            student.setGender(studentListNotYet.get(i).isGender());
            student.setName(studentListNotYet.get(i).getName());
            student.setCode(studentListNotYet.get(i).getCode());
            student.setPhone(studentListNotYet.get(i).getPhone());
            student.setGpa(studentListNotYet.get(i).getGpa());
            ojt_enrollment.setStudent(student);
            ojt_enrollment.setSemester(semester);

            ojtEnrollmentList.add(ojt_enrollment);
            students.add(student);
            detail = new HistoryDetail(Student.class.getName(), null, null, student.toString());
            detail.setHistoryAction(action);
            details.add(detail);
        }
        action.setDetails(details);
        iHistoryActionService.createHistory(action);

        try {
            boolean isSendMail = false;
            for (int i = 0; i < usersList.size(); i++) {
                isSendMail = usersService.sendEmail(nameList.get(i), usersList.get(i).getEmail(), usersList.get(i).getPassword());
            }

            if (isSendMail == true) {
                studentService.saveListStudent(students);
                usersService.saveListUser(usersList);

                ojt_enrollmentService.saveListOjtEnrollment(ojtEnrollmentList);
            }
            if (isSendMail == false) {
                return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
            }

        } catch (PersistenceException ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //check semester //ok
    @PostMapping("/new")
    public ResponseEntity<Void> createNewStudent(@RequestBody Student_ImportFileDTO student) throws Exception {

        List<Role> roleList = new ArrayList<>();
        Role role = new Role();
        Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
        Users users = new Users();
        String password = usersService.getAlphaNumericString();

        role.setId(2);
        role.setDescription("ROLE_STUDENT");
        roleList.add(role);
        users.setRoles(roleList);
        users.setEmail(student.getEmail());
        users.setPassword(password);
        users.setActive(true);

        Semester semester = semesterService.getSemesterByName(student.getSemesterName());

        Student student1 = new Student();
        student1.setEmail(student.getEmail());
        Specialized specialized = iSpecializedService.getSpecializedById(student.getSpecialized().getId());
        student1.setSpecialized(specialized);
        student1.setStatus(StudentStatus.NOTSTART);
        student1.setAddress(student.getAddress());
        student1.setDob(student.getDob());
        student1.setGender(student.isGender());
        student1.setName(student.getName());
        student1.setCode(student.getCode());
        student1.setPhone(student.getPhone());
        student1.setGpa(student.getGpa());

        ojt_enrollment.setStudent(student1);
        ojt_enrollment.setSemester(semester);
        try {
            Student studentIsExited = studentService.getStudentByEmail(student1.getEmail());
            if (studentIsExited == null) {
                studentService.saveStudent(student1);
                ojt_enrollmentService.saveOjtEnrollment(ojt_enrollment);

                if (usersService.saveUser(users)) {
                    usersService.sendEmail(student.getName(), users.getEmail(), users.getPassword());
                }

            } else {
                return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
            }
        } catch (PersistenceException ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //check semester //ok
    @GetMapping("/getAllStudent")
    @ResponseBody
    public ResponseEntity<PagingDTO> getAllStudentsWithInternOptionState(@RequestParam int codeSortOrder, @RequestParam int nameSortOrder, @RequestParam int specializedID, @RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        LOG.info("Getting all student");
        Semester semester = semesterService.getSemesterCurrent();
        List<Student> studentList;
        List<Student_OjtenrollmentDTO> student_ojtenrollmentDTOList = new ArrayList<>();
        try {
            studentList = studentService.getAllStudentsBySemesterId();
            List<Student> filteredStudentList = new ArrayList<Student>();

            if (specializedID == -1) {
                filteredStudentList = studentList;
                if (codeSortOrder != 0) {
                    if (codeSortOrder == 1) {
                        Collections.sort(filteredStudentList, new Comparator<Student>() {
                            @Override
                            public int compare(Student o1, Student o2) {
                                String name1 = o1.getCode();
                                String name2 = o2.getCode();
                                return name1.compareTo(name2);
                            }
                        });
                    }
                    if (codeSortOrder == 2) {
                        Collections.sort(filteredStudentList, new Comparator<Student>() {
                            @Override
                            public int compare(Student o1, Student o2) {
                                String name1 = o1.getCode();
                                String name2 = o2.getCode();
                                return name2.compareTo(name1);
                            }
                        });
                    }
                }
                if (nameSortOrder != 0) {
                    if (nameSortOrder == 1) {
                        Collections.sort(filteredStudentList, new Comparator<Student>() {
                            @Override
                            public int compare(Student o1, Student o2) {
                                String name1 = o1.getName();
                                String name2 = o2.getName();
                                return name1.compareTo(name2);
                            }
                        });
                    }
                    if (nameSortOrder == 2) {
                        Collections.sort(filteredStudentList, new Comparator<Student>() {
                            @Override
                            public int compare(Student o1, Student o2) {
                                String name1 = o1.getName();
                                String name2 = o2.getName();
                                return name2.compareTo(name1);
                            }
                        });
                    }
                }
            } else {
                for (int i = 0; i < studentList.size(); i++) {
                    if (studentList.get(i).getSpecialized().getId() == specializedID) {
                        filteredStudentList.add(studentList.get(i));
                    }
                }
                if (codeSortOrder != 0) {
                    if (codeSortOrder == 1) {
                        Collections.sort(filteredStudentList, new Comparator<Student>() {
                            @Override
                            public int compare(Student o1, Student o2) {
                                String name1 = o1.getCode();
                                String name2 = o2.getCode();
                                return name1.compareTo(name2);
                            }
                        });
                    }
                    if (codeSortOrder == 2) {
                        Collections.sort(filteredStudentList, new Comparator<Student>() {
                            @Override
                            public int compare(Student o1, Student o2) {
                                String name1 = o1.getCode();
                                String name2 = o2.getCode();
                                return name2.compareTo(name1);
                            }
                        });
                    }
                }
                if (nameSortOrder != 0) {
                    if (nameSortOrder == 1) {
                        Collections.sort(filteredStudentList, new Comparator<Student>() {
                            @Override
                            public int compare(Student o1, Student o2) {
                                String name1 = o1.getName();
                                String name2 = o2.getName();
                                return name1.compareTo(name2);
                            }
                        });
                    }
                    if (nameSortOrder == 2) {
                        Collections.sort(filteredStudentList, new Comparator<Student>() {
                            @Override
                            public int compare(Student o1, Student o2) {
                                String name1 = o1.getName();
                                String name2 = o2.getName();
                                return name2.compareTo(name1);
                            }
                        });
                    }
                }
            }
            for (int i = 0; i < filteredStudentList.size(); i++) {
                Student student = filteredStudentList.get(i);
                Student_OjtenrollmentDTO student_ojtenrollmentDTO = new Student_OjtenrollmentDTO();
                student_ojtenrollmentDTO.setStudent(student);
                Ojt_Enrollment ojt_enrollment =
                        ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(student.getEmail(), semester.getId());
                if (ojt_enrollment.getBusiness() != null) {
                    student_ojtenrollmentDTO.setBusinessEnroll(ojt_enrollment.getBusiness().getBusiness_eng_name());
                } else {
                    if (student.isInterviewed1() == true && student.isInterviewed2() == true) {
                        if (student.isAcceptedOption1() == false && student.isAcceptedOption2() == false) {
                            student_ojtenrollmentDTO.setBusinessEnroll("Rớt");
                        }
                    }
                }
                student_ojtenrollmentDTOList.add(student_ojtenrollmentDTO);
            }

        } catch (Exception ex) {
            LOG.info(ex.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Utils<Student_OjtenrollmentDTO> utils = new Utils<>();
        PagingDTO pagingDTO = utils.paging(student_ojtenrollmentDTOList, currentPage, rowsPerPage);

        return new ResponseEntity<>(pagingDTO, HttpStatus.OK);
    }

    @GetMapping("/searchListStudent")
    @ResponseBody
    public ResponseEntity<List<Student>> getAllStudentsWithInternOptionState(@RequestParam String valueSearch) {
        LOG.info("Getting all student");
        Semester semester = semesterService.getSemesterCurrent();
        List<Student> studentList;
        List<Student> searchList = new ArrayList<>();
        try {
            studentList = studentService.getAllStudentsBySemesterId();

            for (int i = 0; i < studentList.size(); i++) {
                if (studentList.get(i).getCode().toLowerCase().contains(valueSearch.toLowerCase()) ||
                        studentList.get(i).getName().toLowerCase().contains(valueSearch.toLowerCase()) ||
                        studentList.get(i).getEmail().toLowerCase().contains(valueSearch.toLowerCase())) {
                    searchList.add(studentList.get(i));
                }
            }

        } catch (Exception ex) {
            LOG.info(ex.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(searchList, HttpStatus.OK);
    }

    @GetMapping("/getStudentsWithNoCompany")
    @ResponseBody
    public ResponseEntity<PagingDTO> getStudentsWithNoCompany(@RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
//        LOG.info("Getting all student");
        PagingDTO pagingDTO = studentService.getStudentsWithNoCompany(currentPage, rowsPerPage);
        if (pagingDTO != null) {
            return new ResponseEntity<>(pagingDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/searchStudentWithHope")
    @ResponseBody
    public ResponseEntity<List<Student_OjtenrollmentDTO>> searchStudentWithHope(@RequestParam String valueSearch, @RequestParam int type) {
        List<Student_OjtenrollmentDTO> student_ojtenrollmentDTOList = studentService.getStudentsWithHope();
        List<Student_OjtenrollmentDTO> finalList = new ArrayList<>();
        for (int i = 0; i < student_ojtenrollmentDTOList.size(); i++) {
            if (student_ojtenrollmentDTOList.get(i).getStudent().getEmail().toLowerCase().contains(valueSearch.toLowerCase()) ||
                    student_ojtenrollmentDTOList.get(i).getStudent().getName().toLowerCase().contains(valueSearch.toLowerCase()) ||
                    student_ojtenrollmentDTOList.get(i).getStudent().getSpecialized().getName().toLowerCase().contains(valueSearch.toLowerCase())) {
                if (type == 0) {
                    finalList.add(student_ojtenrollmentDTOList.get(i));
                }
                if (type == 1) {
                    if (student_ojtenrollmentDTOList.get(i).getBusinessEnroll() == null || student_ojtenrollmentDTOList.get(i).getBusinessEnroll().equals("Rớt")) {
                        finalList.add(student_ojtenrollmentDTOList.get(i));
                    }
                }
            }
        }
        if (student_ojtenrollmentDTOList != null) {
            return new ResponseEntity<>(finalList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get listspecialzed
    @GetMapping("/specialized")
    public ResponseEntity<List<Specialized>> getSpecializedList() {
        List<Specialized> specializedList = specializedService.getAllSpecialized();
        if (specializedList != null) {
            return new ResponseEntity<List<Specialized>>(specializedList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // get list skill by specialized of student
    @GetMapping("/list-skill")
    @ResponseBody
    public ResponseEntity<List<Skill>> getListSkillOfStudentBySpecialized() {
        String email = getEmailFromToken();

        int specializedId = studentService.getSpecializedIdByEmail(email);

        List<Skill> skills = skillService.getListSkillBySpecializedOrSoftSkillIsTrue(specializedId);

        if (skills != null) {
            return new ResponseEntity<List<Skill>>(skills, HttpStatus.OK);

        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("student/{email}")
    @ResponseBody
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        return new ResponseEntity<Student>(studentService.getStudentByEmail(email), HttpStatus.OK);
    }


    //update objective
    @PutMapping("/update-resume")
    public ResponseEntity<String> updateInforOfStudent(@RequestParam String objective,
                                                       @RequestBody List<Skill> skillList) {
        String email = getEmailFromToken();
        boolean updateInfor = studentService.updateInforStudent(email, objective, skillList);
        if (updateInfor == false) {
            List<HistoryDetail> details = new ArrayList<>();
            Method someMethod = null;
            try {
                someMethod = new Object() {
                }
                        .getClass()
                        .getEnclosingMethod();
                Parameter[] parameters = someMethod.getParameters();
                for (Parameter parameter : parameters) {
                    HistoryDetail historyDetail = null;
                    if (parameter.getName().contains("0")) {
                        historyDetail = new HistoryDetail(Student.class.getName(), "objective", email, objective);
                    } else {
                        historyDetail = new HistoryDetail(Student.class.getName(), "student_skill", email, skillList.toString());
                    }
                    details.add(historyDetail);

                }
                HistoryAction action =
                        new HistoryAction(email
                                , "ROLE_STUDENT", ActionEnum.UPDATE, TAG, new Object() {
                        }
                                .getClass()
                                .getEnclosingMethod()
                                .getName(), null, new java.util.Date(), details);
                for (HistoryDetail detail : details) {
                    detail.setHistoryAction(action);
                }
                iHistoryActionService.createHistory(action);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new ResponseEntity<String>("fail", HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    //student lay danh sach loi moi cua no
    @GetMapping("/list-invitation")
    @ResponseBody
    public ResponseEntity<List<Invitation>> getListInvitation() {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByStudentEmail(email);
        if (invitationList != null) {
            return new ResponseEntity<List<Invitation>>(invitationList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //student get details invitation
    @GetMapping("/getInvitation")
    @ResponseBody
    public ResponseEntity<Invitation> getInvitation(@RequestParam int id) {
        Invitation invitation = invitationService.getInvitationById(id);
        if (invitation != null) {
            return new ResponseEntity<Invitation>(invitation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //student get job post details by id
    @GetMapping("/getJobPost")
    @ResponseBody
    public ResponseEntity<Job_PostDTO> getListJobPost(@RequestParam int id) {

        Job_Post job_post = job_postService.findJob_PostById(id);
        String emailOfBusiness = job_post.getOjt_enrollment().getBusiness().getEmail();
        Business business = businessService.getBusinessByEmail(emailOfBusiness);

        Job_PostDTO job_postDTO = new Job_PostDTO();
        job_postDTO.setJob_post(job_post);
        job_postDTO.setBusiness(business);

        int view = job_postService.getViewOfJobPost(id);
        job_postService.updateViewOfJobPost(id, ++view);
        if (job_post != null) {
            return new ResponseEntity<Job_PostDTO>(job_postDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //return id of skill
    @GetMapping("/skill")
    @ResponseBody
    public ResponseEntity<Integer> getIdSkillByName(@RequestParam(value = "nameSkill") String nameSkill) {
        System.out.println(nameSkill);
        return new ResponseEntity<Integer>(skillService.fullTextSearch(nameSkill), HttpStatus.OK);
    }

    //update option 1 of student
    @PutMapping("/updateOption1")
    public ResponseEntity<String> updateOption1OfStudent(@RequestParam String option1) {
        String email = getEmailFromToken();
        String update = studentService.updateOption1Student(email, option1);
        if (update.equals("success")) {
            HistoryDetail historyDetail = new HistoryDetail(Student.class.getName(), "option1", email, option1);
            HistoryAction action =
                    new HistoryAction(email
                            , "ROLE_STUDENT", ActionEnum.UPDATE, TAG, new Object() {
                    }
                            .getClass()
                            .getEnclosingMethod()
                            .getName(), null, new java.util.Date(), historyDetail);
            historyDetail.setHistoryAction(action);
            iHistoryActionService.createHistory(action);
        }


        return new ResponseEntity<>(update, HttpStatus.OK);
    }

    //update option 2 of student
    @PutMapping("/updateOption2")
    public ResponseEntity<String> updateOption2OfStudent(@RequestParam String option2) {
        String email = getEmailFromToken();
        String update = studentService.updateOption2Student(email, option2);
        if (update.equals("success")) {
            HistoryDetail historyDetail = new HistoryDetail(Student.class.getName(), "option2", email, option2);
            HistoryAction action =
                    new HistoryAction(email
                            , "ROLE_STUDENT", ActionEnum.UPDATE, TAG, new Object() {
                    }
                            .getClass()
                            .getEnclosingMethod()
                            .getName(), null, new java.util.Date(), historyDetail);
            historyDetail.setHistoryAction(action);
            iHistoryActionService.createHistory(action);

        }
        return new ResponseEntity<>(update, HttpStatus.OK);
    }

    private List<Student> studentListIsInvited = new ArrayList<>();

    //get list student of business invitation
    //get nhung hs ma cty da gui loi moi
    //da fix
    @GetMapping("/getListStudentIsInvited")
    @ResponseBody
    public ResponseEntity<PagingDTO> getListStudentIsInvited(@RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByBusinessEmail(email);
        List<Student> studentListIsInvitedInFunc = new ArrayList<>();
        List<Student_InvitationDTO> studentList = new ArrayList<>();

        Semester semester = semesterService.getSemesterCurrent();

        for (int i = 0; i < invitationList.size(); i++) {
            if (invitationList.get(i).getSemester().getId() != semester.getId()) {
                invitationList.remove(invitationList.get(i));
            }
        }

        for (int i = 0; i < invitationList.size(); i++) {
            Student_InvitationDTO student_invitationDTO = new Student_InvitationDTO();
            Student student = studentService.getStudentIsInvited(invitationList.get(i).getStudent().getEmail());
            List<Invitation> invitations = invitationService.getListInvitationByStudentEmail(student.getEmail());
            student_invitationDTO.setInvitations(invitations);
            student_invitationDTO.setStudent(student);
            studentList.add(student_invitationDTO);
            studentListIsInvitedInFunc.add(student);
        }
        if (studentList != null) {
            studentListIsInvited = studentListIsInvitedInFunc;

            Utils<Student_InvitationDTO> student_invitationDTOUtils = new Utils<>();
            PagingDTO pagingDTO = student_invitationDTOUtils.paging(studentList, currentPage, rowsPerPage);
            return new ResponseEntity<PagingDTO>(pagingDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getListStudentIsInvitedNotPaging")
    @ResponseBody
    public ResponseEntity<List<Student_InvitationDTO>> getListStudentIsInvitedNotPaging() {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByBusinessEmail(email);
        List<Student> studentListIsInvitedInFunc = new ArrayList<>();
        List<Student_InvitationDTO> studentList = new ArrayList<>();

        Semester semester = semesterService.getSemesterCurrent();

        for (int i = 0; i < invitationList.size(); i++) {
            if (invitationList.get(i).getSemester().getId() != semester.getId()) {
                invitationList.remove(invitationList.get(i));
            }
        }

        for (int i = 0; i < invitationList.size(); i++) {
            Student_InvitationDTO student_invitationDTO = new Student_InvitationDTO();
            Student student = studentService.getStudentIsInvited(invitationList.get(i).getStudent().getEmail());
            List<Invitation> invitations = invitationService.getListInvitationByStudentEmail(student.getEmail());
            student_invitationDTO.setInvitations(invitations);
            student_invitationDTO.setStudent(student);
            studentList.add(student_invitationDTO);
            studentListIsInvitedInFunc.add(student);
        }
        if (studentList != null) {
            studentListIsInvited = studentListIsInvitedInFunc;
            return new ResponseEntity<>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/searchInviAllFields")
    @ResponseBody
    public ResponseEntity<List<Student_InvitationDTO>> searchInviAllFields(@RequestParam String valueSearch) {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByBusinessEmail(email);
        List<Student> studentListIsInvitedInFunc = new ArrayList<>();
        List<Student_InvitationDTO> studentList = new ArrayList<>();

        Semester semester = semesterService.getSemesterCurrent();

        for (int i = 0; i < invitationList.size(); i++) {
            if (invitationList.get(i).getSemester().getId() != semester.getId()) {
                invitationList.remove(invitationList.get(i));
            }
        }

        for (int i = 0; i < invitationList.size(); i++) {
            if (invitationList.get(i).getStudent().getCode().toLowerCase().contains(valueSearch.toLowerCase()) ||
                    invitationList.get(i).getStudent().getName().toLowerCase().contains(valueSearch.toLowerCase()) ||
                    invitationList.get(i).getStudent().getSpecialized().getName().toLowerCase().contains(valueSearch.toLowerCase())) {
                Student_InvitationDTO student_invitationDTO = new Student_InvitationDTO();
                Student student = studentService.getStudentIsInvited(invitationList.get(i).getStudent().getEmail());
                List<Invitation> invitations = invitationService.getListInvitationByStudentEmail(student.getEmail());
                student_invitationDTO.setInvitations(invitations);
                student_invitationDTO.setStudent(student);
                studentList.add(student_invitationDTO);
                studentListIsInvitedInFunc.add(student);
            }
        }
        if (studentList != null) {
            studentListIsInvited = studentListIsInvitedInFunc;

            return new ResponseEntity<List<Student_InvitationDTO>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    public ResponseEntity<List<Student_InvitationDTO>> getListStudentOfBusiness() {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByBusinessEmail(email);
        List<Student> studentListIsInvitedInFunc = new ArrayList<>();
        List<Student_InvitationDTO> studentList = new ArrayList<>();

        Semester semester = semesterService.getSemesterCurrent();

        for (int i = 0; i < invitationList.size(); i++) {
            if (invitationList.get(i).getSemester().getId() != semester.getId()) {
                invitationList.remove(invitationList.get(i));
            }
        }

        for (int i = 0; i < invitationList.size(); i++) {

            Student_InvitationDTO student_invitationDTO = new Student_InvitationDTO();
            Student student = studentService.getStudentIsInvited(invitationList.get(i).getStudent().getEmail());
            List<Invitation> invitations = invitationService.getListInvitationByStudentEmail(student.getEmail());
            student_invitationDTO.setInvitations(invitations);
            student_invitationDTO.setStudent(student);
            studentList.add(student_invitationDTO);
            studentListIsInvitedInFunc.add(student);
        }
        if (studentList != null) {
            studentListIsInvited = studentListIsInvitedInFunc;
            return new ResponseEntity<List<Student_InvitationDTO>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //danh sach nhung dua set cong ty vao nguyen vong
    //check semester ok
    @GetMapping("/getListStudentByOption")
    @ResponseBody
    public ResponseEntity<List<Student>> getListStudentByOptionNameBusiness() {
        String email = getEmailFromToken();

        Business business = businessService.getBusinessByEmail(email);

        //confirm o day
        List<Student> studentList =
                studentService.findStudentByBusinessNameOption(business.getBusiness_eng_name(), business.getBusiness_eng_name());
        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    //check semester ok
    //danh sach nhung dua set cong ty vao nguyen vong va trang thai cua nv đó
    @GetMapping("/getListStudentAndOptionAndStatusOptionByCodeName")
    @ResponseBody
    public ResponseEntity<List<Student>> getListStudentByOptionNameBusinessAndStatusOption(@RequestParam String valueSearch) {
        //email of business
        String email = getEmailFromToken();

        Business business = businessService.getBusinessByEmail(email);

        //list student set cty vao nguyen vong
        List<Student> studentList = studentService.findStudentByBusinessNameOption(business.getBusiness_eng_name(), business.getBusiness_eng_name());
        List<Student> filteredStudentList = new ArrayList<Student>();
        if (studentList != null) {
            filteredStudentList = searchStudentByCodeName(studentList, valueSearch);
        }
        List<Student> listResult = new ArrayList<>();

        String businessName = business.getBusiness_eng_name();

        if (filteredStudentList != null) {
            for (int i = 0; i < filteredStudentList.size(); i++) {
                if (filteredStudentList.get(i).getOption1() == null && filteredStudentList.get(i).getOption2() == null) {
                    continue;
                }
                if (filteredStudentList.get(i).getOption2() == null) {
                    if (filteredStudentList.get(i).getOption1().equals(businessName)) {
                        if (filteredStudentList.get(i).isInterviewed1() == false) {
                            listResult.add(filteredStudentList.get(i));
                        }
                    }
                }
                if (filteredStudentList.get(i).getOption1() == null) {
                    if (filteredStudentList.get(i).getOption2().equals(businessName)) {
                        if (filteredStudentList.get(i).isInterviewed2() == false) {
                            listResult.add(filteredStudentList.get(i));
                        }
                    }
                }
                if (filteredStudentList.get(i).getOption1() != null && filteredStudentList.get(i).getOption2() != null) {
                    if (filteredStudentList.get(i).getOption1().equals(businessName)) {
                        if (filteredStudentList.get(i).isInterviewed1() == false) {
                            listResult.add(filteredStudentList.get(i));
                        }
                    }
                    if (filteredStudentList.get(i).getOption2().equals(businessName)) {
                        if (filteredStudentList.get(i).isInterviewed2() == false) {
                            listResult.add(filteredStudentList.get(i));
                        }
                    }
                }
            }
        }
        if (listResult != null) {
            return new ResponseEntity<List<Student>>(listResult, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getListStudentByOptionAndStatusOption")
    @ResponseBody
    public ResponseEntity<PagingDTO> getListStudentByOptionNameBusinessAndStatusOption(@RequestParam int specializedID, @RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        //email of business
        String email = getEmailFromToken();

        Business business = businessService.getBusinessByEmail(email);

        //list student set cty vao nguyen vong
        List<Student> studentList = studentService.findStudentByBusinessNameOption(business.getBusiness_eng_name(), business.getBusiness_eng_name());
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

        List<Student> listResult = new ArrayList<>();

        String businessName = business.getBusiness_eng_name();

        if (filteredStudentList != null) {
            for (int i = 0; i < filteredStudentList.size(); i++) {
                if (filteredStudentList.get(i).getOption1() == null && filteredStudentList.get(i).getOption2() == null) {
                    continue;
                }
                if (filteredStudentList.get(i).getOption2() == null) {
                    if (filteredStudentList.get(i).getOption1().equals(businessName)) {
                        if (filteredStudentList.get(i).isInterviewed1() == false) {
                            listResult.add(filteredStudentList.get(i));
                        }
                    }
                }
                if (filteredStudentList.get(i).getOption1() == null) {
                    if (filteredStudentList.get(i).getOption2().equals(businessName)) {
                        if (filteredStudentList.get(i).isInterviewed2() == false) {
                            listResult.add(filteredStudentList.get(i));
                        }
                    }
                }
                if (filteredStudentList.get(i).getOption1() != null && filteredStudentList.get(i).getOption2() != null) {
                    if (filteredStudentList.get(i).getOption1().equals(businessName)) {
                        if (filteredStudentList.get(i).isInterviewed1() == false) {
                            listResult.add(filteredStudentList.get(i));
                        }
                    }
                    if (filteredStudentList.get(i).getOption2().equals(businessName)) {
                        if (filteredStudentList.get(i).isInterviewed2() == false) {
                            listResult.add(filteredStudentList.get(i));
                        }
                    }
                }
            }
        }

        if (listResult != null) {
            Utils<Student> studentUtils = new Utils<>();
            PagingDTO pagingDTO = studentUtils.paging(listResult, currentPage, rowsPerPage);

            return new ResponseEntity<PagingDTO>(pagingDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester // chua test
    // lay list student chua duoc moi boi cong ty
    @GetMapping("/getListStudentNotYetInvited")
    @ResponseBody
    public ResponseEntity<PagingDTO> getListStudentNotYetInvited(@RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        getListStudentOfBusiness();

        List<Student> listStudentIsInvited = studentListIsInvited;

        String emailBusiness = getEmailFromToken();

        List<Student> listAllStudent = studentService.getAllStudentsBySemesterIdAndNotYetInvitation(emailBusiness);

        List<Student> officialStudentList = ojt_enrollmentService.getListStudentByBusiness(emailBusiness);

        for (int i = 0; i < listStudentIsInvited.size(); i++) {
            String emailStudentIsInvited = listStudentIsInvited.get(i).getEmail();
            for (int j = 0; j < listAllStudent.size(); j++) {
                String emailStudent = listAllStudent.get(j).getEmail();
                if (emailStudent.equals(emailStudentIsInvited)) {
                    listAllStudent.remove(listAllStudent.get(j));
                    break;
                }
            }
        }

        for (int i = 0; i < officialStudentList.size(); i++) {
            String emailStudentIsIn = officialStudentList.get(i).getEmail();
            for (int j = 0; j < listAllStudent.size(); j++) {
                String emailStudent = listAllStudent.get(j).getEmail();
                if (emailStudent.equals(emailStudentIsIn)) {
                    listAllStudent.remove(listAllStudent.get(j));
                    break;
                }
            }
        }

        if (listAllStudent != null) {
            Utils<Student> studentUtils = new Utils<>();
            PagingDTO pagingDTO = studentUtils.paging(listAllStudent, currentPage, rowsPerPage);

            return new ResponseEntity<>(pagingDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/searchStudentNotYetInvitedAllFields")
    @ResponseBody
    public ResponseEntity<List<Student>> searchStudentNotYetInvitedAllFields(@RequestParam String valueSearch) {
        getListStudentOfBusiness();

        List<Student> listStudentIsInvited = studentListIsInvited;

        List<Student> listAllStudent = studentService.getAllStudentsBySemesterId();

        String emailBusiness = getEmailFromToken();
        List<Student> officialStudentList = ojt_enrollmentService.getListStudentByBusiness(emailBusiness);

        for (int i = 0; i < listStudentIsInvited.size(); i++) {
            String emailStudentIsInvited = listStudentIsInvited.get(i).getEmail();
            for (int j = 0; j < listAllStudent.size(); j++) {
                String emailStudent = listAllStudent.get(j).getEmail();
                if (emailStudent.equals(emailStudentIsInvited)) {
                    listAllStudent.remove(listAllStudent.get(j));
                    break;
                }
            }
        }

        for (int i = 0; i < officialStudentList.size(); i++) {
            String emailStudentIsIn = officialStudentList.get(i).getEmail();
            for (int j = 0; j < listAllStudent.size(); j++) {
                String emailStudent = listAllStudent.get(j).getEmail();
                if (emailStudent.equals(emailStudentIsIn)) {
                    listAllStudent.remove(listAllStudent.get(j));
                    break;
                }
            }
        }

        if (listAllStudent != null) {
            List<Student> searchStudentList = searchStudentByCodeNameSpecialized(listAllStudent, valueSearch);

            return new ResponseEntity<>(searchStudentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/updateToken")
    public ResponseEntity<Void> updateTokenForStudent(@RequestParam String token) {
        String emailStudent = getEmailFromToken();
        boolean updateToken = studentService.updateTokenDeviceForStudent(emailStudent, token);
        if (updateToken == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    //student get all job post time post desc
    @GetMapping("/getAllJobPost")
    @ResponseBody
    public ResponseEntity<List<Job_Post>> getAllJobPost() {
        LOG.info("Getting all job post");
        List<Job_Post> job_postList = job_postService.getAllJobPost();
        if (job_postList != null) {
            return new ResponseEntity<List<Job_Post>>(job_postList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }


    //check semester ok
    //  get Invitation By Business Email And StudentEmail
    @GetMapping("/getInvitationByBusinessEmailAndStudentEmail")
    @ResponseBody
    public ResponseEntity<Invitation> getInvitationByBusinessEmailAndStudentEmail(@RequestParam String businessEmail) {
        String studentEmail = getEmailFromToken();
        Invitation invitation = invitationService.getInvitationByBusinessEmailAndStudentEmail(businessEmail, studentEmail);
        if (invitation != null) {
            return new ResponseEntity<Invitation>(invitation, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester // chua test
    @GetMapping("/getJobPostsSuggest")
    @ResponseBody
    public ResponseEntity<List<Business_JobPostDTO>> getJobPostsSuggest() {
        String email = getEmailFromToken();
        List<Business_JobPostDTO> business_jobPostDTOList = new ArrayList<>();

        List<Job_Post> job_postList = studentService.getSuggestListJobPost(email); // tra ve list job post suggest theo ky
        for (int i = 0; i < job_postList.size(); i++) {
            Business_JobPostDTO business_jobPostDTO = new Business_JobPostDTO();
            business_jobPostDTO.setBusiness(job_postList.get(i).getOjt_enrollment().getBusiness());

            business_jobPostDTO.setJob_post(job_postList.get(i));
//            List<Job_Post> postList = new ArrayList<>();
//            postList.add(job_postList.get(i));
            // sua business_jobPostDTO.setJob_postList(postList);

            business_jobPostDTOList.add(business_jobPostDTO);
        }
        if (business_jobPostDTOList != null) {
            return new ResponseEntity<List<Business_JobPostDTO>>(business_jobPostDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/updateLinkAvatar")
    public ResponseEntity<Void> updateLinkAvatar(@RequestParam String avatar) {
        String email = getEmailFromToken();
        boolean update = studentService.updateLinkAvatar(email, avatar);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    @GetMapping("/tasks")
    @ResponseBody
    public ResponseEntity<List<Task>> getTasksOfStudent() {
        String email = getEmailFromToken();

        List<Task> taskList = taskService.findTaskByStudentEmail(email);
        if (taskList != null) {
            return new ResponseEntity<List<Task>>(taskList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester ok
    @GetMapping("/evaluations")
    @ResponseBody
    public ResponseEntity<List<Evaluation>> getEvaluationsOfStudent() {
        String email = getEmailFromToken();

        List<Evaluation> evaluationList = evaluationService.getEvaluationsByStudentEmail(email);
        if (evaluationList != null) {
            return new ResponseEntity<List<Evaluation>>(evaluationList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //Only use for export excel - don't use it anywhere else
    @GetMapping("/evaluationsOfStudent")
    @ResponseBody
    public ResponseEntity<List<Evaluation>> getEvaluationsByStudentEmail(@RequestParam String email) {

        List<Evaluation> evaluationList = evaluationService.getEvaluationsByStudentEmail(email);
        Evaluation finalEvaluation = new Evaluation();
        finalEvaluation.setOjt_enrollment(evaluationList.get(evaluationList.size() -1).getOjt_enrollment());
        float score_discipline = 0;
        float score_work = 0;
        float score_activity = 0;
        int daysWork = 0;
        for (int i = 0; i < evaluationList.size(); i++) {
            score_discipline += evaluationList.get(i).getScore_discipline();
            score_work += evaluationList.get(i).getScore_work();
            score_activity += evaluationList.get(i).getScore_activity();
            daysWork += evaluationList.get(i).getWorkDays();
        }
        finalEvaluation.setScore_activity(score_activity/4);
        finalEvaluation.setScore_discipline(score_discipline/4);
        finalEvaluation.setScore_work(score_work/4);
        finalEvaluation.setProject_name("Đánh giá tổng");
        finalEvaluation.setTimeStart(evaluationList.get(0).getTimeStart());
        finalEvaluation.setTimeEnd(evaluationList.get(evaluationList.size() -1).getTimeEnd());
        finalEvaluation.setWorkDays(daysWork);
        finalEvaluation.setRemark("");
        finalEvaluation.setSupervisor(evaluationList.get(evaluationList.size() -1).getSupervisor());
        evaluationList.add(finalEvaluation);
        if (evaluationList != null) {
            return new ResponseEntity<List<Evaluation>>(evaluationList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //Only use for export excel - don't use it anywhere else
    @GetMapping("/businessesOfEvaluations")
    @ResponseBody
    public ResponseEntity<List<String>> getBusinessOfEvaluations(@RequestParam String email) {

        List<Evaluation> evaluationList = evaluationService.getEvaluationsByStudentEmail(email);
        List<String> listBusiness = new ArrayList<>();
        for (int i = 0; i < evaluationList.size(); i++) {
            listBusiness.add(evaluationList.get(i).getOjt_enrollment().getBusiness().getBusiness_name());
        }
        listBusiness.add(evaluationList.get(evaluationList.size() - 1).getOjt_enrollment().getBusiness().getBusiness_name());
        if (evaluationList != null) {
            return new ResponseEntity<List<String>>(listBusiness, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/business")
    @ResponseBody
    public ResponseEntity<Business> getBusinessOfStudent(@RequestParam String email) {
        Business business = studentService.getBusinessOfStudent(email);
        if (business != null) {
            return new ResponseEntity<Business>(business, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/businesses")
    @ResponseBody
    public ResponseEntity<List<Business>> getBusinessesListOfStudent() {
        String email = getEmailFromToken();

        List<Business> businessList = studentService.getBusinessByOptionStudent(email);
        if (businessList != null) {
            return new ResponseEntity<List<Business>>(businessList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/events")
    @ResponseBody
    public ResponseEntity<List<Event>> getEventsOfStudent() {
        String email = getEmailFromToken();

        List<Event> eventList = eventService.getEventList(email);
        if (eventList != null) {
            Collections.sort(eventList);
            return new ResponseEntity<List<Event>>(eventList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //chua test
    @GetMapping("/studentsSuggest")
    @ResponseBody
    public ResponseEntity<PagingDTO> getListSuggestStudent(@RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        getListStudentOfBusiness(); // lay ra nhung dua da moi

        String email = getEmailFromToken();
        List<Student> studentList = businessService.getSuggestListStudent(email);

        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            for (int j = 0; j < studentListIsInvited.size(); j++) {
                Student studentIsInvited = studentListIsInvited.get(j);
                if (student.getEmail().equals(studentIsInvited.getEmail())) {
                    studentList.remove(student); // xoa dua da duoc moi ra khoi list suggest
                }
            }
        }

        List<Student> officialStudentList = ojt_enrollmentService.getListStudentByBusiness(email);
        for (int i = 0; i < officialStudentList.size(); i++) {
            String emailStudentIsIn = officialStudentList.get(i).getEmail();
            for (int j = 0; j < studentList.size(); j++) {
                String emailStudent = studentList.get(j).getEmail();
                if (emailStudent.equals(emailStudentIsIn)) {
                    studentList.remove(studentList.get(j));
                    break;
                }
            }
        }
        if (studentList != null) {
            Utils<Student> studentUtils = new Utils<>();
            PagingDTO pagingDTO = studentUtils.paging(studentList, currentPage, rowsPerPage);
            return new ResponseEntity<PagingDTO>(pagingDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/searchStudentSuggestAllFields")
    @ResponseBody
    public ResponseEntity<List<Student>> searchStudentSuggestAllFields(@RequestParam String valueSearch) {
        getListStudentOfBusiness(); // lay ra nhung dua da moi

        String email = getEmailFromToken();
        List<Student> studentList = businessService.getSuggestListStudent(email);

        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            for (int j = 0; j < studentListIsInvited.size(); j++) {
                Student studentIsInvited = studentListIsInvited.get(j);
                if (student.getEmail().equals(studentIsInvited.getEmail())) {
                    studentList.remove(student); // xoa dua da duoc moi ra khoi list suggest
                }
            }
        }

        List<Student> officialStudentList = ojt_enrollmentService.getListStudentByBusiness(email);
        for (int i = 0; i < officialStudentList.size(); i++) {
            String emailStudentIsIn = officialStudentList.get(i).getEmail();
            for (int j = 0; j < studentList.size(); j++) {
                String emailStudent = studentList.get(j).getEmail();
                if (emailStudent.equals(emailStudentIsIn)) {
                    studentList.remove(studentList.get(j));
                    break;
                }
            }
        }
        if (studentList != null) {
            List<Student> searchStudentList = searchStudentByCodeNameSpecialized(studentList, valueSearch);

            return new ResponseEntity<>(searchStudentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/stateInvitation")
    public ResponseEntity<Void> setInvitationForOption(@RequestParam int id,
                                                       @RequestParam int numberOfOption) {
        String studentEmail = getEmailFromToken();
        Invitation invitation = invitationService.getInvitationById(id);
        if (numberOfOption == 1) {
            String businessEngName = invitation.getBusiness().getBusiness_eng_name();
            studentService.updateOption1Student(studentEmail, businessEngName);
            invitationService.updateStateOfInvitation(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } else if (numberOfOption == 2) {
            String businessEngName = invitation.getBusiness().getBusiness_eng_name();
            studentService.updateOption2Student(studentEmail, businessEngName);
            invitationService.updateStateOfInvitation(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //set doanh nghiep thuc tap cho student
    //check semester //ok
    @PutMapping("/businessInternship")
    public ResponseEntity<Void> setBusinessInternshipForStudent(@RequestParam String emailBusiness) {
        String emailStudent = getEmailFromToken();
        ojt_enrollmentService.updateBusinessForStudent(emailBusiness, emailStudent);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    //check semester chua test
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboardOfStudent() {
        String email = getEmailFromToken();

        DashboardDTO dashboardDTO = new DashboardDTO();
        Student student = studentService.getStudentByEmail(email);
        dashboardDTO.setSupervisor(student.getSupervisor());

        List<Evaluation> evaluationList = evaluationService.getEvaluationsByStudentEmail(email);
        if (evaluationList == null) {
            evaluationList = new ArrayList<>();
        }
        dashboardDTO.setEvaluationList(evaluationList);

        int countEventIsNotRead = eventService.countEventIsNotRead(email);
        dashboardDTO.setUnReadInformessage(countEventIsNotRead);

        List<Task> taskList = taskService.findTaskByStudentEmail(email);
        if (taskList == null) {
            taskList = new ArrayList<>();
        }
        dashboardDTO.setTaskList(taskList);

        Semester semester = semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollmentOfStudent = ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semester.getId());


        Date dateEnroll = ojt_enrollmentOfStudent.getTimeEnroll();
        if (dateEnroll != null) {
            Date dateCurrent = new Date(Calendar.getInstance().getTime().getTime());

            long getDiff = dateCurrent.getTime() - dateEnroll.getTime();

            long getDaysDiff = getDiff / (24 * 60 * 60 * 1000);

            if (getDaysDiff >= 30) {
                dashboardDTO.setMakeFeedback(true);
            } else {
                dashboardDTO.setMakeFeedback(false);
            }
        }
        Student_Answer student_answer = iStudent_answerService.findStudentAnswerByStudentEmail(email);
        if (student_answer != null) {
            dashboardDTO.setDoneFeedback(true);
        } else {
            dashboardDTO.setDoneFeedback(false);
        }

        Business business = ojt_enrollmentOfStudent.getBusiness();
        dashboardDTO.setBusiness(business);
        return new ResponseEntity<DashboardDTO>(dashboardDTO, HttpStatus.OK);
    }

    @PutMapping("/rate")
    public ResponseEntity<Void> updateRateForBusinessByStudent(@RequestParam int rate) {
        String email = getEmailFromToken();
        businessService.updateRateNumber(email, rate);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/event")
    @ResponseBody
    public ResponseEntity<Event> getDetailsEvent(@RequestParam int id) {
        Event event = eventService.findEventById(id);
        return new ResponseEntity<Event>(event, HttpStatus.OK);
    }

    @PutMapping("/taskStatus")
    public ResponseEntity<Void> updateTaskStatus(@RequestParam int id, @RequestParam int typeStatus) {
        String email = getEmailFromToken();
        boolean result = taskService.updateStatusTask(id, typeStatus, null);
        if (result) {
            HistoryDetail historyDetail = null;
            switch (typeStatus) {
                case 2:
                    historyDetail = new HistoryDetail(Task.class.getName(), "status", String.valueOf(id), Status.PENDING.toString());
                    break;
                case 3:
                    historyDetail = new HistoryDetail(Task.class.getName(), "status", String.valueOf(id), Status.DONE.toString());
                    break;
            }

            HistoryAction action =
                    new HistoryAction(email
                            , "ROLE_STUDENT", ActionEnum.UPDATE, TAG, new Object() {
                    }
                            .getClass()
                            .getEnclosingMethod()
                            .getName(), null, new java.util.Date(), historyDetail);
            historyDetail.setHistoryAction(action);
            iHistoryActionService.createHistory(action);

        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/evaluation")
    @ResponseBody
    public ResponseEntity<Evaluation> getEvaluationById(@RequestParam int id) {
        Evaluation evaluation = evaluationService.getEvaluationById(id);
        return new ResponseEntity<Evaluation>(evaluation, HttpStatus.OK);
    }

    @PutMapping("/information")
    public ResponseEntity<Void> updateInformationStudent(@RequestParam String name, @RequestParam String phone,
                                                         @RequestParam boolean gender, @RequestParam String address,
                                                         @RequestParam String birthDate) throws ParseException {
        String email = getEmailFromToken();
        boolean update = studentService.updateInformationStudent(email, name, phone, gender, address, birthDate);
        if (update == true) {
            List<HistoryDetail> details = new ArrayList<>();
            Method someMethod = null;
            try {
                someMethod = new Object() {
                }
                        .getClass()
                        .getEnclosingMethod();
                Parameter[] parameters = someMethod.getParameters();
                for (Parameter parameter : parameters) {
                    HistoryDetail historyDetail = null;
                    if (parameter.getName().contains("0")) {
                        historyDetail = new HistoryDetail(Student.class.getName(), "phone", email, phone);
                    } else if (parameter.getName().contains("1")) {
                        historyDetail = new HistoryDetail(Student.class.getName(), "gender", email, String.valueOf(gender));
                    } else if (parameter.getName().contains("2")) {
                        historyDetail = new HistoryDetail(Student.class.getName(), "address", email, address);
                    } else {
                        historyDetail = new HistoryDetail(Student.class.getName(), "birthDate", email, String.valueOf(birthDate));
                    }
                    details.add(historyDetail);

                }
                HistoryAction action =
                        new HistoryAction(email
                                , "ROLE_STUDENT", ActionEnum.UPDATE, TAG, new Object() {
                        }
                                .getClass()
                                .getEnclosingMethod()
                                .getName(), null, new java.util.Date(), details);
                for (HistoryDetail detail : details) {
                    detail.setHistoryAction(action);
                }
                iHistoryActionService.createHistory(action);
            } catch (Exception e) {
                e.printStackTrace();
            }

            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);

    }

    @PutMapping("/statusEvent")
    public ResponseEntity<Void> updateStatusEvent(@RequestParam int id) {
        boolean update = eventService.updateStatusIsRead(id);
        if (update) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/taskByStatus")
    @ResponseBody
    public ResponseEntity<List<Task>> getTaskListByStatus(@RequestParam int type) {
        String email = getEmailFromToken();

        List<Task> taskList = new ArrayList<>();
        if (type == 1) {
            taskList = taskService.findTasksOfStudentByStatus(email, Status.NOTSTART);
        } else if (type == 2) {
            taskList = taskService.findTasksOfStudentByStatus(email, Status.PENDING);
        } else if (type == 3) {
            taskList = taskService.findTasksOfStudentByStatus(email, Status.DONE);
        } else if (type == 4) {
            taskList = taskService.findTasksOfStudentByStatus(email, Status.APPROVED);
        }
        if (taskList != null) {
            return new ResponseEntity<List<Task>>(taskList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PostMapping("/businessPropose")
    public ResponseEntity<Void> createBusinessPropose(@RequestBody Business_Proposed business_proposed) {
        String email = getEmailFromToken();
        if (business_proposed != null) {
            Student student = studentService.getStudentByEmail(email);

            business_proposed.setStudent_proposed(student);
            business_proposed.setContactLink(email);
            iBusiness_proposedService.createBusinessPropose(business_proposed);
            HistoryDetail historyDetail = new HistoryDetail(Business_Proposed.class.getName(), null, email, business_proposed.toString());
            HistoryAction action =
                    new HistoryAction(email
                            , "ROLE_STUDENT", ActionEnum.INSERT, TAG, new Object() {
                    }
                            .getClass()
                            .getEnclosingMethod()
                            .getName(), null, new java.util.Date(), historyDetail);
            historyDetail.setHistoryAction(action);
            iHistoryActionService.createHistory(action);

            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/questions")
    @ResponseBody
    public ResponseEntity<List<Question>> getListQuestion() {
        List<Question> questions = iQuestionService.getAllQuestion();
        if (questions != null) {
            return new ResponseEntity<List<Question>>(questions, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PostMapping("/answers")
    public ResponseEntity<Void> answersFeedBack(@RequestBody List<Answer> answers, @RequestParam Map<String, String> mapOthers) {
        String studentEmail = getEmailFromToken();
        Student student = studentService.getStudentByEmail(studentEmail);

        iStudent_answerService.saveStudent_Answer(student, answers, mapOthers);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/answers")
    @ResponseBody
    public ResponseEntity<List<StudentAnswerDTO>> getAnswers() {
        String email = getEmailFromToken();
        List<StudentAnswerDTO> answerDTOS = studentService.findListStudentAnswer(email);
        if (answerDTOS != null) {
            return new ResponseEntity<List<StudentAnswerDTO>>(answerDTOS, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);

    }

    @GetMapping("/answersOfStudent")
    @ResponseBody
    public ResponseEntity<List<StudentAnswerDTO>> getAnswersOfStudent(@RequestParam String studentEmail) {
        List<StudentAnswerDTO> answerDTOS = studentService.findListStudentAnswer(studentEmail);
        boolean isAnswered = false;
        for (int i = 0; i < answerDTOS.size(); i++) {
            if (answerDTOS.get(i).getAnswers() != null) {
                isAnswered = true;
                break;
            }
        }
        if (answerDTOS != null && isAnswered == true) {
            return new ResponseEntity<List<StudentAnswerDTO>>(answerDTOS, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);

    }

    @PostMapping("/feedback")
    public ResponseEntity<Void> postFeedback(@RequestParam String content) {
        String email = getEmailFromToken();
        studentService.postFeedBack(email, content);
        HistoryDetail historyDetail = new HistoryDetail(Answer.class.getName(), null, null, content);
        HistoryAction action =
                new HistoryAction(email
                        , "ROLE_STUDENT", ActionEnum.INSERT, TAG, new Object() {
                }
                        .getClass()
                        .getEnclosingMethod()
                        .getName(), null, new java.util.Date(), historyDetail);
        historyDetail.setHistoryAction(action);
        iHistoryActionService.createHistory(action);

        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    @GetMapping("/unReadMessage")
    public ResponseEntity<Integer> getUnreadMess() {
        String email = getEmailFromToken();

        int countEventIsNotRead = eventService.countEventIsNotRead(email);

        return new ResponseEntity<Integer>(countEventIsNotRead, HttpStatus.OK);
    }

    @GetMapping("/businessIsReject")
    @ResponseBody
    public ResponseEntity<Boolean> getStatusOfBusinessProposeOfStudent() {
        String email = getEmailFromToken();
        boolean result = iBusiness_proposedService.checkBusinessProposeIsReject(email);
        return new ResponseEntity<Boolean>(result, HttpStatus.OK);
    }

    @PostMapping("/event")
    public ResponseEntity<Void> studentCreateInformMessage(@RequestBody Event event) {
        String email = getEmailFromToken();
        studentService.studentCreateInformMessage(email, event);
        HistoryDetail historyDetail = new HistoryDetail(Event.class.getName(), null, null, event.toString());
        HistoryAction action =
                new HistoryAction(email
                        , "ROLE_STUDENT", ActionEnum.INSERT, TAG, new Object() {
                }
                        .getClass()
                        .getEnclosingMethod()
                        .getName(), null, new java.util.Date(), historyDetail);
        historyDetail.setHistoryAction(action);
        iHistoryActionService.createHistory(action);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    //check semester //ok
    //get all job post of a business for student
    @GetMapping("/getAllJobPostABusiness")
    @ResponseBody
    public ResponseEntity<List<Business_JobPostDTO>> getAllJobPostOfABusiness(@RequestParam String businessEmail) {

        Business business = businessService.getBusinessByEmail(businessEmail);

        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessEmail, semesterCurrent.getId());

        List<Business_JobPostDTO> business_jobPostDTOList = new ArrayList<>();

        Business_JobPostDTO business_jobPostDTO = new Business_JobPostDTO();

        List<Job_Post> job_postList = job_postService.getAllJobPostOfBusiness(ojt_enrollment);
        for (int i = 0; i < job_postList.size(); i++) {
            business_jobPostDTO.setBusiness(business);
            business_jobPostDTO.setJob_post(job_postList.get(i));
            business_jobPostDTOList.add(business_jobPostDTO);
            business_jobPostDTO = new Business_JobPostDTO();
        }

        if (job_postList != null) {
            Collections.sort(business_jobPostDTOList);
            return new ResponseEntity<List<Business_JobPostDTO>>(business_jobPostDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/pagination")
    @ResponseBody
    public ResponseEntity<PagingDTO> getAllStudentPaging(@RequestParam int currentPage, @RequestParam int rowsPerPage) {
        PagingDTO pagingStudent = studentService.pagingStudent(currentPage, rowsPerPage);
        return new ResponseEntity<>(pagingStudent, HttpStatus.OK);
    }

    @GetMapping("/getListStudentByBusinessByCodeNameEmail")
    @ResponseBody
    public ResponseEntity<List<Student>> getListStudentByBusinessByCodeNameEmail(@RequestParam String valueSearch) {
        String emailBusiness = getEmailFromToken();
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(emailBusiness);
        if (studentList != null) {
            List<Student> searchStudentList = searchStudentByCodeNameEmail(studentList, valueSearch);
            return new ResponseEntity<List<Student>>(searchStudentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    private List<Student> searchStudentByCodeNameEmail(List<Student> studentList, String valueSearch) {
        List<Student> searchStudentList = new ArrayList<Student>();
        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            if (student.getCode().toLowerCase().contains(valueSearch.toLowerCase()) || student.getName().toLowerCase().contains(valueSearch.toLowerCase()) || student.getEmail().toLowerCase().contains(valueSearch.toLowerCase())) {
                searchStudentList.add(student);
            }
        }
        return searchStudentList;
    }

    private List<Student> searchStudentByCodeName(List<Student> studentList, String valueSearch) {
        List<Student> searchStudentList = new ArrayList<Student>();
        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            if (student.getCode().toLowerCase().contains(valueSearch.toLowerCase()) || student.getName().toLowerCase().contains(valueSearch.toLowerCase())) {
                searchStudentList.add(student);
            }
        }
        return searchStudentList;
    }

    private List<Student> searchStudentByCodeNameSpecialized(List<Student> studentList, String valueSearch) {
        List<Student> searchStudentList = new ArrayList<Student>();
        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            if (student.getCode().toLowerCase().contains(valueSearch.toLowerCase()) || student.getName().toLowerCase().contains(valueSearch.toLowerCase()) || student.getSpecialized().getName().toLowerCase().contains(valueSearch.toLowerCase())) {
                searchStudentList.add(student);
            }
        }
        return searchStudentList;
    }

    //get email from token
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
