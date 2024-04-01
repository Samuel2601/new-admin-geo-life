import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import iziToast from 'izitoast';
import { CreateService } from 'src/app/services/create.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-create-actividad-proyecto',
  templateUrl: './create-actividad-proyecto.component.html',
  styleUrl: './create-actividad-proyecto.component.scss'
})
export class CreateActividadProyectoComponent {
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
  token=this.helper.token();
  registrarActividadP() {
    if (this.estadoIncidenteForm.valid) {
        if(!this.token){
          throw this.router.navigate(["/inicio"]);
        }
        this.createService.registrarTipoActividadProyecto(this.token, this.estadoIncidenteForm.value).subscribe(response => {
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
            console.error(error);
        });
    }
  }

}
