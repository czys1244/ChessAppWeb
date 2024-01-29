package com.chessapp.chessappbackend.services;

import com.chessapp.chessappbackend.dto.moveRequest;
import com.chessapp.chessappbackend.models.*;
import com.chessapp.chessappbackend.repositories.GameRepository;
import com.chessapp.chessappbackend.repositories.UserRepository;
import com.github.bhlangonijr.chesslib.Board;
import com.github.bhlangonijr.chesslib.Side;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Objects;
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
        long time = 600;  // 10 minutes
        game.setTime(time);
        game.setFirstPlayerTime(time);
        game.setSecondPlayerTime(time);
        gameRepository.save(game);
        return game;
    }

    public Game getGameById(String id) {
        Optional<Game> optionalGame = gameRepository.findById(id);
        optionalGame.orElseThrow(() -> new RuntimeException("Game with provided id doesn't exist"));
        Game game = optionalGame.get();
        return game;
    }

    public Game connectToGame(Player player, String gameId) {
        Optional<Game> optionalGame = gameRepository.findById(gameId);

        optionalGame.orElseThrow(() -> new RuntimeException("Game with provided id doesn't exist"));
        Game game = optionalGame.get();

        if (game.getSecondPlayer() != null) {
            throw new RuntimeException("Game is not valid anymore");
        }
        if (game.getFirstPlayer() != null) {
            game.setStartedAt(System.currentTimeMillis());
        }


        game.setSecondPlayer(player.getName());
        game.setStatus(GameStatusEnum.IN_PROGRESS);
        gameRepository.save(game);
        return game;
    }

    public Game connectToRandomGame(Player player) {
        Optional<Game> optionalGame = gameRepository.findFirstByStatusAndSecondPlayerIsNull(GameStatusEnum.NEW);
        optionalGame.orElseThrow(() -> new RuntimeException("There is no available Game!"));
        Game game = optionalGame.get();
        game.setSecondPlayer(player.getName());
        game.setStatus(GameStatusEnum.IN_PROGRESS);
        gameRepository.save(game);
        return game;
    }

    public Game move(moveRequest move, String username) {
        Optional<Game> optionalGame = gameRepository.findById(move.getGameId());

        optionalGame.orElseThrow(() -> new RuntimeException("Game with provided id doesn't exist"));
        Game game = optionalGame.get();
        if (game.getStatus() == GameStatusEnum.FINISHED) {
            throw new RuntimeException("Game is finished");
        }
        Board board = new Board();
        String startFen = board.getFen();
        String fen = game.getFen();


        board.loadFromFen(fen);

        boolean firstTurn = Objects.equals(board.getFen(), startFen);


        if (firstTurn) {
            game.setFirstPlayerTime(game.getTime());
            game.setSecondPlayerTime(game.getTime());
            game.setFirstPlayerLastMoveTime(System.currentTimeMillis());
            game.setSecondPlayerLastMoveTime(System.currentTimeMillis());
        }
        else {
            if (game.getPlayerTurn() == PlayerTurnEnum.FIRST_PLAYER) {
                long elapsed = System.currentTimeMillis() - game.getFirstPlayerLastMoveTime();
                game.setFirstPlayerTime(game.getFirstPlayerTime() - elapsed / 1000);
                game.setSecondPlayerLastMoveTime(System.currentTimeMillis());
            }
            else {
                long elapsed = System.currentTimeMillis() - game.getSecondPlayerLastMoveTime();
                game.setSecondPlayerTime(game.getSecondPlayerTime() - elapsed / 1000);
                game.setFirstPlayerLastMoveTime(System.currentTimeMillis());
            }
        }



        String from = move.getFrom();
        String to = move.getTo();

        board.doMove(from + to);
        System.out.println(board.toString());
        System.out.println(board.getFen());
        game.setFen(board.getFen());

        String turn = board.getSideToMove().name();


        if (turn.equals("WHITE")) {
            game.setPlayerTurn(PlayerTurnEnum.FIRST_PLAYER);
        } else {
            game.setPlayerTurn(PlayerTurnEnum.SECOND_PLAYER);
        }


//        if (turn.equals("WHITE")){
//            game.setPlayerTurn(PlayerTurnEnum.FIRST_PLAYER);
//        }
        if (board.isMated() || board.isStaleMate() || board.isInsufficientMaterial() || board.isDraw() || board.isRepetition()) {
            game.setStatus(GameStatusEnum.FINISHED);
            game.setWinner(username);
        }
        gameRepository.save(game);

        return game;
    }
}