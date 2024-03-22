import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from 'src/app/services/filter.service';
import { HelperService } from 'src/app/services/helper.service';
import { UpdateService } from 'src/app/services/update.service';
import iziToast from 'izitoast';
@Component({
  selector: 'app-edit-categoria',
  templateUrl: './edit-categoria.component.html',
  styleUrl: './edit-categoria.component.scss'
})
export class EditCategoriaComponent implements OnInit {
  id:any;
  categoria:any;
  token=this.helper.token();
  constructor(private obtener:FilterService,private update:UpdateService,private helper:HelperService,private modalService: NgbModal){

  }
  ngOnInit(): void {
    console.log(this.id);
    this.obtenerCategoria();
  }
  loadcategoria=false;
  obtenerCategoria(){
    this.loadcategoria=false;
    this.obtener.obtenerCategoria(this.token,this.id).subscribe(response=>{
      this.categoria=response.data;
      console.log(this.categoria);
    });
    setTimeout(() => {
      this.loadcategoria=true;
    }, 500);
  }
  cerrar(){
    this.modalService.dismissAll();
  }

  updateCate(){
    this.update.actualizarCategoria(this.token,this.id,this.categoria).subscribe(response=>{
      if(response.data){
        let data=response.data;
        iziToast.success({
          title:'Actualizado',
          position:'bottomRight',
          message:data.nombre
        });
        setTimeout(() => {          
          this.modalService.dismissAll();
        }, 1000);
      }
    },error=>{
      iziToast.error({
        title:'ERROR',
        position:'bottomRight',
        message:error.error.message
      });
    });
  }
}
