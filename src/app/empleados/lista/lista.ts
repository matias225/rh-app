import { Component, inject, signal } from '@angular/core';
import { Empleado } from '../../models/empleado';
import { EmpleadoService } from '../../services/empleado.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './lista.html',
})
export class ListaComponent {
  empleados = signal<Empleado[]>([]);
  error = signal('');
  private empleadoService = inject(EmpleadoService);

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.error.set('');
    this.empleadoService.obtenerEmpleados().subscribe({
      next: (empleados) => {
        this.empleados.set(empleados);
      },
      error: (error) => {
        console.error('Error al obtener empleados:', error);
        this.error.set('No se pudo cargar el listado de empleados.');
      },
    });
  }

  eliminar(empleado: Empleado): void {
    const confirmar = confirm(`¿Está seguro de eliminar al empleado "${empleado.nombre}"?`);
    if (!confirmar) {
      return;
    }

    this.error.set('');
    this.empleadoService.eliminarEmpleado(empleado.idEmpleado).subscribe({
      next: (respuesta) => {
        console.log(respuesta.mensaje);
        this.cargar();
      },
      error: (error) => {
        console.error('Error al eliminar empleado:', error);
        this.error.set('No se pudo eliminar el empleado.');
      },
    });
  }
}
