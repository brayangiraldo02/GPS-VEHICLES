import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: false,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  logoURL =
    'https://res.cloudinary.com/dhry2v8qz/image/upload/v1747705038/AlfaSoft/company-logo/AlfaSoft.png';

  private authService = inject(AuthService);

  get userName(): string {
    return this.authService.user?.nombre?.toUpperCase() || 'USUARIO';
  }

  logout(): void {
    this.authService.logout();
  }
}
