import { Producto } from '../producto/producto.model';

export interface DetalleVenta {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}
