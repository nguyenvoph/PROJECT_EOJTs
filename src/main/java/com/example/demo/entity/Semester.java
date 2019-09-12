package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "semester")
public class Semester implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "start_date")
    private java.sql.Date start_date;

    @Column(name = "end_date")
    private java.sql.Date end_date;


    @Column(name = "finish_choose_option_time")
    private java.sql.Date finish_choose_option_time;

    @Column(name = "finish_interview_time")
    private java.sql.Date finish_interview_time;

    @Column(name = "finish_choose_business_time")
    private java.sql.Date finish_choose_business_time;

    @OneToMany(mappedBy = "semester")
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    private List<Ojt_Enrollment> ojt_enrollments;

    @OneToMany(mappedBy = "semester")
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    private List<Invitation> invitations;

    @Column(name = "start_choose_option_time")
    private java.sql.Date start_choose_option_time;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getStart_date() {
        return start_date;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public Date getEnd_date() {
        return end_date;
    }

    public void setEnd_date(Date end_date) {
        this.end_date = end_date;
    }

    public Date getFinish_choose_option_time() {
        return finish_choose_option_time;
    }

    public void setFinish_choose_option_time(Date finish_choose_option_time) {
        this.finish_choose_option_time = finish_choose_option_time;
    }

    public Date getFinish_interview_time() {
        return finish_interview_time;
    }

    public void setFinish_interview_time(Date finish_interview_time) {
        this.finish_interview_time = finish_interview_time;
    }

    public Date getFinish_choose_business_time() {
        return finish_choose_business_time;
    }

    public void setFinish_choose_business_time(Date finish_choose_business_time) {
        this.finish_choose_business_time = finish_choose_business_time;
    }

    public List<Ojt_Enrollment> getOjt_enrollments() {
        return ojt_enrollments;
    }

    public void setOjt_enrollments(List<Ojt_Enrollment> ojt_enrollments) {
        this.ojt_enrollments = ojt_enrollments;
    }

    public List<Invitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<Invitation> invitations) {
        this.invitations = invitations;
    }

    public Date getStart_choose_option_time() {
        return start_choose_option_time;
    }

    public void setStart_choose_option_time(Date start_choose_option_time) {
        this.start_choose_option_time = start_choose_option_time;
    }
}
