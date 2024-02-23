import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/app/services/list.service';
import { IndexEstadoIncidenteComponent } from '../../estado-incidente/index-estado-incidente/index-estado-incidente.component';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { Router } from '@angular/router';
import iziToast from 'izitoast';

@Component({
  selector: 'app-index-incidentes-denuncia',
  templateUrl: './index-incidentes-denuncia.component.html',
  styleUrl: './index-incidentes-denuncia.component.scss'
})
export class IndexIncidentesDenunciaComponent implements OnInit{
  @ViewChild('content') modalContent: TemplateRef<any> | undefined;
  incidentesDenuncias=[];
  public url = GLOBAL.url;
  constructor(private router: Router,private listService: ListService,private modalService: NgbModal) { }
  ngOnInit(): void {
    this.listarIncidentesDenuncias();
  }
  llamarmodal(){
    this.modalService.dismissAll();
    this.modalService.open(IndexEstadoIncidenteComponent, { centered: true });
  }
  listarIncidentesDenuncias(): void {
    const token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
    this.listService.listarIncidentesDenuncias(token).subscribe(
      response => {
        this.incidentesDenuncias = response.data;
        console.log(response.data);
      },
      error => {
        console.log(error);
        if(error.error.message=='InvalidToken'){
          this.router.navigate(["/inicio"]);
        }else{
          iziToast.error({
            title:'Error',
            message:'Sin Conexión a la Base de Datos'
          });
        }
      }
    );
  }
  imagenModal: string='';
  openModal(url: string) {
    this.imagenModal = url;
    const modalRef = this.modalService.open(this.modalContent, { size: 'lg' });
  }

}
