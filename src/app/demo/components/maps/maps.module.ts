import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsRoutingModule } from './maps-routing.module';

import { SidebarModule } from 'primeng/sidebar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SpeedDialModule } from 'primeng/speeddial';

import { LayersComponent } from './layers/layers.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
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
    AutoCompleteModule
  ],
  declarations: [LayersComponent],
})
export class MapsModule { }
