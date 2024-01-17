package com.chessapp.chessappbackend.services;

import com.chessapp.chessappbackend.models.*;
import com.chessapp.chessappbackend.repositories.GameRepository;
import com.chessapp.chessappbackend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
//    private final ChessService chessService;

    public Game createGame(Player player) {
        Game game = new Game();
        game.setId(UUID.randomUUID().toString());
        game.setFirstPlayer(player.getName());
        game.setStatus(GameStatusEnum.NEW);
        gameRepository.save(game);
        return game;
    }

    public Game connectToGame(Player player, String gameId) {
        Optional<Game> optionalGame=gameRepository.findById(gameId);

        optionalGame.orElseThrow(() ->new RuntimeException("Game with provided id doesn't exist"));
        Game game = optionalGame.get();

        if (game.getSecondPlayer() != null) {
            throw new RuntimeException("Game is not valid anymore");
        }

        game.setSecondPlayer(player.getName());
        game.setStatus(GameStatusEnum.IN_PROGRESS);
        gameRepository.save(game);
        return game;
    }

    public Game connectToRandomGame(Player player) {
        Optional<Game> optionalGame = gameRepository.findFirstByStatusAndSecondPlayerIsNull(GameStatusEnum.NEW);
        optionalGame.orElseThrow(() ->new RuntimeException("There is no available Game!"));
        Game game = optionalGame.get();
        game.setSecondPlayer(player.getName());
        game.setStatus(GameStatusEnum.IN_PROGRESS);
        gameRepository.save(game);
        return game;
    }

    public Game move(Move move) {
        Optional<Game> optionalGame=gameRepository.findById(move.getGameId());

        optionalGame.orElseThrow(() ->new RuntimeException("Game with provided id doesn't exist"));
        Game game = optionalGame.get();

        Game gameAfterMove=game;
        gameRepository.save(gameAfterMove);

        return gameAfterMove;
    }
}