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
import { NativeBiometric } from 'capacitor-native-biometric';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
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
    statusbiometrico(): boolean {
        const correoCookieuser = this.helper.isMobil()
            ? localStorage.getItem('correo')
            : this.cookieService.get('correo');
        const correoCookiepass = this.helper.isMobil()
            ? localStorage.getItem('pass')
            : this.cookieService.get('pass');
        if (correoCookieuser && correoCookiepass) {
            return true;
        }
        return false;
    }
    async callbiometrico() {
        const correoCookieuser = this.helper.isMobil()
            ? localStorage.getItem('correo')
            : this.cookieService.get('correo');
        const correoCookiepass = this.helper.isMobil()
            ? localStorage.getItem('pass')
            : this.cookieService.get('pass');
        if (correoCookieuser) {
            try {
                const correoDesencriptado =
                    this.helper.decryptDataLogin(correoCookieuser);
                this.loginForm.get('correo').setValue(correoDesencriptado);
                if (this.helper.isMobil() && correoCookiepass) {
                    // Realizar autenticación biométrica
                    const result = await NativeBiometric.isAvailable();
                    if (result.isAvailable) {
                        const verified = await NativeBiometric.verifyIdentity({
                            reason: 'Para un facil inicio de sesión',
                            title: 'Inicio de Sesión',
                            subtitle: 'Coloque su dedo en el sensor.',
                            description: 'Se requiere Touch ID o Face ID',
                        })
                            .then(() => true)
                            .catch(() => false);

                        if (verified) {
                            const correoDesencriptado =
                                this.helper.decryptDataLogin(correoCookiepass);
                            this.loginForm
                                .get('pass')
                                .setValue(correoDesencriptado);
                            this.postLogin();
                        }
                    }
                }
            } catch (error) {
                console.error('Error al desencriptar el correo:', error);
                // Manejar el error de desencriptación de manera adecuada
            }
        }
    }
    async ngOnInit() {
        this.playAudio();
        let bolroutin: boolean = true;
        this.route.queryParams.subscribe((params) => {
            if (params && params['correo'] && params['password']) {
                this.loginForm.get('correo')?.setValue(params['correo']);
                this.loginForm.get('pass')?.setValue(params['password']);

                bolroutin = false;
            }
        });
        if (bolroutin) {
            this.nombreUsuario = this.helper.isMobil()
                ? this.helper.decryptDataLogin(
                      localStorage.getItem('nombreUsuario')
                  )
                : this.helper.decryptDataLogin(
                      this.cookieService.get('nombreUsuario')
                  );
            this.fotoUsuario = this.helper.isMobil()
                ? this.helper.decryptDataLogin(
                      localStorage.getItem('fotoUsuario')
                  )
                : this.helper.decryptDataLogin(
                      this.cookieService.get('fotoUsuario')
                  );
            this.callbiometrico();
        }

        if (this.helper.token()) {
            this.router.navigate(['/home']);
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

            this._adminService.login(user).subscribe(
                async (response: any) => {
                    if (response.token) {
                        const data = response.data;
                        if (data) {
                            if (!this.helper.isMobil()) {
                                this.cookieService.set(
                                    'nombreUsuario',
                                    this.helper.encryptDataLogin(
                                        data.nombres,
                                        'buzon'
                                    )
                                );
                                this.cookieService.set(
                                    'fotoUsuario',
                                    this.helper.encryptDataLogin(
                                        data.foto,
                                        'buzon'
                                    )
                                );
                                this.cookieService.set(
                                    'correo',
                                    this.helper.encryptDataLogin(
                                        data.correo,
                                        'buzon'
                                    )
                                );
                            } else {
                                localStorage.setItem(
                                    'nombreUsuario',
                                    this.helper.encryptDataLogin(
                                        data.nombres,
                                        'buzon'
                                    )
                                );
                                localStorage.setItem(
                                    'fotoUsuario',
                                    this.helper.encryptDataLogin(
                                        data.foto,
                                        'buzon'
                                    )
                                );
                                localStorage.setItem(
                                    'correo',
                                    this.helper.encryptDataLogin(
                                        data.correo,
                                        'buzon'
                                    )
                                );
                            }
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
                        const correoCookiepass = this.helper.isMobil()
                            ? localStorage.getItem('pass')
                            : this.cookieService.get('pass');
                        if (
                            this.helper.isMobil() &&
                            (!correoCookiepass||this.loginForm.get('pass')?.value!=this.helper.decryptDataLogin(correoCookiepass))
                        ) {
                            // Realizar autenticación biométrica
                            const result = await NativeBiometric.isAvailable();
                            if (result.isAvailable) {
                                const verified =
                                    await NativeBiometric.verifyIdentity({
                                        reason: 'Para un facil inicio de sesión',
                                        title: 'Inicio de Sesión',
                                        subtitle:
                                            'Coloque su dedo en el sensor.',
                                        description:
                                            'Se requiere Touch ID o Face ID',
                                    })
                                        .then(() => true)
                                        .catch(() => false);

                                if (!verified) {
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: '(fallo)',
                                        detail: 'Sin biometria',
                                    });
                                    // Si la autenticación biométrica falla, muestra un mensaje al usuario o realiza alguna acción adecuada
                                    //return;
                                } else {
                                    localStorage.setItem(
                                        'pass',
                                        this.helper.encryptDataLogin(
                                            user.password,
                                            'buzon'
                                        )
                                    );
                                }
                            }
                        }
                        // Redirigir a la página de mapa después de la autenticación exitosa
                        setTimeout(() => {
                            if (response.pass) {
                                this.router.navigate(['/maps/edit-user']);
                            } else {
                                this.router.navigate(['/home']);
                            }
                        }, 2000);
                    }
                },
                (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: '(' + error.status + ')',
                        detail: error.error.message || 'Sin conexión',
                    });
                }
            );
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Aviso',
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
    loginWithFacebook() {
        // Lógica para iniciar sesión con Facebook
    }

    loginWithGoogle() {
        // Lógica para iniciar sesión con Google
    }
}
