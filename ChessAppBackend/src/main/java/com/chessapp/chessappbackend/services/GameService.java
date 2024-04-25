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

import java.util.*;

@Service
@AllArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final long time = 600;
    private final UserService userService;

    public Game createGame(Player player) {
        Game game = new Game();
        game.setId(UUID.randomUUID().toString());
        game.setFirstPlayer(player.getName());
        game.setStatus(GameStatusEnum.NEW);

        game.setTime(time);
        game.setFirstPlayerTime(time);
        game.setSecondPlayerTime(time);
        gameRepository.save(game);
        return game;
    }

    public Game createRankedGame(Player player) {
        Game game = new Game();
        game.setId(UUID.randomUUID().toString());
        game.setFirstPlayer(player.getName());
        game.setStatus(GameStatusEnum.NEW);

        game.setTime(time);
        game.setFirstPlayerTime(time);
        game.setSecondPlayerTime(time);
        game.setIsRanked(1);
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
            if(Objects.equals(player.getName(), game.getFirstPlayer())){
                throw new RuntimeException("You can't play with yourself");
            }
            game.setStartedAt(System.currentTimeMillis());
        }


        game.setSecondPlayer(player.getName());
        game.setStatus(GameStatusEnum.IN_PROGRESS);
        gameRepository.save(game);
        return game;
    }


    public Game connectToRandomGame(Player player) {
        Optional<Game> optionalGame = gameRepository.findFirstByStatusAndFirstPlayerIsNotNullAndIsRankedIsTrueAndSecondPlayerIsNullAndIsRankedIsTrue(GameStatusEnum.NEW);
        optionalGame.orElseThrow(() -> new RuntimeException("There is no available Game!"));
        Game game = optionalGame.get();
        game.setStartedAt(System.currentTimeMillis());
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
        } else {
            if (game.getPlayerTurn() == PlayerTurnEnum.FIRST_PLAYER) {
                long elapsed = System.currentTimeMillis() - game.getFirstPlayerLastMoveTime();
                game.setFirstPlayerTime(game.getFirstPlayerTime() - elapsed / 1000);
                game.setSecondPlayerLastMoveTime(System.currentTimeMillis());
            } else {
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
        if (board.isMated()) {
            game.setStatus(GameStatusEnum.FINISHED);
            game.setWinner(username);
            if (game.getIsRanked() == 1) {
                if (game.getFirstPlayer().equals(username)) {
                    Optional<User> optionalUser = userService.findByUsername(game.getFirstPlayer());
                    optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    User user = optionalUser.get();
                    user.setRating(user.getRating() + 10);
                    userService.save(user);
                    Optional<User> optionalUser2 = userService.findByUsername(game.getSecondPlayer());
                    optionalUser2.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    User user2 = optionalUser2.get();
                    user2.setRating(user2.getRating() - 10);
                    userService.save(user2);
                } else {
                    Optional<User> optionalUser = userService.findByUsername(game.getSecondPlayer());
                    optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    User user = optionalUser.get();
                    user.setRating(user.getRating() + 10);
                    userService.save(user);
                    Optional<User> optionalUser2 = userService.findByUsername(game.getFirstPlayer());
                    optionalUser2.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    User user2 = optionalUser2.get();
                    user2.setRating(user2.getRating() - 10);
                    userService.save(user2);
                }
            }
            if (board.isStaleMate() || board.isInsufficientMaterial() || board.isDraw()) {
                game.setStatus(GameStatusEnum.FINISHED);
            }
            if (game.getFirstPlayerTime() <= 0) {
                game.setStatus(GameStatusEnum.FINISHED);
                game.setWinner(game.getSecondPlayer());
                if (game.getIsRanked() == 1) {
                    Optional<User> optionalUser = userService.findByUsername(game.getSecondPlayer());
                    optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    User user = optionalUser.get();
                    user.setRating(user.getRating() + 10);
                    userService.save(user);
                    Optional<User> optionalUser2 = userService.findByUsername(game.getFirstPlayer());
                    optionalUser2.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    User user2 = optionalUser2.get();
                    user2.setRating(user2.getRating() - 10);
                    userService.save(user2);
                }
            }
        } else if (game.getSecondPlayerTime() <= 0) {
            game.setStatus(GameStatusEnum.FINISHED);
            game.setWinner(game.getFirstPlayer());
            if (game.getIsRanked() == 1) {
                Optional<User> optionalUser = userService.findByUsername(game.getFirstPlayer());
                optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                User user = optionalUser.get();
                user.setRating(user.getRating() + 10);
                userService.save(user);
                Optional<User> optionalUser2 = userService.findByUsername(game.getSecondPlayer());
                optionalUser2.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                User user2 = optionalUser2.get();
                user2.setRating(user2.getRating() - 10);
                userService.save(user2);
            }
        }
        gameRepository.save(game);

        return game;
    }

    public Game checkTime(String id, String username) {
        Optional<Game> optionalGame = gameRepository.findById(id);
        optionalGame.orElseThrow(() -> new RuntimeException("Game with provided id doesn't exist"));
        Game game = optionalGame.get();

        if (game.getStatus() == GameStatusEnum.FINISHED) {
            throw new RuntimeException("Game is finished");
        } else {
            if (game.getFirstPlayer().equals(username) && game.getPlayerTurn() == PlayerTurnEnum.SECOND_PLAYER) {
                long elapsed = System.currentTimeMillis() - game.getSecondPlayerLastMoveTime();
                if (game.getSecondPlayerTime() - elapsed / 1000 <= 0) {
                    game.setStatus(GameStatusEnum.FINISHED);
                    game.setWinner(game.getFirstPlayer());
                    if (game.getIsRanked() == 1) {
                        Optional<User> optionalUser = userService.findByUsername(game.getFirstPlayer());
                        optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                        User user = optionalUser.get();
                        user.setRating(user.getRating() + 10);
                        userService.save(user);
                        Optional<User> optionalUser2 = userService.findByUsername(game.getSecondPlayer());
                        optionalUser2.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                        User user2 = optionalUser2.get();
                        user2.setRating(user2.getRating() - 10);
                        userService.save(user2);
                    }
                }
            } else if (game.getSecondPlayer().equals(username) && game.getPlayerTurn() == PlayerTurnEnum.FIRST_PLAYER) {
                long elapsed = System.currentTimeMillis() - game.getFirstPlayerLastMoveTime();
                if (game.getFirstPlayerTime() - elapsed / 1000 <= 0) {
                    game.setStatus(GameStatusEnum.FINISHED);
                    game.setWinner(game.getSecondPlayer());
                    if (game.getIsRanked() == 1) {
                        Optional<User> optionalUser = userService.findByUsername(game.getSecondPlayer());
                        optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                        User user = optionalUser.get();
                        user.setRating(user.getRating() + 10);
                        userService.save(user);
                        Optional<User> optionalUser2 = userService.findByUsername(game.getFirstPlayer());
                        optionalUser2.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                        User user2 = optionalUser2.get();
                        user2.setRating(user2.getRating() - 10);
                        userService.save(user2);
                    }
                }
            }
            gameRepository.save(game);
        }

        return game;
    }

//    public Integer checkResign(String id) {
//        Optional<Game> optionalGame = gameRepository.findById(id);
//        optionalGame.orElseThrow(() -> new RuntimeException("Game with provided id doesn't exist"));
//        Game game = optionalGame.get();
//        if (game.getStatus() == GameStatusEnum.FINISHED) {
//            return 1;
//        }
//
//        return 0;
//    }

    public Game resign(String id, String username) {
        Optional<Game> optionalGame = gameRepository.findById(id);
        optionalGame.orElseThrow(() -> new RuntimeException("Game with provided id doesn't exist"));
        Game game = optionalGame.get();
        if (game.getStatus() == GameStatusEnum.FINISHED) {
            throw new RuntimeException("Game is finished");
        } else {
            game.setStatus(GameStatusEnum.FINISHED);
            if (game.getFirstPlayer().equals(username)) {
                game.setWinner(game.getSecondPlayer());
                if (game.getIsRanked() == 1) {
                    Optional<User> optionalUser = userService.findByUsername(game.getSecondPlayer());
                    optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    User user = optionalUser.get();
                    user.setRating(user.getRating() + 10);
                    userService.save(user);
                    Optional<User> optionalUser2 = userService.findByUsername(game.getFirstPlayer());
                    optionalUser2.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    User user2 = optionalUser2.get();
                    user2.setRating(user2.getRating() - 10);
                    userService.save(user2);
                }
            } else {
                game.setWinner(game.getFirstPlayer());
                Optional<User> optionalUser = userService.findByUsername(game.getSecondPlayer());
                optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                User user = optionalUser.get();
                user.setRating(user.getRating() - 10);
                userService.save(user);
                Optional<User> optionalUser2 = userService.findByUsername(game.getFirstPlayer());
                optionalUser2.orElseThrow(() -> new UsernameNotFoundException("User not found"));
                User user2 = optionalUser2.get();
                user2.setRating(user2.getRating() + 10);
                userService.save(user2);
            }
            gameRepository.save(game);
        }

        return game;
    }

    public Game draw(String gameId, String name) {
        Optional<Game> optionalGame = gameRepository.findById(gameId);
        optionalGame.orElseThrow(() -> new RuntimeException("Game with provided id doesn't exist"));
        Game game = optionalGame.get();
        if (game.getStatus() == GameStatusEnum.FINISHED) {
            throw new RuntimeException("Game is finished");
        } else {
            if (game.getFirstPlayer().equals(name)) {
                game.setFirstPlayerDrawOffer(1);
            } else if (game.getSecondPlayer().equals(name)) {
                game.setSecondPlayerDrawOffer(1);
            }
            if (game.getFirstPlayerDrawOffer() == 1 && game.getSecondPlayerDrawOffer() == 1) {
                game.setStatus(GameStatusEnum.FINISHED);
            }
            gameRepository.save(game);
        }

        return game;
    }
    public List<Game> history(String name) {
        List<Game> games = new ArrayList<Game>();
        gameRepository.findAll().forEach(game -> {
            if (game.getFirstPlayer().equals(name) || game.getSecondPlayer().equals(name)) {
                games.add(game);
            }
        });

        return games;
    }




}