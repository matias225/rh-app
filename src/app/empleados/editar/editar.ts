import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Empleado } from '../../models/empleado';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './editar.html',
})
export class EditarComponent {
  private empleadoService = inject(EmpleadoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // El formulario trabaja con un objeto normal.
  empleado: Empleado = {
    idEmpleado: 0,
    nombre: '',
    departamento: '',
    sueldo: 0,
  };

  // Estado de la interfaz: usamos Signals.
  cargando = signal(true);

  guardando = signal(false);

  error = signal('');

  idEmpleado = 0;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('ID de empleado inválido');
      this.cargando.set(false);

      return;
    }

    this.idEmpleado = Number(id);

    if (isNaN(this.idEmpleado)) {
      this.error.set('ID de empleado inválido');
      this.cargando.set(false);

      return;
    }

    this.cargarEmpleado();
  }

  cargarEmpleado(): void {
    this.empleadoService.obtenerEmpleadoPorId(this.idEmpleado).subscribe({
      next: (empleado) => {

        this.empleado = empleado;
        // Actualizamos el Signal.
        this.cargando.set(false);
      },

      error: (error) => {
        console.error('Error al obtener empleado:', error);

        this.error.set('No se pudo cargar el empleado.');

        this.cargando.set(false);
      },
    });
  }

  guardar(): void {
    this.error.set('');

    this.guardando.set(true);

    this.empleadoService.editarEmpleado(this.idEmpleado, this.empleado).subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/empleados']);
      },

      error: (error) => {
        console.error('Error al actualizar empleado:', error);
        this.guardando.set(false);
        this.error.set('No se pudo actualizar el empleado.');
      },
    });
  }
}
