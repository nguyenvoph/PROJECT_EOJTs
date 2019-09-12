package com.example.demo.controller;

import com.example.demo.config.*;
import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import com.example.demo.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.cache.annotation.CacheConfig;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.PersistenceException;
import java.io.IOException;
import java.sql.Date;
import java.util.*;


@RestController
@RequestMapping("/api/business")
public class BusinessController {
    private final String TAG = "BusinessController";

    @Autowired
    IBusinessService businessService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    IBusinessImportFileService businessImportFileService;

    @Autowired
    ISkillService skillService;

    @Autowired
    IInvitationService invitationService;

    @Autowired
    IJob_PostService job_postService;

    @Autowired
    IStudentService studentService;

    @Autowired
    ISupervisorService supervisorService;

    @Autowired
    IUsersService usersService;

    @Autowired
    IJob_Post_SkillService job_post_skillService;

    @Autowired
    IEventService eventService;

    @Autowired
    IEvaluationService evaluationService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    RedisTemplate template;

    @Autowired
    IHistoryActionService iHistoryActionService;

    private final Logger LOG = LoggerFactory.getLogger(getClass());

    @PostMapping("")
    public ResponseEntity<Void> saveBusiness(@RequestBody List<BusinessDTO> listBusinessDTO) throws Exception {
        for (int i = 0; i < listBusinessDTO.size(); i++) {
            for (int j = 0; j < listBusinessDTO.get(i).getSkillDTOList().size(); j++) {
                String skill_name = "";
                int skill_id = 0;
                Skill skill = new Skill();

                skill_name = listBusinessDTO.get(i).getSkillDTOList().get(j).getName();
                skill_id = skillService.fullTextSearch(skill_name);
                skill.setId(skill_id);
                listBusinessDTO.get(i).getSkillDTOList().get(j).setSkill(skill);
            }
        }

        boolean isSendMail = businessImportFileService.insertBusiness(listBusinessDTO);
        if (isSendMail == false) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //check semester //ok
    @PostMapping("/new")
    public ResponseEntity<Void> createNewBusiness(@RequestBody BusinessDTO businessDTO) throws Exception {

        List<Role> roleList = new ArrayList<>();
        Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
        List<Ojt_Enrollment> ojtEnrollmentList = new ArrayList<>();
        Users users = new Users();
        String password = usersService.getAlphaNumericString();

        Role role = new Role();
        role.setId(3);
        role.setDescription("ROLE_HR");
        roleList.add(role);

        Role role_supervisor = new Role();
        role_supervisor.setId(4);
        role_supervisor.setDescription("ROLE_SUPERVISOR");
        roleList.add(role_supervisor);

        users.setRoles(roleList);
        users.setEmail(businessDTO.getEmail());
        users.setPassword(password);
        users.setActive(true);

        Semester semester = semesterService.getSemesterByName(businessDTO.getNameSemester());

        //Business business = businessService.getBusinessByEmail(businessDTO.getEmail());
        Business business = transferBusinessDTOtoBusiness(businessDTO);

        ojt_enrollment.setBusiness(business);
        ojt_enrollment.setSemester(semester);
        ojtEnrollmentList.add(ojt_enrollment);
        business.setOjt_enrollments(ojtEnrollmentList);

        try {
            Business businessIsExisted=businessService.getBusinessByEmail(business.getEmail());
            if(businessIsExisted==null){
                businessService.saveBusiness(business);

                if (usersService.saveUser(users)) {
                    usersService.sendEmail(business.getBusiness_name(), users.getEmail(), users.getPassword());
                }
            }else{
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

    public Business transferBusinessDTOtoBusiness(BusinessDTO businessDTO) {
        Business business = new Business();
        business.setEmail(businessDTO.getEmail());
        business.setBusiness_name(businessDTO.getBusiness_name());
        business.setBusiness_eng_name(businessDTO.getBusiness_eng_name());
        business.setBusiness_website(businessDTO.getBusiness_website());
        business.setBusiness_phone(businessDTO.getBusiness_phone());
        business.setBusiness_address(businessDTO.getBusiness_address());
        business.setBusiness_overview(businessDTO.getBusiness_overview());

        return business;
    }

    //check semester //ok
    @GetMapping("/getAllBusiness")
    @ResponseBody
    public ResponseEntity<List<Business>> getAllBusiness() {
        //List<Business> businessList = businessService.getAllBusiness();
        List<Business> businessList = businessService.getAllBusinessBySemester();
        if (businessList != null) {
            return new ResponseEntity<List<Business>>(businessList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/pagination")
    @ResponseBody
    public ResponseEntity<PagingDTO> getAllBusinessPaging(@RequestParam int currentPage, @RequestParam int rowsPerPage) {
        PagingDTO pagingBusiness = businessService.pagingBusiness(currentPage, rowsPerPage);
        return new ResponseEntity<>(pagingBusiness, HttpStatus.OK);
    }

    @GetMapping("/searchListBusiness")
    @ResponseBody
    public ResponseEntity<List<Business>> getAllBusinessPaging(@RequestParam String valueSearch) {
        List<Business> businessList = businessService.getAllBusinessBySemester();
        List<Business> searchList = new ArrayList<>();
        for (int i = 0; i < businessList.size(); i++) {
            if (businessList.get(i).getBusiness_name().toLowerCase().contains(valueSearch.toLowerCase()) ||
                    businessList.get(i).getBusiness_eng_name().toLowerCase().contains(valueSearch.toLowerCase())) {
                searchList.add(businessList.get(i));
            }
        }
        return new ResponseEntity<>(searchList, HttpStatus.OK);
    }


    @GetMapping("singlekey/{key}")
    public List<Business> getSingleValue(@PathVariable("key") String key) {
        //List<Business> value = (List<Business>) template.opsForList();
        return null;
    }

    @GetMapping("/getBusiness")
    @ResponseBody
    public ResponseEntity<Business> getBusinessByEmailFromToken() {
        String email = getEmailFromToken();
        Business business = businessService.getBusinessByEmail(email);
        if (business != null) {
            return new ResponseEntity<Business>(business, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/business")
    @ResponseBody
    public ResponseEntity<Business> getBusinessByEmail(@RequestParam String email) {
        Business business = businessService.getBusinessByEmail(email);
        if (business != null) {
            return new ResponseEntity<Business>(business, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //update business
    @PutMapping("/updateBusiness")
    public ResponseEntity<Void> updateBusinessByEmail(@RequestBody Business business) {
        String email = getEmailFromToken();
        boolean update = businessService.updateBusiness(email, business);
        if (update == true) {
            HistoryDetail historyDetail = new HistoryDetail(Business.class.getName(), "ALL", business.getEmail(), business.toString());
            HistoryAction action =
                    new HistoryAction(email
                            , "ROLE_HR", ActionEnum.UPDATE, TAG, new Object() {
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

    //list invitaion of busines
    @GetMapping("/listInvitation")
    @ResponseBody
    public ResponseEntity<List<Invitation>> getListInvitation() {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByBusinessEmail(email);
        if (invitationList != null) {
            return new ResponseEntity<List<Invitation>>(invitationList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //business get details invitation
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

    @GetMapping("/getInvitationOfStudent")
    @ResponseBody
    public ResponseEntity<Invitation> getInvitationOfStudent(@RequestParam String emailStudent) {
        String email = getEmailFromToken();
        List<Invitation> invitationList = invitationService.getListInvitationByBusinessEmail(email);
        Invitation invitation = new Invitation();
        for (int i = 0; i < invitationList.size(); i++) {
            if (invitationList.get(i).getStudent().getEmail().equals(emailStudent)) {
                invitation = invitationList.get(i);
                break;
            }
        }
        if (invitation != null) {
            return new ResponseEntity<Invitation>(invitation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //get job post details by id
    @GetMapping("/getJobPost")
    @ResponseBody
    public ResponseEntity<Job_PostDTO> getJobPost(@RequestParam int id) {

        Job_Post job_post = job_postService.findJob_PostById(id);
        String emailOfBusiness = job_post.getOjt_enrollment().getBusiness().getEmail();
        Business business = businessService.getBusinessByEmail(emailOfBusiness);

        Job_PostDTO job_postDTO = new Job_PostDTO();
        job_postDTO.setJob_post(job_post);
        job_postDTO.setBusiness(business);

        if (job_post != null) {
            return new ResponseEntity<Job_PostDTO>(job_postDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //get all post of all business
    //check semester //ok
    @GetMapping("/getAllJobPostOfBusiness")
    @ResponseBody
    public ResponseEntity<List<Business_JobPostDTO>> getAllJobPostBusiness() {
        LOG.info("Getting all job post");
        List<Business_JobPostDTO> business_jobPostDTOList = businessService.getAllJobPostOfBusinesses();
        if (business_jobPostDTOList == null) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<List<Business_JobPostDTO>>(business_jobPostDTOList, HttpStatus.OK);
    }

    //check semester ok
    // create an invitation
    @PostMapping("/createInvitation")
    public ResponseEntity<Void> createInvitationForStudent(@RequestBody Invitation invitation
            , @RequestParam String emailStudent) {
        String emailBusiness = getEmailFromToken();
        Business business = businessService.getBusinessByEmail(emailBusiness);

        Student student = studentService.getStudentByEmail(emailStudent);

        invitation.setStudent(student);
        invitation.setBusiness(business);
        invitationService.createInvitation(invitation);

        ValueOperations values = template.opsForValue();
        List<Student> studentList = (List<Student>) values.get("studentsIsInvitation");

        if (studentList != null) {
            int position = checkPositionStudent(studentList, student);
            studentList.remove(position);
            values.set("studentsIsInvitation", studentList);
        }
        HistoryDetail historyDetail = new HistoryDetail(Invitation.class.getName(), null, null, invitation.toString());
        HistoryAction action =
                new HistoryAction(getEmailFromToken()
                        , "ROLE_HR", ActionEnum.INSERT, TAG, new Object() {
                }
                        .getClass()
                        .getEnclosingMethod()
                        .getName(), emailStudent, new java.util.Date(), historyDetail);
        historyDetail.setHistoryAction(action);
        iHistoryActionService.createHistory(action);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    public int checkPositionStudent(List<Student> students, Student student) {
        for (int i = 0; i < students.size(); i++) {
            Student studentInList = students.get(i);
            if (studentInList.getEmail().equals(student.getEmail())) {
                return i;
            }
        }
        return 0;
    }

    // update status of option student when interview
    @PutMapping("/updateStatusOfStudent")
    public ResponseEntity<Void> updateStatusOfOptionStudent(@RequestParam List<Integer> numberOfOption, @RequestParam boolean statusOfOption
            , @RequestParam String emailOfStudent) {
        boolean updateStatus = studentService.updateStatusOptionOfStudent(numberOfOption, statusOfOption, emailOfStudent);
        if (updateStatus == true) {
            HistoryDetail historyDetail = new HistoryDetail(Student.class.getName(), numberOfOption.get(0) == 1?"isAcceptedOption1":"isAcceptedOption2", null, String.valueOf(statusOfOption));
            HistoryAction action =
                    new HistoryAction(getEmailFromToken()
                            , "ROLE_HR", ActionEnum.UPDATE, TAG, new Object() {
                    }
                            .getClass()
                            .getEnclosingMethod()
                            .getName(), emailOfStudent, new java.util.Date(), historyDetail);
            historyDetail.setHistoryAction(action);
            iHistoryActionService.createHistory(action);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //update info job post
    //check semester //ok
    @PutMapping("/updateJobPost")
    public ResponseEntity<Void> updateJobPostOfBusiness(@RequestBody Job_Post job_post) {
        String businessEmail = getEmailFromToken();

        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessEmail, semesterCurrent.getId());
        job_post.setOjt_enrollment(ojt_enrollment);


        List<Job_Post_Skill> job_post_skills = job_post.getJob_post_skills();
        for (int i = 0; i < job_post_skills.size(); i++) {
            Job_Post_Skill job_post_skill = job_post_skills.get(i);
            job_post_skill.setJob_post(job_post);
            job_post_skillService.updateJobPostSkill(job_post_skill);
        }

        boolean updateJobPost = job_postService.updateInforJobPost(job_post);
        if (updateJobPost == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    //get ds chinh thuc cua cong ty
    @GetMapping("/getStudentsByBusiness")
    @ResponseBody
    public ResponseEntity<PagingDTO> getListStudentByBusiness(@RequestParam int specializedID, @RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        String emailBusiness = getEmailFromToken();
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(emailBusiness);
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
        if (filteredStudentList != null) {
            Utils<Student> studentUtils = new Utils<>();
            PagingDTO pagingDTO = studentUtils.paging(filteredStudentList, currentPage, rowsPerPage);
            return new ResponseEntity<PagingDTO>(pagingDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getNumStudent")
    @ResponseBody
    public ResponseEntity<Integer> getNumStudent() {
        String emailBusiness = getEmailFromToken();
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(emailBusiness);

        if (studentList != null) {
            return new ResponseEntity<Integer>(studentList.size(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getSpecializedsOfStudentsInBusiness")
    @ResponseBody
    public ResponseEntity<List<Specialized>> getSpecializedsOfStudentsInBusiness() {
        String emailBusiness = getEmailFromToken();
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(emailBusiness);
        List<Specialized> specializeds = new ArrayList<Specialized>();
        if (studentList != null) {
            for (int i = 0; i < studentList.size(); i++) {
                if (specializeds.size() >= 1) {
                    boolean flagExist = false;
                    for (int j = 0; j < specializeds.size(); j++) {
                        if (specializeds.get(j).getId() == studentList.get(i).getSpecialized().getId()) {
                            flagExist = true;
                        }
                    }
                    if (flagExist == false) {
                        specializeds.add(studentList.get(i).getSpecialized());
                    }
                } else {
                    specializeds.add(studentList.get(i).getSpecialized());
                }
            }
            Collections.sort(specializeds, new Comparator<Specialized>() {
                @Override
                public int compare(Specialized o1, Specialized o2) {
                    String name1 = o1.getName();
                    String name2 = o2.getName();
                    return name1.compareTo(name2);
                }
            });
            return new ResponseEntity<List<Specialized>>(specializeds, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getSpecializedsOfBusiness")
    @ResponseBody
    public ResponseEntity<List<Specialized>> getSpecializedsOfBusiness() {
        List<Specialized> specializeds = getSpecializedsOfBusinessJobsPost();
        if (specializeds != null) {
            return new ResponseEntity<List<Specialized>>(specializeds, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getStudentsByBusinessNotPaging")
    @ResponseBody
    public ResponseEntity<List<Student>> getListStudentByBusinessNotPaging() {
        String emailBusiness = getEmailFromToken();
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(emailBusiness);

        if (studentList != null) {
            return new ResponseEntity<>(studentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getStudentsByBusinessWithNoSupervisor")
    @ResponseBody
    public ResponseEntity<List<Student>> getStudentsByBusinessWithNoSupervisor() {
        String emailBusiness = getEmailFromToken();
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(emailBusiness);
        List<Student> students = new ArrayList<>();
        for (int i = 0; i < studentList.size(); i++) {
            if (studentList.get(i).getSupervisor().getEmail().equals(emailBusiness)) {
                students.add(studentList.get(i));
            }
        }
        if (students != null) {
            return new ResponseEntity<List<Student>>(students, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //upload link transcript
    @PutMapping("/updateLinkTranscript")
    public ResponseEntity<Void> updateLinkTranscript(@RequestBody Student student) {
        boolean updateLinkTranscript = studentService.updateLinkTranscriptForStudent(student);
        if (updateLinkTranscript == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get top 5 business
    @GetMapping("/getTop5Business")
    @ResponseBody
    public ResponseEntity<List<Business>> getTop5Business() {
        List<Business> businessList = businessService.findTop5BusinessByRateAverage();
        if (businessList != null) {
            return new ResponseEntity<List<Business>>(businessList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    //get all job post of a business for student
    @GetMapping("/getAllJobPostABusiness")
    @ResponseBody
    public ResponseEntity<List<Business_JobPostDTO>> getAllJobPostOfABusiness() {
        String businessEmail = getEmailFromToken();

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

    //check semester // ok
    //get all supervisor of business
    @GetMapping("/getAllSupervisorABusiness")
    @ResponseBody
    public ResponseEntity<PagingDTO> getSupervisorOfABusiness(@RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        String email = getEmailFromToken();

        List<Supervisor> supervisors = supervisorService.getAllSupervisorOfABusiness(email);

        Utils<Supervisor> supervisorUtils = new Utils<>();
        PagingDTO pagingDTO = supervisorUtils.paging(supervisors, currentPage, rowsPerPage);

        if (supervisors != null) {
            return new ResponseEntity<PagingDTO>(pagingDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/searchSupervisorABusinessAllFields")
    @ResponseBody
    public ResponseEntity<List<Supervisor>> getSupervisorOfABusiness(@RequestParam String valueSearch) {
        String email = getEmailFromToken();

        List<Supervisor> supervisors = supervisorService.getAllSupervisorOfABusiness(email);
        List<Supervisor> searchSupervisorList = new ArrayList<Supervisor>();
        for (int i = 0; i < supervisors.size(); i++) {
            Supervisor supervisor = supervisors.get(i);
            if (supervisor.getEmail().toLowerCase().contains(valueSearch.toLowerCase()) ||
                    supervisor.getName().toLowerCase().contains(valueSearch.toLowerCase()) ||
                    supervisor.getPhone().toLowerCase().contains(valueSearch.toLowerCase()) ||
                    supervisor.getAddress().toLowerCase().contains(valueSearch.toLowerCase())) {
                searchSupervisorList.add(supervisor);
            }
        }

        if (supervisors != null) {
            return new ResponseEntity<List<Supervisor>>(searchSupervisorList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    // create a supervisor
    @PostMapping("/createSupervisor")
    public ResponseEntity<Void> createSupervisor(@RequestBody Supervisor supervisor) {
        String email = getEmailFromToken();
        boolean result = false;

        result = supervisorService.createSupervisor(supervisor, email);
        if (result) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //update state isActive supervisor
    @PutMapping("/updateStatus")
    public ResponseEntity<Void> updateStatusSupervisor(@RequestParam String email, @RequestParam boolean isActive) {
        boolean updateStatus = supervisorService.updateStateSupervisor(email, isActive);
        if (updateStatus == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //assign supervisor for student
    @PutMapping("/assignSupervisor")
    public ResponseEntity<Void> assignSupervisorForStudent(@RequestBody List<Student> studentList) {
        boolean assign = studentService.assignSupervisorForStudent(studentList);
        if (assign == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester ok
    //create job post
    @PostMapping("/createJobPost")
    public ResponseEntity<Void> createJobPost(@RequestBody Job_Post job_post) {
        String emailBusiness = getEmailFromToken();
        boolean create = job_postService.createJob_Post(emailBusiness, job_post);
        if (create == true) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get all events of business
    @GetMapping("/events")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfBusinessSent() {
        String email = getEmailFromToken();
        List<Event> events = eventService.getEventListOfBusiness(email);
        if (events != null) {
            List<Event> finalBusinessListEvent = eventService.getEventListSent(events);
            Collections.sort(finalBusinessListEvent);
            List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalBusinessListEvent);
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/eventsReceived")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfBusinessReceived() {
        String email = getEmailFromToken();
        List<Event> businessReceivedEvents = eventService.getEventListOfBusiness(email);
        if (businessReceivedEvents != null) {
            List<Event> finalListEvent = eventService.getEventListReceived(businessReceivedEvents);
            Collections.sort(finalListEvent);
            List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalListEvent);
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/eventsReceivedNotRead")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfBusinessReceivedNotRead() {
        String email = getEmailFromToken();
        List<Event> businessReceivedEvents = eventService.getEventListOfBusiness(email);
        if (businessReceivedEvents != null) {
            List<Event> finalListEvent = eventService.getEventListReceived(businessReceivedEvents);
            List<Event> finalListEventNotRead = eventService.getEventListNotRead(finalListEvent);
            Collections.sort(finalListEventNotRead);
            List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalListEventNotRead);
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/eventsReceivedRead")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfBusinessReceivedRead() {
        String email = getEmailFromToken();
        List<Event> businessReceivedEvents = eventService.getEventListOfBusiness(email);
        if (businessReceivedEvents != null) {
            List<Event> finalListEvent = eventService.getEventListReceived(businessReceivedEvents);
            List<Event> finalListEventRead = eventService.getEventListRead(finalListEvent);
            Collections.sort(finalListEventRead);
            List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalListEventRead);
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester ok
    @GetMapping("/evaluations")
    @ResponseBody
    public ResponseEntity<List<Evaluation>> getAllEvaluationOfBusiness() {
        String email = getEmailFromToken();

        //get student of business in a semester
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(email);
        //get all evaluations of list student of business
//        List<Evaluation> evaluationList = evaluationService.getListEvaluationOfBusiness(email);

//        List<Evaluation> evaluationList = new ArrayList<Evaluation>();
//        for (int i = 0; i < studentList.size(); i++) {
//            evaluationList.addAll(evaluationService.getEvaluationsByStudentEmail(studentList.get(i).getEmail()));
//        }
//
//        List<Evaluation> overviewEvaluationList = new ArrayList<Evaluation>();
//        int flag = 0;
//        for (int i = 0; i < studentList.size(); i++) {
//            flag = 0;
//            for (int j = 0; j < evaluationList.size(); j++) {
//                if (studentList.get(i).getCode().equals(evaluationList.get(j).getOjt_enrollment().getStudent().getCode())) {
//                    overviewEvaluationList.add(evaluationList.get(j));
//                    if (flag > 0) {
//                        for (int k = 1; k <= flag; k++) {
//                            Date date1 = overviewEvaluationList.get(overviewEvaluationList.size() - k).getTimeStart();
//                            Date date2 = overviewEvaluationList.get(overviewEvaluationList.size() - 1 - k).getTimeStart();
//                            if (date1.before(date2)) {
//                                Evaluation tmpEvaluation = overviewEvaluationList.get(overviewEvaluationList.size() - 1 - k);
//                                overviewEvaluationList.set(overviewEvaluationList.size() - 1 - k, overviewEvaluationList.get(overviewEvaluationList.size() - k));
//                                overviewEvaluationList.set(overviewEvaluationList.size() - k, tmpEvaluation);
//                            }
//                        }
//                    }
//                    flag++;
//                }
//            }
//            if (flag < 4) {
//                for (int l = flag; l < 4; l++) {
//                    overviewEvaluationList.add(null);
//                }
//            }
//        }
        List<Evaluation> evaluationList = evaluationService.getEvaluationListOfStudentList(studentList);
        if (evaluationList != null) {
            return new ResponseEntity<List<Evaluation>>(evaluationList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/studentsEvaluations")
    @ResponseBody
    public ResponseEntity<PagingDTO> getEvaluationsOfStudents(@RequestParam int specializedID, @RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        String email = getEmailFromToken();
        PagingDTO pagingDTO = businessService.getEvaluationListOfBusiness(specializedID, email, currentPage, rowsPerPage);
        if (pagingDTO != null) {
            return new ResponseEntity<PagingDTO>(pagingDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/searchingEvaluationAllField")
    @ResponseBody
    public ResponseEntity<List<Student_EvaluationDTO>> searchingEvaluationAllField(@RequestParam String valueSearch) {
        String email = getEmailFromToken();
        List<Student> studentList = ojt_enrollmentService.getListStudentByBusiness(email);
        List<Student> searchStudentList = new ArrayList<Student>();
        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            if (student.getCode().toLowerCase().contains(valueSearch.toLowerCase()) || student.getName().toLowerCase().contains(valueSearch.toLowerCase())) {
                searchStudentList.add(student);
            }
        }
        List<Student_EvaluationDTO> student_evaluationDTOS = new ArrayList<>();

        for (int i = 0; i < searchStudentList.size(); i++) {
            List<Evaluation> evaluationList = evaluationService.getEvaluationsByStudentEmail(searchStudentList.get(i).getEmail());
            Collections.sort(evaluationList);
            if (evaluationList.size() < 4) {
                for (int j = evaluationList.size(); j < 4; j++) {
                    evaluationList.add(null);
                }
            }
            evaluationList = evaluationService.checkSemesterOfListEvaluation(evaluationList);
            Student_EvaluationDTO student_evaluationDTO = new Student_EvaluationDTO();
            student_evaluationDTO.setEvaluationList(evaluationList);
            student_evaluationDTO.setStudent(searchStudentList.get(i));

            student_evaluationDTOS.add(student_evaluationDTO);
        }
        if (student_evaluationDTOS != null) {
            return new ResponseEntity<List<Student_EvaluationDTO>>(student_evaluationDTOS, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PostMapping("/sms")
    @ResponseBody
    public ResponseEntity<String> sendSms(@RequestBody SmsDTO smsDTO) {
        Sms sms = new Sms();

        try {
            sms.sendSMS(smsDTO.getReceiverNumber(), smsDTO.getContent(), 2, "EOJTs");
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private List<Specialized> getSpecializedsOfBusinessJobsPost() {
        String businessEmail = getEmailFromToken();

        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessEmail, semesterCurrent.getId());
        List<Job_Post> job_postList = job_postService.getAllJobPostOfBusiness(ojt_enrollment);
        List<Specialized> specializeds = new ArrayList<Specialized>();
        if (job_postList != null) {
            for (int i = 0; i < job_postList.size(); i++) {
                for (int j = 0; j < job_postList.get(i).getJob_post_skills().size(); j++) {
                    if (specializeds.size() >= 1) {
                        boolean flagExist = false;
                        for (int k = 0; k < specializeds.size(); k++) {
                            if (specializeds.get(k).getId() == job_postList.get(i).getJob_post_skills().get(j).getSkill().getSpecialized().getId()) {
                                flagExist = true;
                            }
                        }
                        if (flagExist == false) {
                            specializeds.add(job_postList.get(i).getJob_post_skills().get(j).getSkill().getSpecialized());
                        }
                    } else {
                        specializeds.add(job_postList.get(i).getJob_post_skills().get(j).getSkill().getSpecialized());
                    }
                }

            }
        }
        return specializeds;
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
