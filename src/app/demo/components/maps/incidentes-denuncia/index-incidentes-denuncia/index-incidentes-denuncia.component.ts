import { Component, OnInit, ViewChild, TemplateRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/app/demo/services/list.service';
import { IndexEstadoIncidenteComponent } from '../estado-incidente/index-estado-incidente/index-estado-incidente.component';
import { GLOBAL } from 'src/app/demo/services/GLOBAL';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/demo/services/helper.service';
import { Capacitor } from '@capacitor/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-index-incidentes-denuncia',
  templateUrl: './index-incidentes-denuncia.component.html',
  styleUrl: './index-incidentes-denuncia.component.scss',
  providers: [MessageService]
})
export class IndexIncidentesDenunciaComponent implements OnInit,OnChanges{
  public url = GLOBAL.url;
  constructor(private router: Router,private listService: ListService,private modalService: NgbModal,private helperservice:HelperService,private messageService: MessageService,) { }
  
  load_lista=true;

  @Input() filtro: string | undefined;
  @Input() valor: number | undefined;
  @Input() modal: any = false;

  deshabilitarMapaDesdeIndexFichaSectorial(event: MouseEvent) {
    this.stopPropagation(event);
    this.helperservice.deshabilitarMapa();
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
  private initialTouchY: number=0;
  private isDragging: boolean = false;
  
  get vermodal():boolean{
    if(this.modal){
      return this.modal
    }else{
      return false;
    }
  }
  set vermodal(val: boolean){  
    this.helperservice.cerrarincidente();
  }

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
    return this.helperservice.isMobil();
  }

  checkstatus=[
    'danger',
    'warning',
    'danger',
    'success'];
  
  @ViewChild('contentimage') modalContent: TemplateRef<any> | undefined;
  incidentesDenuncias:any=[];


  check:any={};
  async ngOnInit(): Promise<void> {
    if(!this.modal)this.helperservice.llamarspinner();
    try {
      this.check.IndexEstadoIncidenteComponent = this.helperservice.decryptData('IndexEstadoIncidenteComponent')  || false;
      //console.log(this.check);
    } catch (error) {
      //console.error('Error al verificar permisos:', error);
      this.router.navigate(['/error']);
    }
  
    this.listarIncidentesDenuncias();
    if(this.modal==false)this.helperservice.cerrarspinner();
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
  irMap(direccion:any,event:any){
    event.stopPropagation();
    //console.log('Marcando');
    //this.helperservice.marcarlugar(direccion.latitud,direccion.longitud,'Incidente del Ciudadano');
    const carficha = document.getElementById("card-ficha");
    if (carficha) {
      carficha.addEventListener('touchend', this.onTouchEnd.bind(this));
      carficha.addEventListener('mouseup', this.onTouchEnd.bind(this));
    }    
  }
  token=this.helperservice.token();
  listarIncidentesDenuncias(): void {
    if(this.modal==false)this.helperservice.llamarspinner();
    this.load_lista=true;
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }

    if(this.filtro&&this.valor){
      this.listService.listarIncidentesDenuncias(this.token,this.filtro,this.valor,true).subscribe(response=>{
        //console.log(response);
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
         this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
        }  
      });
    }else{
      this.listService.listarIncidentesDenuncias(this.token).subscribe(response=>{
        //console.log(response);
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
    if(this.modal==false)this.helperservice.cerrarspinner();
  }

  imagenModal: any[] = [];
  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  openModalimagen(url: any) {
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
}
