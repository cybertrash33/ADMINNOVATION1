import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-usuario.component.html',
  styleUrls: ['./header-usuario.component.css']
})
export class HeaderUsuarioComponent implements OnInit, OnDestroy {
  usuarioActual: any = {};
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.subscription = this.authService.usuario$.subscribe((user) => {
      if (user) {
        this.usuarioActual = user;
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}