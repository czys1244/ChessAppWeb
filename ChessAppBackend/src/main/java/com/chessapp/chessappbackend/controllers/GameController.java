package com.chessapp.chessappbackend.controllers;
import com.chessapp.chessappbackend.dto.ConnectRequest;
import com.chessapp.chessappbackend.dto.GameId;
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

import java.util.List;
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

    @GetMapping("/history")
    public ResponseEntity<List<Game>> history(Authentication authentication) {
        String authUser = authentication.getName();
//        Player authPlayer = new Player(authUser);
        return ResponseEntity.ok(gameService.history(authUser));
    }

    @PostMapping("/resign")
    public ResponseEntity<Game> resign(@RequestBody GameId gameId, Authentication authentication) {
        return ResponseEntity.ok(gameService.resign(gameId.getGameId(), authentication.getName())) ;
    }

    @PostMapping("/draw")
    public ResponseEntity<Game> draw(@RequestBody GameId gameId, Authentication authentication) {
        return ResponseEntity.ok(gameService.draw(gameId.getGameId(), authentication.getName())) ;
    }

    @PostMapping("/time")
    public ResponseEntity<Game> time(@RequestBody GameId gameId, Authentication authentication) {
        return ResponseEntity.ok(gameService.checkTime(gameId.getGameId(), authentication.getName())) ;
    }



    @GetMapping("/create")
    public ResponseEntity<Game> create(Authentication authentication) {
        String authUser = authentication.getName();
        Player authPlayer = new Player(authUser);
        return ResponseEntity.ok(gameService.createGame(authPlayer));
    }

    @GetMapping("/ranked")
    public ResponseEntity<Game> ranked(Authentication authentication) {
        String authUser = authentication.getName();
        Player authPlayer = new Player(authUser);
        return ResponseEntity.ok(gameService.createRankedGame(authPlayer));
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

    @GetMapping("/connectrandom")
    public ResponseEntity<Game> connectRandom(Authentication authentication) throws RuntimeException {
        String authUser = authentication.getName();
        Player authPlayer = new Player(authUser);
        return ResponseEntity.ok(gameService.connectToRandomGame(authPlayer));
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
