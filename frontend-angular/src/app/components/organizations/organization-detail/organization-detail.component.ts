import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../../../services/organization.service';
import { Organization } from '../../../models/organization.model';

//Componente para mostrar los detalles completos de una organización específica

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.css']
})
export class OrganizationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private organizationService = inject(OrganizationService);

  organization: Organization | null = null;
  loading = true;

  ngOnInit() {
    const nit = this.route.snapshot.paramMap.get('nit');
    if (nit) {
      this.loadOrganization(nit);
    } else {
      this.loading = false;
      console.error('NIT no proporcionado en la ruta');
    }
  }

  // Carga los datos de una organización específica por su NIT

  loadOrganization(nit: string): void {
    this.loading = true;
    this.organizationService.getOrganizationByNit(nit).subscribe({
      next: (organization) => {
        this.organization = organization;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando organización:', error);
        this.loading = false;
        alert('Error al cargar la organización');
      }
    });
  }

  // Función para realizar donaciones (en desarrollo).

  donate(): void {
    alert('Función de donación en desarrollo');
  }

  goBack(): void {
    this.router.navigate(['/panel/organizations']);
  }
}