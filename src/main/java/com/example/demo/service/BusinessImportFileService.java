package com.example.demo.service;

import com.example.demo.config.ActionEnum;
import com.example.demo.dto.BusinessDTO;
import com.example.demo.dto.SkillDTO;
import com.example.demo.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class BusinessImportFileService implements IBusinessImportFileService {

    @Autowired
    IJob_PostService job_postService;

    @Autowired
    IUsersService usersService;

    @Autowired
    IJob_Post_SkillService job_post_skillService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IBusinessService iBusinessService;

    @Autowired
    ISupervisorService iSupervisorService;

    @Autowired
    IHistoryActionService iHistoryActionService;

    private List<String> listPass = new ArrayList<>();

    @Transactional
    @Override
    public boolean insertBusiness(List<BusinessDTO> businessDTOList) {

        boolean isSendMail = sendMailBusiness(businessDTOList);



        if (isSendMail == true) {

            List<HistoryDetail> details = new ArrayList<>();
            HistoryAction action =
                    new HistoryAction(getEmailFromToken()
                            , "ROLE_ADMIN", ActionEnum.INSERT, "BusinessController", new Object() {
                    }
                            .getClass()
                            .getEnclosingMethod()
                            .getName(), null, new java.util.Date());
            HistoryDetail detail = null;

            for (int i = 0; i < businessDTOList.size(); i++) {
                BusinessDTO businessDTO = businessDTOList.get(i);

                Business businessIsExisted = iBusinessService.getBusinessByEmail(businessDTO.getEmail());

                Business business = new Business(businessDTO.getEmail(), businessDTO.getBusiness_name()
                        , businessDTO.getBusiness_eng_name(), businessDTO.getBusiness_phone()
                        , businessDTO.getBusiness_address(), businessDTO.getBusiness_overview(), businessDTO.getBusiness_website(), businessDTO.getLogo());


                Semester semester = semesterService.getSemesterByName(businessDTO.getNameSemester());
                Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
                if (businessIsExisted == null) {
                    ojt_enrollment.setBusiness(business);
                } else {
                    ojt_enrollment.setBusiness(businessIsExisted);
                }
                ojt_enrollment.setSemester(semester);

                Date datePost = new Date(Calendar.getInstance().getTime().getTime());
                Job_Post job_post = new Job_Post(businessDTO.getDescription(), businessDTO.getTime_post(), businessDTO.getViews(), businessDTO.getContact()
                        , businessDTO.getInterview_process(), businessDTO.getInterest());
                job_post.setOjt_enrollment(ojt_enrollment);
                job_post.setTimePost(datePost);

                List<SkillDTO> skillDTOList = businessDTO.getSkillDTOList();

                Job_Post_Skill job_post_skill = new Job_Post_Skill();

                //import all file to db
                for (int j = 0; j < skillDTOList.size(); j++) {
                    job_post_skill.setJob_post(job_post);
                    job_post_skill.setSkill(skillDTOList.get(j).getSkill());
                    job_post_skill.setNumber(skillDTOList.get(j).getNumber());
                    job_post_skillService.saveJobPostSkill(job_post_skill);

                    job_post_skill = new Job_Post_Skill();
                }

//        insert account to table user
                if (businessIsExisted == null) {
                    String email = businessDTO.getEmail();
                    String password = listPass.get(i);

                    Users users = new Users(email, password);
                    users.setActive(true);

                    List<Role> roleList = new ArrayList<>();
                    Role roleOfBusiness = new Role();
                    roleOfBusiness.setId(3);
                    roleList.add(roleOfBusiness);

                    Role roleOfSupervisor = new Role();
                    roleOfSupervisor.setId(4);
                    roleList.add(roleOfSupervisor);

                    users.setRoles(roleList);

                    usersService.saveUser(users);

                    Supervisor supervisor = new Supervisor();
                    supervisor.setEmail(businessDTO.getEmail());
                    supervisor.setAddress(businessDTO.getBusiness_address());
                    supervisor.setName(businessDTO.getBusiness_eng_name());
                    supervisor.setPhone(businessDTO.getBusiness_phone());
                    iSupervisorService.createSupervisor(supervisor, null);
                    detail = new HistoryDetail(Business.class.getName(), null, null, businessDTO.toString());
                    detail.setHistoryAction(action);
                    details.add(detail);
                }
            }
            action.setDetails(details);
            iHistoryActionService.createHistory(action);
            return true;
        } else {
            return false;
        }
    }

    public boolean sendMailBusiness(List<BusinessDTO> businessDTOS) {
        try {
            for (int i = 0; i < businessDTOS.size(); i++) {
                BusinessDTO businessDTO = businessDTOS.get(i);
                Business businessIsExisted = iBusinessService.getBusinessByEmail(businessDTO.getEmail());
                if (businessIsExisted == null) {
                    String name = businessDTO.getBusiness_name();
                    String email = businessDTO.getEmail();
                    String password = usersService.getAlphaNumericString();
                    listPass.add(password);

                    boolean isSendMail = usersService.sendEmail(name, email, password);
                    if (isSendMail == false) {
                        return false;
                    }
                } else {
                    String name = businessIsExisted.getBusiness_name();
                    String email = businessIsExisted.getEmail();
                    usersService.sendEmailToBusinessIsExisted(name, email);
                }
            }
        } catch (Exception e) {
            return false;
        }
        return true;
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
