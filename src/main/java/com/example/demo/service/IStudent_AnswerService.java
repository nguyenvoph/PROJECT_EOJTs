package com.example.demo.service;


import com.example.demo.entity.Answer;
import com.example.demo.entity.Student;
import com.example.demo.entity.Student_Answer;

import java.util.List;
import java.util.Map;

public interface IStudent_AnswerService {
    void saveStudent_Answer(Student student, List<Answer> answer, Map<String,String> mapsOther);
    void saveFeedback(Student student,Answer answer);
    Student_Answer findStudentAnswerByStudentEmail(String email);
    int countStudentsAnswerByAnswerId(int id);
    int countStudent_AnswersGroupByStudentEmail();
    List<Student_Answer> findStudentAnswersByEmail(String email);
    void deleteStudentAnswerByAnswerId(int id);
}
