package com.example.demo.controller;

import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Semester;
import com.example.demo.service.IOjt_EnrollmentService;
import com.example.demo.service.ISemesterService;
import com.example.demo.service.Ojt_EnrollmentService;
import com.example.demo.service.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/enrollment")
public class Ojt_EnrollmentController {

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    ISemesterService semesterService;

    @GetMapping
    public ResponseEntity<List<Ojt_Enrollment>> getAllOjt_Enrollment() throws Exception {
        List<Ojt_Enrollment> ojtEnrollmentList = new ArrayList<>();
        try {
            ojtEnrollmentList = ojt_enrollmentService.getAllOjt_Enrollment();

        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(ojtEnrollmentList, HttpStatus.OK);
    }

    //check semester ok
    @GetMapping("/{email}")
    public ResponseEntity<Integer> getIdOjt_Enrollment(@PathVariable String email) {
        Semester semester = semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(email, semester.getId());
        //return new ResponseEntity<Integer>(ojt_enrollmentService.getOjt_EnrollmentIdByBusinessEmail(email), HttpStatus.OK);
        if (ojt_enrollment != null) {
            return new ResponseEntity<Integer>(ojt_enrollment.getId(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get semester info
    @GetMapping("/currentSemester")
    public ResponseEntity<Semester> getSemester() {
        Semester semester = semesterService.getSemesterCurrent();
        if (semester != null) {
            return new ResponseEntity<Semester>(semester, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getSelectedStuEnrollment")
    public ResponseEntity<Ojt_Enrollment> getSelectedStuEnrollment(@RequestParam String email) {
        Semester semester = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojtEnrollment = ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(email, semester.getId());
        if (ojtEnrollment != null) {
            return new ResponseEntity<Ojt_Enrollment>(ojtEnrollment, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

}
