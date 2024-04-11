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
import { DialogService } from 'primeng/dynamicdialog';
import { App } from '@capacitor/app';
import { AdminService } from 'src/app/demo/services/admin.service';
import { filter } from 'rxjs/operators';
import { helpers } from '@turf/turf';
@Component({
  selector: 'app-index-incidentes-denuncia',
  templateUrl: './index-incidentes-denuncia.component.html',
  styleUrl: './index-incidentes-denuncia.component.scss',
  providers: [MessageService]
})
export class IndexIncidentesDenunciaComponent implements OnInit,OnChanges{
  public url = GLOBAL.url;
  constructor(private router: Router,private listService: ListService,private modalService: NgbModal,private helperservice:HelperService,private messageService: MessageService,private dialogService: DialogService,private admin:AdminService) { }
  
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


  check: any = {};
  token = this.helperservice.token();
  id = this.admin.identity(this.token);
  rol = this.admin.roluser(this.token);
  async ngOnInit(): Promise<void> {
    console.log(this.rol);
    if(!this.modal)this.helperservice.llamarspinner();
    try {
       this.check.IndexIncidentesDenunciaComponent = this.helperservice.decryptData('IndexIncidentesDenunciaComponent') || false;
      this.check.IndexEstadoIncidenteComponent = this.helperservice.decryptData('IndexEstadoIncidenteComponent') || false;
      this.check.TotalFilterIncidente = this.helperservice.decryptData('TotalFilterIncidente') || false;
      this.check.EditIncidentesDenunciaComponent = this.helperservice.decryptData('EditIncidentesDenunciaComponent') || false;
      if (!this.check.IndexIncidentesDenunciaComponent) {
        this.router.navigate(['/notfound']); 
      }
      ////console.log(this.check);
    } catch (error) {
      ////console.error('Error al verificar permisos:', error);
      this.router.navigate(['/notfound']);
    }
    await this.buscarencargos();
    this.listarIncidentesDenuncias();
    if(this.modal==false)this.helperservice.cerrarspinner();
  }
  encargos: any[] = [];
  async buscarencargos() {
    this.listService.listarEncargadosCategorias(this.token,'encargado',this.id).subscribe(response => {
      console.log(response);
      if (response.data) {
        this.encargos = response.data;
      }
    });
  }

  listarIncidentesDenuncias(): void {
     if (!this.modal) {
        this.helperservice.llamarspinner();
    }
    this.load_lista = true;
    if (!this.token) {
        throw this.router.navigate(["/auth/login"]);
    }

    let filtroServicio = '';
    let valorServicio : any;

    if (this.filtro && this.valor) {
        filtroServicio = this.filtro;
        valorServicio = this.valor;
    }

    if (!this.check.TotalFilterIncidente) {
        filtroServicio = 'ciudadano';
        valorServicio = this.id;
    }

    this.listService.listarIncidentesDenuncias(this.token, filtroServicio, valorServicio).subscribe(response => {
        if (response.data) {
          this.incidentesDenuncias = response.data;
          console.log(this.incidentesDenuncias);
            if (this.filtro && this.valor && !this.check.TotalFilterIncidente) {
                // Si hay filtro y valor, y TotalFilterIncidente es falso, filtrar manualmente
              this.incidentesDenuncias = this.incidentesDenuncias.filter((ficha: any) => ficha[this.filtro] == this.valor);
              
          }
          if (!this.check.TotalFilterIncidente) {            
            this.incidentesDenuncias = this.incidentesDenuncias.filter((ficha: any) => this.encargos.find(element=>element.categoria._id ===ficha.categoria._id));
          }
          console.log(this.incidentesDenuncias,this.check.TotalFilterIncidente,this.filtro && this.valor);
            this.load_lista = false;
        }
    }, error => {
        this.load_lista = false;
        if (error.error.message == 'InvalidToken') {
            this.router.navigate(["/auth/login"]);
        } else {
            this.messageService.add({ severity: 'error', summary: ('(' + error.status + ')').toString(), detail: error.error.message || 'Sin conexión' });
        }
    });

    if (!this.modal) {
        this.helperservice.cerrarspinner();
    }
  }
  visible: boolean = false;
  option: any;
  balanceFrozen: boolean = true;
  llamarmodal(){
    const modalRef=this.dialogService.open(IndexEstadoIncidenteComponent, {
      header: '',
      dismissableMask: true,
          width: this.isMobil() ? '100%' : '70%',
    });
    App.addListener('backButton', data => {
       modalRef.close();
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['filtro'] || changes['valor']){
      this.listarIncidentesDenuncias();
      this.height = 300;
    }
  }
  irMap(direccion:any,event:any){
    event.stopPropagation();
    ////console.log('Marcando');
    //this.helperservice.marcarlugar(direccion.latitud,direccion.longitud,'Incidente del Ciudadano');
    const carficha = document.getElementById("card-ficha");
    if (carficha) {
      carficha.addEventListener('touchend', this.onTouchEnd.bind(this));
      carficha.addEventListener('mouseup', this.onTouchEnd.bind(this));
    }    
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
  marcarsitio(direccion:any,nombre?:any) {
    this.helperservice.marcarLugar(direccion.latitud,direccion.longitud,nombre);
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
