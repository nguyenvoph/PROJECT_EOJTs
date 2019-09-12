package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "event")
public class Event implements Comparable<Event>, Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "title", columnDefinition = "NVARCHAR(255)")
    private String title;


    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;


    @Column(name = "time_created")
    private java.sql.Date time_created;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "admin_email")
    //@JsonIgnore
    private Admin admin;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "business_email")
    @JsonIgnore
    private Business business;


    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "supervisor_email")
    @JsonIgnore
    private Supervisor supervisor;


    //@ManyToMany(mappedBy = "events")
//    @ManyToMany(cascade = CascadeType.MERGE)
//    @JoinTable(
//            name = "student_event",
//            joinColumns = {
//                    @JoinColumn(name = "event_id")},
//            inverseJoinColumns = {
//                    @JoinColumn(name = "student_email")}
//    )
////    @JsonIgnore
//    private List<Student> students;

    @OneToMany(mappedBy = "event")
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    private List<Student_Event> student_events;

    @Column(name = "isRead")
    private boolean isRead;

//    @Column(name = "heading_email")
//    private String heading_email;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getTime_created() {
        return time_created;
    }

    public void setTime_created(Date time_created) {
        this.time_created = time_created;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

//    public List<Student> getStudents() {
//        return students;
//    }
//
//    public void setStudents(List<Student> students) {
//        this.students = students;
//    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public Event() {
    }

    @Override
    public int compareTo(Event event) {
        return event.getTime_created().compareTo(this.getTime_created());
    }

//    public String getHeading_email() {
//        return heading_email;
//    }
//
//    public void setHeading_email(String heading_email) {
//        this.heading_email = heading_email;
//    }

    public List<Student_Event> getStudent_events() {
        return student_events;
    }

    public void setStudent_events(List<Student_Event> student_events) {
        this.student_events = student_events;
    }

    public Supervisor getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Supervisor supervisor) {
        this.supervisor = supervisor;
    }

    @Override
    public String toString() {
        return this.title + "\n" + this.description;
    }
}
