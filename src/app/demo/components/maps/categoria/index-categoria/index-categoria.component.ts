import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { HelperService } from 'src/app/demo/services/helper.service';
import { ListService } from 'src/app/demo/services/list.service';
import { UpdateService } from 'src/app/demo/services/update.service';
import { CreateCategoriaComponent } from '../create-categoria/create-categoria.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateSubcategoriaComponent } from '../sub/create-subcategoria/create-subcategoria.component';
import { EditCategoriaComponent } from '../edit-categoria/edit-categoria.component';
import { EditSubcategoriaComponent } from '../sub/edit-subcategoria/edit-subcategoria.component';
import { DeleteService } from 'src/app/demo/services/delete.service';
interface Column {
  field: string;
  header: string;
}
@Component({
  selector: 'app-index-categoria',
  templateUrl: './index-categoria.component.html',
    styleUrl: './index-categoria.component.scss',
   providers: [MessageService]
})
export class IndexCategoriaComponent {
  categorias!: TreeNode[];
  constcategorias=[];
  clonedProducts: { [s: string]: any } = {};
  token = this.helperservice.token();
  constructor(private listService: ListService,private router: Router, private updateservice:UpdateService, private helperservice:HelperService,private modalService: NgbModal,private deleteService:DeleteService,private messageService: MessageService) { }
  cols!: Column[];
  async ngOnInit() {
    this.loading=true;
    await this.listarCategorias();
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripción' },
      { field: '', header: '' }
  ];
    let aux =await this.listService.listarSubcategorias(this.token).toPromise();
    if(aux.data){
        this.listadosubcategoria=aux.data;
    }
  }
  clear(table: Table) {
    table.clear();
  }
  opcion=false;
  loading=true;

  listadocategoria!:any[];
  listadosubcategoria!:any[];
  async listarCategorias(): Promise<void> {
    this.loading = true;
    this.opcion=false;
    if (!this.token) {
      this.router.navigate(['/inicio']);
      return;
    }
  
    try {
      const categoriasResponse = await this.listService.listarCategorias(this.token).toPromise();
      if (categoriasResponse.data) {
        this.listadocategoria=categoriasResponse.data;
        const categorias = await Promise.all(categoriasResponse.data.map(async (categoria: any) => {
          const subcategoriaResponse = await this.listService.listarSubcategorias(this.token, 'categoria', categoria._id).toPromise();
          const children = subcategoriaResponse.data.map((subcategoria: any) => ({
            data: {
              nombre: subcategoria.nombre,
              descripcion: subcategoria.descripcion,
              _id:subcategoria._id,
              cat:false
            }
          }));
          console.log('children',children);
          return {
            data: {
              nombre: categoria.nombre,
              descripcion: categoria.descripcion,
              _id:categoria._id,
              cat:true
            },
            children: children
          };
        }));
        this.categorias = categorias;
        console.log(this.categorias);
      } else {
        throw new Error('No se pudo obtener la lista de categorías');
      }
    } catch (error) {
      console.error('Error al listar categorías y subcategorías', error);
    } finally {
      this.loading = false;
    }
  }

    editRow(id:any,cat:boolean){
        console.log(id);
        this.modalService.dismissAll();
        if(cat){
            const modalRef = this.modalService.open(EditCategoriaComponent, { centered: true });    
            modalRef.componentInstance.id=id;
        }else{
            const modalRef = this.modalService.open(EditSubcategoriaComponent, { centered: true });    
            modalRef.componentInstance.id=id;
        }
    }
    responsemodal:any;
    iddelete:any;
    @ViewChild('Confirmar') Confirmar: TemplateRef<any> | undefined;
    load_btn_delte=true;
   async remoRow(row:any,cat:boolean){
        this.iddelete=row;
        console.log(row);
        if(cat){
            this.responsemodal = await this.deleteService.verificarCategoria(this.token,this.iddelete._id).toPromise();
        }else{
            this.responsemodal = await this.deleteService.verificarSubCategoria(this.token,this.iddelete._id).toPromise();
            console.log(this.responsemodal);
        }
        const modalRef = this.modalService.open(this.Confirmar, { centered: true,size: 'lg'  }); 
    }
    respaldo!:any;
    eliminarCategoria() {
        console.log(this.respaldo, this.iddelete);
        if (this.iddelete) {
            const data: any = {}; // Corrección: usa const en lugar de let para data
            if (this.respaldo) {
                data.eliminarSubcategorias = false;
                data.nuevaCategoria = this.respaldo._id;
            } else {
                data.eliminarSubcategorias = true;
            }
            if (this.iddelete.cat) {
                this.deleteService.eliminarCategoria(this.token, this.iddelete._id, data).subscribe(response => {
                    console.log(response.data);
                    this.messageService.add({severity: 'success', summary: 'Eliminación', detail: 'completado'});

                }, error => {
                    this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
                });
            } else {
                this.deleteService.eliminarSubcategoria(this.token, this.iddelete._id, data).subscribe(response => {
                    console.log(response.data);
                     this.messageService.add({severity: 'success', summary: 'Eliminación', detail: 'completado'});
                }, error => {
                   this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
                });
            }
        }
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
