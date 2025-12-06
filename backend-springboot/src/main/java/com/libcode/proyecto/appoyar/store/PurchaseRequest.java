package com.libcode.proyecto.appoyar.store;

public class PurchaseRequest {

    private Long productId;
    private Integer quantity;

    public PurchaseRequest() {
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
