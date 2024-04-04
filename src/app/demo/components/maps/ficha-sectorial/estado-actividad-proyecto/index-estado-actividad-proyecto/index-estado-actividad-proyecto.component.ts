import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEstadoActividadProyectoComponent } from '../create-estado-actividad-proyecto/create-estado-actividad-proyecto.component';
import { Router } from '@angular/router';
import { ListService } from 'src/app/demo/services/list.service';
import { HelperService } from 'src/app/demo/services/helper.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-index-estado-actividad-proyecto',
  templateUrl: './index-estado-actividad-proyecto.component.html',
  styleUrl: './index-estado-actividad-proyecto.component.scss'
})
export class IndexEstadoActividadProyectoComponent implements OnInit{
  actividadEstado:any=[];
  model:boolean=true;
  constructor(private dialogService: DialogService,private router: Router,private listService:ListService,private helper:HelperService){
   
  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      // Verificar la ruta actual y ajustar el valor de model
      if (this.router.url === '/create-estado-incidente') {
        this.model = false; // Si la ruta es /create-estado-incidente, model es false
      } else {
        this.model = true; // En cualquier otra ruta, model es true
      }
    });
    this.listarestadoser();
  }
  token=this.helper.token();
  listarestadoser(){
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listService.listarEstadosActividadesProyecto(this.token).subscribe(response=>{
      if(response.data){
        this.actividadEstado=response.data
      }
    },error=>{

    });
  }
   isMobil() {
    return this.helper.isMobil();
  }
  abrirModal(){
    this.dialogService.open(CreateEstadoActividadProyectoComponent,  {
        header: 'Nuevo Estado de Actividad Proyecto',
        width: this.isMobil() ? '100%' : '50%',
    });
  }
}
