import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';

import { CreateCategoriaComponent } from './components/categoria/create-categoria/create-categoria.component';
import { IndexCategoriaComponent } from './components/categoria/index-categoria/index-categoria.component';
import { EditCategoriaComponent } from './components/categoria/edit-categoria/edit-categoria.component';
import { CreateSubcategoriaComponent } from './components/categoria/sub/create-subcategoria/create-subcategoria.component';
import { IndexSubcategoriaComponent } from './components/categoria/sub/index-subcategoria/index-subcategoria.component';
import { EditSubcategoriaComponent } from './components/categoria/sub/edit-subcategoria/edit-subcategoria.component';
import { ErrorComponent } from './components/user/error/error.component';
import { PermisoGuard } from './guards/permiso.guard';
const appRoute: Routes = [
	//{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },//, canActivate: [AuthGuard]
	{ path: 'inicio', component:LoginComponent },
	{ path: 'registro', component:SignupComponent },
	{ path: 'categorias', component: IndexCategoriaComponent},
	{ path: 'subcategorias', component: IndexSubcategoriaComponent},
	{ path: 'create-categoria', component:CreateCategoriaComponent },
	{ path: 'create-subcategoria', component:CreateSubcategoriaComponent },
    /*{ path: '**', redirectTo: '/error' }*/
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);
