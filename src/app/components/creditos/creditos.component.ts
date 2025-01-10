import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.css'
})
export class CreditosComponent {
  developer = {
    name: 'José Sebastián Colin Becerra',
    group: '7CM2',
    email: 'jcolinb1800@alumno.ipn.mx'
  };
}

