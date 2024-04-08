import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateActividadProyectoComponent } from '../create-actividad-proyecto/create-actividad-proyecto.component';
import { ListService } from 'src/app/demo/services/list.service';
import { HelperService } from 'src/app/demo/services/helper.service';
import { DialogService } from 'primeng/dynamicdialog';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-index-actividad-proyecto',
  templateUrl: './index-actividad-proyecto.component.html',
  styleUrl: './index-actividad-proyecto.component.scss'
})
export class IndexActividadProyectoComponent implements OnInit {
  model:boolean=true;
  actividadPro:any=[];

  constructor(private modalService: NgbModal,private router: Router,private listService:ListService,private helper:HelperService,private dialogService: DialogService){

  }
  cerrarModal() {
    this.modalService.dismissAll();
  }
  check:any={};
  ngOnInit(): void {
    this.check.CreateActividadProyectoComponent = this.helper.decryptData('CreateActividadProyectoComponent') || false;
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
  token=this.helper.token();
  listarActividadProyecto(){
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listService.listarTiposActividadesProyecto(this.token).subscribe(response=>{
      //console.log(response);
      if(response.data){
        this.actividadPro=response.data;
      }
    });
  }
 isMobil() {
    return this.helper.isMobil();
  }
  abrirModal(){
    const modalRef=this.dialogService.open(CreateActividadProyectoComponent,  {
        header: 'Nueva Actividad',
        width: this.isMobil() ? '100%' : '50%',
    });
    App.addListener('backButton', data => {
       modalRef.close();
    });
  }
}
