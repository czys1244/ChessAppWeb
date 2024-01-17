package com.chessapp.chessappbackend.controllers;

import com.chessapp.chessappbackend.dto.JwtAuthenticationResponse;
import com.chessapp.chessappbackend.dto.SignInRequest;
import com.chessapp.chessappbackend.dto.SignUpRequest;
import com.chessapp.chessappbackend.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public JwtAuthenticationResponse register(@RequestBody SignUpRequest request) {
        return authenticationService.register(request);
    }

    @PostMapping("/login")
    public JwtAuthenticationResponse login(@RequestBody SignInRequest request) {
        return authenticationService.login(request);
    }



}