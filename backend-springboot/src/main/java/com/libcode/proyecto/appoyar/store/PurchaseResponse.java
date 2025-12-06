package com.libcode.proyecto.appoyar.store;

public class PurchaseResponse {

    private Long purchaseId;
    private Long productId;
    private Integer quantity;
    private Integer totalPoints;

    private Long userId;
    private String userEmail;
    private Integer userPointsAfterPurchase;

    public PurchaseResponse() {
    }

    public PurchaseResponse(
            Long purchaseId,
            Long productId,
            Integer quantity,
            Integer totalPoints,
            Long userId,
            String userEmail,
            Integer userPointsAfterPurchase
    ) {
        this.purchaseId = purchaseId;
        this.productId = productId;
        this.quantity = quantity;
        this.totalPoints = totalPoints;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userPointsAfterPurchase = userPointsAfterPurchase;
    }

    public Long getPurchaseId() {
        return purchaseId;
    }

    public void setPurchaseId(Long purchaseId) {
        this.purchaseId = purchaseId;
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

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Integer getUserPointsAfterPurchase() {
        return userPointsAfterPurchase;
    }

    public void setUserPointsAfterPurchase(Integer userPointsAfterPurchase) {
        this.userPointsAfterPurchase = userPointsAfterPurchase;
    }
}
