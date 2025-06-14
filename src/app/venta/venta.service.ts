import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Venta } from '../models/venta.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private apiUrl = 'http://localhost:8080/api/ventas'; // Ajusta si tu backend usa otra URL

  constructor(private http: HttpClient) {}

  registrarVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta);
  }

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  obtenerVentaPorId(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/${id}`);
  }
}
