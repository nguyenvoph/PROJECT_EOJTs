package com.example.demo.service;

import com.example.demo.config.BusinessProposedStatus;
import com.example.demo.config.StudentStatus;
import com.example.demo.entity.*;
import com.example.demo.repository.IBusiness_ProposedRepository;
import com.example.demo.repository.ISupervisorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class Business_ProposedService implements IBusiness_ProposedService {

    @Autowired
    IBusiness_ProposedRepository iBusiness_proposedRepository;

    @Autowired
    ISemesterService iSemesterService;

    @Autowired
    IOjt_EnrollmentService iOjt_enrollmentService;

    @Autowired
    IStudentService iStudentService;

    @Autowired
    IEventService iEventService;

    @Autowired
    IUsersService iUsersService;

    @Autowired
    IBusinessService iBusinessService;

    @Autowired
    IStudent_EventService iStudent_eventService;

    @Autowired
    ISupervisorRepository iSupervisorRepository;

    @Override
    public List<Business_Proposed> getAll() {

        Semester semester = iSemesterService.getSemesterCurrent();
        List<Business_Proposed> business_proposeds = iBusiness_proposedRepository.findAll();

        List<Business_Proposed> business_proposedsSemesterCurrent = new ArrayList<>();

        for (int i = 0; i < business_proposeds.size(); i++) {
            Student student = business_proposeds.get(i).getStudent_proposed();
            Ojt_Enrollment ojt_enrollment = iOjt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(student.getEmail(), semester.getId());
            if (ojt_enrollment != null) {
                business_proposedsSemesterCurrent.add(business_proposeds.get(i));
            }
        }
        return business_proposedsSemesterCurrent;
    }

    @Override
    public Business_Proposed findById(int id) {
        return iBusiness_proposedRepository.findById(id);
    }

    @Override
    public void updateStatusByAdmin(int id, String comment, boolean status, String email) throws Exception {
        Business_Proposed business_proposed = findById(id);
        String descriptionEvent = "", emailNextHeading = "", contentEmail = "";

        if (business_proposed != null) {
            business_proposed.setCommentAdmin(comment);

            if (status) {
                business_proposed.setIsAcceptedByAdmin(BusinessProposedStatus.ACCEPTED);
                descriptionEvent = "Xin chào " + business_proposed.getStudent_proposed().getName() + "! Lời đề nghị thực tập tại doanh nghiệp " +
                        business_proposed.getBusiness_name() + " của bạn đã được chấp nhận"
                        + comment;
                emailNextHeading = "admin@gmail.com";
                contentEmail = "";
            } else {
                business_proposed.setIsAcceptedByAdmin(BusinessProposedStatus.REJECTED);
                descriptionEvent = "Xin chào " + business_proposed.getStudent_proposed().getName() + "! Lời đề nghị thực tập tại doanh nghiệp " +
                        business_proposed.getBusiness_name() + " của bạn đã bị từ chối vì lý do: "
                        + comment;
                emailNextHeading = "admin@gmail.com";
                contentEmail = "";
            }
            iBusiness_proposedRepository.save(business_proposed);
        }

        createInformMessageAndSendMail(status, business_proposed, descriptionEvent, email, emailNextHeading, contentEmail);
    }


//    @Override
//    public void updateStatusByStartUpRoom(int id, String comment, boolean status, String email) throws Exception {
//        Business_Proposed business_proposed = findById(id);
//
//        if (business_proposed != null) {
//            business_proposed.setCommentStartupRoom(comment);
//
//            if (status) {
//                business_proposed.setIsAcceptedByStartupRoom(BusinessProposedStatus.ACCEPTED);
//            } else {
//                business_proposed.setIsAcceptedByStartupRoom(BusinessProposedStatus.REJECTED);
//            }
//            iBusiness_proposedRepository.save(business_proposed);
//        }
//
//        String descriptionEvent = "Xin chào " + business_proposed.getStudent_proposed().getName() + "! Lời đề nghị thực tập tại doanh nghiệp " +
//                business_proposed.getBusiness_name() + " của bạn đã bị từ chối bởi Phòng Khởi Nghiệp vì lý do: "
//                + comment;
//        String emailNextHeading = "headtraining@gmail.com";
//        String contentEmail = "PHÒNG KHỞI NGHIỆP ĐÃ XEM XÉT VÀ CHẤP NHẬN YÊU CẤU THỰC TẬP TẠI DOANH NGHIỆP " + business_proposed.getBusiness_name()
//                + " CỦA SINH VIÊN " + business_proposed.getStudent_proposed().getName() + "!\n" + "KÍNH MONG PHÒNG ĐÀO TẠO XEM XÉT TRƯỜNG HỢP!";
//
//        createInformMessageAndSendMail(status, business_proposed, descriptionEvent, email, emailNextHeading, contentEmail);
//    }
//
//    @Override
//    public void updateStatusByHeadOfTraining(int id, String comment, boolean status, String email) throws Exception {
//        Business_Proposed business_proposed = findById(id);
//
//        if (business_proposed != null) {
//            business_proposed.setCommentHeadOfTraining(comment);
//            if (status) {
//                business_proposed.setIsAcceptedByHeadOfTraining(BusinessProposedStatus.ACCEPTED);
//            } else {
//                business_proposed.setIsAcceptedByHeadOfTraining(BusinessProposedStatus.REJECTED);
//            }
//            iBusiness_proposedRepository.save(business_proposed);
//        }
//
//        String descriptionEvent = "Xin chào " + business_proposed.getStudent_proposed().getName() + "! Lời đề nghị thực tập tại doanh nghiệp " +
//                business_proposed.getBusiness_name() + " của bạn đã bị từ chối bởi phòng Đào tạo vì lý do: "
//                + comment;
//        String emailNextHeading = "headmaster@gmail.com";
//        String contentEmail = "PHÒNG ĐÀO TẠO ĐÃ XEM XÉT VÀ CHẤP NHẬN YÊU CẤU THỰC TẬP TẠI DOANH NGHIỆP " + business_proposed.getBusiness_name()
//                + " CỦA SINH VIÊN " + business_proposed.getStudent_proposed().getName() + "!\n" + "KÍNH MONG BAN GIÁM HIỆU XEM XÉT TRƯỜNG HỢP!";
//
//        createInformMessageAndSendMail(status, business_proposed, descriptionEvent, email, emailNextHeading, contentEmail);
//    }
//
//    @Override
//    public void updateStatusByHeadMaster(int id, String comment, boolean status, String email) throws Exception {
//        Business_Proposed business_proposed = findById(id);
//        String descriptionEvent = "", emailNextHeading = "", contentEmail = "";
//        if (business_proposed != null) {
//            business_proposed.setCommentHeadOfMaster(comment);
//            if (status) {
//                business_proposed.setIsAcceptedByHeadMaster(BusinessProposedStatus.ACCEPTED);
//
//                descriptionEvent = "Xin chào " + business_proposed.getStudent_proposed().getName() + "! Lời đề nghị thực tập tại doanh nghiệp " +
//                        business_proposed.getBusiness_name() + " của bạn đã được phê duyệt bởi Ban giám hiệu";
//            } else {
//                business_proposed.setIsAcceptedByHeadMaster(BusinessProposedStatus.REJECTED);
//
//                descriptionEvent = "Xin chào " + business_proposed.getStudent_proposed().getName() + "! Lời đề nghị thực tập tại doanh nghiệp " +
//                        business_proposed.getBusiness_name() + " của bạn đã bị từ chối bởi Ban giám hiệu vì lí do: " + comment;
//                contentEmail = "PHÒNG ĐÀO TẠO ĐÃ XEM XÉT VÀ CHẤP NHẬN YÊU CẤU THỰC TẬP TẠI DOANH NGHIỆP " + business_proposed.getBusiness_name()
//                        + " CỦA SINH VIÊN " + business_proposed.getStudent_proposed().getName() + "!\n" + "KÍNH MONG BAN GIÁM HIỆU XEM XÉT TRƯỜNG HỢP!";
//            }
//            iBusiness_proposedRepository.save(business_proposed);
//        }
//
//        createInformMessageAndSendMail(status, business_proposed, descriptionEvent, email, emailNextHeading, contentEmail);
//    }

    @Override
    public void createInformMessageAndSendMail(boolean status, Business_Proposed business_proposed, String descriptionEvent, String emailHeading, String emailNextHeading, String emailContent) throws Exception {
//        if (!status || (status && emailHeading.equals("headmaster@gmail.com"))) {
        // create inform message
        Event event = new Event();
        Date date = new Date(Calendar.getInstance().getTime().getTime());
        List<Student> studentList = new ArrayList<>();
        studentList.add(business_proposed.getStudent_proposed());

        event.setTitle("Kết quả đề xuất thực tập tại doanh nghiệp mới");
        event.setDescription(descriptionEvent);
        event.setTime_created(date);
        //event.setStudents(studentList);
        event.setRead(false);
        Admin admin = new Admin();
        admin.setEmail(emailHeading);
        event.setAdmin(admin);

        boolean create = iEventService.createEvent(event);

        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            Student_Event student_event = new Student_Event();
            student_event.setStudent(student);
            student_event.setEvent(event);
            student_event.setStudent(false);

            iStudent_eventService.saveStudentEvent(student_event);
        }

        if (status) {
            // Xử lí logic khúc này: add vô bảng business + set ojt_enrollment

            List<Role> roleList = new ArrayList<>();
            Role role = new Role();
            Ojt_Enrollment ojt_enrollment = new Ojt_Enrollment();
            List<Ojt_Enrollment> ojtEnrollmentList = new ArrayList<>();
            Users users = new Users();
            Business business = new Business();

            String password = iUsersService.getAlphaNumericString();

            role.setId(3);
            roleList.add(role);
            users.setRoles(roleList);
            users.setEmail(business_proposed.getEmail());
            users.setPassword(password);
            users.setActive(true);

            Semester semester = iSemesterService.getSemesterCurrent();

            business.setEmail(business_proposed.getEmail());
            business.setBusiness_name(business_proposed.getBusiness_name());
            business.setBusiness_eng_name(business_proposed.getBusiness_eng_name());
            business.setBusiness_phone(business_proposed.getBusiness_phone());
            business.setBusiness_address(business_proposed.getBusiness_address());
            business.setBusiness_overview(business_proposed.getBusiness_overview());
            business.setBusiness_website(business_proposed.getBusiness_website());
            business.setLogo(business_proposed.getLogo());

            Ojt_Enrollment ojt_enrollmentIsExisted=
                    iOjt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId
                            (business_proposed.getStudent_proposed().getEmail(),semester.getId());

            ojt_enrollmentIsExisted.setBusiness(business);
            Date timeEnroll = new Date(Calendar.getInstance().getTime().getTime());
            ojt_enrollmentIsExisted.setTimeEnroll(timeEnroll);
            iOjt_enrollmentService.saveOjtEnrollment(ojt_enrollmentIsExisted);

            Ojt_Enrollment newOjtEnrollmentForBusiness=new Ojt_Enrollment();
            newOjtEnrollmentForBusiness.setBusiness(business);
            newOjtEnrollmentForBusiness.setSemester(semester);
            ojtEnrollmentList.add(newOjtEnrollmentForBusiness);
            business.setOjt_enrollments(ojtEnrollmentList);

            Supervisor supervisor=new Supervisor();
            supervisor.setEmail(business_proposed.getEmail());
            supervisor.setAddress(business_proposed.getBusiness_address());
            supervisor.setActive(true);
            supervisor.setName(business_proposed.getBusiness_eng_name());
            supervisor.setPhone(business_proposed.getBusiness_phone());
            iSupervisorRepository.save(supervisor);


            //update status student when raise business success
            Student student = business_proposed.getStudent_proposed();
            student.setStatus(StudentStatus.STARTED);
            student.setSupervisor(supervisor);
            iStudentService.saveStudent(student);

            iBusinessService.saveBusiness(business);
            iUsersService.saveUser(users);


            if (iUsersService.saveUser(users)) {
                iUsersService.sendEmail(business.getBusiness_name(), users.getEmail(), users.getPassword());
            }
        }
    }

    @Override
    public void createBusinessPropose(Business_Proposed business_proposed) {
        iBusiness_proposedRepository.save(business_proposed);
    }

    @Override
    public boolean updateBusinessPropose(Business_Proposed business_proposed) {
        Business_Proposed businessProposedFound = iBusiness_proposedRepository.findById(business_proposed.getId());

        if (businessProposedFound != null) {
            iBusiness_proposedRepository.save(business_proposed);
            return true;
        }
        return false;
    }

    @Override
    public boolean checkBusinessProposeIsReject(String email) {

        List<Business_Proposed> business_proposeds = iBusiness_proposedRepository.findBusiness_ProposedsByStudent_proposed(email);
        if (business_proposeds.size() == 0 || business_proposeds == null) {
            return true;
        }
        for (int i = 0; i < business_proposeds.size(); i++) {
            Business_Proposed bus = business_proposeds.get(i);
            if (bus.getIsAcceptedByAdmin() == BusinessProposedStatus.REJECTED) {
                return true;
            }
        }
        return false;
    }
}
