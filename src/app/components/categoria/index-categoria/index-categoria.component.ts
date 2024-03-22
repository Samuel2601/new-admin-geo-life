import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { HelperService } from 'src/app/services/helper.service';
import { ListService } from 'src/app/services/list.service';
import { UpdateService } from 'src/app/services/update.service';
import { CreateCategoriaComponent } from '../create-categoria/create-categoria.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateSubcategoriaComponent } from '../sub/create-subcategoria/create-subcategoria.component';
import { EditCategoriaComponent } from '../edit-categoria/edit-categoria.component';
import { EditSubcategoriaComponent } from '../sub/edit-subcategoria/edit-subcategoria.component';
import { DeleteService } from 'src/app/services/delete.service';
import iziToast from 'izitoast';
interface Column {
  field: string;
  header: string;
}
@Component({
  selector: 'app-index-categoria',
  templateUrl: './index-categoria.component.html',
  styleUrl: './index-categoria.component.scss'
})
export class IndexCategoriaComponent {
  categorias!: TreeNode[];
  constcategorias=[];
  clonedProducts: { [s: string]: any } = {};
  token = this.helperservice.token();
  constructor(private listService: ListService,private router: Router, private updateservice:UpdateService, private helperservice:HelperService,private modalService: NgbModal,private deleteService:DeleteService) { }
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
  getFileSystemNodesData() {
    return [  
        {  
            "data":{  
                "name":"Applications",
                "size":"200mb",
                "type":"Folder"
            },
            "children":[  
                {  
                    "data":{  
                        "name":"Angular",
                        "size":"25mb",
                        "type":"Folder"
                    },
                    "children":[  
                        {  
                            "data":{  
                                "name":"angular.app",
                                "size":"10mb",
                                "type":"Application"
                            }
                        },
                        {  
                            "data":{  
                                "name":"cli.app",
                                "size":"10mb",
                                "type":"Application"
                            }
                        },
                        {  
                            "data":{  
                                "name":"mobile.app",
                                "size":"5mb",
                                "type":"Application"
                            }
                        }
                    ]
                },
                {  
                    "data":{  
                        "name":"editor.app",
                        "size":"25mb",
                        "type":"Application"
                    }
                },
                {  
                    "data":{  
                        "name":"settings.app",
                        "size":"50mb",
                        "type":"Application"
                    }
                }
            ]
        },
        {  
            "data":{  
                "name":"Cloud",
                "size":"20mb",
                "type":"Folder"
            },
            "children":[  
                {  
                    "data":{  
                        "name":"backup-1.zip",
                        "size":"10mb",
                        "type":"Zip"
                    }
                },
                {  
                    "data":{  
                        "name":"backup-2.zip",
                        "size":"10mb",
                        "type":"Zip"
                    }
                }
            ]
        },
        {  
            "data": {  
                "name":"Desktop",
                "size":"150kb",
                "type":"Folder"
            },
            "children":[  
                {  
                    "data":{  
                        "name":"note-meeting.txt",
                        "size":"50kb",
                        "type":"Text"
                    }
                },
                {  
                    "data":{  
                        "name":"note-todo.txt",
                        "size":"100kb",
                        "type":"Text"
                    }
                }
            ]
        },
        {  
            "data":{  
                "name":"Documents",
                "size":"75kb",
                "type":"Folder"
            },
            "children":[
                {  
                    "data":{  
                        "name":"Work",
                        "size":"55kb",
                        "type":"Folder"
                    },
                    "children":[  
                        {  
                            "data":{  
                                "name":"Expenses.doc",
                                "size":"30kb",
                                "type":"Document"
                            }
                        },
                        {  
                            "data":{  
                                "name":"Resume.doc",
                                "size":"25kb",
                                "type":"Resume"
                            }
                        }
                    ]
                },
                {  
                    "data":{  
                        "name":"Home",
                        "size":"20kb",
                        "type":"Folder"
                    },
                    "children":[  
                        {  
                            "data":{  
                                "name":"Invoices",
                                "size":"20kb",
                                "type":"Text"
                            }
                        }
                    ]
                }
            ]
        },
        {  
            "data": {  
                "name":"Downloads",
                "size":"25mb",
                "type":"Folder"
            },
            "children":[  
                {  
                    "data": {  
                        "name":"Spanish",
                        "size":"10mb",
                        "type":"Folder"
                    },
                    "children":[  
                        {  
                            "data":{  
                                "name":"tutorial-a1.txt",
                                "size":"5mb",
                                "type":"Text"
                            }
                        },
                        {  
                            "data":{  
                                "name":"tutorial-a2.txt",
                                "size":"5mb",
                                "type":"Text"
                            }
                        }
                    ]
                },
                {  
                    "data":{  
                        "name":"Travel",
                        "size":"15mb",
                        "type":"Text"
                    },
                    "children":[  
                        {  
                            "data":{  
                                "name":"Hotel.pdf",
                                "size":"10mb",
                                "type":"PDF"
                            }
                        },
                        {  
                            "data":{  
                                "name":"Flight.pdf",
                                "size":"5mb",
                                "type":"PDF"
                            }
                        }
                    ]
                }
            ]
        },
        {  
            "data": {  
                "name":"Main",
                "size":"50mb",
                "type":"Folder"
            },
            "children":[  
                {  
                    "data":{  
                        "name":"bin",
                        "size":"50kb",
                        "type":"Link"
                    }
                },
                {  
                    "data":{  
                        "name":"etc",
                        "size":"100kb",
                        "type":"Link"
                    }
                },
                {  
                    "data":{  
                        "name":"var",
                        "size":"100kb",
                        "type":"Link"
                    }
                }
            ]
        },
        {  
            "data":{  
                "name":"Other",
                "size":"5mb",
                "type":"Folder"
            },
            "children":[  
                {  
                    "data":{  
                        "name":"todo.txt",
                        "size":"3mb",
                        "type":"Text"
                    }
                },
                {  
                    "data":{  
                        "name":"logo.png",
                        "size":"2mb",
                        "type":"Picture"
                    }
                }
            ]
        },
        {  
            "data":{  
                "name":"Pictures",
                "size":"150kb",
                "type":"Folder"
            },
            "children":[  
                {  
                    "data":{  
                        "name":"barcelona.jpg",
                        "size":"90kb",
                        "type":"Picture"
                    }
                },
                {  
                    "data":{  
                        "name":"primeng.png",
                        "size":"30kb",
                        "type":"Picture"
                    }
                },
                {  
                    "data":{  
                        "name":"prime.jpg",
                        "size":"30kb",
                        "type":"Picture"
                    }
                }
            ]
        },
        {  
            "data":{  
                "name":"Videos",
                "size":"1500mb",
                "type":"Folder"
            },
            "children":[  
                {  
                    "data":{  
                        "name":"primefaces.mkv",
                        "size":"1000mb",
                        "type":"Video"
                    }
                },
                {  
                    "data":{  
                        "name":"intro.avi",
                        "size":"500mb",
                        "type":"Video"
                    }
                }
            ]
        }
    ]
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
                    iziToast.success({
                        title: 'Eliminación',
                        position: 'bottomRight',
                        message: 'completado'
                    });
                }, error => {
                    iziToast.error({
                        title: '(' + error.status + ')',
                        position: 'bottomRight',
                        message: error.error.message,
                    });
                });
            } else {
                this.deleteService.eliminarSubcategoria(this.token, this.iddelete._id, data).subscribe(response => {
                    console.log(response.data);
                    iziToast.success({
                        title: 'Eliminación',
                        position: 'bottomRight',
                        message: 'completado'
                    });
                }, error => {
                    iziToast.error({
                        title: '(' + error.status + ')',
                        position: 'bottomRight',
                        message: error.error.message,
                    });
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
