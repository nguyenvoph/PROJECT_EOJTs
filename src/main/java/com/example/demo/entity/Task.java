package com.example.demo.entity;

import com.example.demo.config.Level;
import com.example.demo.config.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;

@Entity
@Table(name = "task")
public class Task implements Serializable, Comparable<Task> {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "title", columnDefinition = "NVARCHAR(150)")
    private String title;


    @Enumerated(EnumType.STRING)
    @Check(constraints = "level_task IN ('EASY' ,'NORMAL', 'DIFFICULT')")
    @Column(name = "level_task")
    private Level level_task = Level.EASY;

//    @Column(name = "priority")
//    private int priority;

    @Column(name = "time_created")
    private java.sql.Date time_created;

    @Column(name = "time_end")
    private java.sql.Date time_end;


    @Enumerated(EnumType.STRING)
    @Check(constraints = "status IN ('NOTSTART' ,'PENDING', 'DONE','APPROVED','NOTFINISHED')")
    @Column(name = "status")
    private Status status = Status.NOTSTART;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "supervisor_email")
    private Supervisor supervisor;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    @JoinColumn(name = "ojt_enrollment_id")
    private Ojt_Enrollment ojt_enrollment;

    @Column(name = "comment", columnDefinition = "NVARCHAR(MAX)")
    private String comment;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Level getLevel_task() {
        return level_task;
    }

    public void setLevel_task(Level level_task) {
        this.level_task = level_task;
    }

//    public int getPriority() {
//        return priority;
//    }
//
//    public void setPriority(int priority) {
//        this.priority = priority;
//    }

    public Date getTime_created() {
        return time_created;
    }

    public void setTime_created(Date time_created) {
        this.time_created = time_created;
    }

    public Date getTime_end() {
        return time_end;
    }

    public void setTime_end(Date time_end) {
        this.time_end = time_end;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Supervisor getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Supervisor supervisor) {
        this.supervisor = supervisor;
    }

    public Ojt_Enrollment getOjt_enrollment() {
        return ojt_enrollment;
    }

    public void setOjt_enrollment(Ojt_Enrollment ojt_enrollment) {
        this.ojt_enrollment = ojt_enrollment;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public int compareTo(Task task) {
        return task.getTime_created().compareTo(this.getTime_created());
    }

    @Override
    public String toString() {
        String str = this.title + "/"  + this.time_end + "/" + this.level_task + "/" + this.description + "/" + this.comment;
        return str;
    }
}
