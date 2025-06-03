import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CiudadDto } from '../dto/ciudad-dto';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  private baseUrl = 'http://localhost:8080/api/ciudades'; // Ajusta esta URL si tu backend usa otra

  constructor(private http: HttpClient) {}

  listarCiudades(): Observable<CiudadDto[]> {
    return this.http.get<CiudadDto[]>(`${this.baseUrl}`);
  }
}
