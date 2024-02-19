import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/app/services/list.service';
import { IndexEstadoIncidenteComponent } from '../../estado-incidente/index-estado-incidente/index-estado-incidente.component';

@Component({
  selector: 'app-index-incidentes-denuncia',
  templateUrl: './index-incidentes-denuncia.component.html',
  styleUrl: './index-incidentes-denuncia.component.scss'
})
export class IndexIncidentesDenunciaComponent implements OnInit{
  incidentesDenuncias=[];
  constructor(private listService: ListService,private modalService: NgbModal) { }
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
      }
    );
  }
}
