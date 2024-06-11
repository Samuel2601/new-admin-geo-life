import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { AdminService } from 'src/app/demo/services/admin.service';

@Component({
    selector: 'app-password-recovery',
    templateUrl: './password-recovery.component.html',
    styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent implements OnInit {
    recoveryForm: FormGroup;
    submitted = false;
    recaptchaVerified = false;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private recaptchaV3Service: ReCaptchaV3Service,
        private admin: AdminService
    ) {}

    ngOnInit() {
        this.recoveryForm = this.formBuilder.group({
            correo: ['', [Validators.required, Validators.email]],
            recaptcha: ['', Validators.required],
        });
    }

    get f(): any {
        return this.recoveryForm.controls;
    }

    resolved(captchaResponse: string) {
        this.recaptchaVerified = true;
        this.recoveryForm.controls['recaptcha'].setValue(captchaResponse);
    }

    onSubmit() {
        this.submitted = true;

        if (this.recoveryForm.invalid || !this.recaptchaVerified) {
            return;
        }

        const formData = this.recoveryForm.value;
        console.log(formData);
        this.admin.recoverPassword(formData).subscribe(
            (response) => {
                console.log(response);
            },
            (error) => {
                console.error(error);
            }
        );
    }
}
