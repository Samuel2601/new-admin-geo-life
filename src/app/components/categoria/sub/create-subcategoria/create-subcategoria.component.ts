import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService } from 'src/app/services/list.service';
import { CreateService } from 'src/app/services/create.service';
@Component({
  selector: 'app-create-subcategoria',
  templateUrl: './create-subcategoria.component.html',
  styleUrl: './create-subcategoria.component.scss'
})
export class CreateSubcategoriaComponent implements OnInit{
  categorias: any[] = [];
  subcategoriaForm: FormGroup;
  constructor(private fb: FormBuilder,private listService: ListService, private createService:CreateService){
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
    this.listService.listarCategorias(token).subscribe(response => {
      this.categorias = response.data;
      console.log(response)
    });
  }
  registrarSubcategoria() {
    if (this.subcategoriaForm.valid) {
      const token = sessionStorage.getItem('token'); // Reemplaza 'tu_token' por el token real
      const data = {
        categoria: this.subcategoriaForm.value.categoria,
        nombre: this.subcategoriaForm.value.nombre,
        descripcion: this.subcategoriaForm.value.descripcion
      };
      this.createService.registrarSubcategoria(token, data).subscribe(response => {
        console.log(response);
        // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje de éxito o redirigir a otra página
      });
    } else {
      // Aquí puedes mostrar un mensaje de error o realizar alguna otra acción si el formulario no es válido
    }
  }
}
