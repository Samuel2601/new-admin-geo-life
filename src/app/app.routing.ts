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

import { IndexUsuarioComponent } from './components/usuario/index-usuario/index-usuario.component';
import { EditUsuarioComponent } from './components/usuario/edit-usuario/edit-usuario.component';
import { CreateUsuarioComponent } from './components/usuario/create-usuario/create-usuario.component';
import { CreateFichaSectorialComponent } from './components/ficha-sectorial/create-ficha-sectorial/create-ficha-sectorial.component';
import { IndexFichaSectorialComponent } from './components/ficha-sectorial/index-ficha-sectorial/index-ficha-sectorial.component';
import { EditFichaSectorialComponent } from './components/ficha-sectorial/edit-ficha-sectorial/edit-ficha-sectorial.component';
import { IndexIncidentesDenunciaComponent } from './components/incidentes-denuncia/index-incidentes-denuncia/index-incidentes-denuncia.component';
import { CreateIncidentesDenunciaComponent } from './components/incidentes-denuncia/create-incidentes-denuncia/create-incidentes-denuncia.component';
import { EditIncidentesDenunciaComponent } from './components/incidentes-denuncia/edit-incidentes-denuncia/edit-incidentes-denuncia.component';
import { IndexEncargadoCategoriaComponent } from './components/encargado-categoria/index-encargado-categoria/index-encargado-categoria.component';
import { CreateEncargadoCategoriaComponent } from './components/encargado-categoria/create-encargado-categoria/create-encargado-categoria.component';
import { EditEncargadoCategoriaComponent } from './components/encargado-categoria/edit-encargado-categoria/edit-encargado-categoria.component';
import { IndexRolUserComponent } from './components/rol-user/index-rol-user/index-rol-user.component';
import { EditRolUserComponent } from './components/rol-user/edit-rol-user/edit-rol-user.component';
import { CreateRolUserComponent } from './components/rol-user/create-rol-user/create-rol-user.component';
import { IndexEstadoIncidenteComponent } from './components/estado-incidente/index-estado-incidente/index-estado-incidente.component';
import { EditEstadoIncidenteComponent } from './components/estado-incidente/edit-estado-incidente/edit-estado-incidente.component';
import { CreateEstadoIncidenteComponent } from './components/estado-incidente/create-estado-incidente/create-estado-incidente.component';
import { IndexEstadoActividadProyectoComponent } from './components/estado-actividad-proyecto/index-estado-actividad-proyecto/index-estado-actividad-proyecto.component';
import { EditEstadoActividadProyectoComponent } from './components/estado-actividad-proyecto/edit-estado-actividad-proyecto/edit-estado-actividad-proyecto.component';
import { CreateEstadoActividadProyectoComponent } from './components/estado-actividad-proyecto/create-estado-actividad-proyecto/create-estado-actividad-proyecto.component';
import { IndexActividadProyectoComponent } from './components/actividad-proyecto/index-actividad-proyecto/index-actividad-proyecto.component';
import { EditActividadProyectoComponent } from './components/actividad-proyecto/edit-actividad-proyecto/edit-actividad-proyecto.component';
import { CreateActividadProyectoComponent } from './components/actividad-proyecto/create-actividad-proyecto/create-actividad-proyecto.component';
import { IndexDireccionGeoComponent } from './components/direccion-geo/index-direccion-geo/index-direccion-geo.component';
import { EditDireccionGeoComponent } from './components/direccion-geo/edit-direccion-geo/edit-direccion-geo.component';
import { CreateDireccionGeoComponent } from './components/direccion-geo/create-direccion-geo/create-direccion-geo.component';
import { IndexPermisosComponent } from './components/permisos/index-permisos/index-permisos.component';
import { EditPermisosComponent } from './components/permisos/edit-permisos/edit-permisos.component';
import { CreatePermisosComponent } from './components/permisos/create-permisos/create-permisos.component';
import { AdminComponent } from './components/admin/admin.component';

const appRoute: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },//, canActivate: [AuthGuard]
	{ path: 'inicio', component:LoginComponent },
	{ path: 'registro', component:SignupComponent },
	{ path: 'categorias', component: IndexCategoriaComponent},
	{ path: 'subcategorias', component: IndexSubcategoriaComponent},
	{ path: 'create-categoria', component:CreateCategoriaComponent },
	{ path: 'create-subcategoria', component:CreateSubcategoriaComponent },
	
	// Agregar las rutas para los otros componentes
	{ path: 'administracion', component: AdminComponent },
	{ path: 'edit-usuario/:id', component: EditUsuarioComponent },
	{ path: 'create-usuario', component: CreateUsuarioComponent },
	{ path: 'fichas-sectoriales', component: IndexFichaSectorialComponent },
	{ path: 'edit-ficha-sectorial/:id', component: EditFichaSectorialComponent },
	{ path: 'create-ficha-sectorial', component: CreateFichaSectorialComponent },
	{ path: 'incidentes-denuncia', component: IndexIncidentesDenunciaComponent },
	{ path: 'edit-incidentes-denuncia/:id', component: EditIncidentesDenunciaComponent },
	{ path: 'create-incidentes-denuncia', component: CreateIncidentesDenunciaComponent },
	{ path: 'encargados-categoria', component: IndexEncargadoCategoriaComponent },
	{ path: 'edit-encargado-categoria/:id', component: EditEncargadoCategoriaComponent },
	{ path: 'create-encargado-categoria', component: CreateEncargadoCategoriaComponent },
	{ path: 'roles-usuario', component: IndexRolUserComponent },
	{ path: 'edit-rol-user/:id', component: EditRolUserComponent },
	{ path: 'create-rol-user', component: CreateRolUserComponent },
	{ path: 'estados-incidente', component: IndexEstadoIncidenteComponent },
	{ path: 'edit-estado-incidente/:id', component: EditEstadoIncidenteComponent },
	{ path: 'create-estado-incidente', component: CreateEstadoIncidenteComponent },
	{ path: 'estados-actividad-proyecto', component: IndexEstadoActividadProyectoComponent },
	{ path: 'edit-estado-actividad-proyecto/:id', component: EditEstadoActividadProyectoComponent },
	{ path: 'create-estado-actividad-proyecto', component: CreateEstadoActividadProyectoComponent },
	{ path: 'actividades-proyecto', component: IndexActividadProyectoComponent },
	{ path: 'edit-actividad-proyecto/:id', component: EditActividadProyectoComponent },
	{ path: 'create-actividad-proyecto', component: CreateActividadProyectoComponent },
	{ path: 'direcciones-geo', component: IndexDireccionGeoComponent },
	{ path: 'edit-direccion-geo/:id', component: EditDireccionGeoComponent },
	{ path: 'create-direccion-geo', component: CreateDireccionGeoComponent },
	{ path: 'permisos', component: IndexPermisosComponent },
	{ path: 'edit-permisos/:id', component: EditPermisosComponent },
	{ path: 'create-permisos', component: CreatePermisosComponent },

	{ path: 'user-profile', component: EditUsuarioComponent },

    /*{ path: '**', redirectTo: '/error' }*/
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);
