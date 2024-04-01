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

import { LayersComponent } from './layers/layers.component';
import { IndexIncidentesDenunciaComponent } from './incidentes-denuncia/index-incidentes-denuncia/index-incidentes-denuncia.component';
import { IndexEstadoIncidenteComponent } from './incidentes-denuncia/estado-incidente/index-estado-incidente/index-estado-incidente.component';
import { CreateEstadoIncidenteComponent } from './incidentes-denuncia/estado-incidente/create-estado-incidente/create-estado-incidente.component';

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
    GalleriaModule
  ],
  declarations: [LayersComponent, IndexIncidentesDenunciaComponent,
    IndexEstadoIncidenteComponent,
  CreateEstadoIncidenteComponent],
})
export class MapsModule { }
