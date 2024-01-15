package com.chessapp.chessappbackend.repositories;

import com.chessapp.chessappbackend.models.Game;
import com.chessapp.chessappbackend.models.GameStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, String> {
    Optional<Game> findFirstByStatusAndSecondPlayerIsNull(GameStatusEnum status);
}
