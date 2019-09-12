package com.example.demo.entity;
import com.example.demo.config.ActionEnum;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;

import java.util.Date;
import java.util.List;


@Entity
@Table(name = "action_history")
public class HistoryAction implements Comparable<HistoryAction>, Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "email")
    private String email;

    @Column(name = "role")
    private String role;

    @Enumerated(EnumType.STRING)
    @Check(constraints = "function_type IN ('INSERT' ,'UPDATE', 'DELETE')")
    @Column(name = "function_type")
    private ActionEnum function_type;

    @Column(name = "controller")
    private String controller;

    @Column(name = "function_name")
    private String function_name;

    @Column(name = "targetEmail",columnDefinition = "NVARCHAR(MAX)")
    private String targetEmail;

    @Column(name = "actionTime")
    private Date actionTime;

    @OneToMany(mappedBy = "historyAction", cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<HistoryDetail> details = new ArrayList<>();

    public HistoryAction(String email, String role, ActionEnum function_type, String controller, String function_name, String targetEmail, Date actionTime, HistoryDetail detail) {
        this.email = email;
        this.role = role;
        this.function_type = function_type;
        this.controller = controller;
        this.function_name = function_name;
        this.targetEmail = targetEmail;
        this.actionTime = actionTime;
        details.add(detail);
    }

    public HistoryAction(String email, String role, ActionEnum function_type, String controller, String function_name, String targetEmail, Date actionTime, List<HistoryDetail> details) {
        this.email = email;
        this.role = role;
        this.function_type = function_type;
        this.controller = controller;
        this.function_name = function_name;
        this.targetEmail = targetEmail;
        this.actionTime = actionTime;
        this.details = details;
    }

    public HistoryAction(String email, String role, ActionEnum function_type, String controller, String function_name, String targetEmail, Date actionTime) {
        this.email = email;
        this.role = role;
        this.function_type = function_type;
        this.controller = controller;
        this.function_name = function_name;
        this.targetEmail = targetEmail;
        this.actionTime = actionTime;
    }

    public HistoryAction() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public ActionEnum getFunction_type() {
        return function_type;
    }

    public void setFunction_type(ActionEnum function_type) {
        this.function_type = function_type;
    }

    public String getController() {
        return controller;
    }

    public void setController(String controller) {
        this.controller = controller;
    }

    public String getFunction_name() {
        return function_name;
    }

    public void setFunction_name(String function_name) {
        this.function_name = function_name;
    }

    public String getTargetEmail() {
        return targetEmail;
    }

    public void setTargetEmail(String targetEmail) {
        this.targetEmail = targetEmail;
    }

    public Date getActionTime() {
        return actionTime;
    }

    public void setActionTime(Date actionTime) {
        this.actionTime = actionTime;
    }

    public List<HistoryDetail> getDetails() {
        return details;
    }

    public void setDetails(List<HistoryDetail> details) {
        this.details = details;
    }

    @Override
    public int compareTo(HistoryAction o) {
        return o.getActionTime().compareTo(this.actionTime);
    }
}