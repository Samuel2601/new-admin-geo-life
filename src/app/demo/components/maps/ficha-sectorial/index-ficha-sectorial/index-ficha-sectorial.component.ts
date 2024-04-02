import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/app/demo/services/list.service';
import { IndexEstadoActividadProyectoComponent } from '../estado-actividad-proyecto/index-estado-actividad-proyecto/index-estado-actividad-proyecto.component';
import { IndexActividadProyectoComponent } from '../actividad-proyecto/index-actividad-proyecto/index-actividad-proyecto.component';
import { HelperService } from 'src/app/demo/services/helper.service';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/demo/services/GLOBAL';
import { Capacitor } from '@capacitor/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-index-ficha-sectorial',
  templateUrl: './index-ficha-sectorial.component.html',
  styleUrl: './index-ficha-sectorial.component.scss',
  providers: [MessageService]
})
export class IndexFichaSectorialComponent implements OnInit,OnChanges {
  public url = GLOBAL.url;
  @Input() filtro: string | undefined;
  @Input() valor: number | undefined;
  @Input() modal: boolean = false;
  @ViewChild('contentimage') modalContent: TemplateRef<any> | undefined;
  clear(table: Table) {
    table.clear();
  }
  getSeverity(status: string) {
    switch (status.toLowerCase()) {
        case 'suspendido':
            return 'danger';
  
        case 'finalizado':
            return 'success';
  
        case 'en proceso':
            return 'primary';
  
        case 'pendiente':
            return 'warning';
  
            case 'planificada':
              return 'info'; // Otra opción aquí, dependiendo de lo que desees
    
          default:
            return ''; // Otra opción aquí, dependiendo de lo que desees
    }
  }
  deshabilitarMapaDesdeIndexFichaSectorial(event: MouseEvent) {
    this.stopPropagation(event);
    this.helperservice.deshabilitarMapa();
  }
  load_lista=true;
  fichasectorial:any=[];
  constructor(private router: Router,private listService:ListService,private modalService: NgbModal,private helperservice:HelperService,private messageService: MessageService){
  
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['filtro'] || changes['valor']){
      this.listarficha();
      this.height = 300;
    }
  }
  get vermodal():boolean{
    if(this.modal){
      return this.modal
    }else{
      return false;
    }
  }
  set vermodal(val: boolean){  
    this.helperservice.cerrarficha();
  }
  check:any={};
  async ngOnInit(): Promise<void> {
    console.log(this.modal);
    if(!this.modal)this.helperservice.llamarspinner();
    try {
      this.check.IndexEstadoActividadProyectoComponent = this.helperservice.decryptData('IndexEstadoActividadProyectoComponent')  || false;
      this.check.IndexActividadProyectoComponent = this.helperservice.decryptData('IndexActividadProyectoComponent') || false;
      console.log(this.check);
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      this.router.navigate(['/error']);
    }
  
    this.listarficha();
    if(!this.modal)this.helperservice.cerrarspinner();
  }

  isMobil() {
    return this.helperservice.isMobil();
  }
  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'custom-modal' });
  }
  visible: boolean = false;
  option: any;
  token = this.helperservice.token();
  listarficha(){
    if(!this.modal)this.helperservice.llamarspinner();
    this.load_lista=true;
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }
    if(this.filtro&&this.valor){
      this.listService.listarFichaSectorial(this.token,this.filtro,this.valor).subscribe(response=>{
        console.log(response);
        if(response.data){
          this.fichasectorial=response.data;
          this.load_lista=false;
        }
      },error=>{
        console.error(error);
        this.load_lista=false;
        if(error.error.message=='InvalidToken'){
          this.router.navigate(["/inicio"]);
        }else{
           this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
        }  
      });
    }else{
      this.listService.listarFichaSectorial(this.token).subscribe(response=>{
        console.log(response);
        this.fichasectorial=response.data;
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
    if(!this.modal)this.helperservice.cerrarspinner();
  }
  llamarmodal2(){
    this.modalService.dismissAll();
    this.modalService.open(IndexActividadProyectoComponent, { centered: true });
  }
  llamarmodal(){
    this.modalService.dismissAll();
    this.modalService.open(IndexEstadoActividadProyectoComponent, { centered: true });
  }
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
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
  
  imagenModal: any[] = [];

  openModalimagen(url: any) {
    this.imagenModal = url;
     console.log('imagenModal',this.imagenModal);
    this.imagenAMostrar = this.imagenModal[0];
    //const modalRef = this.modalService.open(this.modalContent, { size: 'lg' });
  }
  @Output() imagenModalChange: EventEmitter<any> = new EventEmitter<any>();
  updateImagenModal(value: any) {
    this.imagenModal = value;
    console.log('imagenModal',this.imagenModal);
    this.imagenModalChange.emit(this.imagenModal);
  }
  openimagen(url: any) {
    this.imagenModal = url;
    this.imagenAMostrar = this.imagenModal[0];
    //const modalRef = this.modalService.open(this.modalContent, { size: 'lg' });
  }
  imagenAMostrar:any;
  mostrarImagen(index: number) {
    this.imagenAMostrar = this.imagenModal[index];
    // Aquí agregamos la lógica para cambiar el índice activo del carrusel
    document.querySelectorAll('.carousel-item').forEach((el, i) => {
      if (i === index) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }
  displayBasic: boolean = false;

 
    responsiveOptions: any[] = [
      {
          breakpoint: '1500px',
          numVisible: 5
      },
      {
          breakpoint: '1024px',
          numVisible: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];

}
