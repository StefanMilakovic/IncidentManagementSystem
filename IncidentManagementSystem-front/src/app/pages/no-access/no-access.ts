import { Component } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {Header} from '../../components/header/header';

@Component({
  selector: 'app-no-access',
  imports: [
    Header
  ],
  templateUrl: './no-access.html',
  styleUrl: './no-access.css',
})
export class NoAccess {
  constructor(private authService: AuthService, private router: Router) {}

  goToLogin() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
