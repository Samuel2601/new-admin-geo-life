import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/app/services/list.service';
import { CreatePermisosComponent } from '../create-permisos/create-permisos.component';

@Component({
  selector: 'app-index-permisos',
  templateUrl: './index-permisos.component.html',
  styleUrl: './index-permisos.component.scss'
})
export class IndexPermisosComponent {
  permisos=[];
  clonedProducts: { [s: string]: any } = {};
  roles:any
  rolselect: string[] = [];

  constructor(private listService: ListService,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listarCategorias();
  }
  token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
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
  categoria.rolesPermitidos = this.roles.filter((rol:any) => this.rolselect.includes(rol._id));
  
  // Aquí debes guardar el permiso actualizado

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
