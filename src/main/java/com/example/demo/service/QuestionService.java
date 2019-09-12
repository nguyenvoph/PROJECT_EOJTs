package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.entity.Question;
import com.example.demo.repository.IQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService implements IQuestionService {

    @Autowired
    IQuestionRepository iQuestionRepository;

    @Autowired
    IAnswerService iAnswerService;

    @Autowired
    IStudent_AnswerService iStudent_answerService;

    @Override
    public List<Question> getAllQuestion() {
        List<Question> questions = iQuestionRepository.findAll();

        List<Question> questionsResult = new ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            if (question.isActive()) {
                List<Answer> answers = questions.get(i).getAnswers();
                for (int j = 0; j < answers.size(); j++) {
                    if (answers.get(j).isOther() == true) {
                        answers.remove(answers.get(j));
                    }
                }
                question.setAnswers(answers);
                questionsResult.add(question);
            }

        }
        if (questionsResult != null) {
            return questionsResult;
        }
        return null;
    }

    @Override
    public List<Question> getAllQuestionNotCareStatus() {
        List<Question> questions = iQuestionRepository.findAll();
        if (questions != null) {
            return questions;
        }
        return null;
    }

    @Override
    public Question findQuestionById(int id) {
        Question question = iQuestionRepository.findById(id);
        return question;
    }

    @Override
    public void addNewQuestion(Question question) {
        List<Answer> answers = question.getAnswers();

        for (Answer answer : answers) {
            answer.setQuestion(question);
        }
        question.setAnswers(answers);
        iQuestionRepository.save(question);
    }

    @Override
    public void deleteQuestion(int id, boolean status) {
        Question question = findQuestionById(id);
        if (question != null) {
            question.setActive(status);
            iQuestionRepository.save(question);

        }
    }

    @Override
    public void updateQuestion(Question question) {
        Question questionIsExisted = findQuestionById(question.getId());

        int sizeAnswerOfQuestionUpdate = question.getAnswers().size(); //size update
        int sizeAnswerOfQuestionIsExisted = questionIsExisted.getAnswers().size(); // size current

        if (questionIsExisted != null) {
            if (sizeAnswerOfQuestionUpdate < sizeAnswerOfQuestionIsExisted) { // xoa cau tra loi
                List<Answer> answersIsDeleted = getAnswerIsDeleted(questionIsExisted.getAnswers(), question.getAnswers());
                for (int i = 0; i < answersIsDeleted.size(); i++) {
                    Answer answer = answersIsDeleted.get(i);
                    iAnswerService.deleteAnswerById(answer.getId());
                }
                List<Answer> answers = question.getAnswers();

                for (Answer answer : answers) {
                    answer.setQuestion(question);
                }
                question.setAnswers(answers);

                iQuestionRepository.save(question);
                return;
            } else if (sizeAnswerOfQuestionUpdate > sizeAnswerOfQuestionIsExisted) { // them cau tra loi
                List<Answer> answersIsAdd = getAnswerIsDeleted(question.getAnswers(), questionIsExisted.getAnswers()); //tim duoc list answer add
                for (int i = 0; i < answersIsAdd.size(); i++) {
                    Answer answer = answersIsAdd.get(i);
                    answer.setQuestion(question);
                    iAnswerService.saveAnswer(answer);
                }
                List<Answer> answers = question.getAnswers();

                for (Answer answer : answers) {
                    answer.setQuestion(question);
                }
                question.setAnswers(answers);

                iQuestionRepository.save(question);
                return;
            } else { // 0 thay doi size cau tra loi
                List<Answer> answers = question.getAnswers();

                for (Answer answer : answers) {
                    answer.setQuestion(question);
                }
                question.setAnswers(answers);
                iQuestionRepository.save(question);
                return;
            }
        }
    }

    public List<Answer> getAnswerIsDeleted(List<Answer> answersCurrent, List<Answer> answersUpdate) {
        List<Answer> answersIsDeleted = new ArrayList<>();
        boolean isFound = false;

        for (int i = 0; i < answersCurrent.size(); i++) {
            Answer answerCurrent = answersCurrent.get(i);
            for (int j = 0; j < answersUpdate.size(); j++) {
                Answer answerUpdate = answersUpdate.get(j);
                if (answerCurrent.getId() == answerUpdate.getId()) {
                    isFound = true;
                    break;
                }
            }
            if (isFound == false) {
                answersIsDeleted.add(answerCurrent);
            }
            isFound = false;
        }
        return answersIsDeleted;
    }
    
}
