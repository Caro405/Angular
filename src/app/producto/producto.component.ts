import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoCiudadDTO } from '../dto/producto-dto';
import { Caravana } from '../models/caravana.model';
import { CiudadDto } from '../dto/ciudad-dto';
import { DetalleVenta } from '../models/detalle-venta.model';
import { Venta } from '../models/venta.model';
import { VentaService } from '../service/venta.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto.component.html'
})
export class ProductoComponent {
  @Input() productos: ProductoCiudadDTO[] = [];
  @Input() caravana!: Caravana;
  @Input() ciudad!: CiudadDto;

  carrito: DetalleVenta[] = [];

  constructor(private ventaService: VentaService) {}

  agregarAlCarrito(productoCiudad: ProductoCiudadDTO) {
    if (!productoCiudad.cantidadSeleccionada || productoCiudad.cantidadSeleccionada <= 0) {
      alert('Cantidad inválida.');
      return;
    }

    const detalle: DetalleVenta = {
      producto: productoCiudad.producto,
      cantidad: productoCiudad.cantidadSeleccionada,
      precioUnitario: productoCiudad.precio
    };

    this.carrito.push(detalle);
    productoCiudad.cantidadSeleccionada = 0; // limpiar input
  }

  getTotal(): number {
    return this.carrito.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0);
  }

  comprar() {
    const total = this.getTotal();

    if (this.caravana.dinero < total) {
      alert('Dinero insuficiente.');
      return;
    }

    const venta: Venta = {
      fecha: new Date().toISOString(),
      total,
      caravana: this.caravana,
      ciudad: this.ciudad,
      detalles: this.carrito
    };

    this.ventaService.registrarVenta(venta).subscribe({
      next: () => {
        alert('Compra realizada con éxito');
        this.caravana.dinero -= total;

        // Añadir al inventario
        this.carrito.forEach(detalle => {
          const existente = this.caravana.inventario.productosInventario.find(pi => pi.producto.id === detalle.producto.id);
          if (existente) {
            existente.cantidad += detalle.cantidad;
          } else {
            this.caravana.inventario.productosInventario.push({
              producto: detalle.producto,
              cantidad: detalle.cantidad
            });
          }
        });

        this.carrito = [];
      },
      error: () => alert('Error al registrar la compra')
    });
  }
}
