import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateService } from 'src/app/services/create.service';
import { ListService } from 'src/app/services/list.service';
import { AdminService } from 'src/app/services/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import iziToast from 'izitoast';
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
  constructor(private modalService: NgbModal,private fb: FormBuilder,private createService:CreateService,private router: Router,private listarService:ListService,private adminservice:AdminService){
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
  ngOnInit(): void {
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
    const ident=this.adminservice.identity(sessionStorage.getItem('token'));
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
    const token = sessionStorage.getItem('token');
    if(!token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listarService.listarEstadosActividadesProyecto(token).subscribe(response=>{
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
          title:'Error',
          message:'Sin Conexión a la Base de Datos'
        });
      }
    });
  }

  listarActividadProyecto(){
    const token=sessionStorage.getItem('token');
    if(!token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listarService.listarTiposActividadesProyecto(token).subscribe(response=>{
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
          title:'Error',
          message:'Sin Conexión a la Base de Datos'
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

  registrarFichaSectorial() {
    if (this.fichaSectorialForm?.valid) {
      const token = sessionStorage.getItem('token');
      if (token && this.fichaSectorialForm.value) {
        this.createService.registrarActividadProyecto(token, this.fichaSectorialForm.value).subscribe(response => {
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
        if(!token){
          throw this.router.navigate(["/inicio"]);
        }
      }
    }else{
      console.log(this.fichaSectorialForm.valid);
    }
  }
}