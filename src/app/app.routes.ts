import { Routes } from '@angular/router';
import { AuthGuard } from '~core/guards/auth.guard';
import { LayoutComponent } from '~core/layout/layout.component';
import { LoginComponent } from '~features/authentication/pages/login/login.component';
import { SalesOrderComponent } from '~features/sales-order/sales-order.component';
import { ContactComponent } from '~features/contact/contact.component';
import { UserComponent } from '~features/user/user.component';
import { DashboardComponent } from '~features/dashboard/dashboard.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // require for load sign-in page first
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'sales-order', component: SalesOrderComponent },
      { path: 'user', component: UserComponent },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
