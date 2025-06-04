import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CiudadListComponent } from './ciudad/ciudad-list/ciudad-list.component';
import { CaravanaComponent } from './caravana/caravana.component';
import { Caravana } from '../app/models/caravana.model';


interface Jugador {
  id: number;
  nombre: string;
  rol: 'Administrador' | 'COMERCIANTE' | 'CARAVANERO';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, CiudadListComponent, CaravanaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bienvenidos al Juego';
  paso = 0;
  cantidadJugadores = 1;
  jugadores: Jugador[] = [];
  jugadorActual: Jugador = { id: 0, nombre: '', rol: 'COMERCIANTE' };
  ciudadActual: string = 'Ciudad 1';

 caravana: Caravana = {
  nombre: 'Caravana Alfa',
  velocidad: 50,
  cargaActual: 0,
  capacidadMaxCarga: 500,
  dinero: 10000000,
  puntosVidaActual: 100,
  puntosVidaMax: 100,
  guardias: true,
  jugadores: [],
  inventario: {
    productosInventario: []
  }
};

  continuar() {
    if (this.jugadores.length < this.cantidadJugadores) {
      this.jugadores.push({ ...this.jugadorActual });
      this.jugadorActual = { id: 0, nombre: '', rol: 'COMERCIANTE' };
    }
    if (this.jugadores.length === this.cantidadJugadores) {
      this.caravana.jugadores = this.jugadores;
      this.paso = 2;
    }
  }
}
