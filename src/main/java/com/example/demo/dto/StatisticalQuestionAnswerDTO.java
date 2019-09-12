package com.example.demo.dto;

import com.example.demo.entity.Answer;

import java.io.Serializable;
import java.util.List;

public class StatisticalQuestionAnswerDTO implements Serializable {
    private String question;
    private List<String> answers;
    private List<Integer> countAnswer;
    private boolean isManyOption;
    private List<String> others;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }

    public List<Integer> getCountAnswer() {
        return countAnswer;
    }

    public void setCountAnswer(List<Integer> countAnswer) {
        this.countAnswer = countAnswer;
    }

    public boolean isManyOption() {
        return isManyOption;
    }

    public void setManyOption(boolean manyOption) {
        isManyOption = manyOption;
    }

    public List<String> getOthers() {
        return others;
    }

    public void setOthers(List<String> others) {
        this.others = others;
    }
}
