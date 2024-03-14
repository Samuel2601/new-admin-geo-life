import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateService } from 'src/app/services/create.service';
import { HelperService } from 'src/app/services/helper.service';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-create-permisos',
  templateUrl: './create-permisos.component.html',
  styleUrl: './create-permisos.component.scss'
})
export class CreatePermisosComponent implements OnInit{
  componente:any;
  componentes = [
    'DashboardComponent',
'CreateCategoriaComponent',
'IndexCategoriaComponent',
'EditCategoriaComponent',
'CreateSubcategoriaComponent',
'IndexSubcategoriaComponent',
'EditSubcategoriaComponent',
'ErrorComponent',
'IndexUsuarioComponent',
'EditUsuarioComponent',
'CreateUsuarioComponent',
'CreateFichaSectorialComponent',
'IndexFichaSectorialComponent',
'EditFichaSectorialComponent',
'IndexIncidentesDenunciaComponent',
'CreateIncidentesDenunciaComponent',
'EditIncidentesDenunciaComponent',
'IndexEncargadoCategoriaComponent',
'CreateEncargadoCategoriaComponent',
'EditEncargadoCategoriaComponent',
'IndexRolUserComponent',
'EditRolUserComponent',
'CreateRolUserComponent',
'IndexEstadoIncidenteComponent',
'EditEstadoIncidenteComponent',
'CreateEstadoIncidenteComponent',
'IndexEstadoActividadProyectoComponent',
'EditEstadoActividadProyectoComponent',
'CreateEstadoActividadProyectoComponent',
'IndexActividadProyectoComponent',
'EditActividadProyectoComponent',
'CreateActividadProyectoComponent',
'IndexDireccionGeoComponent',
'EditDireccionGeoComponent',
'CreateDireccionGeoComponent',
'IndexPermisosComponent',
'EditPermisosComponent',
'CreatePermisosComponent',
'AdminComponent',
  ];
  rol:any;
  roles:any;
  newpermiso:any={
    nombreComponente:'',
    rolesPermitidos:[]
  }
  constructor(private modalService: NgbModal, private listService:ListService,private createService:CreateService,private helper:HelperService){

  }
  ngOnInit(): void {
    this.listarrol();
  }
  token = this.helper.token();
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
