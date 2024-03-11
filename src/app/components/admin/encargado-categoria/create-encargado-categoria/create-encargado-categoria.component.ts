import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService } from 'src/app/services/list.service';
import { CreateService } from 'src/app/services/create.service';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import iziToast from 'izitoast';
@Component({
  selector: 'app-create-encargado-categoria',
  templateUrl: './create-encargado-categoria.component.html',
  styleUrl: './create-encargado-categoria.component.scss'
})
export class CreateEncargadoCategoriaComponent implements OnInit {
  encargadosSeleccionados: any[] = [];
  categorias: any[] = [];
  categoriaselect:any;
  usuarios: any[] = [];
  subcategoriaForm: FormGroup;
  token=this.helper.token();
  constructor(private fb: FormBuilder,private listService: ListService, private createService:CreateService,private router: Router,private helper:HelperService){
    this.subcategoriaForm = this.fb.group({
      categoria: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.listarCategorias();
    this.listarUsuarios();
  }

  listarCategorias() {
    const token = sessionStorage.getItem('token'); // Reemplaza 'tu_token' por el token real
    if(!token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listService.listarCategorias(token).subscribe(response => {
      this.categorias = response.data;
      console.log(response);
    });
  }
  listarUsuarios() {
    if(!this.token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listService.listarUsuarios(this.token,'rol_user.orden',2).subscribe(response => {
      this.usuarios = response.data;
      console.log(response);
    });
  }
  eliminarEncargado(id: any): void {
    this.encargadosSeleccionados = this.encargadosSeleccionados.filter((encargado: any) => encargado !== id);
  }
  
  agregarEncargado(target:any){
    console.log(target.value);
    this.encargadosSeleccionados.push(target.value);
  }
  userfilter(id:any){
    return this.usuarios.find((element:any)=>element._id==id);
  }
  registrarEncargo(){
    if(this.encargadosSeleccionados.length>0&&this.categoriaselect){
      this.createService.registrarEncargadoCategoria(this.token,{encargado:this.encargadosSeleccionados,categoria:this.categoriaselect}).subscribe(response=>{
        console.log(response)
        iziToast.success({title:'Ingresado',position:'bottomRight',message:response.message});
      },error=>{
        iziToast.error({
          title: ('('+error.status+')').toString(),
          position: 'bottomRight',
          message: error.error.message,
        });
      })
    }
  }
}
