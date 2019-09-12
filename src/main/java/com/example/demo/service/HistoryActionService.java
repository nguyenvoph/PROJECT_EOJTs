package com.example.demo.service;

import com.example.demo.entity.HistoryAction;
import com.example.demo.repository.IHistoryActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class HistoryActionService implements IHistoryActionService {

    @Autowired
    IHistoryActionRepository historyActionRepository;

    @Override
    public boolean createHistory(HistoryAction historyAction) {
        return historyActionRepository.save(historyAction) == null;
    }

    @Override
    public List<HistoryAction> getAllHistory() {
        List<HistoryAction> actions = historyActionRepository.findAll();
        Collections.sort(actions);
        return actions;
    }

    @Override
    public HistoryAction getHistoryActionById(int id) {
        HistoryAction historyAction = historyActionRepository.findHistoryActionById(id);
        if (historyAction != null) {
            return historyAction;
        }
        return null;
    }
}
