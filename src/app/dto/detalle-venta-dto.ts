import { ProductoDto } from './ciudad-dto';

export interface DetalleVenta {
  producto: ProductoDto;
  cantidad: number;
  precioUnitario: number;
}
