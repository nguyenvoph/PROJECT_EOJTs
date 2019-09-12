package com.example.demo.repository;

import com.example.demo.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISemesterRepository extends JpaRepository<Semester, Integer> {

    Semester findSemesterByName(String name);
}
