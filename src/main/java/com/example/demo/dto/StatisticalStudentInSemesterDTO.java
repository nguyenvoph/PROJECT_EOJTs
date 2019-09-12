package com.example.demo.dto;

import java.io.Serializable;
import java.util.List;

public class StatisticalStudentInSemesterDTO implements Serializable {
    private List<Integer> countStudentByType; // gioi kha tb
    private List<Integer> countStudentByStatus; // pass hay rot

    public StatisticalStudentInSemesterDTO() {
    }

    public List<Integer> getCountStudentByType() {
        return countStudentByType;
    }

    public void setCountStudentByType(List<Integer> countStudentByType) {
        this.countStudentByType = countStudentByType;
    }

    public List<Integer> getCountStudentByStatus() {
        return countStudentByStatus;
    }

    public void setCountStudentByStatus(List<Integer> countStudentByStatus) {
        this.countStudentByStatus = countStudentByStatus;
    }
}
