
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LogComponent } from './components/log/log.component';
import { authGuard } from './guard/auth.guard';
import { CreditosComponent } from './components/creditos/creditos.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'employees', component: LogComponent },
      { path: 'creditos', component: CreditosComponent },
      { path: '', redirectTo: 'employees', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];