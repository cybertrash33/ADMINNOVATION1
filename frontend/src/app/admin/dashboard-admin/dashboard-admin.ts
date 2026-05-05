import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderAdminComponent, SidebarAdminComponent],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardAdminComponent implements OnInit {
  usuarioActual: any = null;
  loadingStats: boolean = true;
  stats: any = {
    usuarios: { total: 0, activos: 0, nuevosMes: 0 },
    pqrs: { total: 0, pendientes: 0, resueltasMes: 0 },
    actividades: { total: 0, activos: 0, proximos: 0 }
  };
  private usuariosChart: any;
  private pqrsChart: any;
  private actividadesChart: any;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.loadingStats = true;
    this.http.get(environment.apiUrl + '/estadisticas').subscribe({
      next: (data: any) => {
        this.stats = {
          usuarios: {
            total: data.usuarios.total,
            activos: data.usuarios.activos,
            nuevosMes: data.usuarios.nuevosMes
          },
          pqrs: {
            total: data.pqrs.total,
            pendientes: data.pqrs.pendientes,
            resueltasMes: data.pqrs.resueltasMes
          },
          actividades: {
            total: data.actividades.total,
            activos: data.actividades.activos,
            proximos: data.actividades.proximos
          }
        };

if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
              this.inicializarGraficos(data);
            }, 100);
          }
        this.loadingStats = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.toastService.error('Error al cargar las estadísticas');
        this.stats = {
          usuarios: { total: 150, activos: 120, nuevosMes: 15 },
          pqrs: { total: 85, pendientes: 12, resueltasMes: 30 },
          actividades: { total: 25, activos: 18, proximos: 5 }
        };

if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
              this.inicializarGraficos();
            }, 100);
          }
        this.loadingStats = false;
      }
    });
  }

  inicializarGraficos(data?: any) {
    this.crearUsuariosChart(data?.usuarios?.distribucion);
    this.crearPqrsChart(data?.pqrs?.porEstado);
    this.crearActividadesChart(data?.actividades?.porMes);
  }

  crearUsuariosChart(distribucion?: number[]) {
    const ctx = document.getElementById('usuariosChart') as HTMLCanvasElement;
    if (ctx) {
      const data = distribucion || [120, 30, 15];
      const maxValue = Math.max(...data);
      this.usuariosChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Activos', 'Inactivos', 'Nuevos este mes'],
          datasets: [{
            label: 'Usuarios',
            data: data,
            backgroundColor: ['#00D1B2', '#64748B', '#3B82F6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.2,
          plugins: {
            legend: { display: false },
            datalabels: {
              display: true, color: '#fff',
              font: { weight: 'bold', size: 12 },
              formatter: (value: number) => value
            }
          },
          scales: {
            y: { beginAtZero: true, suggestedMax: maxValue + 1, grid: { display: false }, ticks: { precision: 0 } },
            x: { grid: { display: false }, ticks: { precision: 0 } }
          }
        }
      });
    }
  }

  crearPqrsChart(porEstado?: number[]) {
    const ctx = document.getElementById('pqrsChart') as HTMLCanvasElement;
    if (ctx) {
      const data = porEstado || [12, 25, 40, 8];
      const maxValue = Math.max(...data);
      this.pqrsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Pendientes', 'En Proceso', 'Resueltas', 'Cerradas'],
          datasets: [{
            label: 'PQRS',
            data: data,
            backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#6B7280'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.2,
          plugins: {
            legend: { display: false },
            datalabels: {
              display: true, color: '#fff',
              font: { weight: 'bold', size: 12 },
              formatter: (value: number) => value
            }
          },
          scales: {
            y: { beginAtZero: true, suggestedMax: maxValue + 1, grid: { display: false }, ticks: { precision: 0 } },
            x: { grid: { display: false }, ticks: { precision: 0 } }
          }
        }
      });
    }
  }

  crearActividadesChart(porMes?: number[]) {
    const ctx = document.getElementById('actividadesChart') as HTMLCanvasElement;
    if (ctx) {
      const data = porMes || [4, 6, 5, 8, 7, 5];
      const maxValue = Math.max(...data);
      this.actividadesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [{
            label: 'Actividades',
            data: data,
            borderColor: '#00D1B2',
            backgroundColor: 'rgba(0, 209, 178, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.2,
          plugins: {
            legend: { display: false },
            datalabels: {
              display: true, color: '#1E293B',
              font: { weight: 'bold', size: 11 },
              align: 'top', anchor: 'end', offset: 4,
              formatter: (value: number) => value
            }
          },
          scales: {
            y: { beginAtZero: true, suggestedMax: maxValue + 1, grid: { display: false }, ticks: { precision: 0 } },
            x: { grid: { display: false }, ticks: { precision: 0 } }
          }
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}