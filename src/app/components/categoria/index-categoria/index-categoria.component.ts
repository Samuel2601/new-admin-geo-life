import { Component } from '@angular/core';
import { ListService } from 'src/app/services/list.service';
@Component({
  selector: 'app-index-categoria',
  templateUrl: './index-categoria.component.html',
  styleUrl: './index-categoria.component.scss'
})
export class IndexCategoriaComponent {
  categorias=[];
  clonedProducts: { [s: string]: any } = {};

  constructor(private listService: ListService) { }

  ngOnInit(): void {
    this.listarCategorias();
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
}
