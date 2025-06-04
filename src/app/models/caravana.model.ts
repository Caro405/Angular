import { ProductoInventario } from './producto-inventario.model';



export interface Jugador {
  id: number;
  nombre: string;
  rol: 'Administrador' | 'COMERCIANTE' | 'CARAVANERO';
}

export interface Inventario {
  productosInventario: {
    producto: any;
    cantidad: number;
  }[];
}

export interface Caravana {
  nombre: string;
  velocidad: number;
  cargaActual: number;
  capacidadMaxCarga: number;
  dinero: number;
  puntosVidaActual: number;
  puntosVidaMax: number;
  guardias: boolean;
  jugadores: Jugador[];
  inventario: Inventario;
}
