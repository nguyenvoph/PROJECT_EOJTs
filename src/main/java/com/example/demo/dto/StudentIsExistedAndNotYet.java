package com.example.demo.dto;

import com.example.demo.entity.Student;

import java.io.Serializable;
import java.util.List;

public class StudentIsExistedAndNotYet implements Serializable {
    private List<Student> studentsIsExisted;
    private List<Student> studentsNotYet;

    public StudentIsExistedAndNotYet() {
    }

    public List<Student> getStudentsIsExisted() {
        return studentsIsExisted;
    }

    public void setStudentsIsExisted(List<Student> studentsIsExisted) {
        this.studentsIsExisted = studentsIsExisted;
    }

    public List<Student> getStudentsNotYet() {
        return studentsNotYet;
    }

    public void setStudentsNotYet(List<Student> studentsNotYet) {
        this.studentsNotYet = studentsNotYet;
    }
}
