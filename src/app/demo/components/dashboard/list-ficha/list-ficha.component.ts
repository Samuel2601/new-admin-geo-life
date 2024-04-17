import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { GLOBAL } from 'src/app/demo/services/GLOBAL';
import { HelperService } from 'src/app/demo/services/helper.service';
import { ListService } from 'src/app/demo/services/list.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-list-ficha',
  templateUrl: './list-ficha.component.html',
  styleUrl: './list-ficha.component.scss'
})
export class ListFichaComponent implements OnInit{
  public url = GLOBAL.url;
  imagenModal: any[] = [];
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
    checkstatus=[
    'danger',
    'warning',
    'danger',
    'success'];
  constructor(private dialogService: DialogService,private listService: ListService,private helper:HelperService,private router: Router,private messageService: MessageService,private config: DynamicDialogConfig,) {
    
  }
  check:any= {};
  async ngOnInit(): Promise<void> {
    if (this.config && this.config.data && this.config.data.valor) {
      this.valor = this.config.data.valor;
    }
    if (this.config && this.config.data && this.config.data.filtro) {
      this.filtro = this.config.data.filtro;
    }
    if (this.config && this.config.data && this.config.data.valor) {
      this.actividad = this.config.data.actividad;
    }
    console.log(this.valor,this.filtro,this.actividad);
    try {
       this.check.IndexIncidentesDenunciaComponent = this.helper.decryptData('IndexIncidentesDenunciaComponent') || false;
      this.check.IndexEstadoIncidenteComponent = this.helper.decryptData('IndexEstadoIncidenteComponent') || false;
      if (!this.check.IndexIncidentesDenunciaComponent) {
        this.router.navigate(['/notfound']); 
      }
      ////console.log(this.check);
    } catch (error) {
      ////console.error('Error al verificar permisos:', error);
      this.router.navigate(['/notfound']);
    }
  
    this.listarIncidentesDenuncias();
  }
    token=this.helper.token();
    listarIncidentesDenuncias(): void {
    this.load_lista=true;
    if(!this.token){
      throw this.router.navigate(["/auth/login"]);
    }

    if(this.filtro&&this.valor){
      this.listService.listarFichaSectorial(this.token,this.filtro,this.valor).subscribe(response=>{
        console.log(response);
        if(response.data){
          this.incidentesDenuncias = response.data;
          this.incidentesDenuncias = this.incidentesDenuncias.filter((element:any)=>element.actividad.nombre == this.actividad);
          this.load_lista=false;
        }
      },error=>{
        //console.error(error);
        this.load_lista=false;
        if(error.error.message=='InvalidToken'){
          this.router.navigate(["/auth/login"]);
        }else{
         this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
        }  
      });
    }else{
      this.listService.listarFichaSectorial(this.token).subscribe(response=>{
        ////console.log(response);
        this.incidentesDenuncias=response.data;
        this.load_lista=false;
      },error=>{
        //console.error(error);
        this.load_lista=false;
        if(error.error.message=='InvalidToken'){
            this.router.navigate(["/auth/login"]);
          }else{
            this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
          }
      });
    }
  }
  vermodal: boolean = false;
  valor: string = '';
  filtro: string = '';
  actividad: string = '';
  load_lista=true;
  incidentesDenuncias:any=[];
  clear(table: Table) {
    table.clear();
  }
  openModal(content: any) {
   // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  irMap(direccion:any,event:any){
    event.stopPropagation();
    ////console.log('Marcando');
    //this.helperservice.marcarlugar(direccion.latitud,direccion.longitud,'Incidente del Ciudadano');   
  }
  openModalimagen(url: any) {
    this.imagenModal = url;
    this.imagenAMostrar = this.imagenModal[0];
    //const this.ref = this.modalService.open(this.modalContent, { size: 'lg' });
  }
  imagenAMostrar: any;
    isMobil() {
    return this.helper.isMobil();
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
   openimagen(url: any) {
    this.imagenModal = url;
     this.imagenAMostrar = this.imagenModal[0];
     App.addListener('backButton', data => {
       this.displayBasic = false;
      });
    //const this.ref = this.dialogService.open(this.modalContent, { size: 'lg' });
  }
  opendialog(incidente:any) {
    this.visible = true;
    this.option = incidente;
     App.addListener('backButton', data => {
       this.visible = false;
      });
  }
  option: any;
  visible: boolean = false;
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
}
