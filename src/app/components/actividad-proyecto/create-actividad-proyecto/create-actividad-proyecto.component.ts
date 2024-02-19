import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateService } from 'src/app/services/create.service';

@Component({
  selector: 'app-create-actividad-proyecto',
  templateUrl: './create-actividad-proyecto.component.html',
  styleUrl: './create-actividad-proyecto.component.scss'
})
export class CreateActividadProyectoComponent {
  estadoIncidenteForm: FormGroup<any>;
  model: boolean=true;
  constructor(private fb: FormBuilder,private createService:CreateService,private router: Router){
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
  registrarActividadP() {
    if (this.estadoIncidenteForm.valid) {
        const token = sessionStorage.getItem('token');
        this.createService.registrarTipoActividadProyecto(token, this.estadoIncidenteForm.value).subscribe(response => {
            console.log(response);
        }, error => {
            console.error(error);
        });
    }
  }

}
