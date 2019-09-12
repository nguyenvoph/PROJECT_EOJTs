package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.entity.Student_Answer;
import com.example.demo.repository.IAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnswerService implements IAnswerService {

    @Autowired
    IAnswerRepository iAnswerRepository;

    @Autowired
    IStudent_AnswerService iStudent_answerService;

    @Override
    public void saveAnswer(Answer answer) {
        iAnswerRepository.save(answer);
    }

    @Override
    public List<Answer> findAnswerByOtherIsTrueAndQuestionId(int id) {
        List<Answer> answers = iAnswerRepository.findAnswersByOtherIsTrueAndQuestionId(id);
        return answers;
    }

    @Override
    public Answer findAnswerById(int id) {
        Answer answer = iAnswerRepository.findById(id);
        if (answer != null) {
            return answer;
        }
        return null;
    }

    @Transactional
    @Override
    public void deleteAnswerById(int id) {
        Answer answer = findAnswerById(id);
        if (answer != null) {
            iStudent_answerService.deleteStudentAnswerByAnswerId(id);
            iAnswerRepository.deleteById(id);
        }
    }

    @Override
    public List<Answer> getAllFeedbackStudent(String email) {
        List<Answer> answers=new ArrayList<>();
        List<Student_Answer> student_answers = iStudent_answerService.findStudentAnswersByEmail(email);
        for (int i = 0; i < student_answers.size(); i++) {
            Student_Answer student_answer = student_answers.get(i);
            Answer answer=student_answer.getAnswer();
            if(answer.getQuestion()== null){
                answers.add(answer);
            }
        }
        return answers;
    }
}
