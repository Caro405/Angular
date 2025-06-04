import { ProductoDto } from './ciudad-dto'; // 👈 importa correctamente

export class ProductoCiudadDTO {
  producto!: ProductoDto;
  precio: number = 0;
  cantidadSeleccionada?: number; // usado para la compra desde Angular
}
