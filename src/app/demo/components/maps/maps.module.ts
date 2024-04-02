import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsRoutingModule } from './maps-routing.module';

import { SidebarModule } from 'primeng/sidebar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SpeedDialModule } from 'primeng/speeddial';


import { GoogleMapsModule } from '@angular/google-maps';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TreeTableModule } from 'primeng/treetable';
import { StepperModule } from 'primeng/stepper';

import { LayersComponent } from './layers/layers.component';
import { IndexIncidentesDenunciaComponent } from './incidentes-denuncia/index-incidentes-denuncia/index-incidentes-denuncia.component';
import { IndexEstadoIncidenteComponent } from './incidentes-denuncia/estado-incidente/index-estado-incidente/index-estado-incidente.component';
import { CreateEstadoIncidenteComponent } from './incidentes-denuncia/estado-incidente/create-estado-incidente/create-estado-incidente.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { IndexFichaSectorialComponent } from './ficha-sectorial/index-ficha-sectorial/index-ficha-sectorial.component';
import { IndexEstadoActividadProyectoComponent } from './ficha-sectorial/estado-actividad-proyecto/index-estado-actividad-proyecto/index-estado-actividad-proyecto.component';
import { CreateEstadoActividadProyectoComponent } from './ficha-sectorial/estado-actividad-proyecto/create-estado-actividad-proyecto/create-estado-actividad-proyecto.component';
import { IndexActividadProyectoComponent } from './ficha-sectorial/actividad-proyecto/index-actividad-proyecto/index-actividad-proyecto.component';
import { CreateActividadProyectoComponent } from './ficha-sectorial/actividad-proyecto/create-actividad-proyecto/create-actividad-proyecto.component';
import { CreateIncidentesDenunciaComponent } from './incidentes-denuncia/create-incidentes-denuncia/create-incidentes-denuncia.component';
import { CreateFichaSectorialComponent } from './ficha-sectorial/create-ficha-sectorial/create-ficha-sectorial.component';
import { IndexCategoriaComponent } from './categoria/index-categoria/index-categoria.component';
import { CreateCategoriaComponent } from './categoria/create-categoria/create-categoria.component';
import { EditCategoriaComponent } from './categoria/edit-categoria/edit-categoria.component';
import { CreateSubcategoriaComponent } from './categoria/sub/create-subcategoria/create-subcategoria.component';
import { IndexSubcategoriaComponent } from './categoria/sub/index-subcategoria/index-subcategoria.component';
import { EditSubcategoriaComponent } from './categoria/sub/edit-subcategoria/edit-subcategoria.component';

@NgModule({  
  imports: [
    CommonModule,
    MapsRoutingModule,
    SidebarModule,
    InputGroupModule,
    InputGroupAddonModule,
    IconFieldModule,
    InputIconModule,
    SpeedDialModule,
    GoogleMapsModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    TableModule,
    DialogModule,
    TagModule,
    GalleriaModule,
    ImageModule,
    FileUploadModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    DashboardModule,
    SkeletonModule,
    TreeTableModule,
    StepperModule
  ],
  declarations: [LayersComponent, IndexIncidentesDenunciaComponent,
    IndexEstadoIncidenteComponent,
    CreateEstadoIncidenteComponent,  
    IndexFichaSectorialComponent,
    IndexEstadoActividadProyectoComponent,
    CreateEstadoActividadProyectoComponent,
    IndexActividadProyectoComponent,
    CreateActividadProyectoComponent,
    CreateIncidentesDenunciaComponent,
    CreateFichaSectorialComponent,
    IndexCategoriaComponent,
    CreateCategoriaComponent,
    EditCategoriaComponent,
    CreateSubcategoriaComponent,
    IndexSubcategoriaComponent,
    EditSubcategoriaComponent
  ],
})
export class MapsModule { }
