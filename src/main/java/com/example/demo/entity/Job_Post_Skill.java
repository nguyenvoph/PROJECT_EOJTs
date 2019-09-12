package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "job_post_skill")
public class Job_Post_Skill implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @ManyToOne(cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    @JoinColumn(name = "job_post_id")
    private Job_Post job_post;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Column(name = "number")
    private int number;

    public Job_Post getJob_post() {
        return job_post;
    }

    public void setJob_post(Job_Post job_post) {
        this.job_post = job_post;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Job_Post_Skill(Job_Post job_post, Skill skill, int number) {
        this.job_post = job_post;
        this.skill = skill;
        this.number = number;
    }

    public Job_Post_Skill() {
    }
}
