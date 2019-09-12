package com.example.demo.service;

import com.example.demo.dto.EventDTO;
import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.IEventRepository;
import com.example.demo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Service
public class EventService implements IEventService {

    @Autowired
    IEventRepository IEventRepository;

    @Autowired
    IStudent_EventService iStudent_eventService;

    @Autowired
    ISemesterService iSemesterService;

    @Autowired
    IUsersService iUsersService;

    @Autowired
    private RedisTemplate<Object, Object> template;

    @Override
    public List<Event> getEventList(String email) {
        List<Event> events = IEventRepository.findEventsByStudentEmail(email);
        if (events != null) {
            return events;
        }
        return null;
    }

    @Override
    public List<Event> getEventListOfAdmin(String email) {
        List<Event> events = IEventRepository.findEventsByAdmin_Email(email);
        if (events != null) {
            return events;
        }
        return null;
    }

    @Override
    public List<Event> getEventListOfBusiness(String email) {
        List<Event> events = IEventRepository.findEventsByBusinessEmail(email);
        if (events != null) {
            return events;
        }
        return null;
    }

    @Override
    public List<Event> getEventListOfSupervisor(String email) {
        List<Event> events = IEventRepository.findEventsBySupervisorEmail(email);
        if (events != null) {
            return events;
        }
        return null;
    }

    @Override
    public List<Event> getEventListSent(List<Event> eventList) {
        Semester semester = iSemesterService.getSemesterCurrent();
        Date dateStartSemester = semester.getStart_choose_option_time();
        Date dateEndSemester = semester.getEnd_date();
        List<Event> finalListEvent = new ArrayList<Event>();
        for (int i = 0; i < eventList.size(); i++) {
            Date dateEventCreate = eventList.get(i).getTime_created();
            if ((dateEventCreate.after(dateStartSemester) || dateEventCreate.equals(dateStartSemester)) && dateEventCreate.before(dateEndSemester)) {
                if (eventList.get(i).getStudent_events().size() > 1 || eventList.get(i).getStudent_events().get(0).isStudent() == false) {
                    finalListEvent.add(eventList.get(i));
                }
            }
        }
        return finalListEvent;
    }

    @Override
    public List<Event> getEventListReceived(List<Event> eventList) {
        Semester semester = iSemesterService.getSemesterCurrent();
        Date dateStartSemester = semester.getStart_choose_option_time();
        Date dateEndSemester = semester.getEnd_date();
        List<Event> finalListEvent = new ArrayList<Event>();
        for (int i = 0; i < eventList.size(); i++) {
            Date dateEventCreate = eventList.get(i).getTime_created();
            if ((dateEventCreate.after(dateStartSemester) || dateEventCreate.equals(dateStartSemester)) && dateEventCreate.before(dateEndSemester)) {
                if (eventList.get(i).getStudent_events().size() == 1 && eventList.get(i).getStudent_events().get(0).isStudent() == true) {
                    finalListEvent.add(eventList.get(i));
                }
            }
        }
        return finalListEvent;
    }

    @Override
    public List<Event> getEventListRead(List<Event> eventList) {
        List<Event> finalListEvent = new ArrayList<Event>();
        for (int i = 0; i < eventList.size(); i++) {
            if (eventList.get(i).isRead() == true) {
                finalListEvent.add(eventList.get(i));
            }
        }
        return finalListEvent;
    }

    @Override
    public List<Event> getEventListNotRead(List<Event> eventList) {
        List<Event> finalListEvent = new ArrayList<Event>();
        for (int i = 0; i < eventList.size(); i++) {
            if (eventList.get(i).isRead() == false) {
                finalListEvent.add(eventList.get(i));
            }
        }
        return finalListEvent;
    }

    @Override
    public int countEventIsNotRead(String email) {
        int count = IEventRepository.findEventsByStudentEmailAndReadIsFalse(email);

        return count;
    }

    @Override
    public Event findEventById(int id) {
        Event event = IEventRepository.findEventById(id);
        if (event != null) {
            event.setRead(true);
            IEventRepository.save(event);
            return event;
        }
        return null;
    }

    @Override
    public boolean createEvent(Event event) {
        if (event != null) {
            IEventRepository.save(event);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateEvent(Event event) {
        if (event != null) {
            IEventRepository.save(event);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateStatusIsRead(int id) {
        Event event = findEventById(id);
        if (event != null) {
            event.setRead(true);
            IEventRepository.save(event);
            return true;
        }
        return false;
    }

    @Override
    public EventDTO findEventAndStudentsById(int id) {
        Event event = IEventRepository.findEventById(id);
        List<Student> students = new ArrayList<>();

        List<Student_Event> student_events = iStudent_eventService.findStudentEventByEventId(id);

        for (int i = 0; i < student_events.size(); i++) {
            students.add(student_events.get(i).getStudent());
        }
        EventDTO eventDTO = new EventDTO();
        eventDTO.setEvent(event);
        eventDTO.setStudentList(students);

        if (eventDTO != null) {
//            event.setRead(true);
//            IEventRepository.save(event);
            return eventDTO;
        }
        return null;
    }

    @Override
    public List<EventDTO> transformListEventToEventDTO(List<Event> eventList) {
        List<EventDTO> eventDTOList = new ArrayList<EventDTO>();
        for (int i = 0; i < eventList.size(); i++) {
            List<Student> studentList = new ArrayList<Student>();
            for (int j = 0; j < eventList.get(i).getStudent_events().size(); j++) {
                studentList.add(eventList.get(i).getStudent_events().get(j).getStudent());
            }
            EventDTO eventDTO = new EventDTO();
            eventDTO.setEvent(eventList.get(i));
            eventDTO.setStudentList(studentList);
            eventDTOList.add(eventDTO);
        }
        return eventDTOList;
    }

    @Override
    public PagingDTO pagingEvent(String email, int currentPage, int rowsPerPage) {
        Users users = iUsersService.findUserByEmail(email);
        List<Role> roleList = users.getRoles();
        Utils<Event> eventUtils = new Utils<>();

        List<Event> eventListResult;
        for (int i = 0; i < roleList.size(); i++) {
            Role role = roleList.get(i);
            if (role.getDescription().equals("ROLE_ADMIN")) {
                eventListResult = getEventListOfAdmin(email);
                return eventUtils.paging(eventListResult, currentPage, rowsPerPage);
            } else if (role.getDescription().equals("ROLE_HR")) {
                eventListResult = getEventListOfBusiness(email);
                return eventUtils.paging(eventListResult, currentPage, rowsPerPage);
            }
        }
        return null;
    }
}

