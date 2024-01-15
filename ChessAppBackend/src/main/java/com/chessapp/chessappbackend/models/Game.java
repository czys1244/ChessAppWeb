package com.chessapp.chessappbackend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


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
    private String secondPlayer;
    private boolean winner;




    private PlayerTurnEnum playerTurn;

    public Game() {
        playerTurn = PlayerTurnEnum.FIRST_PLAYER;
    }


}
