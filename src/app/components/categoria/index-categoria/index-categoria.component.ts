import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from 'src/app/services/list.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-index-categoria',
  templateUrl: './index-categoria.component.html',
  styleUrl: './index-categoria.component.scss'
})
export class IndexCategoriaComponent {
  categorias:any[]=[];
  constcategorias=[];
  clonedProducts: { [s: string]: any } = {};

  constructor(private listService: ListService,private router: Router, private updateservice:UpdateService) { }

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    const token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
    if(!token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listService.listarCategorias(token).subscribe(
      response => {
        this.constcategorias=response.data;
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
    const token = sessionStorage.getItem('token');
    this.updateservice.actualizarCategoria(token,categoria._id,categoria).subscribe(response=>{console.log(response)},error=>{
      console.log(error);
    });

  }

  onRowEditCancel(categoria: any, rowIndex: number) {
    // Cancelar la edición de la categoría
    this.categorias[rowIndex]=this.clonedProducts[categoria._id];
    console.log('Cancelar edición de la categoría:', categoria);
    
  }

  verSubcategorias(id: any) {
      this.router.navigate(['/subcategorias'], { queryParams: { id: id } });
  }

  confirmarEliminacion(categoria: any) {
    console.log('Eliminar la categoría:', categoria);
  }
}
