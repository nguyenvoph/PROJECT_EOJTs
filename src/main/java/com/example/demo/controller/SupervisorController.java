package com.example.demo.controller;

import com.example.demo.config.ActionEnum;
import com.example.demo.config.Status;
import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.service.*;
import com.example.demo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.sql.Date;

@RestController
@RequestMapping("/api/supervisor")
public class SupervisorController {
    private final String TAG ="SupervisorController";

    @Autowired
    ITaskService taskService;

    @Autowired
    ISupervisorService supervisorService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    IEvaluationService evaluationService;

    @Autowired
    IStudentService studentService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IEventService eventService;

    @Autowired
    IHistoryActionService iHistoryActionService;

    @Autowired
    IUsersService iUsersService;

    @GetMapping("")
    @ResponseBody
    public ResponseEntity<SupervisorDTO> getSupervisorDetails() {
        String email = getEmailFromToken();

        SupervisorDTO supervisorDTO = new SupervisorDTO();

        Supervisor supervisor = supervisorService.findByEmail(email);
        supervisorDTO.setSupervisor(supervisor);
        supervisorDTO.setBusiness(supervisor.getBusiness());
        if (supervisor != null) {
            return new ResponseEntity<SupervisorDTO>(supervisorDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //update supervisor
    @PutMapping("/updateSupervisor")
    public ResponseEntity<Void> updateSupervisor(@RequestBody Supervisor profile) {
        Supervisor supervisor = supervisorService.findByEmail(profile.getEmail());
        supervisor.setPhone(profile.getPhone());
        supervisor.setLogo(profile.getLogo());
        supervisor.setName(profile.getName());
        supervisor.setAddress(profile.getAddress());
        boolean update = supervisorService.updateSupervisor(supervisor);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester // ok
    @PostMapping("")
    public ResponseEntity<Void> createNewTask(@RequestBody Task task, @RequestParam String emailStudent) {
        String email = getEmailFromToken();
        Users users = iUsersService.findUserByEmail(email);
        Supervisor supervisor = supervisorService.findByEmail(email);
        Semester semesterCurrent = semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(emailStudent, semesterCurrent.getId());

        task.setOjt_enrollment(ojt_enrollment);
        task.setSupervisor(supervisor);
        taskService.createTaskForStudent(task);
        HistoryDetail historyDetail = new HistoryDetail(Task.class.getName(), null, null, task.toString());
        HistoryAction action =
                new HistoryAction(getEmailFromToken()
                        , users.getRoles().size()> 1 ? "ROLE_HR" : "ROLE_ADMIN", ActionEnum.INSERT, TAG, new Object() {
                }
                        .getClass()
                        .getEnclosingMethod()
                        .getName(), emailStudent, new java.util.Date(), historyDetail);
        historyDetail.setHistoryAction(action);
        iHistoryActionService.createHistory(action);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/tasks")
    @ResponseBody
    public ResponseEntity<PagingDTO> findTasksBySupervisorEmail(@RequestParam int taskStatus, @RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        String email = getEmailFromToken();
        List<Task> taskList = taskService.findTaskBySupervisorEmail(email);

        List<TaskDTO> taskDTOList = new ArrayList<>();
        for (int i = 0; i < taskList.size(); i++) {
            Task task = taskList.get(i);
            //Tổng = 0, Chưa hoàn thành(NOTSTART) = 1, Cần chỉnh sửa - Từ chối(PENDING) = 2, HOÀN THÀNH(DONE, APPROVED) = 3, Đang chờ duyệt(NOTSTART, DONE) = 4, Duyệt(APPROVED) = 5
            if (taskStatus == 0) {
                Student student = task.getOjt_enrollment().getStudent();

                TaskDTO taskDTO = new TaskDTO(task, student.getEmail(), student.getName());
                taskDTOList.add(taskDTO);
            } else if (taskStatus == 1) {
                if (task.getStatus() == Status.NOTSTART) {
                    Student student = task.getOjt_enrollment().getStudent();

                    TaskDTO taskDTO = new TaskDTO(task, student.getEmail(), student.getName());
                    taskDTOList.add(taskDTO);
                }
            } else if (taskStatus == 2) {
                if (task.getStatus() == Status.PENDING) {
                    Student student = task.getOjt_enrollment().getStudent();

                    TaskDTO taskDTO = new TaskDTO(task, student.getEmail(), student.getName());
                    taskDTOList.add(taskDTO);
                }
            } else if (taskStatus == 3) {
                if (task.getStatus() == Status.DONE || task.getStatus() == Status.APPROVED) {
                    Student student = task.getOjt_enrollment().getStudent();

                    TaskDTO taskDTO = new TaskDTO(task, student.getEmail(), student.getName());
                    taskDTOList.add(taskDTO);
                }
            } else if (taskStatus == 4) {
                if (task.getStatus() == Status.NOTSTART || task.getStatus() == Status.DONE) {
                    Student student = task.getOjt_enrollment().getStudent();

                    TaskDTO taskDTO = new TaskDTO(task, student.getEmail(), student.getName());
                    taskDTOList.add(taskDTO);
                }
            } else if (taskStatus == 5) {
                if (task.getStatus()  == Status.APPROVED) {
                    Student student = task.getOjt_enrollment().getStudent();

                    TaskDTO taskDTO = new TaskDTO(task, student.getEmail(), student.getName());
                    taskDTOList.add(taskDTO);
                }
            }
         }
        if (taskDTOList != null) {
            Utils<TaskDTO> supervisorUtils = new Utils<>();
            PagingDTO pagingDTO = supervisorUtils.paging(taskDTOList, currentPage, rowsPerPage);

            return new ResponseEntity<PagingDTO>(pagingDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/searchingTaskAllFields")
    @ResponseBody
    public ResponseEntity<List<TaskDTO>> searchingAllFields(@RequestParam String valueSearch) {
        String email = getEmailFromToken();
        List<Task> taskList = taskService.findTaskBySupervisorEmail(email);

        List<TaskDTO> taskDTOList = new ArrayList<>();
        for (int i = 0; i < taskList.size(); i++) {
            Task task = taskList.get(i);
            if (task.getTitle().toLowerCase().contains(valueSearch.toLowerCase()) || task.getOjt_enrollment().getStudent().getName().toLowerCase().contains(valueSearch.toLowerCase())) {
                Student student = task.getOjt_enrollment().getStudent();

                TaskDTO taskDTO = new TaskDTO(task, student.getEmail(), student.getName());
                taskDTOList.add(taskDTO);
            }
        }
        if (taskDTOList != null) {
            return new ResponseEntity<List<TaskDTO>>(taskDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getNumTask")
    @ResponseBody
    public ResponseEntity<Integer> getNumTask() {
        String email = getEmailFromToken();
        List<Task> taskList = taskService.findTaskBySupervisorEmail(email);
        if (taskList != null) {
            return new ResponseEntity<Integer>(taskList.size(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //time_enroll of  ojt_enrollment has to be not null
    @PostMapping("/evaluation")
    public ResponseEntity<Void> createNewEvaluation(@RequestBody Evaluation evaluation, @RequestParam String emailStudent) {
        String email = getEmailFromToken();
        Users users = iUsersService.findUserByEmail(email);

        Supervisor supervisor = supervisorService.findByEmail(email);
        evaluation.setSupervisor(supervisor);

        evaluationService.createNewEvaluation(evaluation, emailStudent);
        HistoryDetail historyDetail = new HistoryDetail(Evaluation.class.getName(), null, null, evaluation.toString());
        HistoryAction action =
                new HistoryAction(getEmailFromToken()
                        , users.getRoles().size()> 1 ? "ROLE_HR" : "ROLE_ADMIN", ActionEnum.INSERT, TAG, new Object() {
                }
                        .getClass()
                        .getEnclosingMethod()
                        .getName(), emailStudent, new java.util.Date(), historyDetail);
        historyDetail.setHistoryAction(action);
        iHistoryActionService.createHistory(action);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //update evaluation
    @PutMapping("/updateEvaluation")
    public ResponseEntity<Void> updateEvaluationById(@RequestParam int id, @RequestBody Evaluation evaluation) {
        boolean update = evaluationService.updateEvaluation(id, evaluation);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getEvaluation")
    @ResponseBody
    public ResponseEntity<Evaluation> getEvaluationById(@RequestParam int id) {
        Evaluation evaluation = evaluationService.getEvaluationById(id);
        if (evaluation != null) {
            return new ResponseEntity<Evaluation>(evaluation, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getNumOfEvaluationsOfStudent")
    @ResponseBody
    public ResponseEntity<Integer> getNumOfEvaluationsOfStudent(@RequestParam String stuEmail) {
        List<Evaluation> evaluations = evaluationService.getEvaluationsByStudentEmail(stuEmail);
        if (evaluations != null) {
            return new ResponseEntity<Integer>(evaluations.size(), HttpStatus.OK);
        }
        return new ResponseEntity<Integer>(0, HttpStatus.OK);
    }

    //get all evaluations of a supervisor by semester
    //check semester // ok
    @GetMapping("/business")
    @ResponseBody
    public ResponseEntity<Business> getBusinessOfEvaluation(@RequestParam String email) {
        Supervisor supervisor = supervisorService.findByEmail(email);
        Business business = supervisor.getBusiness();
        if (business != null) {
            return new ResponseEntity<Business>(business, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/supervisor")
    @ResponseBody
    public ResponseEntity<Supervisor> getSupervisorOfEvaluation(@RequestParam String email) {
        Supervisor supervisor = supervisorService.findByEmail(email);
        if (supervisor != null) {
            return new ResponseEntity<Supervisor>(supervisor, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester ok
    @GetMapping("/evaluations")
    @ResponseBody
    public ResponseEntity<List<Evaluation>> getAllEvaluationOfSupervisor() {
        String email = getEmailFromToken();

        //get all students of supervisor in a semester
        List<Student> studentList = studentService.getAllStudentOfASupervisor(email);

        if (studentList != null) {
            List<Evaluation> evaluationList = evaluationService.getEvaluationListOfStudentList(studentList);
            if (evaluationList != null) {
                return new ResponseEntity<List<Evaluation>>(evaluationList, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    @GetMapping("/students")
    @ResponseBody
    public ResponseEntity<List<Student>> getAllStudentBySupervisorEmail() {
        String email = getEmailFromToken();

        List<Student> studentList = studentService.getAllStudentOfASupervisor(email);

        if (studentList != null) {
            return new ResponseEntity<List<Student>>(studentList, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    @GetMapping("/students/pagination")
    @ResponseBody
    public ResponseEntity<PagingDTO> getAllStudentBySupervisorEmailPagination(@RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        String email = getEmailFromToken();

        List<Student> studentList = studentService.getAllStudentOfASupervisor(email);

        if (studentList != null) {
            Utils<Student> supervisorUtils = new Utils<>();
            PagingDTO pagingDTO = supervisorUtils.paging(studentList, currentPage, rowsPerPage);

            return new ResponseEntity<PagingDTO>(pagingDTO, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/getNumStudent")
    @ResponseBody
    public ResponseEntity<Integer> getNumStudent() {
        String email = getEmailFromToken();

        List<Student> studentList = studentService.getAllStudentOfASupervisor(email);
        if (studentList != null) {
            return new ResponseEntity<Integer>(studentList.size(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/searchingStudentAllFields")
    @ResponseBody
    public ResponseEntity<List<Student>> searchingStudentAllFields(@RequestParam String valueSearch) {
        String email = getEmailFromToken();

        List<Student> studentList = studentService.getAllStudentOfASupervisor(email);
        List<Student> searchStudentList = new ArrayList<Student>();
        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            if (student.getCode().toLowerCase().contains(valueSearch.toLowerCase()) || student.getName().toLowerCase().contains(valueSearch.toLowerCase()) || student.getEmail().toLowerCase().contains(valueSearch.toLowerCase())) {
                searchStudentList.add(student);
            }
        }
        if (searchStudentList != null) {
            return new ResponseEntity<List<Student>>(searchStudentList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/allTasksByStudentEmail")
    @ResponseBody
    public ResponseEntity<List<Task>> getAllTasksOfStudent(@RequestParam String emailStudent) {

        List<Task> taskList = taskService.findTaskByStudentEmail(emailStudent);
        if (taskList != null) {
            return new ResponseEntity<List<Task>>(taskList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    @GetMapping("/taskByStudentEmail")
    @ResponseBody
    public ResponseEntity<List<Task>> getTasksOfStudent(@RequestParam String emailStudent, @RequestParam Date dateStart, @RequestParam Date dateEnd) {

        List<Task> taskList = taskService.findTaskByStudentEmail(emailStudent);
        List<Task> selectedTaskList = new ArrayList<>();
        for (int i = 0; i < taskList.size(); i++) {
            if (((taskList.get(i).getTime_created().after(dateStart) || taskList.get(i).getTime_created().equals(dateStart)) && (taskList.get(i).getTime_created().before(dateEnd) || taskList.get(i).getTime_created().equals(dateEnd))) ||
                    ((taskList.get(i).getTime_end().after(dateStart) || taskList.get(i).getTime_end().equals(dateStart)) && (taskList.get(i).getTime_end().before(dateEnd) || taskList.get(i).getTime_end().equals(dateEnd)))) {
                selectedTaskList.add(taskList.get(i));
            }
        }
        if (selectedTaskList != null) {
            return new ResponseEntity<List<Task>>(selectedTaskList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/task")
    @ResponseBody
    public ResponseEntity<TaskDTO> getTaskById(@RequestParam int id) {
        Task task = taskService.findTaskById(id);

        Student student = task.getOjt_enrollment().getStudent();

        TaskDTO taskDTO = new TaskDTO(task, student.getEmail(), student.getName());

        if (task != null) {
            return new ResponseEntity<TaskDTO>(taskDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //check semester //ok
    @PutMapping("/task")
    public ResponseEntity<Void> updateTask(@RequestBody Task task, @RequestParam String emailStudent) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();

        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(emailStudent, semesterCurrent.getId());

        task.setOjt_enrollment(ojt_enrollment);
        boolean update = taskService.updateTask(task);
        if (update == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @DeleteMapping("/task")
    public ResponseEntity<Void> deleteTask(@RequestParam int id) {
        boolean delete = taskService.deleteTask(id);
        if (delete == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PutMapping("/stateTask")
    public ResponseEntity<Void> updateStateTask(@RequestParam int id, @RequestParam int typeTask, @RequestParam String comment) {
        boolean updateStateTask = taskService.updateStatusTask(id, typeTask, comment);
        if (updateStateTask == true) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/studentsEvaluations")
    @ResponseBody
    public ResponseEntity<PagingDTO> getEvaluationsOfStudents(@RequestParam int currentPage
            , @RequestParam int rowsPerPage) {
        String email = getEmailFromToken();
        PagingDTO pagingDTO = supervisorService.getEvaluationListOfSupervisor(email, currentPage, rowsPerPage);
        if (pagingDTO != null) {
            return new ResponseEntity<PagingDTO>(pagingDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/searchingEvaluationAllField")
    @ResponseBody
    public ResponseEntity<List<Student_EvaluationDTO>> searchingEvaluationAllField(@RequestParam String valueSearch) {
        String email = getEmailFromToken();

        List<Student> studentList = studentService.getAllStudentOfASupervisor(email);
        List<Student> searchStudentList = new ArrayList<Student>();
        for (int i = 0; i < studentList.size(); i++) {
            Student student = studentList.get(i);
            if (student.getCode().toLowerCase().contains(valueSearch.toLowerCase()) || student.getName().toLowerCase().contains(valueSearch.toLowerCase())) {
                searchStudentList.add(student);
            }
        }
        List<Student_EvaluationDTO> student_evaluationDTOS = new ArrayList<>();

        for (int i = 0; i < searchStudentList.size(); i++) {
            List<Evaluation> evaluationList = evaluationService.getEvaluationsByStudentEmail(searchStudentList.get(i).getEmail());
            Collections.sort(evaluationList);
            if (evaluationList.size() < 4) {
                for (int j = evaluationList.size(); j < 4; j++) {
                    evaluationList.add(null);
                }
            }
            evaluationList = evaluationService.checkSemesterOfListEvaluation(evaluationList);
            Student_EvaluationDTO student_evaluationDTO = new Student_EvaluationDTO();
            student_evaluationDTO.setEvaluationList(evaluationList);
            student_evaluationDTO.setStudent(searchStudentList.get(i));

            student_evaluationDTOS.add(student_evaluationDTO);
        }
        if (student_evaluationDTOS != null) {
            return new ResponseEntity<List<Student_EvaluationDTO>>(student_evaluationDTOS, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/events")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfSupervisorSent() {
        String email = getEmailFromToken();
        List<Event> events = eventService.getEventListOfSupervisor(email);
        if (events != null) {
            List<Event> finalSupervisorListEvent = eventService.getEventListSent(events);
            Collections.sort(finalSupervisorListEvent);
            List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalSupervisorListEvent);
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/eventsReceived")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfSupervisorReceived() {
        String email = getEmailFromToken();
        List<Event> supervisorReceivedEvents = eventService.getEventListOfSupervisor(email);
        if (supervisorReceivedEvents != null) {
            List<Event> finalListEvent = eventService.getEventListReceived(supervisorReceivedEvents);
            Collections.sort(finalListEvent);
            List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalListEvent);
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/eventsReceivedNotRead")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfSupervisorReceivedNotRead() {
        String email = getEmailFromToken();
        List<Event> supervisorReceivedEvents = eventService.getEventListOfSupervisor(email);
        if (supervisorReceivedEvents != null) {
            List<Event> finalListEvent = eventService.getEventListReceived(supervisorReceivedEvents);
            List<Event> finalListEventNotRead = eventService.getEventListNotRead(finalListEvent);
            Collections.sort(finalListEventNotRead);
            List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalListEventNotRead);
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @GetMapping("/eventsReceivedRead")
    @ResponseBody
    public ResponseEntity<List<EventDTO>> getAllEventOfSupervisorReceivedRead() {
        String email = getEmailFromToken();
        List<Event> supervisorReceivedEvents = eventService.getEventListOfBusiness(email);
        if (supervisorReceivedEvents != null) {
            List<Event> finalListEvent = eventService.getEventListReceived(supervisorReceivedEvents);
            List<Event> finalListEventRead = eventService.getEventListRead(finalListEvent);
            Collections.sort(finalListEventRead);
            List<EventDTO> eventDTOList = eventService.transformListEventToEventDTO(finalListEventRead);
            return new ResponseEntity<List<EventDTO>>(eventDTOList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    //get email from token
    private String getEmailFromToken() {
        String email = "";
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return email;
    }

}
