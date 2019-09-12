package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "history_detail")
public class HistoryDetail implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "tableName")
    private String tableName;
    @Column(name = "columnName")
    private String columnName;
    @Column(name = "targetId")
    private String targetId;
    @Column(name = "newValue", columnDefinition = "NVARCHAR(MAX)")
    private String newValue;

    @ManyToOne(cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "action_history_id")
    @JsonIgnore
    private HistoryAction historyAction;

    public HistoryDetail() {
    }

    public HistoryDetail(String tableName, String columnName, String targetId, String newValue) {
        this.tableName = tableName;
        this.columnName = columnName;
        this.targetId = targetId;
        this.newValue = newValue;
    }

    public HistoryDetail(String tableName, String columnName, String targetId, String newValue, HistoryAction historyAction) {
        this.tableName = tableName;
        this.columnName = columnName;
        this.targetId = targetId;
        this.newValue = newValue;
        this.historyAction = historyAction;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public HistoryAction getHistoryAction() {
        return historyAction;
    }

    public void setHistoryAction(HistoryAction historyAction) {
        this.historyAction = historyAction;
    }


}
