import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateService } from 'src/app/services/create.service';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-create-permisos',
  templateUrl: './create-permisos.component.html',
  styleUrl: './create-permisos.component.scss'
})
export class CreatePermisosComponent implements OnInit{
  componente:any;
  componentes = [
    'HomeComponent',
    'CreateCategoriaComponent', 'IndexCategoriaComponent',
    'CreateSubcategoriaComponent', 'IndexSubcategoriaComponent',

    'IndexUsuarioComponent', 'CreateUsuarioComponent',
    'CreateFichaSectorialComponent', 'IndexFichaSectorialComponent', 
    'IndexIncidentesDenunciaComponent', 'CreateIncidentesDenunciaComponent',
    'IndexEncargadoCategoriaComponent', 'CreateEncargadoCategoriaComponent',

    'IndexRolUserComponent', 'EditRolUserComponent', 'CreateRolUserComponent',
    'IndexEstadoIncidenteComponent','CreateEstadoIncidenteComponent',
    'IndexEstadoActividadProyectoComponent', 'CreateEstadoActividadProyectoComponent',

    'IndexActividadProyectoComponent', 'CreateActividadProyectoComponent',

    'IndexDireccionGeoComponent', 'EditDireccionGeoComponent', 'CreateDireccionGeoComponent',
    
    'IndexPermisosComponent', 'EditPermisosComponent', 'CreatePermisosComponent',
    'AdminComponent'
  ];
  rol:any;
  roles:any;
  newpermiso:any={
    nombreComponente:'',
    rolesPermitidos:[]
  }
  constructor(private modalService: NgbModal, private listService:ListService,private createService:CreateService){

  }
  ngOnInit(): void {
    this.listarrol();
  }
  token = sessionStorage.getItem('token');
  listarrol(){
    this.listService.listarRolesUsuarios(this.token).subscribe(response=>{
      this.roles=response.data;
    });
  }
  addrol(id:any){
    console.log(id,this.rol);
    this.newpermiso.rolesPermitidos.push(this.rol);
  }
  enviar(){
    console.log(this.newpermiso);
    this.createService.registrarPermiso(this.token,this.newpermiso).subscribe(response=>{
      console.log(response);
    });
  }
  DimissModal(){
    this.modalService.dismissAll();
  }
}
