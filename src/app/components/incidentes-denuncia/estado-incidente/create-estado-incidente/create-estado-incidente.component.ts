import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import iziToast from 'izitoast';
import { CreateService } from 'src/app/services/create.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-create-estado-incidente',
  templateUrl: './create-estado-incidente.component.html',
  styleUrl: './create-estado-incidente.component.scss'
})
export class CreateEstadoIncidenteComponent implements OnInit {
  estadoIncidenteForm: FormGroup<any>;
  model: boolean=true;
  constructor(private fb: FormBuilder,private createService:CreateService,private router: Router,private helper:HelperService){
    this.estadoIncidenteForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      // Verificar la ruta actual y ajustar el valor de model
      if (this.router.url === '/create-estado-incidente') {
        this.model = false; // Si la ruta es /create-estado-incidente, model es false
      } else {
        this.model = true; // En cualquier otra ruta, model es true
      }
    });
  }
  abrirModal() {
    this.model = true; // Cambia model a true cuando se abre el modal
  }

  cerrarModal() {
    this.model = false; // Cambia model a false cuando se cierra el modal
  }
  token=this.helper.token();
  registrarEstadoIncidente() {
    if (this.estadoIncidenteForm?.valid) {
      if(!this.token){
        throw this.router.navigate(["/inicio"]);
      }
      if (this.token && this.estadoIncidenteForm.value) {
        this.createService.registrarEstadoIncidente(this.token, this.estadoIncidenteForm.value).subscribe(response => {
          console.log(response);
          if(response.data){
            iziToast.success({
              title:'Listo',
              message:'Ingresado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(["/home"]);
            }, 2000);
          }
        }, error => {
          // Manejar errores
          console.error(error);
        });
      }
    }
  }
  
  
}
