import { Component } from '@angular/core';
import { ListService } from 'src/app/services/list.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-index-subcategoria',
  templateUrl: './index-subcategoria.component.html',
  styleUrl: './index-subcategoria.component.scss'
})
export class IndexSubcategoriaComponent {
  subcategorias: any[]|undefined;
  id: any ='';
  constructor(private listService: ListService,private route: ActivatedRoute,private router: Router) {
    this.id = this.route.snapshot.queryParamMap.get('id');
   }

  ngOnInit(): void {
    this.listarSubcategorias();
  }

  listarSubcategorias(): void {
    const token = sessionStorage.getItem('token'); // Reemplaza 'your_token_here' con tu token de autenticación
    if(!token){
      throw this.router.navigate(["/inicio"]);
    }
    this.listService.listarSubcategorias(token,'categoria',this.id).subscribe(
      response => {
        this.subcategorias = response.data;
      },
      error => {
        console.log(error);
      }
    );
  }
}
