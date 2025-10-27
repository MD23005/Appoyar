package com.libcode.proyecto.appoyar.user;

import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/usuarios")
public class UserController {

    private final UserService service;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public User registrarUsuario(@RequestBody CreateUserRequest userRequest) {
        logger.info("Recibiendo solicitud para crear usuario: {}", userRequest.getCorreo());
        logger.info("Datos recibidos - Nombre: {}, Correo: {}, PasswordHash: {}", 
                   userRequest.getNombre(), userRequest.getCorreo(), userRequest.getPasswordHash());

        String nombreLimpio = limpiarNombre(userRequest.getNombre());
        
        User user = new User();
        user.setNombre(nombreLimpio);
        user.setCorreo(userRequest.getCorreo());
        user.setPasswordHash(userRequest.getPasswordHash());
        
        User usuarioGuardado = service.guardarUsuario(user);
        logger.info("Usuario guardado exitosamente: {} - {}", 
                   usuarioGuardado.getNombre(), usuarioGuardado.getCorreo());
        
        return usuarioGuardado;
    }

    private String limpiarNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            return "Usuario";
        }
        
        String nombreLimpio = nombre.trim();
    
        if (nombreLimpio.contains("@") || nombreLimpio.length() < 2) {
            return generarNombreAmigable(nombreLimpio);
        }
        
        return nombreLimpio;
    }
    
    private String generarNombreAmigable(String input) {
        String base = input.split("@")[0];
        
        base = base.replaceAll("[^a-zA-ZáéíóúÁÉÍÓÚñÑ]", "");
        
        if (base.isEmpty() || base.length() < 2) {
            return "Usuario";
        }
        
        return base.substring(0, 1).toUpperCase() + base.substring(1).toLowerCase();
    }

    @GetMapping
    public List<User> obtenerUsuarios() {
        return service.obtenerTodosLosUsuarios();
    }
    @GetMapping("/correo/{correo}")
    public User obtenerUsuarioPorCorreo(@PathVariable String correo) {
        return service.obtenerUsuarioPorCorreo(correo);
    }
}