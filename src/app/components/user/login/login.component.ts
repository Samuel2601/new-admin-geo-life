import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import iziToast from 'izitoast';
import { AdminService } from 'src/app/services/admin.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  public loginForm: FormGroup|any;
  showPassword = false;
  height: number=700;
  save:boolean=false;

  constructor(private router: Router,
    public formBuilder: FormBuilder,
    private _adminService:AdminService,
    private helper:HelperService
    ) { }

  async ngOnInit() {
    this.setHeight();
    window.addEventListener('resize', () => {
      this.setHeight();
    });
    this.loginForm = this.formBuilder.group({
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          Validators.maxLength(50)
        ],
      ],
      pass: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)
      ]],
      save:[false]
    });
  }
  setHeight(): void {
    this.height = window.innerHeight;
  }

  async ionViewWillEnter() {

  }

  get formControls() {
    return this.loginForm.controls;
  }

  async postLogin() {
    if (this.loginForm.valid) {
      let user = {
        correo: this.loginForm.get("correo")?.value,
        password: this.loginForm.get("pass")?.value,        
        time:3,
        tipo:'hours'
      };
      if(this.loginForm.get("save")?.value){
        user.time=7;
        user.tipo='days';
      }
      this._adminService.login_admin(user).subscribe((response:any)=>{
        if(response.token){
          if(!this.loginForm.get("save")?.value){
            sessionStorage.setItem('token',response.token);
            if(response.data.foto){
              sessionStorage.setItem('foto',response.data.foto);
            }
          }else{
            localStorage.setItem('token',response.token);
            if(response.data.foto){
              localStorage.setItem('foto',response.data.foto);
            }
          }
         
          this.helper.listpermisos(this.loginForm.get("save")?.value);
          iziToast.success({
            title:'Ingreso',
            position:'bottomRight',
            message:'Bienvenido'
          });
          //this.navbarComponent.cerrarmodal();
          //this.navbarComponent.asignarToken();
          setTimeout(() => {          
          this.router.navigate(["/home"]);
          }, 2000);
        }   
       },
       error => {
        console.error(error);
         iziToast.error({
           title: ('('+error.status+')').toString(),
           position: 'bottomRight',
           message: error.error.message||'Sin conexión',
         });
       });
     
    } else {
      iziToast.warning({
        title:'Aviso',
        position:'bottomRight',
        message:'Completa los datos'
      });
    }
  }

  async resetPassword() {
    if (this.loginForm.get("correo")?.value) {
      if (this.formControls['correo']?.invalid) {
      } else {
        const resetInput = [{
          type: 'text',
          placeholder: 'Cédula',
          name: 'cedula'
        }];
        const buttons = [
          {
            text: 'Cancelar',
            cssClass: 'text-color-danger',
            role: 'cancel'
          },
          {
            text: 'Restablecer',
            handler: async (data: any) => {
              const cedula: string = data.cedula;
              if (cedula.length != 10) {
                return false;
              }
              try {
                Number.parseInt(cedula);
                this.postReset(cedula);
                return true;
              } catch (error) {
                return false;
              }
            }
          }
        ];
      }
    } else {
    }
  }
  async postReset(cedula: string) {

  }
}
