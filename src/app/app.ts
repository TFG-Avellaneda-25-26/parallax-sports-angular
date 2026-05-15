import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@widgets/header';
import { VerifyEmailDialogComponent } from '@features/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, VerifyEmailDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
