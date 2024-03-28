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
    ToastModule
  ],
  declarations: [LayersComponent],
})
export class MapsModule { }
