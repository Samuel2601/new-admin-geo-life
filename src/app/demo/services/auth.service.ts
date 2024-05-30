import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { FingerprintAuth } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async authenticate(): Promise<boolean> {
    try {
      // Primero verificamos si la autenticación biométrica está disponible
      const available = await FingerprintAuth['available']();
      if (available.has) {
        // Si está disponible, solicitamos la autenticación
        const result = await FingerprintAuth['verify']({
          reason: 'Please authenticate to access the application',
          title: 'Authentication Required'
        });
        return result.verified;
      } else {
        console.error('Biometric authentication not available');
        return false;
      }
    } catch (error) {
      console.error('Authentication failed', error);
      return false;
    }
  }
}
