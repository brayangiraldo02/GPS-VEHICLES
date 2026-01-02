import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  menuOptions = [
    { title: 'Tablas', icon: 'table_view', route: '/tablas', color: 'text-blue-600 bg-blue-100' },
    {
      title: 'Inventarios',
      icon: 'inventory_2',
      route: '/inventarios',
      color: 'text-orange-600 bg-orange-100',
    },
    {
      title: 'Facturación',
      icon: 'receipt_long',
      route: '/facturacion',
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Cartera',
      icon: 'account_balance_wallet',
      route: '/cartera',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Inspecciones',
      icon: 'fact_check',
      route: '/inspecciones',
      color: 'text-teal-600 bg-teal-100',
    },
    {
      title: 'Utilidades',
      icon: 'build',
      route: '/utilidades',
      color: 'text-gray-600 bg-gray-100',
    },
  ];
}
