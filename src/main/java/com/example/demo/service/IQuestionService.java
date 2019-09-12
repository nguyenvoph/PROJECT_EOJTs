package com.example.demo.service;

import com.example.demo.entity.Question;

import java.util.List;

public interface IQuestionService {
    List<Question> getAllQuestion();

    List<Question> getAllQuestionNotCareStatus();

    Question findQuestionById(int id);

    void addNewQuestion(Question question);

    void deleteQuestion(int id, boolean status);

    void updateQuestion(Question question);
}
