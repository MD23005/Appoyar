package com.libcode.proyecto.appoyar.store;

import com.libcode.proyecto.appoyar.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/store")
@CrossOrigin(origins = "http://localhost:4200")
public class StorePurchaseController {

    private static final Logger logger = LoggerFactory.getLogger(StorePurchaseController.class);

    private final StorePurchaseService purchaseService;

    public StorePurchaseController(StorePurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping("/purchases")
    public ResponseEntity<PurchaseResponse> purchase(
            @RequestBody PurchaseRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        // Si el token trae 'email', usamos ese valor (coincide con el campo 'correo' en la BD).
        // Si no, construimos el identificador Auth0 almacenado en passwordHash: "auth0_" + sub
        String identifier;
        String email = jwt.getClaim("email");

        if (email != null && !email.isEmpty()) {
            identifier = email;
        } else {
            String sub = jwt.getSubject(); // p.ej. "auth0|691b3ce17c095dfea95bdb8e"
            identifier = "auth0_" + sub;   // p.ej. "auth0_auth0|691b3ce17c095dfea95bdb8e"
        }

        logger.info("Solicitud de compra - productoId: {}, cantidad: {}, identificadorUsuario: {}",
                request.getProductId(), request.getQuantity(), identifier);

        StorePurchase purchase =
                purchaseService.purchaseProduct(identifier, request.getProductId(), request.getQuantity());

        User user = purchase.getUser();

        PurchaseResponse response = new PurchaseResponse(
                purchase.getId(),
                purchase.getProduct().getId(),
                purchase.getQuantity(),
                purchase.getTotalPoints(),
                user.getId(),
                user.getCorreo(),
                user.getPuntos()
        );

        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleBusinessError(IllegalStateException ex) {
        // P.ej. falta de puntos
        return ResponseEntity.status(409).body(ex.getMessage());
    }
}
