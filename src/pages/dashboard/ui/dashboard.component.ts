import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '@features/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <nav class="dashboard-header">
        <h1>Dashboard de Deportes</h1>
        <button (click)="logout()" class="logout-btn">
          Cerrar sesión
        </button>
      </nav>

      <main class="dashboard-content">
        <section class="welcome-section">
          <h2>Bienvenido!</h2>
          <p>Estás autenticado en el sistema.</p>
        </section>

        <section class="placeholder-section">
          <p>Aquí irá el contenido del dashboard con los eventos deportivos.</p>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .dashboard-header {
      background-color: #333;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 20px;
    }

    .logout-btn {
      padding: 8px 16px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
    }

    .logout-btn:hover {
      background-color: #c82333;
    }

    .dashboard-content {
      flex: 1;
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
      width: 100%;
    }

    .welcome-section,
    .placeholder-section {
      background: white;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      border: 1px solid #ddd;
    }

    .welcome-section h2 {
      margin: 0 0 8px 0;
      font-size: 18px;
      color: #333;
    }

    .welcome-section p,
    .placeholder-section p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  `],
})
export class DashboardComponent {
  private store = inject(AuthStore);
  private router = inject(Router);

  logout(): void {
    this.store.logout();
    this.router.navigate(['/login']);
  }
}
