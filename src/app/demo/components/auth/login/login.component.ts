import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminService } from 'src/app/demo/services/admin.service';
import { HelperService } from 'src/app/demo/services/helper.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CookieService } from 'ngx-cookie-service';
import { GLOBAL } from 'src/app/demo/services/GLOBAL';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Howl } from 'howler';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
    providers: [MessageService, DynamicDialogRef],
})
export class LoginComponent implements OnInit {
    sound = new Howl({
        src: ['../../../../../assets/audio/audio_login.mpeg'],
    });

    public loginForm: FormGroup | any;
    showPassword = false;
    height: number = 700;
    save: boolean = false;
    url = GLOBAL.url;
    nombreUsuario: string;
    fotoUsuario: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public formBuilder: FormBuilder,
        private _adminService: AdminService,
        private helper: HelperService,
        private messageService: MessageService,
        public layoutService: LayoutService,
        private cookieService: CookieService
    ) {
        this.loginForm = this.formBuilder.group({
            correo: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'
                    ),
                    Validators.maxLength(50),
                ],
            ],
            pass: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(30),
                ],
            ],
            save: [true],
        });

        // Eliminar espacios en blanco del correo electrónico
        this.loginForm.get('correo').valueChanges.subscribe((value) => {
            const correoSinEspacios = value.replace(/\s/g, '');
            const correoMinusculas = correoSinEspacios.toLowerCase();
            this.loginForm.patchValue(
                { correo: correoMinusculas },
                { emitEvent: false }
            );
        });
    }

    async ngOnInit() {
        let bolroutin: boolean = true;
        this.route.queryParams.subscribe((params) => {
            if (params && params['correo'] && params['password']) {
                this.loginForm.get('correo')?.setValue(params['correo']);
                this.loginForm.get('password')?.setValue(params['password']);
                this.playAudio();
                bolroutin = false;
            }
        });
        if (bolroutin) {
            this.nombreUsuario = this.helper.decryptDataLogin(
                this.cookieService.get('nombreUsuario')
            );
            this.fotoUsuario = this.helper.decryptDataLogin(
                this.cookieService.get('fotoUsuario')
            );
            const correoCookie = this.cookieService.get('correo');
            if (correoCookie) {
                try {
                    const correoDesencriptado =
                        this.helper.decryptDataLogin(correoCookie);
                    this.loginForm.get('correo').setValue(correoDesencriptado);
                } catch (error) {
                    console.error('Error al desencriptar el correo:', error);
                    // Manejar el error de desencriptación de manera adecuada
                }
            }

            if (!this.nombreUsuario) {
                this.playAudio();
            }
        }

        if (this.helper.token()) {
            this.router.navigate(['/maps']);
        }
        this.setHeight();
        window.addEventListener('resize', () => {
            this.setHeight();
        });
    }

    playAudio() {
        this.sound.play();
    }
    stopAudio() {
        this.sound.stop();
    }

    setHeight(): void {
        this.height = window.innerHeight;
    }

    async ionViewWillEnter() {}

    get formControls() {
        return this.loginForm.controls;
    }

    async postLogin() {
        ////console.log(this.loginForm,this.loginForm.valid);
        if (this.loginForm.valid) {
            let user = {
                correo: this.loginForm.get('correo')?.value,
                password: this.loginForm.get('pass')?.value,
                time: 3,
                tipo: 'hours',
            };
            if (this.loginForm.get('save')?.value) {
                user.time = 60;
                user.tipo = 'days';
            }
            ////console.log(user);
            this._adminService.login(user).subscribe(
                (response: any) => {
                    if (response.token) {
                       // console.log(response.data);
                        const data = response.data;
                        if (data) {
                            this.cookieService.set(
                                'nombreUsuario',
                                this.helper.encryptDataLogin(
                                    data.nombres,
                                    'buzon'
                                )
                            );
                            this.cookieService.set(
                                'fotoUsuario',
                                this.helper.encryptDataLogin(data.foto, 'buzon')
                            );
                            this.cookieService.set(
                                'correo',
                                this.helper.encryptDataLogin(
                                    data.correo,
                                    'buzon'
                                )
                            );
                        }
                        if (!this.loginForm.get('save')?.value) {
                            sessionStorage.setItem('token', response.token);
                            if (response.data.foto) {
                                sessionStorage.setItem(
                                    'foto',
                                    response.data.foto
                                );
                            }
                        } else {
                            localStorage.setItem('token', response.token);
                            if (response.data.foto) {
                                localStorage.setItem(
                                    'foto',
                                    response.data.foto
                                );
                            }
                        }

                        this.helper.listpermisos(
                            this.loginForm.get('save')?.value
                        );
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Ingreso',
                            detail: 'Bienvenido',
                        });
                        //this.navbarComponent.cerrarmodal();
                        //this.navbarComponent.asignarToken();
                        this.stopAudio();
                        setTimeout(() => {
                            this.router.navigate(['/maps']);
                        }, 2000);
                    }
                },
                (error) => {
                    // //console.error(error);
                    this.messageService.add({
                        severity: 'error',
                        summary: ('(' + error.status + ')').toString(),
                        detail: error.error.message || 'Sin conexión',
                    });
                }
            );
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Aviso'.toString(),
                detail: 'Completa los datos',
            });
        }
    }

    async resetPassword() {
        if (this.loginForm.get('correo')?.value) {
            if (this.formControls['correo']?.invalid) {
            } else {
                const resetInput = [
                    {
                        type: 'text',
                        placeholder: 'Cédula',
                        name: 'cedula',
                    },
                ];
                const buttons = [
                    {
                        text: 'Cancelar',
                        cssClass: 'text-color-danger',
                        role: 'cancel',
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
                        },
                    },
                ];
            }
        } else {
        }
    }
    async postReset(cedula: string) {}
}
