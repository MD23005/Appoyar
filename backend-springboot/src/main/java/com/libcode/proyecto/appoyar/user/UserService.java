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

    public List<User> obtenerTodosLosUsuarios() {
        return repository.findAll();
    }

    public User obtenerUsuarioPorCorreo(String correo) {
        return repository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con correo: " + correo));
    }
}