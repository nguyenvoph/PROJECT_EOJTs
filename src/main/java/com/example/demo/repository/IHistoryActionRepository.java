package com.example.demo.repository;

import com.example.demo.entity.HistoryAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IHistoryActionRepository extends JpaRepository<HistoryAction, Integer> {

    HistoryAction findHistoryActionById(int id);
}
