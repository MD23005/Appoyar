package com.libcode.proyecto.appoyar.donation;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.math.BigDecimal;
import java.math.RoundingMode;

import com.libcode.proyecto.appoyar.user.User;
import com.libcode.proyecto.appoyar.user.UserRepository;

// Servicio para manejar las operaciones de donaciones

@Service
@Transactional
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DonationService(DonationRepository donationRepository, UserRepository userRepository) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    // Registra una nueva donación en el sistema
    // y también actualiza los puntos del usuario

    public Donation registrarDonacion(Donation donation) {

        // 1. Calcular puntos generados por esta donación
        int puntos = calcularPuntos(donation.getMonto());
        donation.setPuntosGanados(puntos);

        // 2. Guardar la donación
        Donation donacionGuardada = donationRepository.save(donation);

        // 3. Sumar puntos al usuario (si aplica)
        if (puntos > 0) {
            User usuario = donacionGuardada.getUsuario();

            if (usuario == null || usuario.getId() == null) {
                throw new RuntimeException("La donación no tiene un usuario válido asociado");
            }

            // Cargar usuario desde BD para asegurarnos de tener el estado actual
            User usuarioBd = userRepository.findById(usuario.getId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuario.getId()));

            Integer puntosActuales = (usuarioBd.getPuntos() != null) ? usuarioBd.getPuntos() : 0;
            usuarioBd.setPuntos(puntosActuales + puntos);

            userRepository.save(usuarioBd);

            // Actualizar referencia del usuario en la donación que devolvemos
            donacionGuardada.setUsuario(usuarioBd);
        }

        return donacionGuardada;
    }

    // Regla de negocio: 100 puntos por cada unidad monetaria donada
    // Ejemplos:
    //   monto = 20.0  -> 2000 puntos
    //   monto = 25.5  -> 2550 puntos
    private int calcularPuntos(Double monto) {
        if (monto == null || monto <= 0) {
            return 0;
        }
        BigDecimal bdMonto = BigDecimal.valueOf(monto);
        BigDecimal puntos = bdMonto.multiply(BigDecimal.valueOf(100));
        // Redondeamos hacia abajo para no regalar puntos extra por decimales raros
        return puntos.setScale(0, RoundingMode.DOWN).intValueExact();
    }

    // Obtiene todas las donaciones de una organización
    public List<Donation> obtenerDonacionesPorOrganizacion(String nitOrganizacion) {
        return donationRepository.findByOrganizacionNit(nitOrganizacion);
    }

    // Obtiene todas las donaciones de un usuario por su ID
    public List<Donation> obtenerDonacionesPorUsuario(Long idUsuario) {
        return donationRepository.findByUsuarioId(idUsuario);
    }

    // Obtiene el historial de donaciones de un usuario a una organización específica
    public List<Donation> obtenerHistorialDonaciones(String nitOrganizacion, Long idUsuario) {
        return donationRepository.findByOrganizacionNitAndUsuarioId(nitOrganizacion, idUsuario);
    }

    // Obtiene el total donado a una organización
    public Double obtenerTotalDonadoPorOrganizacion(String nitOrganizacion) {
        return donationRepository.sumMontoByOrganizacionNit(nitOrganizacion);
    }
}
