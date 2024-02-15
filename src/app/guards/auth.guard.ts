import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard {
	constructor(private _router: Router, private _adminService: AdminService) {}

	canActivate(): any {
		let access: any = this._adminService.isAuthenticate();

		if (!access) {
			this._router.navigate(['home']);
		}
		return true;
	}
}
