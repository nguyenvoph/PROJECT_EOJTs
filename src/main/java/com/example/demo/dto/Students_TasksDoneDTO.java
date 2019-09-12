package com.example.demo.dto;

import java.io.Serializable;
import java.util.List;

public class Students_TasksDoneDTO implements Serializable {
    private List<String> studentEmail;
    private List<Double> countTaskDoneOfStudent;

    public Students_TasksDoneDTO() {
    }

    public List<String> getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(List<String> studentEmail) {
        this.studentEmail = studentEmail;
    }

    public List<Double> getCountTaskDoneOfStudent() {
        return countTaskDoneOfStudent;
    }

    public void setCountTaskDoneOfStudent(List<Double> countTaskDoneOfStudent) {
        this.countTaskDoneOfStudent = countTaskDoneOfStudent;
    }
}
