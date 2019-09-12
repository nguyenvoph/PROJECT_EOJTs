package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.entity.Question;
import com.example.demo.entity.Student;
import com.example.demo.entity.Student_Answer;
import com.example.demo.repository.IAnswerRepository;
import com.example.demo.repository.IStudent_AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class Student_AnswerService implements IStudent_AnswerService {

    @Autowired
    IStudent_AnswerRepository iStudent_answerRepository;

    @Autowired
    IAnswerRepository iAnswerRepository;

    @Autowired
    IQuestionService iQuestionService;

    @Override
    public void saveStudent_Answer(Student student, List<Answer> answer, Map<String, String> mapsOther) {
        Student_Answer student_answer = new Student_Answer();

        for (int i = 0; i < answer.size(); i++) {
            student_answer.setStudent(student);
            student_answer.setAnswer(answer.get(i));
            iStudent_answerRepository.save(student_answer);
            student_answer = new Student_Answer();
        }
        for (Map.Entry<String, String> maps : mapsOther.entrySet()) {

            Answer answerOther = new Answer();
            answerOther.setOther(true);
            answerOther.setContent(maps.getValue());

            Question question = iQuestionService.findQuestionById(Integer.parseInt(maps.getKey()));
            answerOther.setQuestion(question);

            iAnswerRepository.save(answerOther);
            student_answer.setAnswer(answerOther);
            student_answer.setStudent(student);

            iStudent_answerRepository.save(student_answer);
            student_answer = new Student_Answer();
        }

    }

    @Override
    public void saveFeedback(Student student, Answer answer) {
        Student_Answer student_answer = new Student_Answer();
        student_answer.setStudent(student);
        student_answer.setAnswer(answer);

        iStudent_answerRepository.save(student_answer);
    }

    @Override
    public Student_Answer findStudentAnswerByStudentEmail(String email) {
        return iStudent_answerRepository.findByStudentEmail(email);
    }

    @Override
    public int countStudentsAnswerByAnswerId(int id) {
        int student_answers = iStudent_answerRepository.countStudent_AnswersByAnswerId(id);
        return student_answers;
    }

    @Override
    public int countStudent_AnswersGroupByStudentEmail() {
        int studentsIsAnswer = iStudent_answerRepository.countStudent_AnswersGroupByStudentEmail();
        return studentsIsAnswer;
    }

    @Override
    public List<Student_Answer> findStudentAnswersByEmail(String email) {
        List<Student_Answer> student_answers = iStudent_answerRepository.findStudent_AnswersByStudentEmail(email);
        if (student_answers != null) {
            return student_answers;
        }
        return null;
    }

    @Override
    public void deleteStudentAnswerByAnswerId(int id) {
        iStudent_answerRepository.deleteByAnswerId(id);
    }
}
