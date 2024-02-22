import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEstadoActividadProyectoComponent } from '../create-estado-actividad-proyecto/create-estado-actividad-proyecto.component';
import { Router } from '@angular/router';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-index-estado-actividad-proyecto',
  templateUrl: './index-estado-actividad-proyecto.component.html',
  styleUrl: './index-estado-actividad-proyecto.component.scss'
})
export class IndexEstadoActividadProyectoComponent implements OnInit{
  actividadEstado:any={};
  model:boolean=true;
  constructor(private modalService: NgbModal,private router: Router,private listService:ListService){
   
  }
  cerrarModal() {
    this.modalService.dismissAll();
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
  listarestadoser(){
    const token = sessionStorage.getItem('token');
    this.listService.listarEstadosActividadesProyecto(token).subscribe(response=>{
      if(response.data){
        this.actividadEstado=response.data
      }
    },error=>{

    });
  }
  abrirModal(){
    this.modalService.dismissAll();
    this.modalService.open(CreateEstadoActividadProyectoComponent, { centered: true });
  }
}
