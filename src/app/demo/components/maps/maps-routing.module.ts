import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayersComponent } from './layers/layers.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LayersComponent }
        //{ path: 'error', loadChildren: () => import('./layers/layers.component').then(m => m.LayersComponent) },
    ])],
    exports: [RouterModule]
})
export class MapsRoutingModule { }
