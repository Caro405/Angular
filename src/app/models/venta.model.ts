import { Caravana } from './caravana.model';
import { CiudadDto } from '../dto/ciudad-dto';
import { DetalleVenta } from './detalle-venta.model';

export interface Venta {
  fecha: string;
  total: number;
  caravana: Caravana;
  ciudad: CiudadDto;
  detalles: DetalleVenta[];
}
