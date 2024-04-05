import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateService } from 'src/app/demo/services/create.service';
import { ListService } from 'src/app/demo/services/list.service';
import { AdminService } from 'src/app/demo/services/admin.service';
import { Router } from '@angular/router';
import { Plugins, Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { HelperService } from 'src/app/demo/services/helper.service';
import { MessageService } from 'primeng/api';
const { Geolocation } = Plugins;
import { GalleriaModule } from 'primeng/galleria';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-create-incidentes-denuncia',
  templateUrl: './create-incidentes-denuncia.component.html',
  styleUrl: './create-incidentes-denuncia.component.scss',
  providers: [MessageService]
})
export class CreateIncidentesDenunciaComponent implements OnInit{

  nuevoIncidenteDenuncia:any={};
  categorias: any[] =[];
  subcategorias: any[] =[];
  model: boolean=true;
  constructor(private fb: FormBuilder,
    private createService:CreateService,
    private router: Router,
    private listService: ListService,
    private adminservice:AdminService,
    private helper:HelperService,
    private messageService: MessageService,
    private config: DynamicDialogConfig,
    ){
    this.nuevoIncidenteDenuncia = this.fb.group({
      categoria: ['', Validators.required],
      subcategoria: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }
  data:any
  direccion:any
  geolocation:any;
  mostrar: boolean = false;

  DimissModal() {
    //this.modalService.dismissAll();
  }

  async checkPermissions() {
    const result = await  Geolocation['requestPermissions']();
    if (result.location === 'granted') {
      //console.log('Permiso de ubicación concedido');
    } else {
      //console.log('Permiso de ubicación denegado');
    }
  }
  async tomarFoto() {
    const image:any = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      promptLabelPhoto: 'Tomar foto',
      promptLabelPicture: 'Seleccionar de la galería',
    });
  
    this.imagenesSeleccionadas.push({itemImageSrc: `data:image/jpeg;base64,${image.base64String}`});
    this.file.push(this.base64ToFile(image.base64String, 'imagen.jpg'));
  }
  
  base64ToFile(dataURI: string, fileName: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
  
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    return new File([blob], fileName, { type: 'image/jpeg' });
  }
  async obtenerDireccion(latitud:any, longitud:any) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
             this.geolocation = data;
            //console.log('Dirección:', data,data.display_name);
            return data;
        })
        .catch(error => {
            //console.error('Error al realizar la solicitud:', error);
        });
  }
  
  async ngOnInit() {
     if (this.config && this.config.data && this.config.data.data) {
      this.data = this.config.data.data;
    }
     if (this.config && this.config.data && this.config.data.direccion) {
      this.direccion = this.config.data.direccion;
    }
    this.load_form = false;
    if (this.data) {
      this.nuevoIncidenteDenuncia.direccion_geo = { nombre: this.data.properties.nombre, latitud: this.direccion.latitud, longitud: this.direccion.longitud };
    } else {
      this.router.navigate(['/maps']); // Corregido: navigate espera un array como argumento
    }
    this.router.events.subscribe((val) => {
      // Verificar la ruta actual y ajustar el valor de model
      if (this.router.url === '/create-incidentes-denuncia') {
        this.model = false; // Si la ruta es /create-estado-incidente, model es false
      } else {
        this.model = true; // En cualquier otra ruta, model es true
      }
    });
    try {
      //this.getLocation();
      //console.log(this.data);
      //console.log(this.direccion);
      await Promise.all([
        this.obtenerDireccion(this.direccion.latitud, this.direccion.longitud),
        this.listarCategorias()
      ]);
    } finally {
      setTimeout(() => {        
        this.load_form = true;
      }, 1500);
    }
  }
  
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert('Latitude: ' + position.coords.latitude + ', Longitude: ' + position.coords.longitude);
        },
        (error) => {
          //console.error('Error getting location: ' + error.message);
        }
      );
    } else {
      //console.error('Geolocation is not supported by this browser.');
    }
  }
  token=this.helper.token();
  selectcategoria(event:any){
    if(!this.token){
      //this.modalService.dismissAll();
      throw this.router.navigate(["/inicio"]);
    }
    if (event.value) {
      const id = event.value._id;
      this.listService.listarSubcategorias(this.token,'categoria',id).subscribe(
        response => {
          //console.log(response)
          this.subcategorias = response.data;
        },
        error => {
          //console.log(error);
          if(error.error.message=='InvalidToken'){
            this.router.navigate(["/inicio"]);
          }else{
            this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
          }
        }
      );
    }    
  }
  async listarCategorias() {
    if(!this.token){
      //this.modalService.dismissAll();
      throw this.router.navigate(["/inicio"]);
    }
    this.listService.listarCategorias(this.token).subscribe(
      response => {
        this.categorias = response.data;
        //console.log(response.data);
        this.mostrar=true;
      },
      error => {
        //console.log(error);
        if(error.error.message=='InvalidToken'){
          this.router.navigate(["/inicio"]);
        }else{
          this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
        }
      }
    );
  }

  isMobil() {
    return this.helper.isMobil();
  }

  imagenesSeleccionadas: any[] =[];
  load_carrusel=false;
  upload=true;
  public file:Array<any> = [];


  onFileSelected(event: any): void {
    this.upload=true;
    this.mostrargale=false;
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, seleccione un archivo de imagen.');
          return;
      }
      if (file.size > 4 * 1024 * 1024) {
        alert('Por favor, seleccione un archivo de imagen que sea menor a 4MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenesSeleccionadas.push(reader.result);
      };
      setTimeout(() => {
        this.upload=false;
      this.mostrargale=true;
      }, 1000);
      reader.readAsDataURL(file);
      this.file.push(file);
    }
  }
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
 responsiveimage():string{
  return (window.innerWidth-50).toString();
 }

