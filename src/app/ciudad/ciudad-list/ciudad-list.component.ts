import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CiudadService } from '../../service/ciudad.service';
import { CiudadDto, ProductoDto } from '../../dto/ciudad-dto';
import { Caravana } from '../../models/caravana.model';
import { DetalleVenta } from '../../models/detalle-venta.model';
import { VentaService } from '../../service/venta.service';

@Component({
  selector: 'app-ciudad-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ciudad-list.component.html',
  styleUrls: ['./ciudad-list.component.css']
})

export class CiudadListComponent implements OnInit, OnDestroy {
  @Input() caravana!: Caravana;
  @Output() seleccionCiudad = new EventEmitter<string>();

  ciudades: CiudadDto[] = [];
  ciudadSeleccionada: CiudadDto | null = null;
  productos: any[] = [];
  carrito: DetalleVenta[] = [];

  private readonly ciudadesMap = new Map<number, CiudadDto>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly ciudadService: CiudadService,
    private readonly ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarCiudades();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
private scrollToCiudad(id: number): void {
  setTimeout(() => {
    const target = document.getElementById(`ciudad-${id}`);
    const container = document.querySelector('.container');

    if (target && container) {
      const top = target.offsetTop - (container as HTMLElement).offsetTop;
      (container as HTMLElement).scrollTo({ top, behavior: 'smooth' });
    }
  }, 100);
}


  private cargarCiudades(): void {
    this.ciudadService.listarCiudades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lista) => {
          this.ciudades = lista;
          this.ciudadesMap.clear();
          lista.forEach(ciudad => this.ciudadesMap.set(ciudad.id, ciudad));
          if (this.ciudades.length > 0) {
            this.mostrarDetalles(this.ciudades[0]);
          }
        },
        error: () => alert('Error al cargar ciudades')
      });
  }

mostrarDetalles(ciudad: CiudadDto): void {
  this.ciudadSeleccionada = ciudad;
  this.seleccionCiudad.emit(ciudad.nombre);
  this.productos = ciudad.productos.map(p => ({
    producto: p,
    precio: p.precioBase,
    cantidadSeleccionada: 1
  }));
  this.scrollToCiudad(ciudad.id); 
}


  confirmarCambioCiudad(idCiudadDestino: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const ciudadDestino = this.ciudadesMap.get(idCiudadDestino);
    if (!ciudadDestino) return;

    const confirmado = confirm(`¿Deseas cambiar a la ciudad ${ciudadDestino.nombre}?`);
    if (!confirmado) return;

    const ruta = this.ciudadSeleccionada?.rutasSalida?.find(r => r.id === idCiudadDestino)
             || this.ciudadSeleccionada?.rutasLlegada?.find(r => r.id === idCiudadDestino);

    if (ruta && !ruta.esSegura) {
      this.restarVidaPorRuta(ruta.causaAtaque);
      alert(`⚠️ Ruta peligrosa: ${ruta.causaAtaque}. Vida restante: ${this.caravana.puntosVidaActual}`);
    }

    if (ciudadDestino.impuestos) {
      this.caravana.dinero -= ciudadDestino.impuestos;
      alert(`💰 Impuestos pagados: ${ciudadDestino.impuestos}. Dinero restante: ${this.caravana.dinero}`);
    }

    this.mostrarDetalles(ciudadDestino);
  }

  restarVidaPorRuta(causa: string): void {
    if (causa === 'Desastre Natural') this.caravana.puntosVidaActual -= 3;
    if (causa === 'Bandidos') this.caravana.puntosVidaActual -= 6;
    if (this.caravana.puntosVidaActual < 0) this.caravana.puntosVidaActual = 0;
  }

  agregarAlCarrito(producto: any): void {
    if (!producto.cantidadSeleccionada || producto.cantidadSeleccionada <= 0) {
      alert('Cantidad inválida');
      return;
    }

    const detalle: DetalleVenta = {
      producto: producto.producto,
      cantidad: producto.cantidadSeleccionada,
      precioUnitario: producto.precio
    };

    this.carrito.push(detalle);
    producto.cantidadSeleccionada = 1;
  }

  getTotal(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad * item.precioUnitario, 0);
  }

  comprar(): void {
    const total = this.getTotal();

    if (this.caravana.dinero < total) {
      alert('Dinero insuficiente.');
      return;
    }

    this.caravana.dinero -= total;

    this.carrito.forEach(item => {
      const encontrado = this.caravana.inventario.productosInventario.find(pi => pi.producto.id === item.producto.id);
      if (encontrado) {
        encontrado.cantidad += item.cantidad;
      } else {
        this.caravana.inventario.productosInventario.push({
          producto: item.producto,
          cantidad: item.cantidad
        });
      }
    });

    alert(`Compra realizada por $${total}`);
    this.carrito = [];
  }
}
