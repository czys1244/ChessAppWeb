package com.chessapp.chessappbackend.controllers;
import com.chessapp.chessappbackend.dto.ConnectRequest;
import com.chessapp.chessappbackend.dto.moveRequest;
import com.chessapp.chessappbackend.models.Game;
import com.chessapp.chessappbackend.models.Message;
import com.chessapp.chessappbackend.models.Player;
import com.chessapp.chessappbackend.services.GameService;
import com.chessapp.chessappbackend.services.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/api/game")
public class GameController {
    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserService userService;

    @GetMapping("/rating")
    public ResponseEntity<Integer> getRating(Authentication authentication) {
        String authUser = authentication.getName();
//        Player authPlayer = new Player(authUser);
        return ResponseEntity.ok(userService.getRating(authUser));
    }


    @GetMapping("/create")
    public ResponseEntity<Game> create(Authentication authentication) {
        String authUser = authentication.getName();
        Player authPlayer = new Player(authUser);
        return ResponseEntity.ok(gameService.createGame(authPlayer));
    }

    @PostMapping("/getgame")
    public ResponseEntity<Game> getGameId(@RequestBody ConnectRequest request, Authentication authentication) throws RuntimeException {
        String id = request.getGameId();
        Game game = gameService.getGameById(id);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/rating")
    public ResponseEntity<Integer> getUserRating(@RequestBody Player username ) {
        return ResponseEntity.ok(userService.getUserRating(username.getName()));
    }
    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectRequest request, Authentication authentication) throws RuntimeException {
        String authUser = authentication.getName();
        Player authPlayer = new Player(authUser);
        log.info("connect request: {}", request);
        return ResponseEntity.ok(gameService.connectToGame(authPlayer, request.getGameId()));
    }

    @PostMapping("/send/move")
    public ResponseEntity<Game> move(@RequestBody moveRequest move, Authentication authentication) throws  RuntimeException {
        log.info("move: {}", move);
        String authUser = authentication.getName();
        Game game = gameService.move(move, authUser);

        simpMessagingTemplate.convertAndSend("/queue/game-progress/" + game.getId(), move);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/send/chat")
    public ResponseEntity<Message> text(@RequestBody Message message) throws  RuntimeException {
//        log.info("message: {}", message);
        simpMessagingTemplate.convertAndSend("/topic/message/" + message.getGameId(), message);
        return ResponseEntity.ok(message);
    }



}
