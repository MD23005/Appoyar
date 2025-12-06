import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreService, PurchaseResponse } from '../../services/store.service';
import { UserRolesService } from '../../services/user-roles.service';
import { UserService } from '../../services/user.service';

import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';

import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  private storeService = inject(StoreService);
  private userRolesService = inject(UserRolesService);
  private userService = inject(UserService);

  products: Product[] = [];

  // Variables para control de roles
  canEdit$: Observable<boolean>;
  canCreate$: Observable<boolean>;
  canDelete$: Observable<boolean>;

  // Variable para control de carga
  loading = true;

  // estado del formulario
  isEditing = false;
  editingProduct: Product | null = null;

  // modelo del formulario
  form: Product = {
    nombre: '',
    precio: 0,
    descripcion: '',
    imagenUrl: ''
  };

  // NUEVO: usuario actual (con puntos)
  currentUser: User | null = null;

  // NUEVO: estado de compra
  isBuying = false;

  constructor() {
    // Inicializar los observables de permisos
    this.canEdit$ = this.userRolesService.canEditProducts();
    this.canCreate$ = this.userRolesService.canEditProducts();
    this.canDelete$ = this.userRolesService.canEditProducts();
  }

  ngOnInit(): void {
    this.load();

    // Suscribirse al usuario del backend para tener los puntos en esta pantalla
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  load() {
    this.loading = true;
    this.storeService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.loading = false;
      }
    });
  }

  startCreate() {
    this.canCreate$.pipe(take(1)).subscribe(canCreate => {
      if (!canCreate) {
        alert('No tienes permisos para crear productos');
        return;
      }
      this.isEditing = true;
      this.editingProduct = null;
      this.form = {
        nombre: '',
        precio: 0,
        descripcion: '',
        imagenUrl: ''
      };
    });
  }

  onEdit(product: Product) {
    this.canEdit$.pipe(take(1)).subscribe(canEdit => {
      if (!canEdit) {
        alert('No tienes permisos para editar productos');
        return;
      }
      this.isEditing = true;
      this.editingProduct = product;
      this.form = { ...product };
    });
  }

  cancel() {
    this.isEditing = false;
  }

  save() {
    const permission$ = this.editingProduct ? this.canEdit$ : this.canCreate$;

    permission$.pipe(take(1)).subscribe(canProceed => {
      if (!canProceed) {
        alert('No tienes permisos para guardar productos.');
        return;
      }

      this.form.precio = Number(this.form.precio);

      if (this.editingProduct && this.editingProduct.id) {
        this.storeService.updateProduct(this.editingProduct.id, this.form).subscribe({
          next: () => {
            this.isEditing = false;
            this.load();
          },
          error: (err) => console.error('Error actualizando producto', err)
        });
        return;
      }

      this.storeService.createProduct(this.form).subscribe({
        next: () => {
          this.isEditing = false;
          this.load();
        },
        error: (err) => console.error('Error creando producto', err)
      });
    });
  }

  onDelete(product: Product) {
    this.canDelete$.pipe(take(1)).subscribe(canDelete => {
      if (!canDelete) {
        alert('No tienes permisos para eliminar productos.');
        return;
      }

      if (!product.id) return;
      if (!confirm('¿Eliminar este producto?')) return;

      this.storeService.deleteProduct(product.id).subscribe({
        next: () => this.load(),
        error: (err) => console.error('Error eliminando producto', err)
      });
    });
  }

  // ========= COMPRAR PRODUCTOS CON PUNTOS =========

  // Verificar si el usuario tiene puntos suficientes para un producto
  canBuy(product: Product): boolean {
    if (!this.currentUser) return false;

    const price = Number(product.precio ?? 0);
    const available = this.currentUser.puntos ?? 0;

    return price > 0 && available >= price;
  }

  onBuy(product: Product) {
    if (!this.currentUser) {
      alert('Debes iniciar sesión para poder comprar.');
      return;
    }

    if (!product.id) {
      alert('El producto no tiene un identificador válido.');
      return;
    }

    const price = Number(product.precio ?? 0);
    const available = this.currentUser.puntos ?? 0;

    if (price <= 0) {
      alert('El precio del producto no es válido.');
      return;
    }

    if (available < price) {
      alert(`No tienes puntos suficientes. Tienes ${available} y el producto cuesta ${price}.`);
      return;
    }

    const confirmed = confirm(
      `¿Confirmas la compra de "${product.nombre}" por ${price} puntos?`
    );

    if (!confirmed) {
      return; // Canceló la compra
    }

    this.isBuying = true;

    this.storeService.purchaseProduct({
      productId: product.id,
      quantity: 1
    }).subscribe({
      next: (resp: PurchaseResponse) => {
        // Actualizar puntos localmente usando la respuesta
        const remaining = resp.remainingPoints ?? (available - price);

        this.currentUser = {
          ...this.currentUser!,
          puntos: remaining
        };
        this.userService.setCurrentUser(this.currentUser);

        this.isBuying = false;
        alert('Compra realizada correctamente.');
      },
      error: (err) => {
        console.error('Error al realizar la compra', err);
        this.isBuying = false;
        alert('Ocurrió un error al realizar la compra. Intenta de nuevo.');
      }
    });
  }
}
