import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateActividadProyectoComponent } from '../create-actividad-proyecto/create-actividad-proyecto.component';
import { ListService } from 'src/app/services/list.service';
@Component({
  selector: 'app-index-actividad-proyecto',
  templateUrl: './index-actividad-proyecto.component.html',
  styleUrl: './index-actividad-proyecto.component.scss'
})
export class IndexActividadProyectoComponent implements OnInit {
  model:boolean=true;
  actividadPro:any={};

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
    this.listarActividadProyecto();
  }
  listarActividadProyecto(){
    const token=sessionStorage.getItem('token');
    this.listService.listarTiposActividadesProyecto(token).subscribe(response=>{
      console.log(response);
      if(response.data){
        this.actividadPro=response.data;
      }
    });
  }

  abrirModal(){
    this.modalService.dismissAll();
    this.modalService.open(CreateActividadProyectoComponent, { centered: true });
  }
}
