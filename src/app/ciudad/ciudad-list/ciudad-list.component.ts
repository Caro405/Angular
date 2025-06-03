import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CiudadService } from '../ciudad.service';
import { CiudadDto } from '../../dto/ciudad-dto';

@Component({
  selector: 'app-ciudad-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ciudad-list.component.html',
  styleUrls: ['./ciudad-list.component.css']
})

export class CiudadListComponent implements OnInit, OnDestroy {
  ciudades: CiudadDto[] = [];
  ciudadSeleccionada: CiudadDto | null = null;
  cargando: boolean = false;
  error: string | null = null;

  private readonly ciudadesMap = new Map<number, CiudadDto>();
  private readonly destroy$ = new Subject<void>();

  @Output() seleccionCiudad = new EventEmitter<string>();

  constructor(private readonly ciudadService: CiudadService) {}

  ngOnInit(): void {
    this.cargarCiudades();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarCiudades(): void {
    this.cargando = true;
    this.error = null;

    this.ciudadService.listarCiudades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (listaCiudades: CiudadDto[]) => {
          this.procesarCiudades(listaCiudades);
          this.cargando = false;
        },
        error: (error) => {
          this.manejarError('Error al cargar ciudades', error);
          this.cargando = false;
        }
      });
  }

  private procesarCiudades(listaCiudades: CiudadDto[]): void {
    this.ciudades = listaCiudades;
    this.ciudadesMap.clear();
    
    this.ciudades.forEach(ciudad => {
      if (ciudad?.id) {
        this.ciudadesMap.set(ciudad.id, ciudad);
      }
    });

    // Selecciona la primera ciudad por defecto si existe
    if (this.ciudades.length > 0) {
      this.mostrarDetalles(this.ciudades[0]);
    }
  }

  mostrarDetalles(ciudad: CiudadDto): void {
    if (!ciudad) {
      console.warn('Ciudad no válida para mostrar detalles');
      return;
    }

    this.ciudadSeleccionada = ciudad;
    this.seleccionCiudad.emit(ciudad.nombre);
    this.scrollToCiudad(ciudad.id);
  }

  confirmarCambioCiudad(idCiudadDestino: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validarIdCiudad(idCiudadDestino)) {
      return;
    }

   const confirmado = window.confirm(`¿Estás seguro de que quieres cambiar a la ciudad con ID ${idCiudadDestino}?`);
    
    if (confirmado) {
      const ciudadDestino = this.ciudadesMap.get(idCiudadDestino);
      if (ciudadDestino) {
        this.mostrarDetalles(ciudadDestino);
      } else {
        this.mostrarMensaje('Ciudad destino no encontrada.');
      }
    }
  }

  private validarIdCiudad(id: number): boolean {
    if (!id || id <= 0) { 
      this.mostrarMensaje('ID de ciudad no válido.');
      return false;
    }
    return true;
  }

  private scrollToCiudad(id: number): void {
    if (!id) return;

    setTimeout(() => {
      const elemento = document.getElementById(`ciudad-${id}`);
      if (elemento) {
        elemento.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100); // Aumentado el timeout para mejor rendimiento
  }

  private manejarError(mensaje: string, error: any): void {
    console.error(mensaje, error);
    this.error = mensaje;
  }

  private mostrarMensaje(mensaje: string): void {
    // Podrías reemplazar alert con un servicio de notificaciones más elegante
    alert(mensaje);
  }

  // Método público para recargar ciudades si es necesario
  recargarCiudades(): void {
    this.cargarCiudades();
  }
}