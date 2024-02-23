import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService } from 'src/app/services/list.service';
import { CreateService } from 'src/app/services/create.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-encargado-categoria',
  templateUrl: './create-encargado-categoria.component.html',
  styleUrl: './create-encargado-categoria.component.scss'
})
export class CreateEncargadoCategoriaComponent implements OnInit {
  encargadosSeleccionados: any[] = [];
  categorias: any[] = [];
  usuarios: any[] = [];
  subcategoriaForm: FormGroup;
  constructor(private fb: FormBuilder,private listService: ListService, private createService:CreateService,private router: Router){
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
    const token = sessionStorage.getItem('token'); // Reemplaza 'tu_token' por el token real
    if(!token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listService.listarUsuarios(token).subscribe(response => {
      this.usuarios = response.data;
      console.log(response);
    });
  }
  eliminarEncargado(encargado:any){
    
  }
  agregarEncargado(target:any){

  }
  registrarEncargo(){

  }
}
