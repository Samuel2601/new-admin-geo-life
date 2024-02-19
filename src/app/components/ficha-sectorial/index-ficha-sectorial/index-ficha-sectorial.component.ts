import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/app/services/list.service';
import { IndexEstadoActividadProyectoComponent } from '../../estado-actividad-proyecto/index-estado-actividad-proyecto/index-estado-actividad-proyecto.component';
import { IndexActividadProyectoComponent } from '../../actividad-proyecto/index-actividad-proyecto/index-actividad-proyecto.component';
@Component({
  selector: 'app-index-ficha-sectorial',
  templateUrl: './index-ficha-sectorial.component.html',
  styleUrl: './index-ficha-sectorial.component.scss'
})
export class IndexFichaSectorialComponent implements OnInit{
  @Input() filtro: string | undefined;
  @Input() valor: number | undefined;
  @Input() modal: boolean = false;

  fichasectorial:any={};
  constructor(private listService:ListService,private modalService: NgbModal){

  }
  ngOnInit(): void {
    this.listarficha();
  }

  listarficha(){
    const token=sessionStorage.getItem('token');
    if(this.filtro&&this.valor){
      this.listService.listarFichaSectorial(token,this.filtro,this.valor).subscribe(response=>{
        console.log(response);
        if(response.data){
          this.fichasectorial=response.data;
        }
      },error=>{
        console.error(error);
      });
    }else{
      this.listService.listarFichaSectorial(token).subscribe(response=>{
        console.log(response);
        this.fichasectorial=response.data;
      },error=>{
        console.error(error);
      });
    }
    

  }
  llamarmodal2(){
    this.modalService.dismissAll();
    this.modalService.open(IndexActividadProyectoComponent, { centered: true });
  }
  llamarmodal(){
    this.modalService.dismissAll();
    this.modalService.open(IndexEstadoActividadProyectoComponent, { centered: true });
  }
}
