package com.example.demo.service;

import com.example.demo.entity.Answer;

import java.util.List;

public interface IAnswerService {
    void saveAnswer(Answer answer);
    List<Answer> findAnswerByOtherIsTrueAndQuestionId(int id);
    Answer findAnswerById(int id);
    void deleteAnswerById(int id);
    List<Answer> getAllFeedbackStudent(String email);
}
