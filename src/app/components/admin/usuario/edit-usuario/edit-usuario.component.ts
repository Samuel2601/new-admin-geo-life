import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import iziToast from 'izitoast';
import { UpdateService } from 'src/app/services/update.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { Capacitor } from '@capacitor/core';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrl: './edit-usuario.component.scss'
})
export class EditUsuarioComponent implements OnInit, AfterViewInit{
  datauser:any;
  modal:boolean=true;
  editing:boolean=true;
  url=GLOBAL.url;
  constructor(
    private _route: ActivatedRoute,
    private router:Router,
    private _filterservice: FilterService,
    private adminservice:AdminService,
    private updateservice:UpdateService,private modalService: NgbModal, private helper:HelperService){ }

  ngAfterViewInit(): void {
    this._route.params.subscribe((params) => {
      if(params['id']){
        this.id = params['id'];
      }
      if(this.id != this.adminservice.identity(this.token)){
        this.editing=false;
      }
      if(!this.id){
       this.id= this.adminservice.identity(this.token);
       this.editing=true;
      }
        this.obteneruser(this.id);
      
    });
  }

  token:any = this.helper.token();
  id:any
  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      // Verificar la ruta actual y ajustar el valor de model
      if (this.router.url === '/user-profile') {
        this.modal = false; // Si la ruta es /create-estado-incidente, model es false
      } else {
        this.modal = true; // En cualquier otra ruta, model es true
      }
    });
    if(!this.token){
      this.router.navigate(["/inicio"]);
    }

  }
  isMobil() {
   return this.helper.isMobil();
  }  
  obteneruser(id:any){    
    this._filterservice.obtenerUsuario(this.token,id).subscribe(response=>{
      this.datauser=response.data;
      this.datauser.password='';
      console.log(this.datauser);
    },error=>{
      iziToast.error({
        title: ('('+error.status+')').toString(),
        position: 'bottomRight',
        message: error.error.message,
      });
    });
  }
  updateUser(){
    this.updateservice.actualizarUsuario(this.token,this.id,this.datauser,this.archivoSeleccionado).subscribe(response=>{
      console.log(response);
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
  DimissModal(){
    this.modalService.dismissAll();
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    console.log(files);
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
          this.nombreArchivo=e.target.result;
        };
        reader.readAsDataURL(file);
        console.log(file)
        this.archivoSeleccionado=file;        
      }
    }
  }
}
