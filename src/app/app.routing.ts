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

import { IndexUsuarioComponent } from './components/admin/usuario/index-usuario/index-usuario.component';
import { EditUsuarioComponent } from './components/admin/usuario/edit-usuario/edit-usuario.component';
import { CreateUsuarioComponent } from './components/admin/usuario/create-usuario/create-usuario.component';
import { CreateFichaSectorialComponent } from './components/ficha-sectorial/create-ficha-sectorial/create-ficha-sectorial.component';
import { IndexFichaSectorialComponent } from './components/ficha-sectorial/index-ficha-sectorial/index-ficha-sectorial.component';
import { EditFichaSectorialComponent } from './components/ficha-sectorial/edit-ficha-sectorial/edit-ficha-sectorial.component';
import { IndexIncidentesDenunciaComponent } from './components/incidentes-denuncia/index-incidentes-denuncia/index-incidentes-denuncia.component';
import { CreateIncidentesDenunciaComponent } from './components/incidentes-denuncia/create-incidentes-denuncia/create-incidentes-denuncia.component';
import { EditIncidentesDenunciaComponent } from './components/incidentes-denuncia/edit-incidentes-denuncia/edit-incidentes-denuncia.component';
import { IndexEncargadoCategoriaComponent } from './components/admin/encargado-categoria/index-encargado-categoria/index-encargado-categoria.component';
import { CreateEncargadoCategoriaComponent } from './components/admin/encargado-categoria/create-encargado-categoria/create-encargado-categoria.component';
import { EditEncargadoCategoriaComponent } from './components/admin/encargado-categoria/edit-encargado-categoria/edit-encargado-categoria.component';
import { IndexRolUserComponent } from './components/admin/rol-user/index-rol-user/index-rol-user.component';
import { EditRolUserComponent } from './components/admin/rol-user/edit-rol-user/edit-rol-user.component';
import { CreateRolUserComponent } from './components/admin/rol-user/create-rol-user/create-rol-user.component';
import { IndexEstadoIncidenteComponent } from './components/incidentes-denuncia/estado-incidente/index-estado-incidente/index-estado-incidente.component';
import { EditEstadoIncidenteComponent } from './components/incidentes-denuncia/estado-incidente/edit-estado-incidente/edit-estado-incidente.component';
import { CreateEstadoIncidenteComponent } from './components/incidentes-denuncia/estado-incidente/create-estado-incidente/create-estado-incidente.component';
import { IndexEstadoActividadProyectoComponent } from './components/ficha-sectorial/estado-actividad-proyecto/index-estado-actividad-proyecto/index-estado-actividad-proyecto.component';
import { EditEstadoActividadProyectoComponent } from './components/ficha-sectorial/estado-actividad-proyecto/edit-estado-actividad-proyecto/edit-estado-actividad-proyecto.component';
import { CreateEstadoActividadProyectoComponent } from './components/ficha-sectorial/estado-actividad-proyecto/create-estado-actividad-proyecto/create-estado-actividad-proyecto.component';
import { IndexActividadProyectoComponent } from './components/ficha-sectorial/actividad-proyecto/index-actividad-proyecto/index-actividad-proyecto.component';
import { EditActividadProyectoComponent } from './components/ficha-sectorial/actividad-proyecto/edit-actividad-proyecto/edit-actividad-proyecto.component';
import { CreateActividadProyectoComponent } from './components/ficha-sectorial/actividad-proyecto/create-actividad-proyecto/create-actividad-proyecto.component';
import { IndexDireccionGeoComponent } from './components/direccion-geo/index-direccion-geo/index-direccion-geo.component';
import { EditDireccionGeoComponent } from './components/direccion-geo/edit-direccion-geo/edit-direccion-geo.component';
import { CreateDireccionGeoComponent } from './components/direccion-geo/create-direccion-geo/create-direccion-geo.component';
import { IndexPermisosComponent } from './components/admin/permisos/index-permisos/index-permisos.component';
import { EditPermisosComponent } from './components/admin/permisos/edit-permisos/edit-permisos.component';
import { CreatePermisosComponent } from './components/admin/permisos/create-permisos/create-permisos.component';
import { AdminComponent } from './components/admin/admin.component';

