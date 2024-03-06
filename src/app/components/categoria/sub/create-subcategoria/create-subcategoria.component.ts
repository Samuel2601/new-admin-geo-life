import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService } from 'src/app/services/list.service';
import { CreateService } from 'src/app/services/create.service';
import iziToast from 'izitoast';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-subcategoria',
  templateUrl: './create-subcategoria.component.html',
  styleUrl: './create-subcategoria.component.scss'
})
export class CreateSubcategoriaComponent implements OnInit{
  categorias: any[] = [];
  subcategoriaForm:any={};
  constructor(private fb: FormBuilder,private listService: ListService, private createService:CreateService,private router: Router){
    this.subcategoriaForm = this.fb.group({
      categoria: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.listarCategorias();
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
  registrarSubcategoria() {
    if (this.subcategoriaForm.valid) {
      const token = sessionStorage.getItem('token'); // Reemplaza 'tu_token' por el token real
      if(!token){
        throw this.router.navigate(["/inicio"]);
      }
      console.log(this.subcategoriaForm);
    this.createService.registrarSubcategoria(token, this.subcategoriaForm.value).subscribe(response => {
        console.log(response);
        if(response.data){
          iziToast.success({
            title:'Listo',
            message:'Ingresado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(["/categorias"]);
          }, 2000);
        }
        // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje de éxito o redirigir a otra página
      });
    } else {
      // Aquí puedes mostrar un mensaje de error o realizar alguna otra acción si el formulario no es válido
    }
  }
}
