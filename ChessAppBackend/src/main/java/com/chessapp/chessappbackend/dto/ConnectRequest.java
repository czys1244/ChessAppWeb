package com.chessapp.chessappbackend.dto;

import com.chessapp.chessappbackend.models.Player;
import lombok.Data;

@Data
public class ConnectRequest {
    private String gameId;
}