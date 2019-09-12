package com.example.demo.repository;

import com.example.demo.entity.Student_Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IStudent_EventRepository extends JpaRepository<Student_Event, Integer> {

    List<Student_Event> findByEventId(int id);
}
