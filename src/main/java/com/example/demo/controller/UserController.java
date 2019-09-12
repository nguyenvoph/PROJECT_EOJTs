package com.example.demo.controller;

import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.PersistenceException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    IUsersService userService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

//    @PostMapping
//    public ResponseEntity<Void> addListStudent(@RequestBody List<Users> userList) throws Exception {
//        try {
//            userService.saveListUser(userList);
//        } catch (PersistenceException ex) {
//            ex.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.CONFLICT);
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//        return new ResponseEntity<>(HttpStatus.CREATED);
//    }


    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> userList;
        try {
            userList = userService.getAllUsers();

        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @GetMapping("/getCurrentAccount")
    @ResponseBody
    private ResponseEntity<Users> getCurrentAccount() {
        String email = getEmailFromToken();
        Users account = userService.findUserByEmail(email);
        if (account != null) {
            return new ResponseEntity<Users>(account, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/usersBySemester")
    public ResponseEntity<List<Users>> getAllUsersBySemester() {
        List<Users> usersListCurrentSemester = userService.getAllUsersBySemester();
        if (usersListCurrentSemester != null) {
            return new ResponseEntity<List<Users>>(usersListCurrentSemester, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //update pass word of user
    @PutMapping("/updatePassword")
    public ResponseEntity<Void> updatePassWordOfUsers(@RequestParam String password) {
        String email = getEmailFromToken();
        boolean updatePassword = userService.updatePasswordOfUserByEmail(email, password);
        if (updatePassword == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<Void> updateActive(@RequestParam String email, @RequestParam boolean isActive) {
        boolean update = userService.updateStatus(email, isActive);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get all users by type
    @GetMapping("/getUsersByType")
    @ResponseBody
    public ResponseEntity<PagingDTO> getUsersByType(@RequestParam int type, @RequestParam int currentPage, @RequestParam int rowsPerPage) {
        //List<Users> usersList = userService.getAllUsersByType(type);
        PagingDTO usersList = userService.pagingUser(type, currentPage, rowsPerPage);
        if (usersList != null) {
            return new ResponseEntity<PagingDTO>(usersList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/searchUser")
    @ResponseBody
    public ResponseEntity<List<Users>> searchUser(@RequestParam int type, @RequestParam String valueSearch) {
        List<Users> usersList = userService.getAllUsersByType(type);
        List<Users> finalList = new ArrayList<>();
        for (int i = 0; i < usersList.size(); i++) {
            if (usersList.get(i).getEmail().toLowerCase().contains(valueSearch.toLowerCase())) {
                finalList.add(usersList.get(i));
            }
        }
        if (usersList != null) {
            return new ResponseEntity<List<Users>>(finalList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
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
