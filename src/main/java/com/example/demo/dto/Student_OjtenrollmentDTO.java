package com.example.demo.dto;

import com.example.demo.entity.Student;

import java.io.Serializable;

public class Student_OjtenrollmentDTO implements Serializable {
    private Student student;
    private String businessEnroll;

    public Student_OjtenrollmentDTO() {
    }

    public Student_OjtenrollmentDTO(Student student, String businessEnroll) {
        this.student = student;
        this.businessEnroll = businessEnroll;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getBusinessEnroll() {
        return businessEnroll;
    }

    public void setBusinessEnroll(String businessEnroll) {
        this.businessEnroll = businessEnroll;
    }
}
