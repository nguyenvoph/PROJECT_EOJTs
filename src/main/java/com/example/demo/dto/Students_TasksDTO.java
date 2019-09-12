package com.example.demo.dto;

import java.io.Serializable;
import java.util.List;

public class Students_TasksDTO implements Serializable {
    private List<String> studentEmail;
    private List<Integer> countTaskOfStudent;

    public Students_TasksDTO() {
    }

    public List<String> getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(List<String> studentEmail) {
        this.studentEmail = studentEmail;
    }

    public List<Integer> getCountTaskOfStudent() {
        return countTaskOfStudent;
    }

    public void setCountTaskOfStudent(List<Integer> countTaskOfStudent) {
        this.countTaskOfStudent = countTaskOfStudent;
    }
}
