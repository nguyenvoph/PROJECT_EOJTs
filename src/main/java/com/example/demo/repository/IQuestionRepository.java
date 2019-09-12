package com.example.demo.repository;

import com.example.demo.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IQuestionRepository extends JpaRepository<Question,Integer> {
    Question findById(int id);

}
