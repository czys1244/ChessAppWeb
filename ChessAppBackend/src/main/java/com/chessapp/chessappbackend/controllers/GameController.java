package com.chessapp.chessappbackend.controllers;
import com.chessapp.chessappbackend.dto.ConnectRequest;
import com.chessapp.chessappbackend.models.Game;
import com.chessapp.chessappbackend.models.Move;
import com.chessapp.chessappbackend.models.Player;
import com.chessapp.chessappbackend.services.GameService;
import com.chessapp.chessappbackend.services.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectRequest request, Authentication authentication) throws RuntimeException {
        String authUser = authentication.getName();
        Player authPlayer = new Player(authUser);
        log.info("connect request: {}", request);
        return ResponseEntity.ok(gameService.connectToGame(authPlayer, request.getGameId()));
    }

    @PostMapping("/move")
    public ResponseEntity<Game> move(@RequestBody Move move) throws  RuntimeException {
        log.info("move: {}", move);
        Game game = gameService.move(move);

        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + game.getId(), game);
        return ResponseEntity.ok(game);
    }



}
