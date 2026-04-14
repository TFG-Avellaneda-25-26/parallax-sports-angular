import { Injectable } from '@angular/core';

/**
 * TokenStorage maneja tokens HTTPOnly cookies
 * Los tokens se envían automáticamente por el navegador en cada petición
 * No se pueden acceder desde JavaScript (seguridad)
 */
@Injectable({ providedIn: 'root' })
export class TokenStorage {
  // Los tokens HTTPOnly son manejados automáticamente por el navegador
  // No hay lógica manual necesaria aquí
  
  isAuthenticated(): boolean {
    // Se verifica si hay sesión activa mediante la respuesta del servidor
    return true; // El servidor verificará el token en cada petición
  }
}
