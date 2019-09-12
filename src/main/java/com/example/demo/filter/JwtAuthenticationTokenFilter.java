package com.example.demo.filter;

import com.example.demo.entity.Users;
import com.example.demo.service.JwtService;
import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

public class JwtAuthenticationTokenFilter extends UsernamePasswordAuthenticationFilter {

    private final static String TOKEN_HEADER = "Authorization";

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsersService usersService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;


        httpServletResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpServletResponse.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
        if (httpRequest.getMethod().equals("OPTIONS")) {
            httpServletResponse.setStatus(HttpServletResponse.SC_ACCEPTED);
            httpServletResponse.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        }
        httpServletResponse.setHeader("Access-Control-Allow-Headers", "*");
        httpServletResponse.setHeader("Access-Control-Allow-Credentials", "true");
        httpServletResponse.setHeader("Access-Control-Max-Age", "180");

        String authToken = httpRequest.getHeader(TOKEN_HEADER);

        if (jwtService.validateTokenLogin(authToken)) {
            String email = jwtService.getEmailFromToken(authToken);

//            Account account = accountService.findAccountByEmail(email);
            Users users= usersService.findUserByEmail(email);
            if (users != null) {
                boolean enabled = true;
                boolean accountNonExpired = true;
                boolean credentialsNonExpired = true;
                boolean accountNonLocked = true;
                UserDetails userDetail = new org.springframework.security.core.userdetails.User(users.getEmail(), users.getPassword(), enabled, accountNonExpired,
                        credentialsNonExpired, accountNonLocked, users.getAuthorities());

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetail,
                        null, userDetail.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        chain.doFilter(request, response);
    }
}
