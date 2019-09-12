package com.example.demo.service;

import com.example.demo.entity.Business;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Student;
import java.util.List;

public interface IOjt_EnrollmentService {

    boolean saveListOjtEnrollment(List<Ojt_Enrollment> ojtEnrollmentList);

    boolean saveOjtEnrollment(Ojt_Enrollment ojtEnrollment);

    List<Ojt_Enrollment> getAllOjt_Enrollment();

    int getOjt_EnrollmentIdByBusinessEmail(String email);

    Ojt_Enrollment getOjt_EnrollmentByStudentEmail(String email);

    void updateStudentToBusinessPassOption1OrOption2(List<Student> studentList);

    Ojt_Enrollment getOjt_enrollmentOfBusiness(Business business);

    List<Student> getListStudentByBusiness(String email);

    Ojt_Enrollment getOjt_EnrollmentById(int id);

    void updateBusinessForStudent(String emailBusiness, String emailStudent);

    boolean setBusinessForStudent(String emailBusiness, String emailStudent);

    Ojt_Enrollment getOjtEnrollmentByBusinessEmailAndSemesterId(String email, int id);

    Ojt_Enrollment getOjtEnrollmentByStudentEmailAndSemesterId(String email, int id);

    List<Ojt_Enrollment> getOjt_EnrollmentsBySemesterIdAndStudentEmailNotNull(int id);

    List<Ojt_Enrollment> getOjt_EnrollmentsBySemesterIdAndBusinessEmailNotNull(int id);

    List<Ojt_Enrollment> getOjt_EnrollmentsBySemesterIdAndBusinessNotNullAndStudentNotNull(int id, String email);

    int countOjt_EnrollmentsByBusinessEmailAndSemesterIdAndStudentEmailNotNull(String email,int id);

    Ojt_Enrollment findOjt_EnrollmentByStudentEmailAndBusinessIsNull(String email);

    Ojt_Enrollment findLastEnrollmentByStudentEmail(String email);
}
