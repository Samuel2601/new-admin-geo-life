import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
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
  token = this.helperservice.token();
  constructor(private listService: ListService,private router: Router, private updateservice:UpdateService, private helperservice:HelperService) { }

  ngOnInit(): void {
    
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.helperservice.llamarspinner();
    
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listService.listarCategorias(this.token).subscribe(
      response => {
        this.constcategorias=response.data;
        this.categorias = response.data;
        console.log(response.data);
      },
      error => {
        console.log(error);
      }
    );
    this.helperservice.cerrarspinner();
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
    this.updateservice.actualizarCategoria(this.token,categoria._id,categoria).subscribe(response=>{console.log(response)},error=>{
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
