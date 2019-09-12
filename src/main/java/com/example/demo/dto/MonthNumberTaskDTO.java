package com.example.demo.dto;

import java.io.Serializable;
import java.util.List;

public class MonthNumberTaskDTO implements Serializable {
    private int month;
    private List<Integer> countStatusTaskInMonth;

    public MonthNumberTaskDTO() {
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public List<Integer> getCountStatusTaskInMonth() {
        return countStatusTaskInMonth;
    }

    public void setCountStatusTaskInMonth(List<Integer> countStatusTaskInMonth) {
        this.countStatusTaskInMonth = countStatusTaskInMonth;
    }
}
