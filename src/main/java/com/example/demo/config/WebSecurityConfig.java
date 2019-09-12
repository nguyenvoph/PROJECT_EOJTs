package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.demo.filter.CustomAccessDeniedHandler;
import com.example.demo.filter.JwtAuthenticationTokenFilter;
import com.example.demo.filter.RestAuthenticationEntryPoint;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter() throws Exception {
        JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter = new JwtAuthenticationTokenFilter();
        jwtAuthenticationTokenFilter.setAuthenticationManager(authenticationManager());
        return jwtAuthenticationTokenFilter;
    }

    @Bean
    public RestAuthenticationEntryPoint restServicesEntryPoint() {
        return new RestAuthenticationEntryPoint();
    }

    @Bean
    public CustomAccessDeniedHandler customAccessDeniedHandler() {
        return new CustomAccessDeniedHandler();
    }

    @Bean
    @Override
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().ignoringAntMatchers("/api/**");

        http.authorizeRequests().antMatchers("/api/account/token**").permitAll();
        http.authorizeRequests().antMatchers("/api/file/downloadFile/**").permitAll();
        http.authorizeRequests().antMatchers("/api/account/reset/**").permitAll();
        http.authorizeRequests().antMatchers("/api/account/checkToken/**").permitAll();
        http.authorizeRequests().antMatchers("/api/account/createNewPassword/**").permitAll();

        http
                .antMatcher("/api/**").httpBasic().authenticationEntryPoint(restServicesEntryPoint()).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests()
                .antMatchers(HttpMethod.GET, "/api/**").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_STUDENT') or hasRole('ROLE_HR') or hasRole('ROLE_SUPERVISOR') or hasRole('ROLE_STARTUP') or hasRole('ROLE_HEADTRAINING') or hasRole('ROLE_HEADMASTER')")
                .antMatchers(HttpMethod.POST, "/api/**").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_STUDENT') or hasRole('ROLE_HR') or hasRole('ROLE_SUPERVISOR') or hasRole('ROLE_STARTUP') or hasRole('ROLE_HEADTRAINING') or hasRole('ROLE_HEADMASTER')")
                .antMatchers(HttpMethod.PUT, "/api/**").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_STUDENT') or hasRole('ROLE_HR') or hasRole('ROLE_SUPERVISOR') or hasRole('ROLE_STARTUP') or hasRole('ROLE_HEADTRAINING') or hasRole('ROLE_HEADMASTER')")
                .antMatchers(HttpMethod.DELETE, "/api/**").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_STUDENT') or hasRole('ROLE_HR')or hasRole('ROLE_SUPERVISOR') or hasRole('ROLE_STARTUP') or hasRole('ROLE_HEADTRAINING') or hasRole('ROLE_HEADMASTER')").and()
                .addFilterBefore(jwtAuthenticationTokenFilter(), UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling().accessDeniedHandler(customAccessDeniedHandler());
    }
}
