import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-caravana',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './caravana.component.html',
  styleUrls: ['./caravana.component.css']
})
export class CaravanaComponent {
  @Input() caravana: any;
}