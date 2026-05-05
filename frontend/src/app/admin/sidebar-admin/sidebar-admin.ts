import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-admin.html',
  styleUrls: ['./sidebar-admin.css']
})
export class SidebarAdminComponent implements OnInit {
  activeRoute: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.activeRoute = this.router.url;
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  logout() {
    this.authService.logout();
  }

  irADashboard() {
    this.router.navigate(['/dashboard']);
  }
}