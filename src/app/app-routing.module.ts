import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AuthComponent } from './auth-layout/auth/auth.component';
import { AuthGuard } from './auth-layout/auth/auth.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';


const approutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/auth', pathMatch: 'full' },
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
  },
  { path: '**', redirectTo:'/auth'}
];


@NgModule({
  imports: [RouterModule.forRoot(approutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

