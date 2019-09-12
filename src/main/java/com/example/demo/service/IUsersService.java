package com.example.demo.service;

import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.*;

import java.util.List;

public interface IUsersService {

    boolean sendEmail(String name, String mail, String password) throws Exception;

    void sendResetEmail(String token, String email) throws Exception;

    void sendEmailHeading(String mail, String content) throws Exception;

    String getAlphaNumericString();

    Users findUserByEmail(String email);

    Users findUserByEmailAndPassWord(String email, String password);

    boolean saveListUser(List<Users> usersList);

    boolean saveUser(Users users);

    List<Users> getAllUsers();

    boolean updatePasswordOfUserByEmail(String email, String password);

    boolean updateStatus(String email, boolean isActive);

    boolean createResetToken(String email);

    boolean checkToken(String token, String email);

    boolean createNewPassword(String password, String email);

    List<Users> getAllUsersByType(int type);

    List<Users> getAllUsersBySemester();

    PagingDTO pagingUser(int typeUser,int currentPage, int rowsPerPage);

    void sendEmailToStudentIsExisted(String name, String mail) throws Exception;

    List<Users> getUsersNotYet(List<Users> users);

    void sendEmailToBusinessIsExisted(String name, String mail) throws Exception;

    void sendEmailToSupervisor(String name,String email,String password)throws Exception;
}
