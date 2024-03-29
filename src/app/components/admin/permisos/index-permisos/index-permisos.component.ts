import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/app/services/list.service';
import { CreatePermisosComponent } from '../create-permisos/create-permisos.component';
import { UpdateService } from 'src/app/services/update.service';
import iziToast from 'izitoast';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-index-permisos',
  templateUrl: './index-permisos.component.html',
  styleUrl: './index-permisos.component.scss'
})
export class IndexPermisosComponent {
  permisos:any=[];
  clonedProducts: { [s: string]: any } = {};
  roles:any
  rolselect: string[] = [];

  constructor(private listService: ListService,private modalService: NgbModal, private updateServices:UpdateService,private helper:HelperService) { }

  ngOnInit(): void {
    this.listarCategorias();
    this.listarrol();
  }
  token = this.helper.token();
  listarCategorias(): void {     
    this.listService.ListarPermisos(this.token).subscribe(
      response => {
        this.permisos = response.data;
        console.log(response.data);
      },
      error => {
        console.log(error);
      }
    );
  }
  toggleRol(permiso: any, rol: any) {
    if (this.checklist(permiso, rol._id)) {
      this.deleterol(permiso, rol._id);
    } else {
      this.addrol(permiso, rol);
    }
  }
  checklist(permiso:any,id: any): boolean {
    return permiso.rolesPermitidos.find((element: any) => element._id === id) !== undefined;
  }
  
  addrol(permiso:any,rol: any){
    permiso.rolesPermitidos.push(rol);
    console.log(permiso);
  }

  deleterol(permiso: any, rolId: any) {
    const index = permiso.rolesPermitidos.findIndex((rol: any) => rol._id === rolId);
    if (index !== -1) {
      permiso.rolesPermitidos.splice(index, 1);
    }
    console.log(permiso);
  }
  listarrol(){
    this.listService.listarRolesUsuarios(this.token).subscribe(response=>{
      this.roles=response.data;
    });
  }
  newpermiso(){
    this.modalService.dismissAll();
    this.modalService.open(CreatePermisosComponent, { centered: true });
  }

  editCategoriaId: any | null = null;
  onRowEditInit(categoria: any) {
    this.clonedProducts[categoria._id as string] = { ...categoria };
    // Iniciar la edición de la categoría
    console.log('Iniciar edición de la categoría:', categoria);
  }

  onRowEditSave(categoria: any) {
    // Guardar los cambios de la categoría
    console.log('Guardar cambios de la categoría:', categoria);
      // Agregar roles seleccionados al permiso
      this.updateServices.actualizarPermisos(this.token,categoria._id,categoria).subscribe(response=>{iziToast.success({title:'Ingresado',position:'bottomRight',message:response.message})});

  }

  onRowEditCancel(categoria: any, rowIndex: number) {
    // Cancelar la edición de la categoría
    console.log('Cancelar edición de la categoría:', categoria);

  }

  verSubcategorias(categoria: any) {
    // Lógica para ver las subcategorías
}

  confirmarEliminacion(categoria: any) {
    console.log('Eliminar la categoría:', categoria);
  }
  verDetalles(permiso: any) {
    // Implementa aquí la lógica para mostrar los detalles del permiso
    console.log('Detalles del permiso:', permiso);
}
}
