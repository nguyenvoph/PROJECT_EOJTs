package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "student_answer")
public class Student_Answer implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private int id;

    @ManyToOne(cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "student_email")
    private Student student;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "answer_id")
    private Answer answer;

    //
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "other")
//    private Question other;
//
    public Student_Answer() {
    }

    public Student_Answer(int id,Student student, Answer answer) {
        this.id=id;
        this.student = student;
        this.answer = answer;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Answer getAnswer() {
        return answer;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    //
//    public Question getOther() {
//        return other;
//    }
//
//    public void setOther(Question other) {
//        this.other = other;
//    }
}
