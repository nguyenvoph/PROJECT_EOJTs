package com.example.demo.dto;

import com.example.demo.entity.Evaluation;
import com.example.demo.entity.Student;

import java.util.List;

public class Student_EvaluationDTO {
    private Student student;
    private List<Evaluation> evaluationList;

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public List<Evaluation> getEvaluationList() {
        return evaluationList;
    }

    public void setEvaluationList(List<Evaluation> evaluationList) {
        this.evaluationList = evaluationList;
    }

    public Student_EvaluationDTO() {
    }
}
