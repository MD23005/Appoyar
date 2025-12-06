package com.libcode.proyecto.appoyar.user;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    // Guarda un usuario en la base de datos
    public User guardarUsuario(User user) {
        Optional<User> usuarioExistente = repository.findByCorreo(user.getCorreo());
        if (usuarioExistente.isPresent()) {

            User usuarioActual = usuarioExistente.get();
            usuarioActual.setNombre(user.getNombre());
            usuarioActual.setPasswordHash(user.getPasswordHash());
            return repository.save(usuarioActual);
        }

        return repository.save(user);
    }

    // Obtiene todos los usuarios registrados en el sistema
    public List<User> obtenerTodosLosUsuarios() {
        return repository.findAll();
    }

    // Busca un usuario por su correo electrónico
    public User obtenerUsuarioPorCorreo(String correo) {
        return repository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con correo: " + correo));
    }

    public User obtenerUsuarioPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    /**
     * Busca un usuario usando un identificador genérico que puede ser:
     *  - el correo electrónico (campo 'correo'), o
     *  - el identificador Auth0 almacenado en 'passwordHash' (por ejemplo 'auth0_auth0|xxxx').
     */
    public User obtenerUsuarioPorIdentificador(String identificador) {
        // Primero intentamos por correo
        Optional<User> porCorreo = repository.findByCorreo(identificador);
        if (porCorreo.isPresent()) {
            return porCorreo.get();
        }

        // Si no existe por correo, intentamos por passwordHash (donde guardas el id de Auth0)
        return repository.findByPasswordHash(identificador)
                .orElseThrow(() -> new RuntimeException(
                        "Usuario no encontrado con identificador: " + identificador));
    }
}
