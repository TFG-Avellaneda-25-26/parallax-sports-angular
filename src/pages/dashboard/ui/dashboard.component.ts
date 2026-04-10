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
          <h2>Bienvenido, {{ user()?.displayName || user()?.email }}!</h2>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .dashboard-header {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;

      h1 {
        margin: 0;
        font-size: 28px;
      }
    }

    .logout-btn {
      padding: 10px 20px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #c82333;
      }
    }

    .dashboard-content {
      flex: 1;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .welcome-section,
    .placeholder-section {
      background: white;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      h2 {
        margin-top: 0;
        color: #333;
      }

      p {
        color: #666;
        margin: 0;
      }
    }
  `],
})
export class DashboardComponent {
  private store = inject(AuthStore);
  private router = inject(Router);

  user = this.store.user;

  logout(): void {
    this.store.logout();
    this.router.navigate(['/login']);
  }
}
