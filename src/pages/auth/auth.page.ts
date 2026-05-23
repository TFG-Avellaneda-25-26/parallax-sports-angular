import { Component } from '@angular/core';
import { AuthModeStore, AuthStore, AuthContainer } from '@features/auth';

@Component({
  imports: [AuthContainer],
  providers: [AuthStore, AuthModeStore],
  templateUrl: './auth.page.html'
})
export class AuthPage {

}
