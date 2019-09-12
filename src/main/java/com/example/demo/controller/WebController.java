package com.example.demo.controller;

import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.StudentDTO;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/account")
public class WebController {

    @Autowired
    IUsersService usersService;

    @Autowired
    IJwtService jwtService;

    @Autowired
    IStudentService studentService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IStudent_AnswerService iStudent_answerService;


    @GetMapping("")
    public String hello() {
        return "hello";
    }

    @PostMapping("/token")
    public ResponseEntity<LoginDTO> checkLogin(HttpServletRequest request, @RequestBody Users users, HttpServletResponse response) {
        String result = "";
        HttpStatus httpStatus = null;
        boolean check;
        Users usersFound = new Users();
        LoginDTO login = new LoginDTO();
        try {
            check = false;
            if (usersService.findUserByEmailAndPassWord(users.getEmail(), users.getPassword()) != null) {
                usersFound = usersService.findUserByEmailAndPassWord(users.getEmail(), users.getPassword());
                result = jwtService.generateTokenLogin(usersFound.getEmail(), usersFound.getRoles().get(0).getDescription());
               // result = jwtService.generateTokenLogin(usersFound.getEmail(), usersFound.getRoles());

                login.setUser(usersFound);
                login.setToken(result);

                for (int i = 0; i < usersFound.getRoles().size(); i++) {
                    String name = usersFound.getRoles().get(i).getDescription();
                    if (name.equals("ROLE_STUDENT")) {
                        Student student = studentService.getStudentByEmail(users.getEmail());
                        StudentDTO studentDTO = new StudentDTO();
                        studentDTO.convertFromStudentEntity(student);


                        Ojt_Enrollment ojt_enrollment =
                                ojt_enrollmentService.findLastEnrollmentByStudentEmail(studentDTO.getEmail());
                        Semester semester = ojt_enrollment.getSemester();
                        //Ojt_Enrollment ojt_enrollment=ojt_enrollmentService.findOjt_EnrollmentByStudentEmailAndBusinessIsNull(studentDTO.getEmail());
                       // Semester semester = ojt_enrollment.getSemester();
                        studentDTO.setSemester(semester);
                        if (ojt_enrollment.getBusiness() != null) {
                            studentDTO.setIntership(true);
                            studentDTO.setBusinessName(ojt_enrollment.getBusiness().getBusiness_eng_name());
                        }else{
                            studentDTO.setIntership(false);
                        }
                        login.setStudent(studentDTO);
                    }
                }

                httpStatus = HttpStatus.OK;
            } else {
                httpStatus = HttpStatus.BAD_REQUEST;
            }
        } catch (Exception ex) {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<LoginDTO>(login, httpStatus);
    }

    //check account existed
    @PutMapping("/reset")
    @ResponseBody
    private ResponseEntity<Void> resetPassword(@RequestParam String email) {
        boolean isSuccess = usersService.createResetToken(email);
        if (isSuccess == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/checkToken")
    @ResponseBody
    private ResponseEntity<Void> checkToken(@RequestParam String token) {
        String[] parts = token.split("_");
        boolean isValid = usersService.checkToken(parts[0], parts[1]);
        if (isValid == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/createNewPassword")
    @ResponseBody
    private ResponseEntity<Void> createNewPassword(@RequestParam String password, @RequestParam String token) {
        String[] parts = token.split("_");
        boolean isValid = usersService.createNewPassword(password, parts[1]);
        if (isValid == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
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
