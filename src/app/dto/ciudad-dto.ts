export class CiudadDto {
  id: number;
  nombre: string;
  impuestos: number;
  rutasSalida: RutaDto[] = [];
  rutasLlegada: RutaDto[] = [];
  productos: ProductoDto[] = [];  // Asegúrate de agregar esta propiedad si quieres mostrar productos

  constructor(id: number, nombre: string, impuestos: number, rutasSalida: RutaDto[], rutasLlegada: RutaDto[], productos: ProductoDto[]) {
    this.id = id;
    this.nombre = nombre;
    this.impuestos = impuestos;
    this.rutasSalida = rutasSalida;
    this.rutasLlegada = rutasLlegada;
    this.productos = productos;
  }
}

export class RutaDto {
  id: number;
  distancia: number;
  esSegura: boolean;
  ataque: number;
  causaAtaque: string;

  constructor(id: number, distancia: number, esSegura: boolean, ataque: number, causaAtaque: string) {
    this.id = id;
    this.distancia = distancia;
    this.esSegura = esSegura;
    this.ataque = ataque;
    this.causaAtaque = causaAtaque;
  }
}

export class ProductoDto {
  id: number;
  nombre: string;
  categoria: string;
  precioBase: number;

  constructor(id: number, nombre: string, categoria: string, precioBase: number) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precioBase = precioBase;
  }
}
