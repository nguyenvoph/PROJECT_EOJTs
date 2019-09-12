package com.example.demo.controller;

import com.example.demo.config.ActionEnum;
import com.example.demo.entity.*;
import com.example.demo.repository.IBusiness_ProposedRepository;
import com.example.demo.service.IBusiness_ProposedService;
import com.example.demo.service.IHistoryActionService;
import com.example.demo.service.IUsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/heading")
public class HeadingController {
    private final String TAG = "HeadingController";

    @Autowired
    IBusiness_ProposedService iBusiness_proposedService;

    @Autowired
    IUsersService iUsersService;

    @Autowired
    IHistoryActionService iHistoryActionService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<Business_Proposed>> getListBusiness_Proposed() {
        List<Business_Proposed> business_proposeds = iBusiness_proposedService.getAll();
        if (business_proposeds != null) {
            return new ResponseEntity<List<Business_Proposed>>(business_proposeds, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/id")
    @ResponseBody
    public ResponseEntity<Business_Proposed> getBusiness_Proposed(@RequestParam int id) {
        Business_Proposed business_proposed = iBusiness_proposedService.findById(id);
        if (business_proposed != null) {
            return new ResponseEntity<Business_Proposed>(business_proposed, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping("/admin")
    public ResponseEntity<Void> updateStatusAcceptByAdmin(@RequestParam int id,
                                                                @RequestParam String comment, @RequestParam boolean status) throws Exception {
        String email = getEmailFromToken();
        Users users = iUsersService.findUserByEmail(email);
        List<Role> roles = users.getRoles();

        for (int i = 0; i < roles.size(); i++) {
            if (roles.get(i).getDescription().equals("ROLE_ADMIN")) {
                iBusiness_proposedService.updateStatusByAdmin(id, comment, status, email);
                HistoryDetail historyDetail = new HistoryDetail(Business_Proposed.class.getName(), "isAcceptedByAdmin", String.valueOf(id), String.valueOf(status));
                HistoryDetail historyDetail2 = new HistoryDetail(Business_Proposed.class.getName(), "commentAdmin", String.valueOf(id), comment);

                HistoryAction action =
                        new HistoryAction(getEmailFromToken()
                                , "ROLE_ADMIN", ActionEnum.UPDATE, TAG, new Object() {
                        }
                                .getClass()
                                .getEnclosingMethod()
                                .getName(), null, new java.util.Date(), historyDetail);
                historyDetail.setHistoryAction(action);
                historyDetail2.setHistoryAction(action);
                action.getDetails().add(historyDetail2);
                iHistoryActionService.createHistory(action);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

//    @PutMapping("/startup")
//    public ResponseEntity<Void> updateStatusAcceptByStartUpRoom(@RequestParam int id,
//                                                                @RequestParam String comment, @RequestParam boolean status) throws Exception {
//        String email = getEmailFromToken();
//        Users users = iUsersService.findUserByEmail(email);
//        List<Role> roles = users.getRoles();
//
//        for (int i = 0; i < roles.size(); i++) {
//            if (roles.get(i).getDescription().equals("ROLE_STARTUP")) {
//                iBusiness_proposedService.updateStatusByStartUpRoom(id, comment, status, email);
//                return new ResponseEntity<>(HttpStatus.OK);
//            }
//        }
//        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
//    }
//
//    @PutMapping("/headTraining")
//    public ResponseEntity<Void> updateStatusAcceptByHeadTraining(@RequestParam int id,
//                                                                 @RequestParam String comment, @RequestParam boolean status) throws Exception {
//        String email = getEmailFromToken();
//        Users users = iUsersService.findUserByEmail(email);
//        List<Role> roles = users.getRoles();
//
//        for (int i = 0; i < roles.size(); i++) {
//            if (roles.get(i).getDescription().equals("ROLE_HEADTRAINING")) {
//                iBusiness_proposedService.updateStatusByHeadOfTraining(id, comment, status, email);
//                return new ResponseEntity<>(HttpStatus.OK);
//            }
//        }
//        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
//
//    }
//
//    @PutMapping("/headMaster")
//    public ResponseEntity<Void> updateStatusAcceptByHeadMaster(@RequestParam int id, @RequestParam String comment, @RequestParam boolean status) throws Exception {
//        String email = getEmailFromToken();
//        Users users = iUsersService.findUserByEmail(email);
//        List<Role> roles = users.getRoles();
//
//        for (int i = 0; i < roles.size(); i++) {
//            if (roles.get(i).getDescription().equals("ROLE_HEADMASTER")) {
//                iBusiness_proposedService.updateStatusByHeadMaster(id, comment, status, email);
//                return new ResponseEntity<>(HttpStatus.OK);
//            }
//        }
//        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
//
//    }

    @PutMapping
    public ResponseEntity<Void> updateBusiness(@RequestBody Business_Proposed business_proposed) {
        boolean result = iBusiness_proposedService.updateBusinessPropose(business_proposed);
        if (result) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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
