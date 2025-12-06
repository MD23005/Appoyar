package com.libcode.proyecto.appoyar.store;

import com.libcode.proyecto.appoyar.user.User;
import com.libcode.proyecto.appoyar.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StorePurchaseService {

    private static final Logger logger = LoggerFactory.getLogger(StorePurchaseService.class);

    private final ProductRepository productRepository;
    private final StorePurchaseRepository purchaseRepository;
    private final UserService userService;

    public StorePurchaseService(ProductRepository productRepository,
                                StorePurchaseRepository purchaseRepository,
                                UserService userService) {
        this.productRepository = productRepository;
        this.purchaseRepository = purchaseRepository;
        this.userService = userService;
    }

    @Transactional
    public StorePurchase purchaseProduct(String userIdentifier, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor que 0");
        }

        // Usuario del backend (puede buscarse por correo o por identificador Auth0)
        User user = userService.obtenerUsuarioPorIdentificador(userIdentifier);

        // Producto
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id: " + productId));

        int pricePoints = product.getPrecio().intValue(); // asumimos que el precio ya está en puntos enteros
        int totalPoints = pricePoints * quantity;

        if (user.getPuntos() == null) {
            user.setPuntos(0);
        }

        if (user.getPuntos() < totalPoints) {
            throw new IllegalStateException("No tienes puntos suficientes para esta compra.");
        }

        logger.info("Usuario {} ({}) compra producto {} x{} por {} puntos",
                user.getId(), user.getCorreo(), product.getId(), quantity, totalPoints);

        // Descontar puntos
        user.setPuntos(user.getPuntos() - totalPoints);

        // Registrar compra
        StorePurchase purchase = new StorePurchase();
        purchase.setUser(user);
        purchase.setProduct(product);
        purchase.setQuantity(quantity);
        purchase.setTotalPoints(totalPoints);

        purchaseRepository.save(purchase);
        // El usuario se actualiza automáticamente al estar en el contexto de persistencia

        return purchase;
    }
}