mostrargale=false;
  onFilesSelected(event: any): void {
    this.mostrargale=false;
    //console.log(event);
    this.load_carrusel = false;
    const files: FileList = event.files;

    for(let file of event.files) {
      this.selectedFiles.push(file);
      const objectURL = URL.createObjectURL(file);
      this.imagenesSeleccionadas.push({ itemImageSrc: objectURL });
    }

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: this.selectedFiles.length+'Imagenes subidas'});

    //console.log(this.selectedFiles,this.imagenesSeleccionadas );
    setTimeout(() => {
      this.upload=false;
    this.mostrargale=true;
    }, 1000);
    /*
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
    }
    */
  }
  

selectedFiles: File[] = [];

  async tomarFotoYEnviar(event: any) {
    this.load_carrusel=false;
    this.upload=true;
    this.mostrargale=false;
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      promptLabelPhoto:  'Seleccionar de la galería',
      promptLabelPicture:'Tomar foto',
    });
    if (image && image.base64String && this.selectedFiles.length<3) {
      
        const byteCharacters = atob(image.base64String);
        const byteNumbers = new Array(byteCharacters.length);
    
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Puedes ajustar el tipo según el formato de tu imagen
        let im =new File([blob], "prueba", { type: 'image/jpeg' });
        this.selectedFiles.push(im); 

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenesSeleccionadas.push({ itemImageSrc: e.target.result });
        };
        setTimeout(() => {
          this.mostrargale=true;
        }, 1000);
        reader.readAsDataURL(im);
        this.load_carrusel=true;
        
      this.upload=false;
      if(this.selectedFiles.length==2){
         this.messageService.add({severity: 'info', summary: 'MAX img', detail: 'Solo puede enviar 1 imangenes más'});
      }
    } else {
       this.messageService.add({severity: 'warning', summary: 'MAX img', detail: 'Solo puede enviar 3 imangenes'});
      this.load_carrusel=true;
      //console.error('Error al obtener la cadena base64 de la imagen.');
    }
  }

  eliminarImagen(index: number) {
    this.load_carrusel = false;
    this.imagenesSeleccionadas.splice(index, 1);
     // Eliminar la imagen del arreglo selectedFiles
    this.selectedFiles.splice(index, 1);
    //console.log(this.selectedFiles,this.imagenesSeleccionadas);
    setTimeout(() => {        
      this.load_carrusel = true;
    }, 500);
  }
  load_form:boolean=false;
  crearIncidenteDenuncia(): void {
    this.load_form=false;
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }
    //console.log(this.nuevoIncidenteDenuncia);
    this.nuevoIncidenteDenuncia.ciudadano=this.adminservice.identity(this.token);
    
    this.createService.registrarIncidenteDenuncia(this.token, this.nuevoIncidenteDenuncia,this.selectedFiles).subscribe(response => {
      // Manejar la respuesta del servidor
      //console.log(response);
      if(response.data){
       this.messageService.add({severity: 'success', summary: 'Ingresado', detail: 'Correctamente'});
        //this.modalService.dismissAll();
      }
    }, error => {
      // Manejar errores
      //console.error(error);
      if(error.error.message=='InvalidToken'){
        this.router.navigate(["/inicio"]);
      }else{
       this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
      }
    });
   

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
}
