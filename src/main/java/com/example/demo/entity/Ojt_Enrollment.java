package com.example.demo.entity;

import com.example.demo.config.PositionIntern;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "ojt_enrollment")
public class Ojt_Enrollment implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private int id;


    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
//    @JsonBackReference
//    @JsonIgnore
    @JoinColumn(name = "student_email")
    private Student student;

    @ManyToOne(cascade = {CascadeType.ALL})
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "business_email")
    private Business business;

    @OneToMany(mappedBy = "ojt_enrollment")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Job_Post> job_posts;

    @OneToMany(mappedBy = "ojt_enrollment", cascade = CascadeType.ALL)
    @JsonIgnore
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Task> tasks;

    @OneToMany(mappedBy = "ojt_enrollment", cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Evaluation> evaluations;


    @ManyToOne(cascade = {CascadeType.ALL})
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "semester_id")
    private Semester semester;


//    @OneToMany(mappedBy = "ojt_enrollment", cascade = CascadeType.ALL)
//    @LazyCollection(LazyCollectionOption.FALSE)
//    private List<Supervisor> supervisors;

    @Column(name = "timeEnroll")
    private Date timeEnroll;

    @Enumerated(EnumType.STRING)
    @Check(constraints = "status IN ('DEVELOPER' ,'TESTER')")
    @Column(name = "positionIntern")
    private PositionIntern positionIntern ;

    public Ojt_Enrollment() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public List<Job_Post> getJob_posts() {
        return job_posts;
    }

    public void setJob_posts(List<Job_Post> job_posts) {
        this.job_posts = job_posts;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public List<Evaluation> getEvaluations() {
        return evaluations;
    }

    public void setEvaluations(List<Evaluation> evaluations) {
        this.evaluations = evaluations;
    }

    public Semester getSemester() {
        return semester;
    }

    public void setSemester(Semester semester) {
        this.semester = semester;
    }

//    public List<Supervisor> getSupervisors() {
//        return supervisors;
//    }
//
//    public void setSupervisors(List<Supervisor> supervisors) {
//        this.supervisors = supervisors;
//    }


    public PositionIntern getPositionIntern() {
        return positionIntern;
    }

    public void setPositionIntern(PositionIntern positionIntern) {
        this.positionIntern = positionIntern;
    }

    public Date getTimeEnroll() {
        return timeEnroll;
    }

    public void setTimeEnroll(Date timeEnroll) {
        this.timeEnroll = timeEnroll;
    }
}
