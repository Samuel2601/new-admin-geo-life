import { Component, OnInit, ViewChild, TemplateRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/app/services/list.service';
import { IndexEstadoIncidenteComponent } from '../../estado-incidente/index-estado-incidente/index-estado-incidente.component';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { Router } from '@angular/router';
import iziToast from 'izitoast';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-index-incidentes-denuncia',
  templateUrl: './index-incidentes-denuncia.component.html',
  styleUrl: './index-incidentes-denuncia.component.scss'
})
export class IndexIncidentesDenunciaComponent implements OnInit,OnChanges{
  public url = GLOBAL.url;
  constructor(private router: Router,private listService: ListService,private modalService: NgbModal,private heleperservice:HelperService) { }
  
  load_lista=true;

  @Input() filtro: string | undefined;
  @Input() valor: number | undefined;
  @Input() modal: boolean = false;

  deshabilitarMapaDesdeIndexFichaSectorial() {
    this.heleperservice.deshabilitarMapa();
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
  private initialTouchY: number=0;
  private isDragging: boolean = false;


  onTouchStart(event: TouchEvent) {
    this.initialTouchY = event.touches[0].clientY;
    this.isDragging = true;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) {
      return;
    }

    // Calcula la distancia vertical del arrastre
    const deltaY = event.touches[0].clientY - this.initialTouchY;

    // Realiza acciones según la distancia vertical
    // Por ejemplo, cambiar la altura del elemento
    // o realizar alguna otra acción de acuerdo a tu necesidad
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  isMobil() {
    const screenWidth = window.innerWidth;
    return screenWidth < 768; // Cambia este valor según el ancho que consideres como límite para dispositivos móviles
  }

  checkstatus=[
    'danger',
    'warning',
    'danger',
    'success'];
  
  @ViewChild('contentimage') modalContent: TemplateRef<any> | undefined;
  incidentesDenuncias:any=[];

  ngOnInit(): void {
    this.listarIncidentesDenuncias();
  }
  llamarmodal(){
    this.modalService.dismissAll();
    this.modalService.open(IndexEstadoIncidenteComponent, { centered: true });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['filtro'] || changes['valor']){
      this.listarIncidentesDenuncias();
      this.height = 300;
    }
  }

  listarIncidentesDenuncias(): void {
    this.load_lista=true;
    const token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
    if(!token){
      throw this.router.navigate(["/inicio"]);
    }

    if(this.filtro&&this.valor){
      this.listService.listarIncidentesDenuncias(token,this.filtro,this.valor).subscribe(response=>{
        console.log(response);
        if(response.data){
          this.incidentesDenuncias=response.data;
          this.load_lista=false;
        }
      },error=>{
        console.error(error);
        this.load_lista=false;
        if(error.error.message=='InvalidToken'){
          this.router.navigate(["/inicio"]);
        }else{
          iziToast.error({
            title:'Error',
            message:'Sin Conexión a la Base de Datos'
          });
        }  
      });
    }else{
      this.listService.listarIncidentesDenuncias(token).subscribe(response=>{
        console.log(response);
        this.incidentesDenuncias=response.data;
        this.load_lista=false;
      },error=>{
        console.error(error);
        this.load_lista=false;
        if(error.error.message=='InvalidToken'){
            this.router.navigate(["/inicio"]);
          }else{
            iziToast.error({
              title:'Error',
              message:'Sin Conexión a la Base de Datos'
            });
          }
      });
    }
  }

  imagenModal: string='';
  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  openModalimagen(url: string) {
    this.imagenModal = url;
    const modalRef = this.modalService.open(this.modalContent, { size: 'lg' });
  }

}
