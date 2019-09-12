package com.example.demo.dto;

import com.example.demo.entity.Answer;
import com.example.demo.entity.Question;

import java.io.Serializable;
import java.util.List;

public class StudentAnswerDTO implements Serializable {

    private String studentEmail;
    private String businessEmail;
    private Question question;
    private List<Answer> answers;

    public StudentAnswerDTO() {
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getBusinessEmail() {
        return businessEmail;
    }

    public void setBusinessEmail(String businessEmail) {
        this.businessEmail = businessEmail;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }


    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }
}
