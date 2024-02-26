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
  
    this.imagenSeleccionada = `data:image/jpeg;base64,${image.base64String}`;
    this.file = this.base64ToFile(image.base64String, 'imagen.jpg');
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

  imagenSeleccionada: any;
  public file: any = undefined;


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
        this.imagenSeleccionada = reader.result;
      };
      reader.readAsDataURL(file);
      this.file=file;
    }
  }

  
  crearIncidenteDenuncia(): void {
    const token = sessionStorage.getItem('token');
    
    this.nuevoIncidenteDenuncia.ciudadano=this.adminservice.identity(token);
    
    console.log(this.nuevoIncidenteDenuncia);
    if(this.isMobil()){      
      this.createService.registrarIncidenteDenunciaAPP(token, this.nuevoIncidenteDenuncia,this.file).subscribe(response => {
        // Manejar la respuesta del servidor
        console.log(response);
        if(response.data){
          iziToast.success({
            title:'Listo',
            message:'Ingresado correctamente'
          });
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
            message:'Sin Conexión a la Base de Datos'
          });
        }
      });
    }else{
      this.createService.registrarIncidenteDenuncia(token, this.nuevoIncidenteDenuncia,this.file).subscribe(response => {
        // Manejar la respuesta del servidor
        console.log(response);
        if(response.data){
          iziToast.success({
            title:'Listo',
            message:'Ingresado correctamente'
          });
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
            message:'Sin Conexión a la Base de Datos'
          });
        }
      });
    }
   

  }
}
