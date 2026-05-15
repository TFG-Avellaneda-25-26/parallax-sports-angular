import { Component } from '@angular/core';
import { AuthFormComponent, AuthStore } from '@features/auth';

@Component({
  imports: [AuthFormComponent],
  providers: [AuthStore],
  templateUrl: './auth.page.html'
})
export class AuthPage {

}
