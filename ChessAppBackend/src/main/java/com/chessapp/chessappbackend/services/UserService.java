package com.chessapp.chessappbackend.services;

import com.chessapp.chessappbackend.models.Game;
import com.chessapp.chessappbackend.models.User;
import com.chessapp.chessappbackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    
    public UserDetailsService userDetailsService() {
        return new UserDetailsService(){
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }

    public User save(User newUser) {
        if (newUser.getId() == null) {
            newUser.setCreatedAt(LocalDateTime.now());
        }
        newUser.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(newUser);
    }

    public int getRating(String user) {

        User loggedUser = userRepository.findByUsername(user).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return loggedUser.getRating();
    }

    public Integer getUserRating(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getRating();
    }

    public Optional<User> findByUsername(String user) {
        return userRepository.findByUsername(user);
    }
}
