import { Component } from '@angular/core';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-index-permisos',
  templateUrl: './index-permisos.component.html',
  styleUrl: './index-permisos.component.scss'
})
export class IndexPermisosComponent {
  permisos=[];
  clonedProducts: { [s: string]: any } = {};

  constructor(private listService: ListService) { }

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    const token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
    this.listService.ListarPermisos(token).subscribe(
      response => {
        this.permisos = response.data;
        console.log(response.data);
      },
      error => {
        console.log(error);
      }
    );
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
