import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Empleado } from '../../models/empleado';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-agregar',
  imports: [FormsModule, RouterLink],
  templateUrl: './agregar.html'
})
export class AgregarComponent {
  private empleadoService = inject(EmpleadoService);
  private router = inject(Router);

  guardando = signal(false);
  error = signal('');

  empleado: Empleado = {
    idEmpleado: 0,
    nombre: '',
    departamento: '',
    sueldo: 0
  };

  guardar(): void {
    this.guardando.set(true);
    this.error.set('');

    this.empleadoService.agregarEmpleado(this.empleado).subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/empleados']);
      },
      error: (error) => {
        console.error('Error al crear empleado:', error);
        this.guardando.set(false);

        if (error.status == 0) {
          this.error.set('No se pudo conectar al servidor. Verifica que el backend esté encendido.');
        } else {
          this.error.set('Ocurrió un error al guardar el empleado. Revisa los datos ingresados.')
        }
      }
    });
  }
}