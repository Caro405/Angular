import { Producto } from '../producto/producto.model';

export interface ProductoInventario {
  producto: Producto;
  cantidad: number;
}
