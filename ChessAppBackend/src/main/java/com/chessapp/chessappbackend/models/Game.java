package com.chessapp.chessappbackend.models;

import com.github.bhlangonijr.chesslib.Board;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;


@AllArgsConstructor
@Data
@Builder
@Entity
@Table(name = "games")
public class Game {
    @Id
    private String id;
    private GameStatusEnum status;
    private String firstPlayer;
    private Long firstPlayerTime;
    private Long firstPlayerLastMoveTime;
    private String secondPlayer;
    private Long secondPlayerTime;
    private Long secondPlayerLastMoveTime;
    private String winner;
    Long startedAt;
    private Long time;

    String fen;



    private PlayerTurnEnum playerTurn;

    public Game() {
        Board board = new Board();
        fen = board.getFen();
        playerTurn = PlayerTurnEnum.FIRST_PLAYER;
    }


}
