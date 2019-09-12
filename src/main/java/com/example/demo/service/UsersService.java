package com.example.demo.service;

import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.IUsersRepository;
import com.example.demo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UsersService implements IUsersService {
    @Autowired
    IUsersRepository usersRepository;

    @Autowired
    private JavaMailSender sender;

    @Autowired
    IRoleService roleService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IStudentService iStudentService;

    @Autowired
    IBusinessService iBusinessService;

    @Autowired
    private RedisTemplate<Object, Object> template;

    @Override
    public boolean sendEmail(String name, String mail, String password) {
        try {
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);

            helper.setTo(mail);
            helper.setText("Hi " + name + "," + "welcome you to my system.\nYour password are : " + password + "\nThanks and Regards");
            helper.setSubject("[THÔNG BÁO]");

            sender.send(message);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void sendEmailToSupervisor(String name, String email, String password) throws Exception {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setTo(email);
        helper.setText("Hi " + name + "," + "welcome you to my system.\nYour password are : " + password + "\n.You are appointed " +
                "as a supervisor for internship management at the company this semester.\nThanks and Regards");
        helper.setSubject("[THÔNG BÁO]");

        sender.send(message);
    }

    @Override
    public void sendEmailToStudentIsExisted(String name, String mail) throws Exception {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setTo(mail);
        helper.setText("Xin chào " + name + " , đã tới kì OJT mới. Vui lòng sử dụng tài khoản kì vừa rồi để tiếp tục sử dụng hệ thống" +
                ". Chúc bạn có kì OJT thật tốt và nhiều thành công! \nThanks and Regards");
        helper.setSubject("[THÔNG BÁO]");

        sender.send(message);
    }

    @Override
    public void sendEmailToBusinessIsExisted(String name, String mail) throws Exception {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setTo(mail);
        helper.setText("Xin chào " + name + " , đã tới kì OJT mới. Vui lòng sử dụng tài khoản kì vừa rồi để tiếp tục sử dụng hệ thống" +
                ". Chúc công ty " + name + " có kì OJT mới thật tốt và nhiều thành công! \nThanks and Regards");
        helper.setSubject("[THÔNG BÁO]");

        sender.send(message);
    }

    @Override
    public void sendResetEmail(String token, String email) throws Exception {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(email);
        helper.setText("Hi," + "\n" + "You or someone just require us to reset " + email + " account.\n" +
                "Here is your reset password link: http://localhost:3000/#/resetpassword/" + token +
                "\nThis link is only available in 5 minutes. If it's not you. Just ignore this email and your password will not change." +
                "\nThanks & best regards!");
        helper.setSubject("[Reset your account password in EOJTs system]");

        sender.send(message);
    }

    @Override
    public void sendEmailHeading(String mail, String content) throws Exception {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setTo(mail);
        helper.setText(content);
        helper.setSubject("[XÉT DUYỆT ĐỀ XUẤT THỰC TẬP TẠI CÔNG TY NGOÀI CỦA SINH VIÊN]");

        sender.send(message);
    }

    @Override
    public String getAlphaNumericString() {
        String AlphaNumericString = "0123456789"
                + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                + "abcdefghijklmnopqrstuvxyz";
        StringBuilder sb = new StringBuilder(7);

        for (int i = 0; i < 7; i++) {
            int index
                    = (int) (AlphaNumericString.length()
                    * Math.random());
            sb.append(AlphaNumericString
                    .charAt(index));
        }
        return sb.toString();
    }

    @Override
    public Users findUserByEmail(String email) {
        Users users = usersRepository.findUserByEmail(email);
        if (users != null) {
            return users;
        }
        return null;
    }

    @Override
    public Users findUserByEmailAndPassWord(String email, String password) {
        Users users = usersRepository.findUserByEmailAndPassword(email, password);
        if (users != null) {
            return users;
        }
        return null;
    }

    @Override
    public boolean saveListUser(List<Users> usersList) {
        ValueOperations values = template.opsForValue();
        List<Users> usersListIsExisted = (List<Users>) values.get("ROLE_STUDENTusers");
        if(usersListIsExisted==null){
            values.set("ROLE_STUDENTusers",usersList);
        }else{
            usersListIsExisted.addAll(usersList);
            values.set("ROLE_STUDENTusers",usersListIsExisted);
        }

        usersRepository.saveAll(usersList);
        return true;
    }

    @Override
    public boolean saveUser(Users users) {
        ValueOperations values = template.opsForValue();

        List<Role> roleList = users.getRoles();
        for (int i = 0; i < roleList.size(); i++) {
            Role role = roleList.get(i);
            // if (role.getDescription().equals("ROLE_STUDENT")) {
            if (role.getId() == 2) {
                List<Users> usersList = (List<Users>) values.get("ROLE_STUDENTusers");
                if (usersList != null) {
                    usersList.add(users);
                    values.set("ROLE_STUDENTusers", usersList);
                }
                //} else if (role.getDescription().equals("ROLE_HR")) {
            } else if (role.getId() == 3) {
                List<Users> usersList = (List<Users>) values.get("ROLE_HRusers");
                if (usersList != null) {
                    usersList.add(users);
                    values.set("ROLE_HRusers", usersList);
                }
            }
        }
        usersRepository.save(users);
        return true;
    }

    @Override
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    @Override
    public boolean updatePasswordOfUserByEmail(String email, String password) {
        Users users = findUserByEmail(email);
        if (users != null) {
            users.setPassword(password);
            usersRepository.save(users);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateStatus(String email, boolean isActive) {
        ValueOperations values = template.opsForValue();

        Users users = usersRepository.findUserByEmail(email);

        List<Role> roleList = users.getRoles();
        for (int i = 0; i < roleList.size(); i++) {
            Role role = roleList.get(i);
            if (role.getDescription().equals("ROLE_STUDENT")) {
                List<Users> usersList = (List<Users>) values.get("ROLE_STUDENTusers");
                if (usersList != null) {
                    int index = findPositionOfUsers(usersList, users);
                    usersList.remove(index);

                    users.setActive(isActive);
                    usersList.add(index, users);
                    values.set("ROLE_STUDENTusers", usersList);
                }
            } else if (role.getDescription().equals("ROLE_HR")) {
                List<Users> usersList = (List<Users>) values.get("ROLE_HRusers");
                if (usersList != null) {
                    int index = findPositionOfUsers(usersList, users);
                    usersList.remove(index);

                    users.setActive(isActive);
                    usersList.add(index, users);
                    values.set("ROLE_HRusers", usersList);
                }
            }
        }
        if (users != null) {
            users.setActive(isActive);
            usersRepository.save(users);
            return true;
        }
        return false;
    }

    public int findPositionOfUsers(List<Users> usersList, Users users) {
        for (int i = 0; i < usersList.size(); i++) {
            Users usersOfList = usersList.get(i);
            if (usersOfList.getEmail().equals(users.getEmail())) {
                return i;
            }
        }
        return -1;
    }

    @Override
    public boolean createResetToken(String email) {
        String resetToken = UUID.randomUUID().toString().replaceAll("_", "-");
        String resetTime = Long.toString(new Date().getTime());
        Users user = findUserByEmail(email);
        try {
            sendResetEmail(resetToken + "_" + email, email);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (user != null) {
            if (user.isActive()) {
                user.setResetToken(resetToken);
                user.setResetTime(resetTime);
                usersRepository.save(user);
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean checkToken(String token, String email) {
        Users user = findUserByEmail(email);
        if (user.getResetToken().equals(token)) {
            return true;
        }
        return false;
    }

    @Override
    public boolean createNewPassword(String password, String email) {
        Users user = findUserByEmail(email);
        Long time = new Date().getTime();
        Long resetTime = Long.parseLong(user.getResetTime());
        if (user != null) {
            //valid only 5 mins
            if ((time - resetTime) > 5 * 60 * 1000) {
                return false;
            } else {
                user.setPassword(password);
                usersRepository.save(user);
                return true;
            }
        }
        return false;
    }

    @Override
    public List<Users> getAllUsersByType(int type) {
        ValueOperations values = template.opsForValue();

        Role role = roleService.findRoleById(type);
        List<Role> roleList = new ArrayList<>();
        roleList.add(role);

        List<Users> users = (List<Users>) values.get(role.getDescription() + "users");
        if (users == null) {
            users = usersRepository.findUsersByRoles(roleList);
            values.set(role.getDescription() + "users", users);
            return users;
        } else {
            return users;
        }
    }

    @Override
    public List<Users> getAllUsersBySemester() {
        Semester semester = semesterService.getSemesterCurrent();
        List<Users> usersListCurrentSemester = new ArrayList<>();
        List<Ojt_Enrollment> ojt_enrollmentList = new ArrayList<>();

        List<Users> usersList = getAllUsers();

        for (int i = 0; i < usersList.size(); i++) {
            Users users = usersList.get(i);
            List<Role> roleListOfUsers = users.getRoles();
            if (roleListOfUsers != null) {
                for (int j = 0; j < roleListOfUsers.size(); j++) {
                    Role role = roleListOfUsers.get(j);
                    if (role.getDescription().equals("ROLE_HR")) {
                        Ojt_Enrollment ojt_enrollmentOfHr = ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(users.getEmail(), semester.getId());
                        if (ojt_enrollmentOfHr != null) {
                            ojt_enrollmentList.add(ojt_enrollmentOfHr);
                        }
                    } else if (role.getDescription().equals("ROLE_STUDENT")) {
                        Ojt_Enrollment ojt_enrollmentOfStudent = ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(users.getEmail(), semester.getId());
                        if (ojt_enrollmentOfStudent != null) {
                            ojt_enrollmentList.add(ojt_enrollmentOfStudent);
                        }
                    }
                }
            }
        }
        for (int i = 0; i < ojt_enrollmentList.size(); i++) {
            Ojt_Enrollment ojt_enrollment = ojt_enrollmentList.get(i);
            if (ojt_enrollment.getStudent() == null) {
                Business business = ojt_enrollment.getBusiness();
                Users users = findUserByEmail(business.getEmail());
                usersListCurrentSemester.add(users);
            } else {
                Student student = ojt_enrollment.getStudent();
                Users users = findUserByEmail(student.getEmail());
                usersListCurrentSemester.add(users);
            }
        }
        if (usersListCurrentSemester != null) {
            return usersListCurrentSemester;
        }
        return null;
    }

    @Override
    public PagingDTO pagingUser(int typeUser, int currentPage, int rowsPerPage) {
        List<Users> usersList = getAllUsersByType(typeUser);
        Utils<Users> usersUtils = new Utils<>();
        return usersUtils.paging(usersList, currentPage, rowsPerPage);
    }

    @Override
    public List<Users> getUsersNotYet(List<Users> users) {
        List<Users> usersListNotYet = new ArrayList<>();

        for (int i = 0; i < users.size(); i++) {
            Users user = users.get(i);

            Users userNotYet = findUserByEmail(user.getEmail());
            if (userNotYet == null) {
                usersListNotYet.add(user);
            }
        }
        return usersListNotYet;
    }
}