const appRoute: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'error', component: ErrorComponent },
	{ path: 'home', component: HomeComponent },//, canActivate: [AuthGuard]
	{ path: 'inicio', component:LoginComponent },
	{ path: 'registro', component:SignupComponent },
	
	{ path: 'categorias', component: IndexCategoriaComponent, canActivate: [PermisoGuard], data: { componente: 'IndexCategoriaComponent' } },
	{ path: 'subcategorias', component: IndexSubcategoriaComponent, canActivate: [PermisoGuard], data: { componente: 'IndexSubcategoriaComponent' } },
	{ path: 'create-categoria', component:CreateCategoriaComponent, canActivate: [PermisoGuard], data: { componente: 'CreateCategoriaComponent' }  },
	{ path: 'create-subcategoria', component:CreateSubcategoriaComponent, canActivate: [PermisoGuard], data: { componente: 'CreateSubcategoriaComponent' }  },
	
	// Agregar las rutas para los otros componentes
	{ path: 'administracion', component: AdminComponent, canActivate: [PermisoGuard], data: { componente: 'AdminComponent' }  },
	{ path: 'edit-usuario/:id', component: EditUsuarioComponent, canActivate: [PermisoGuard], data: { componente: 'EditUsuarioComponent' } },
	{ path: 'create-usuario', component: CreateUsuarioComponent, canActivate: [PermisoGuard], data: { componente: 'CreateUsuarioComponent' }  },
	{ path: 'fichas-sectoriales', component: IndexFichaSectorialComponent , canActivate: [PermisoGuard], data: { componente: 'IndexFichaSectorialComponent' } },
	{ path: 'edit-ficha-sectorial/:id', component: EditFichaSectorialComponent , canActivate: [PermisoGuard], data: { componente: 'EditFichaSectorialComponent' } },
	{ path: 'create-ficha-sectorial', component: CreateFichaSectorialComponent , canActivate: [PermisoGuard], data: { componente: 'CreateFichaSectorialComponent' } },
	{ path: 'incidentes-denuncia', component: IndexIncidentesDenunciaComponent , canActivate: [PermisoGuard], data: { componente: 'IndexIncidentesDenunciaComponent' } },
	{ path: 'edit-incidentes-denuncia/:id', component: EditIncidentesDenunciaComponent, canActivate: [PermisoGuard], data: { componente: 'EditIncidentesDenunciaComponent' }  },
	{ path: 'create-incidentes-denuncia', component: CreateIncidentesDenunciaComponent , canActivate: [PermisoGuard], data: { componente: 'CreateIncidentesDenunciaComponent' } },
	{ path: 'encargados-categoria', component: IndexEncargadoCategoriaComponent , canActivate: [PermisoGuard], data: { componente: 'IndexEncargadoCategoriaComponent' } },
	{ path: 'edit-encargado-categoria/:id', component: EditEncargadoCategoriaComponent , canActivate: [PermisoGuard], data: { componente: 'EditEncargadoCategoriaComponent' } },
	{ path: 'create-encargado-categoria', component: CreateEncargadoCategoriaComponent , canActivate: [PermisoGuard], data: { componente: 'CreateEncargadoCategoriaComponent' } },
	{ path: 'roles-usuario', component: IndexRolUserComponent , canActivate: [PermisoGuard], data: { componente: 'IndexRolUserComponent' } },
	{ path: 'edit-rol-user/:id', component: EditRolUserComponent , canActivate: [PermisoGuard], data: { componente: 'EditRolUserComponent' } },
	{ path: 'create-rol-user', component: CreateRolUserComponent , canActivate: [PermisoGuard], data: { componente: 'CreateRolUserComponent' } },
	{ path: 'estados-incidente', component: IndexEstadoIncidenteComponent, canActivate: [PermisoGuard], data: { componente: 'IndexEstadoIncidenteComponent' }  },
	{ path: 'edit-estado-incidente/:id', component: EditEstadoIncidenteComponent , canActivate: [PermisoGuard], data: { componente: 'EditEstadoIncidenteComponent' } },
	{ path: 'create-estado-incidente', component: CreateEstadoIncidenteComponent, canActivate: [PermisoGuard], data: { componente: 'CreateEstadoIncidenteComponent' }  },
	{ path: 'estados-actividad-proyecto', component: IndexEstadoActividadProyectoComponent, canActivate: [PermisoGuard], data: { componente: 'IndexEstadoActividadProyectoComponent' }  },
	{ path: 'edit-estado-actividad-proyecto/:id', component: EditEstadoActividadProyectoComponent , canActivate: [PermisoGuard], data: { componente: 'EditEstadoActividadProyectoComponent' } },
	{ path: 'create-estado-actividad-proyecto', component: CreateEstadoActividadProyectoComponent , canActivate: [PermisoGuard], data: { componente: 'CreateEstadoActividadProyectoComponent' } },
	{ path: 'actividades-proyecto', component: IndexActividadProyectoComponent, canActivate: [PermisoGuard], data: { componente: 'IndexActividadProyectoComponent' }  },
	{ path: 'edit-actividad-proyecto/:id', component: EditActividadProyectoComponent , canActivate: [PermisoGuard], data: { componente: 'EditActividadProyectoComponent' } },
	{ path: 'create-actividad-proyecto', component: CreateActividadProyectoComponent , canActivate: [PermisoGuard], data: { componente: 'CreateActividadProyectoComponent' } },
	{ path: 'direcciones-geo', component: IndexDireccionGeoComponent, canActivate: [PermisoGuard], data: { componente: 'IndexDireccionGeoComponent' }  },
	{ path: 'edit-direccion-geo/:id', component: EditDireccionGeoComponent, canActivate: [PermisoGuard], data: { componente: 'EditDireccionGeoComponent' }  },
	{ path: 'create-direccion-geo', component: CreateDireccionGeoComponent , canActivate: [PermisoGuard], data: { componente: 'CreateDireccionGeoComponent' } },
	{ path: 'permisos', component: IndexPermisosComponent }, //, canActivate: [PermisoGuard], data: { componente: 'IndexPermisosComponent' } 
	{ path: 'edit-permisos/:id', component: EditPermisosComponent, canActivate: [PermisoGuard], data: { componente: 'EditPermisosComponent' }  },
	{ path: 'create-permisos', component: CreatePermisosComponent, canActivate: [PermisoGuard], data: { componente: 'CreatePermisosComponent' }  },

	{ path: 'user-profile', component: EditUsuarioComponent , canActivate: [PermisoGuard], data: { componente: 'EditUsuarioComponent' } },

    /*{ path: '**', redirectTo: '/error' }*/
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);
