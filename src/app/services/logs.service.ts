import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Definir la interfaz para el empleado
export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  hire_date: Date;
  position: string;
}

// Definir la interfaz para la respuesta de la API
interface ApiResponse {
  estado: number;
  msg: string;
  employees: Employee[];
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
    // URL de la API para empleados
  private apiUrl = 'https://api1-proyecto-final-wcbdf.onrender.com/api/v1/employees';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

    // Obtener todos los empleados
  getLogs(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.authService.getAuthHeaders() });
  }

  // Obtener un empleado por ID (no se usa en el componente, pero se deja por si acaso)
  getLog(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  // Crear un nuevo empleado
  createLog(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee, { headers: this.authService.getAuthHeaders() });
  }

  // Actualizar un empleado existente
  updateLog(id: number, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee, { headers: this.authService.getAuthHeaders() });
  }

  // Eliminar un empleado por ID
  deleteLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }
}