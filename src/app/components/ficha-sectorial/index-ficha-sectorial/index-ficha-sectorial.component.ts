import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/app/services/list.service';
import { IndexEstadoActividadProyectoComponent } from '../../estado-actividad-proyecto/index-estado-actividad-proyecto/index-estado-actividad-proyecto.component';
import { IndexActividadProyectoComponent } from '../../actividad-proyecto/index-actividad-proyecto/index-actividad-proyecto.component';
import { HelperService } from 'src/app/services/helper.service';
@Component({
  selector: 'app-index-ficha-sectorial',
  templateUrl: './index-ficha-sectorial.component.html',
  styleUrl: './index-ficha-sectorial.component.scss'
})
export class IndexFichaSectorialComponent implements OnInit,OnChanges {

  @Input() filtro: string | undefined;
  @Input() valor: number | undefined;
  @Input() modal: boolean = false;

  deshabilitarMapaDesdeIndexFichaSectorial() {
    this.heleperservice.deshabilitarMapa();
  }
  
  fichasectorial:any=[];
  constructor(private listService:ListService,private modalService: NgbModal,private heleperservice:HelperService){
  
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['filtro'] || changes['valor']){
      this.listarficha();
      this.height = 300;
    }
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

  width = 200; // Ancho inicial de la componente
  height = 200; // Altura inicial de la componente
  isResizing = false; // Indicador de si se está redimensionando

  startResize(event: MouseEvent | TouchEvent): void {
    let initialY=0;
    if (event instanceof MouseEvent) {
      initialY = (event as MouseEvent).clientY;
    } else if (event instanceof TouchEvent) {
      initialY = (event as TouchEvent).touches[0].clientY;
    }

    const mouseMoveListener = (moveEvent: MouseEvent | TouchEvent) => {
      let currentY=0;
      if (moveEvent instanceof MouseEvent) {
        currentY = (moveEvent as MouseEvent).clientY;
      } else if (moveEvent instanceof TouchEvent) {
        currentY = (moveEvent as TouchEvent).touches[0].clientY;
      }

      this.height += initialY - currentY;
      initialY = currentY;
    };

    const mouseUpListener = () => {
      document.removeEventListener('mousemove', mouseMoveListener);
      document.removeEventListener('touchmove', mouseMoveListener);
      document.removeEventListener('mouseup', mouseUpListener);
      document.removeEventListener('touchend', mouseUpListener);
    };

    document.addEventListener('mousemove', mouseMoveListener);
    document.addEventListener('touchmove', mouseMoveListener);
    document.addEventListener('mouseup', mouseUpListener);
    document.addEventListener('touchend', mouseUpListener);
  }

  cerrarmodal() {
    
  }
  
}
