import { Component } from '@angular/core';
import { ListService } from 'src/app/services/list.service';
@Component({
  selector: 'app-index-subcategoria',
  templateUrl: './index-subcategoria.component.html',
  styleUrl: './index-subcategoria.component.scss'
})
export class IndexSubcategoriaComponent {
  subcategorias: any[]|undefined;

  constructor(private listService: ListService) { }

  ngOnInit(): void {
    this.listarSubcategorias();
  }

  listarSubcategorias(): void {
    const token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
    this.listService.listarSubcategorias(token).subscribe(
      response => {
        this.subcategorias = response.subcategorias;
      },
      error => {
        console.log(error);
      }
    );
  }
}
