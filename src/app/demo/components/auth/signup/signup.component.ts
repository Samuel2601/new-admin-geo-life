import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { HelperService } from 'src/app/demo/services/helper.service';
import { CreateService } from 'src/app/demo/services/create.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  
})
export class SignupComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private admin: AdminService, private messageService: MessageService,private helper:HelperService,private create:CreateService) {
    this.formulario = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nombres: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      //foto: ['']
    });
     this.formulario.get('cedula')?.valueChanges.subscribe((value:any) => {
      if (this.formulario.get('cedula')?.valid) {
        this.consultar(value);
      }
     });
    this.formulario.get('correo')?.valueChanges.subscribe((value:any) => {
      if (this.formulario.get('correo')?.valid) {
        this.consultarcorreo(value);
      }
    });
  }
  ngOnInit(): void {
   
  }
  visible: boolean = false;
  consultar(id: any) {
   this.visible = true;
      this.admin.getCiudadano(id).subscribe(response => {
        console.log(response);
           setTimeout(() => {          
             this.visible = false;
              if (response.nombres) {          
                this.formulario.get('nombres')?.setValue(response.nombres);
                //this.formulario.get('correo')?.setErrors({ 'status': "VALID" });
              this.formulario.get('nombres')?.disable()
            }
        }, 1000);   
    });
  }
  consultarcorreo(correo: any) {
    this.visible = true;
    this.admin.verificarCorreo(correo).subscribe(response => {
        console.log(response);
        if (response) {
          this.messageService.add({ severity: 'error', summary: 'Invalido', detail: 'Correo electronico ya existente' });
          this.formulario.get('correo')?.setErrors({ 'invalido': true });
        }
        setTimeout(() => {          
         this.visible = false;
        }, 1000);

      });
  }
  registrarse() {
    this.visible = true;
    if (this.formulario.valid) {
      this.formulario.get('nombres')?.enable();
      this.create.registrarUsuario(this.formulario.value).subscribe(response => {
        console.log(response);
        this.messageService.add({ severity: 'success', summary: 'Excelente', detail: 'Registrado Correctamente' });
      }, error => {
         this.messageService.add({severity: 'error', summary:  ('('+error.status+')').toString(), detail: error.error.message||'Sin conexión'});
      });
      setTimeout(() => {          
         this.visible = false;
        }, 1000);
    } else {
      console.log(this.formulario.valid);
      console.log(this.formulario);
      this.messageService.add({ severity: 'error', summary: 'Invalido', detail: 'Rellene todos los campos' });
    }
  }
  
  isMobil() {
    return this.helper.isMobil();
  }
  selectedFiles: any;
  imagenesSeleccionadas: any;
  load_imagen: boolean = true;
  onFilesSelected(event: any): void {
      console.log(event);
      if (event.files.length > 0) {
          const file = event.files[0];
          const objectURL = URL.createObjectURL(file);
          this.imagenesSeleccionadas = objectURL;
        this.load_imagen = false;
          this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: 'Imagen subida'});
      }
  }

  async tomarFotoYEnviar(event: any) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      promptLabelPhoto:  'Seleccionar de la galería',
      promptLabelPicture:'Tomar foto',
    });
    if (image && image.base64String) {
      
        const byteCharacters = atob(image.base64String);
        const byteNumbers = new Array(byteCharacters.length);
    
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Puedes ajustar el tipo según el formato de tu imagen
        let im =new File([blob], "prueba", { type: 'image/jpeg' });
        this.selectedFiles = im;

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenesSeleccionadas=e.target.result
        };
        reader.readAsDataURL(im);

    } else {
       this.messageService.add({severity: 'warning', summary: 'MAX img', detail: 'Solo puede enviar 3 imangenes'});
      //console.error('Error al obtener la cadena base64 de la imagen.');
    }
  }
  formulario: any={};
  active: number | undefined = 0;
}
