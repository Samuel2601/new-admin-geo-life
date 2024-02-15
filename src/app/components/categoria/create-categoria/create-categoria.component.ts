import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateService } from 'src/app/services/create.service';
@Component({
  selector: 'app-create-categoria',
  templateUrl: './create-categoria.component.html',
  styleUrl: './create-categoria.component.scss'
})
export class CreateCategoriaComponent implements OnInit{
  categoriaForm: FormGroup;
  constructor(private fb: FormBuilder,private createService:CreateService){
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }
  ngOnInit(): void {

  }
  registrarCategoria(){
    if (this.categoriaForm.valid) {
      const token = sessionStorage.getItem('token'); // Reemplaza 'tu_token' por el token real
      const data = {
        nombre: this.categoriaForm.value.nombre,
        descripcion: this.categoriaForm.value.descripcion
      };
      this.createService.registrarCategoria(token, data).subscribe(response => {
        console.log(response);
        // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje de éxito o redirigir a otra página
      });
    } else {
      console.log(this.categoriaForm);
      // Aquí puedes mostrar un mensaje de error o realizar alguna otra acción si el formulario no es válido
    }
  }
}

