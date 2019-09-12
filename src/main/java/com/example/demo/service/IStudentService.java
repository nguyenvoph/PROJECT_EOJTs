package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;

import java.text.ParseException;
import java.util.List;

public interface IStudentService {

    Student getStudentByEmail(String email);

    boolean saveListStudent(List<Student> studentList);

    boolean saveStudent(Student student);

    boolean updateStudent(Student student);

    boolean updateStudentPassOrFailRedis(Student student);

    List<Student> getAllStudents();

    List<Student> getAllStudentsBySemesterId();

    List<Student> getAllStudentsBySemesterIdAndNotYetInvitation(String businessEmail);

    int getSpecializedIdByEmail(String email);

    boolean updateInforStudent(String email, String ojective, List<Skill> skillList);

//    public boolean updateOption1Student(String email, String option1);
//
//    public boolean updateOption2Student(String email, String option2);

    String updateOption1Student(String email, String option1);

    String updateOption2Student(String email, String option2);

    Student getStudentIsInvited(String email);

    List<Student> findStudentByBusinessNameOption(String option1, String option2);

    boolean updateLinkFileResumeForStudent(String email, String resumeLink);

    boolean updateStatusOptionOfStudent(List<Integer> numberOfOption, boolean statusOfOption, String emailStudent);

    List<Student> getAllStudentByStatusOption(int typeGetStatus);

    boolean updateTokenDeviceForStudent(String emailStudent, String token);

    boolean updateLinkTranscriptForStudent(Student student);

    boolean assignSupervisorForStudent(List<Student> studentList);

    List<Job_Post> getSuggestListJobPost(String emailStudent);

    float compareSkillsStudentAndSkillsJobPost(List<Skill> skillListStudent, List<Skill> skillListJobPost);

    boolean updateLinkAvatar(String emailStudent, String linkAvatar);

    Business getBusinessOfStudent(String studentEmail);

    List<Business> getBusinessByOptionStudent(String studentEmail);

    List<Student> getAllStudentOfASupervisor(String email);

    boolean updateInformationStudent(String email, String name, String phone, boolean gender, String address, String birthDate) throws ParseException;

    void postFeedBack(String email, String content);

    List<StudentAnswerDTO> findListStudentAnswer(String email);

    void studentCreateInformMessage(String email, Event event);

    PagingDTO pagingStudent(int currentPage, int rowsPerPage);

    PagingDTO getStudentsWithNoCompany(int currentPage, int rowsPerPage);

    List<Student_OjtenrollmentDTO> getStudentsWithHope();

    PagingDTO getEvaluationsOfStudents(int specializedID, int currentPage, int rowsPerPage);

    StudentIsExistedAndNotYet getStudentsIsExisted(List<Student_ImportFileDTO> students);

    void handlerStudentIsExisted(List<Student> students,String semesterName);
}
