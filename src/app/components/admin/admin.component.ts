import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit{
  selected:string='IndexUsuarioComponent';
  check:any={};
  constructor(private helperService: HelperService, private router: Router) { }
  async ngOnInit(): Promise<void> {
    try {
      this.check.IndexUsuarioComponent = await this.helperService.checkPermiso('IndexUsuarioComponent') || false;
      this.check.IndexRolUserComponent = await this.helperService.checkPermiso('IndexRolUserComponent')|| false;
      this.check.IndexEncargadoCategoriaComponent = await this.helperService.checkPermiso('IndexEncargadoCategoriaComponent')|| false;
      this.check.IndexPermisosComponent = await this.helperService.checkPermiso('IndexPermisosComponent') || false;
      console.log(this.check);
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      this.router.navigate(['/error']);
    }
  
    let found = false;
    for (const key in this.check) {
      if (this.check[key] && !found) {
        this.selected = key; // Assuming the keys are in the format 'IndexXxxComponent'
        console.log(this.selected);
        found = true;
      }
    }

  }

}
