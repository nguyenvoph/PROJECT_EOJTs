package com.example.demo.repository;

import com.example.demo.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface IEventRepository extends JpaRepository<Event, Integer> {

    //@Query("select e from Event e join e.students st where st.email = ?1")
    @Query("select e from Event e join e.student_events st where st.student.email = ?1 and st.isStudent=false")
    List<Event> findEventsByStudentEmail(String email);

    List<Event> findEventsByAdmin_Email(String email);

    List<Event> findEventsByBusinessEmail(String email);

    List<Event> findEventsBySupervisorEmail(String email);

    //@Query("select count(e.id) from Event e join e.students st where st.email = ?1 and e.isRead='false'")
    @Query("select count(e.id) from Event e join e.student_events st where st.student.email = ?1 and e.isRead='false' and st.isStudent=false")
    int  findEventsByStudentEmailAndReadIsFalse(String email);

    Event findEventById(int id);

}
