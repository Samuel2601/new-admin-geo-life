import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListService } from 'src/app/demo/services/list.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEstadoIncidenteComponent } from '../create-estado-incidente/create-estado-incidente.component';
import { HelperService } from 'src/app/demo/services/helper.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-index-estado-incidente',
  templateUrl: './index-estado-incidente.component.html',
  styleUrl: './index-estado-incidente.component.scss',
   providers: [MessageService]
})
export class IndexEstadoIncidenteComponent implements OnInit {
  incidentesDenuncias: any[] = [];
  model: boolean=true;
  load_lista:boolean=true;
  constructor(private fb: FormBuilder,private listarService:ListService,private router: Router,private modalService: NgbModal,private helper:HelperService,private messageService: MessageService){

  }
  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      // Verificar la ruta actual y ajustar el valor de model
      if (this.router.url === '/estados-incidente') {
        this.model = false; // Si la ruta es /create-estado-incidente, model es false
      } else {
        this.model = true; // En cualquier otra ruta, model es true
      }
    });
    this.listartEstados();
  }
  token=this.helper.token();
  listartEstados(){
    this.load_lista=true;
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listarService.listarEstadosIncidentes(this.token).subscribe(response=>{
      console.log(response);
      this.incidentesDenuncias=response.data;
      this.load_lista=false;
    },error=>{
      console.error(error);
      this.load_lista=false;
      if(error.error.message=='InvalidToken'){
        this.router.navigate(["/inicio"]);
      }else{
        this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
      }      
    });
  }
  abrirSegundoModal() {
    this.modalService.dismissAll();
    this.modalService.open(CreateEstadoIncidenteComponent, { centered: true });
  }

  abrirModal() {
    this.model = true; // Cambia model a true cuando se abre el modal
  }

  cerrarModal() {
    this.model = false; // Cambia model a false cuando se cierra el modal
  }
}
