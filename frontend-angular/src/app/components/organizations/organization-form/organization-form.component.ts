import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../../../services/organization.service';
import { Organization } from '../../../models/organization.model';
import { firstValueFrom } from 'rxjs';

//Componente para crear y editar organizaciones

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.css']
})
export class OrganizationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private organizationService = inject(OrganizationService);

  organizationForm: FormGroup;
  isEditMode = false;
  currentNit: string = '';
  loading = false;
  uploading = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor() {
    this.organizationForm = this.fb.group({
      nit: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      logoUrl: [''],
      nombreInscriptor: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    const nit = this.route.snapshot.paramMap.get('nit');
    if (nit) {
      this.isEditMode = true;
      this.currentNit = nit;
      this.loadOrganization(nit);
    }
  }

  // Carga los datos de una organización existente para edición

  loadOrganization(nit: string): void {
    this.loading = true;
    this.organizationService.getOrganizationByNit(nit).subscribe({
      next: (organization) => {
        this.organizationForm.patchValue(organization);
        if (organization.logoUrl) {
          this.previewUrl = organization.logoUrl;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando organización:', error);
        this.loading = false;
      }
    });
  }

  // Maneja la selección de un archivo para el logo

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecciona una imagen válida (JPEG, PNG, GIF, WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Elimina la imagen seleccionada y limpia la previsualización

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.organizationForm.patchValue({ logoUrl: '' });
  }

  // Procesa el envío del formulario

  async onSubmit(): Promise<void> {
    if (this.organizationForm.valid) {
      this.loading = true;

      try {
        let logoUrl = this.organizationForm.value.logoUrl;

        if (this.selectedFile) {
          this.uploading = true;
          const uploadResult = await firstValueFrom(
            this.organizationService.uploadLogo(this.selectedFile)
          );
          logoUrl = uploadResult.url;
          this.uploading = false;
        }

        const organizationData: Organization = {
          nit: this.organizationForm.value.nit,
          nombre: this.organizationForm.value.nombre,
          descripcion: this.organizationForm.value.descripcion,
          logoUrl: logoUrl,
          nombreInscriptor: this.organizationForm.value.nombreInscriptor,
          rol: this.organizationForm.value.rol,
          correo: this.organizationForm.value.correo,
          contraseña: this.organizationForm.value.contraseña
        };

        console.log('Enviando datos al backend:', organizationData);

        // Determina si es creación o actualización

        const operation = this.isEditMode 
          ? this.organizationService.updateOrganization(this.currentNit, organizationData)
          : this.organizationService.createOrganization(organizationData);

        operation.subscribe({
          next: (response) => {
            console.log('Respuesta exitosa del backend:', response);
            this.loading = false;
            this.router.navigate(['/panel/organizations']);
          },
          error: (error) => {
            console.error('Error del backend:', error);
            this.loading = false;
            
            let errorMessage = 'Error al guardar la organización';
            if (error.error && error.error.message) {
              errorMessage += ': ' + error.error.message;
            } else if (error.status === 500) {
              errorMessage += '. Error interno del servidor.';
            } else if (error.status === 400) {
              errorMessage += '. Datos inválidos.';
            }
            
            alert(errorMessage);
          }
        });

      } catch (error) {
        console.error('Error inesperado:', error);
        this.loading = false;
        this.uploading = false;
        alert('Error inesperado: ' + error);
      }
    } else {
      console.log('Formulario inválido');
      Object.keys(this.organizationForm.controls).forEach(key => {
        this.organizationForm.get(key)?.markAsTouched();
      });
    }
  }

  // Cancela la operación y regresa a la lista de organizaciones

  cancel(): void {
    this.router.navigate(['/panel/organizations']);
  }
}