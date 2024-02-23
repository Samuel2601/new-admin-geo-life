import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateService } from 'src/app/services/create.service';
import { ListService } from 'src/app/services/list.service';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Plugins, Capacitor } from '@capacitor/core';
import iziToast from 'izitoast';

const { Camera } = Plugins;

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
    
    
    console.log(this.data);
    this.listarCategorias();
  }
  selectcategoria(target:any){
    const token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
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

  imagenSeleccionada: string | ArrayBuffer | null = null;
  public file: any = undefined;

  async onCaptureImage() {
    try {
      const image = await Camera['getPhoto']({
        quality: 90,
        allowEditing: false,
      });

      this.imagenSeleccionada = image && image.base64Data;
      this.file = image;
    } catch (error) {
      console.error('Error al capturar la imagen', error);
    }
  }

  onFileSelected(event: any): void {
    if (this.isMobil()) {
     this.onCaptureImage();
    } else {
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
  }

  
  crearIncidenteDenuncia(): void {
    const token = sessionStorage.getItem('token');
    
    this.nuevoIncidenteDenuncia.ciudadano=this.adminservice.identity(token);
    
    console.log(this.nuevoIncidenteDenuncia);
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
