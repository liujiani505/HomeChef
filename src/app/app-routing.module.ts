import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AuthGuard } from './auth-layout/auth/auth.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';


const approutes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'recipes', loadChildren: () => import('./main-layout/recipes/recipes.module').then(m => m.RecipesModule) },
      { path: 'shopping-list', loadChildren: () => import('./main-layout/shopping-list/shopping-list.module').then(m => m.ShoppingListModule)},
    ]
  },
  { path: '',
    component: AuthLayoutComponent,
    children: [ 
      { path: 'auth', loadChildren: () => import('./auth-layout/auth/auth.module').then(m => m.AuthModule) } 
    ]
  },
  { path: '**', redirectTo: '/auth' },
];


@NgModule({
  imports: [RouterModule.forRoot(approutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

