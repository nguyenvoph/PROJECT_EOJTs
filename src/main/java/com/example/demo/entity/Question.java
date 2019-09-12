package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "question")
public class Question implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "content", columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "isActive")
    private boolean isActive;

    @Column(name = "has_others")
    private boolean has_others;

    @OneToMany(mappedBy = "question",cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Answer> answers;

//    @OneToMany(mappedBy = "other")
//    @LazyCollection(LazyCollectionOption.FALSE)
//    private List<Student_Answer> student_answers;

    @Column(name = "isManyOption")
    private boolean isManyOption;

    public Question() {
    }

    public Question(String content, boolean isActive, boolean has_others, List<Answer> answers) {
        this.content = content;
        this.isActive = isActive;
        this.has_others = has_others;
        this.answers = answers;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isHas_others() {
        return has_others;
    }

    public void setHas_others(boolean has_others) {
        this.has_others = has_others;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    public boolean isManyOption() {
        return isManyOption;
    }

    public void setManyOption(boolean manyOption) {
        isManyOption = manyOption;
    }

    @Override
    public String toString() {
        return this.content;
    }
}
