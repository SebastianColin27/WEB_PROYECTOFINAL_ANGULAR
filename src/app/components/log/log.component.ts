import { Component, OnInit, ViewChild } from '@angular/core';
import { LogsService } from '../../services/logs.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http'; // Importa HttpErrorResponse


// Definir la interfaz para el empleado
interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  hire_date: Date;
  position: string;
}

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
})
export class LogComponent implements OnInit {
  @ViewChild('logModal') logModal: any;
  listadoEmployees: Employee[] = [];
  loading = false;
  employeeForm: FormGroup;
  isEditMode = false;
  currentEmployeeId: number | null = null;
  errorMessage: string | null = null; // Mensaje de error

  constructor(
    private logsService: LogsService,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      hire_date: ['', [Validators.required]],
      position: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {
    this.cargarEmployees();
  }

  cargarEmployees() {
    if (this.authService.hasAuthority('READ')) {
      this.loading = true;
      this.logsService.getLogs().subscribe({
        next: (response) => {
          this.listadoEmployees = response.employees || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar los employees:', error);
          this.loading = false;
        },
      });
    }
  }

  createEmployee() {
    this.isEditMode = false;
    this.employeeForm.reset();
    this.employeeForm.patchValue({
      hire_date: new Date().toISOString().split('T')[0],
    });
    this.modalService.open(this.logModal, { backdrop: 'static', size: 'lg' });
    this.errorMessage = null; // Limpia el mensaje de error al abrir el modal
  }

  editEmployee(employee: Employee) {
    this.isEditMode = true;
    this.currentEmployeeId = employee.id;
    this.employeeForm.patchValue({
      first_name: employee.first_name,
      last_name: employee.last_name,
      hire_date: employee.hire_date ? new Date(employee.hire_date).toISOString().split('T')[0] : null,
      position: employee.position,
    });
    this.modalService.open(this.logModal, { backdrop: 'static', size: 'lg' });
    this.errorMessage = null; // Limpia el mensaje de error al abrir el modal
  }

  eliminarEmployee(employeeId: number) {
    if (this.authService.hasAuthority('DELETE')) {
      if (confirm('¿Está seguro que desea eliminar este empleado?')) {
        this.logsService.deleteLog(employeeId).subscribe({
          next: () => {
            this.cargarEmployees();
            this.errorMessage = null; // Limpia el mensaje de error si la eliminación es exitosa
          },
          error: (error) => {
            console.error('Error al eliminar el empleado:', error);
            this.errorMessage = 'Error al eliminar el empleado. Por favor, inténtalo de nuevo más tarde.';
          },
        });
      }
    } else {
      alert('No tienes permiso para eliminar empleados.');
    }
  }

  onSubmitEmployee(modal: any) {
    if (this.employeeForm.invalid) {
      return;
    }

    const employeeData: Partial<Employee> = {
      ...this.employeeForm.value,
      hire_date: this.employeeForm.value.hire_date,
    };

    const request = this.isEditMode && this.currentEmployeeId
      ? this.logsService.updateLog(this.currentEmployeeId, employeeData)
      : this.logsService.createLog(employeeData);
        
    if (this.isEditMode && this.currentEmployeeId && !this.authService.hasAuthority('UPDATE')) {
        alert('No tienes permiso para actualizar empleados.');
        return;
    } else if(!this.isEditMode && !this.authService.hasAuthority('CREATE')) {
        alert('No tienes permiso para crear empleados.');
        return;
    }


    request.subscribe({
      next: () => {
        modal.close();
        this.cargarEmployees();
        this.errorMessage = null; // Limpia el mensaje de error si la operación es exitosa
      },
      error: (err) => {
          console.error('Error al realizar la operación con el empleado:', err);
          this.handleError(err);
      },
    });
  }
  
  private handleError(error: any){
    let message = 'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.';
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            message = 'Error en la solicitud. Por favor, revisa los datos ingresados.';
           } else if (error.status === 401) {
             message = 'No estas autorizado para realizar esta acción.';
           } else if (error.status === 404) {
             message = 'No se encontró el recurso.';
           } else if (error.status === 500){
             message = 'Error en el servidor al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
           }
           else{
             message = 'Error desconocido. Por favor, inténtalo de nuevo más tarde.';
           }
        }
         this.errorMessage = message;
  }
}