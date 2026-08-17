import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/empleados';

  private convertirEmpleado(empleado: any): Empleado {
  return {
    idEmpleado: empleado.idEmpleado,
    nombre: empleado.nombre,
    departamento: empleado.departamento,
    sueldo: Number(empleado.sueldo)
    };
  }

  obtenerEmpleados(): Observable<Empleado[]> {

    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(
        map(empleados =>
          empleados.map(
            empleado => this.convertirEmpleado(empleado)
          )
        )
      );
  }

  obtenerEmpleadoPorId(
    id: number
  ): Observable<Empleado> {

    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(empleado =>
          this.convertirEmpleado(empleado)
        )
      );
  }

  agregarEmpleado(
    empleado: Empleado
  ): Observable<Empleado> {

    const datos = {
      nombre: empleado.nombre,
      departamento: empleado.departamento,
      sueldo: empleado.sueldo
    };

    return this.http
      .post<any>(this.apiUrl, datos)
      .pipe(
        map(empleado =>
          this.convertirEmpleado(empleado)
        )
      );
  }

  editarEmpleado(
    id: number,
    empleado: Empleado
  ): Observable<Empleado> {

    const datos = {
      nombre: empleado.nombre,
      departamento: empleado.departamento,
      sueldo: empleado.sueldo
    };

    return this.http
      .put<any>(
        `${this.apiUrl}/${id}`,
        datos
      )
      .pipe(
        map(empleado =>
          this.convertirEmpleado(empleado)
        )
      );
  }

  eliminarEmpleado(
    id: number
  ): Observable<{ mensaje: string }> {

    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}