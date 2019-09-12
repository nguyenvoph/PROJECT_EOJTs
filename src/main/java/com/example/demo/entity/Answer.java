package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "answer")
public class Answer implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "content", columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "question_id")
    @LazyCollection(LazyCollectionOption.FALSE)
    private Question question;

    @Column(name = "isOther")
    private boolean isOther;

    @OneToMany(mappedBy = "answer")
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    private List<Student_Answer> student_answers;

//    @ManyToMany(mappedBy = "answers")
//    private List<Student> students;

    public Answer() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public boolean isOther() {
        return isOther;
    }

    public void setOther(boolean other) {
        isOther = other;
    }

    public List<Student_Answer> getStudent_answers() {
        return student_answers;
    }

    public void setStudent_answers(List<Student_Answer> student_answers) {
        this.student_answers = student_answers;
    }
//    public List<Student> getStudents() {
//        return students;
//    }
//
//    public void setStudents(List<Student> students) {
//        this.students = students;
//    }
}
