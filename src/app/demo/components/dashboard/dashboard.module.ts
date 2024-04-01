import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { StackBarriosComponent } from './stack-barrios/stack-barrios.component';
import { StackFichasComponent } from './stack-fichas/stack-fichas.component';
import { StackIncidentesComponent } from './stack-incidentes/stack-incidentes.component';
import { StackbarriofichaComponent } from './stackbarrioficha/stackbarrioficha.component';
import { SplitterModule } from 'primeng/splitter';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        DashboardsRoutingModule,
        SplitterModule,
        ScrollPanelModule,
        TagModule
    ],
    declarations: [DashboardComponent,
        StackBarriosComponent,
        StackFichasComponent,
        StackIncidentesComponent,
        StackbarriofichaComponent
    ]
})
export class DashboardModule { }
