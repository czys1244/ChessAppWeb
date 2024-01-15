package com.chessapp.chessappbackend.controllers;
import com.chessapp.chessappbackend.dto.ConnectRequest;
import com.chessapp.chessappbackend.models.Game;
import com.chessapp.chessappbackend.models.Player;
import com.chessapp.chessappbackend.services.GameService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
public class GameController {
    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    @GetMapping("/create")
    public ResponseEntity<Game> create(Authentication authentication) {
        String authUser = authentication.getName();
        Player authPlayer = new Player(authUser);
        return ResponseEntity.ok(gameService.createGame(authPlayer));
    }
    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectRequest request) throws RuntimeException {
        log.info("connect request: {}", request);
        return ResponseEntity.ok(gameService.connectToGame(request.getPlayer(), request.getGameId()));
    }



}
