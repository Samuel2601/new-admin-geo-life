import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateService } from 'src/app/services/create.service';
import { ListService } from 'src/app/services/list.service';
import { AdminService } from 'src/app/services/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import iziToast from 'izitoast';
import { Capacitor } from '@capacitor/core';
import { HelperService } from 'src/app/services/helper.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-create-ficha-sectorial',
  templateUrl: './create-ficha-sectorial.component.html',
  styleUrl: './create-ficha-sectorial.component.scss'
})
export class CreateFichaSectorialComponent implements OnInit {
  fichaSectorialForm: FormGroup<any>;
  estadosActividadProyecto:any=[];
  actividadesProyecto:any=[];
  model: boolean=true;
  data:any
  constructor(private modalService: NgbModal,private fb: FormBuilder,private createService:CreateService,private router: Router,private listarService:ListService,private adminservice:AdminService,private helper:HelperService,private messageService: MessageService){
    this.fichaSectorialForm = this.fb.group({
      descripcion: ['', Validators.required],
      encargado: ['', Validators.required],
      direccion_geo: ['', Validators.required],
      estado: ['', Validators.required],
      actividad: ['', Validators.required],
      fecha_evento: [''],
      observacion: ['']
    });
  }
  token=this.helper.token();
  ngOnInit(): void {
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }
    
    if (this.data) {
      const direccionGeoControl = this.fichaSectorialForm.get('direccion_geo');
      if (direccionGeoControl) {
        direccionGeoControl.setValue(this.data.properties.nombre);
      } else {
        console.error('El control "direccion_geo" no está definido en el formulario.');
      }
    } else {
      this.router.navigate(['/home']);
    }
    const ident=this.adminservice.identity(this.token);
    if (ident) {
      const indentr = this.fichaSectorialForm.get('encargado');
      if (indentr) {
        indentr.setValue(ident);
      } else {
        console.error('El control "direccion_geo" no está definido en el formulario.');
      }
    } else {
      this.router.navigate(['/inicio']);
    }

    this.router.events.subscribe((val) => {
      // Verificar la ruta actual y ajustar el valor de model
      if (this.router.url === '/create-ficha-sectorial') {
        this.model = false; // Si la ruta es /create-estado-incidente, model es false
      } else {
        this.model = true; // En cualquier otra ruta, model es true
      }
    });
    this.listartEstados();
    this.listarActividadProyecto();
  }
  listartEstados(){
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listarService.listarEstadosActividadesProyecto(this.token).subscribe(response=>{
      console.log(response);
      if(response.data.length>0){
        this.estadosActividadProyecto=response.data;
      }
    },error=>{
      console.error(error);
      if(error.error.message=='InvalidToken'){
        this.router.navigate(["/inicio"]);
      }else{
        iziToast.error({
          title: ('('+error.status+')').toString(),
          position: 'bottomRight',
          message: error.error.message,
        });
      }
    });
  }

  listarActividadProyecto(){
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listarService.listarTiposActividadesProyecto(this.token).subscribe(response=>{
      console.log(response);
      if(response.data.length>0){
        this.actividadesProyecto=response.data;
      }
    },error=>{
      console.error(error);
      if(error.error.message=='InvalidToken'){
        this.router.navigate(["/inicio"]);
      }else{
        iziToast.error({
          title: ('('+error.status+')').toString(),
          position: 'bottomRight',
          message: error.error.message,
        });
      }
    });
  }
  DimissModal(){
    this.modalService.dismissAll();
  }

  abrirModal() {
    this.model = true; // Cambia model a true cuando se abre el modal
  }

  cerrarModal() {
    this.model = false; // Cambia model a false cuando se cierra el modal
  }
  hover = false;
  nombreArchivo: any;
  archivoSeleccionado: File | any;

  activarHover() {
    this.hover = true;
  }

  desactivarHover() {
    this.hover = false;
  }
  isMobil() {
    return this.helper.isMobil();
  }
  
  imagenesSeleccionadas:Array<any>=[];
  load_carrusel=false;
  public file:Array<any> = [];
  selectedFiles: File[] = [];
  upload=true;
  responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
  ];
  onFilesSelected(event: any): void {
    this.load_carrusel=false;
    console.log(event);
    this.load_carrusel = false;
    const files: FileList = event.files;

    for(let file of event.files) {
      this.selectedFiles.push(file);
      const objectURL = URL.createObjectURL(file);
      this.imagenesSeleccionadas.push({ itemImageSrc: objectURL });
    }

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: this.selectedFiles.length+'Imagenes subidas'});

    console.log(this.selectedFiles,this.imagenesSeleccionadas );
    setTimeout(() => {
      this.upload=false;
    this.load_carrusel=true;
    }, 1000);
    /*
    const files: FileList = event.target.files;
    console.log(files);
    if(!this.isMobil()){
      this.imagenesSeleccionadas=[];
      this.selectedFiles=[];
    }
    if (files && files.length > 0) {
      for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          alert('Por favor, seleccione archivos de imagen.');
          return;
        }
        if (file.size > 4 * 1024 * 1024) {
          alert('Por favor, seleccione archivos de imagen que sean menores a 4MB.');
          return;
        }
  
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenesSeleccionadas.push(e.target.result);
        };
        reader.readAsDataURL(file);
        this.selectedFiles.push(file);        
      }
      setTimeout(() => {        
        this.load_carrusel = true;
      }, 500);
    }*/
  }
  
  eliminarImagen(index: number) {
    this.load_carrusel = false;
    this.imagenesSeleccionadas.splice(index, 1);
     // Eliminar la imagen del arreglo selectedFiles
    this.selectedFiles.splice(index, 1);
    console.log(this.selectedFiles,this.imagenesSeleccionadas);
    setTimeout(() => {        
      this.load_carrusel = true;
    }, 500);
  }
  load_form=true;

  registrarFichaSectorial() {
    this.load_form=false;
    if (this.fichaSectorialForm?.valid) {
      if (this.token && this.fichaSectorialForm.value) {
        this.createService.registrarActividadProyecto(this.token, this.fichaSectorialForm.value,this.selectedFiles).subscribe(response => {
          console.log(response);
          if(response.data){
            iziToast.success({
              title:'Listo',
              message:'Ingresado correctamente'
            });
            this.modalService.dismissAll();
          }
        }, error => {
          console.error(error);
          if(error.error.message=='InvalidToken'){
            this.router.navigate(["/inicio"]);
          }else{
            iziToast.error({
              title: ('('+error.status+')').toString(),
              position: 'bottomRight',
              message: error.error.message,
            });
          } 
        });
      }else{
        if(!this.token){
          throw this.router.navigate(["/inicio"]);
        }
      }
    }else{
      console.log(this.fichaSectorialForm.valid);
    }
  }
  responsiveimage():string{
    return (window.innerWidth-50).toString();
   }
}
