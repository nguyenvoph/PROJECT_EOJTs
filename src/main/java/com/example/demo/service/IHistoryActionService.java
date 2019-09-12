package com.example.demo.service;

import com.example.demo.entity.HistoryAction;

import java.util.List;

public interface IHistoryActionService {
    boolean createHistory(HistoryAction HistoryAction);

    List<HistoryAction> getAllHistory();

    HistoryAction getHistoryActionById(int id);
}
