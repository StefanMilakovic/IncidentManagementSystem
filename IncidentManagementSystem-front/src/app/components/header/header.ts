import { Component } from '@angular/core';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  constructor(private authService: AuthService) {}

  signInWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
