import { Component } from '@angular/core';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-index-encargado-categoria',
  templateUrl: './index-encargado-categoria.component.html',
  styleUrl: './index-encargado-categoria.component.scss'
})
export class IndexEncargadoCategoriaComponent {
  encargadosCategoria:any=[];
  clonedProducts: { [s: string]: any } = {};

  constructor(private listService: ListService) { }

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    const token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
    this.listService.listarEncargadosCategorias(token).subscribe(
      response => {
        this.encargadosCategoria = response.data;
        console.log(response.data);
      },
      error => {
        console.log(error);
      }
    );
  }
  getNombreUsuario(idUsuario: string): string {
    const usuario = this.encargadosCategoria.encargado.find((usuario:any) => usuario._id === idUsuario);
    return usuario ? usuario.nombres : '';
  }

  getNombreCategoria(idCategoria: string): string {
      const categoria = this.encargadosCategoria.categoria.find((categoria:any) => categoria._id === idCategoria);
      return categoria ? categoria.nombre : '';
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

  verDetalles(categoria: any) {
    // Lógica para ver las subcategorías
}

  confirmarEliminacion(categoria: any) {
    console.log('Eliminar la categoría:', categoria);
  }
}
