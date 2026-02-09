import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, CurrentUser } from '../../auth/auth.service';
import { UserRole } from '../../models/enums/user-role.enum';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  UserRole = UserRole;

  user: CurrentUser | null = null;
  userRole: UserRole | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.fetchCurrentUser().subscribe(user => {
      this.user = user;
      this.userRole = user?.role as UserRole ?? null;
    });
  }

  signOut(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.user = null;
        this.userRole = null;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
