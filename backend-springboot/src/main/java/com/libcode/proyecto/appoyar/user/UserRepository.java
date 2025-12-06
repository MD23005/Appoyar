package com.libcode.proyecto.appoyar.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByCorreo(String correo);

    // Para poder buscar por el identificador de Auth0 guardado en passwordHash
    Optional<User> findByPasswordHash(String passwordHash);
}
