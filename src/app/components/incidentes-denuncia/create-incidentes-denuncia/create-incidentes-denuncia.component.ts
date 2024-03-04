import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateService } from 'src/app/services/create.service';
import { ListService } from 'src/app/services/list.service';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Plugins, Capacitor } from '@capacitor/core';
import iziToast from 'izitoast';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
const { Geolocation } = Plugins;
@Component({
  selector: 'app-create-incidentes-denuncia',
  templateUrl: './create-incidentes-denuncia.component.html',
  styleUrl: './create-incidentes-denuncia.component.scss'
})
export class CreateIncidentesDenunciaComponent implements OnInit{

  nuevoIncidenteDenuncia:any={};
  categorias: any[] =[];
  subcategorias: any[] =[];
  model: boolean=true;
  constructor(private fb: FormBuilder,
    private createService:CreateService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private listService: ListService,
    private adminservice:AdminService,
    private modalService: NgbModal
    ){
    this.nuevoIncidenteDenuncia = this.fb.group({
      categoria: ['', Validators.required],
      subcategoria: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }
  data:any
  DimissModal() {
    this.modalService.dismissAll();
  }

  async checkPermissions() {
    const result = await  Geolocation['requestPermissions']();
    if (result.location === 'granted') {
      console.log('Permiso de ubicación concedido');
    } else {
      console.log('Permiso de ubicación denegado');
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
  
    this.imagenesSeleccionadas.push( `data:image/jpeg;base64,${image.base64String}`);
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
  
  
  ngOnInit(): void {
    if (this.data) {
      this.nuevoIncidenteDenuncia.direccion_geo = this.data.properties.nombre;
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
    //this.getLocation();
    console.log(this.data);
    this.listarCategorias();
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert('Latitude: ' + position.coords.latitude + ', Longitude: ' + position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location: ' + error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  selectcategoria(target:any){
    const token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
    if(!token){
      this.modalService.dismissAll();
      throw this.router.navigate(["/inicio"]);
    }
    if(target.value){
      this.listService.listarSubcategorias(token,'categoria',target.value).subscribe(
        response => {
          console.log(response)
          this.subcategorias = response.data;
        },
        error => {
          console.log(error);
          if(error.error.message=='InvalidToken'){
            this.router.navigate(["/inicio"]);
          }else{
            iziToast.error({
              title:'Error',
              message:'Sin Conexión a la Base de Datos'
            });
          }
        }
      );
    }    
  }
  listarCategorias(): void {
    const token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
    if(!token){
      this.modalService.dismissAll();
      throw this.router.navigate(["/inicio"]);
    }
    this.listService.listarCategorias(token).subscribe(
      response => {
        this.categorias = response.data;
        console.log(response.data);
      },
      error => {
        console.log(error);
        if(error.error.message=='InvalidToken'){
          this.router.navigate(["/inicio"]);
        }else{
          iziToast.error({
            title:'Error',
            message:'Sin Conexión a la Base de Datos'
          });
        }
      }
    );
  }

  isMobil() {
    return Capacitor.isNativePlatform();
  }

  imagenesSeleccionadas:Array<any>=[];
  load_carrusel=false;
  public file:Array<any> = [];


  onFileSelected(event: any): void {
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
      reader.readAsDataURL(file);
      this.file.push(file);
    }
  }

  onFilesSelected(event: any): void {
    this.load_carrusel = false;
    const files: FileList = event.target.files;
    console.log(files);
    this.imagenesSeleccionadas=[];
    this.selectedFiles=[];
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
  }
  

selectedFiles: File[] = [];

  async tomarFotoYEnviar(event: any) {
    this.load_carrusel=false;
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
          this.imagenesSeleccionadas.push(e.target.result);
        };
        reader.readAsDataURL(im);
        this.load_carrusel=true;
      if(this.selectedFiles.length==2){
        iziToast.info({
          title:'INFO:',
          position:'bottomRight',
          message:'Solo puede enviar 1 imangenes más'
        });
      }
    } else {
      iziToast.warning({
        title:'Error:',
        position:'bottomRight',
        message:'Solo puede enviar 3 imangenes'
      });
      this.load_carrusel=true;
      console.error('Error al obtener la cadena base64 de la imagen.');
    }
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
  crearIncidenteDenuncia(): void {
    this.load_form=false;
    const token = sessionStorage.getItem('token');
    
    this.nuevoIncidenteDenuncia.ciudadano=this.adminservice.identity(token);
    
    this.createService.registrarIncidenteDenuncia(token, this.nuevoIncidenteDenuncia,this.selectedFiles).subscribe(response => {
      // Manejar la respuesta del servidor
      console.log(response);
      if(response.data){
        iziToast.success({
          title:'Listo',
          message:'Ingresado correctamente'
        });
        this.DimissModal();
        setTimeout(() => {
          this.router.navigate(["/home"]);
        }, 2000);
      }
    }, error => {
      // Manejar errores
      console.error(error);
      if(error.error.message=='InvalidToken'){
        this.router.navigate(["/inicio"]);
      }else{
        iziToast.error({
          title:'Error',
          message: error
        });
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
