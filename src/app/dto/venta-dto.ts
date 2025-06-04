import { DetalleVenta } from './detalle-venta-dto';
import { Caravana } from '../models/caravana.model';
import { CiudadDto } from './ciudad-dto';

export interface Venta {
  fecha: string;
  total: number;
  caravana: Caravana;
  ciudad: CiudadDto;
  detalles: DetalleVenta[];
}
