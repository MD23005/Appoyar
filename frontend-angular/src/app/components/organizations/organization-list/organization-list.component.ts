import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrganizationService } from '../../../services/organization.service';
import { Organization } from '../../../models/organization.model';

// Componente para mostrar la lista de todas las organizaciones
// ver, editar, eliminar y crear nuevas organizaciones

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.css']
})
export class OrganizationListComponent implements OnInit {
  private organizationService = inject(OrganizationService);
  private router = inject(Router);

  organizations: Organization[] = [];
  loading = true;
  showSuccessMessage = false;
  successMessage = '';

  ngOnInit() {
    this.loadOrganizations();
  }

  // Carga la lista de organizaciones desde el servidor

  loadOrganizations(): void {
    this.loading = true;
    this.organizationService.getOrganizations().subscribe({
      next: (organizations) => {
        this.organizations = organizations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando organizaciones:', error);
        this.loading = false;
        alert('Error al cargar las organizaciones. Verifica que el servidor esté corriendo.');
      }
    });
  }

  // Navega a la vista de detalle de una organización

  viewOrganization(nit: string): void {
    this.router.navigate(['/panel/organizations', nit]);
  }

  // Navega al formulario para crear una nueva organización

  createOrganization(): void {
    this.router.navigate(['/panel/organizations/new']);
  }

  // Navega al formulario de edición de una organización

  editOrganization(event: Event, nit: string): void {
    event.stopPropagation();
    this.router.navigate(['/panel/organizations/edit', nit]);
  }

  // Elimina una organización después de confirmación del usuario

  deleteOrganization(event: Event, nit: string, nombre: string): void {
    event.stopPropagation();
    
    if (confirm(`¿Estás seguro de que quieres eliminar la organización "${nombre}"?`)) {
      this.organizationService.deleteOrganization(nit).subscribe({
        next: () => {
          this.showSuccess('Organización eliminada exitosamente');
          this.loadOrganizations();
        },
        error: (error) => {
          console.error('Error eliminando organización:', error);
          alert('Error al eliminar la organización');
        }
      });
    }
  }

  // Función para donaciones (en desarrollo)

  donateOrganization(event: Event): void {
    event.stopPropagation();
    alert('Función de donación en desarrollo');
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessMessage = true;
    
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }
}