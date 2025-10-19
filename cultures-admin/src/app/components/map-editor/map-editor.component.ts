import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MapZone {
  id: string;
  label: string;
  points: {x: number, y: number}[]; // Coordonnées en pourcentage
  isCorrect: boolean;
}

@Component({
  selector: 'app-map-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent {
  @Input() imageUrl: string = '';
  @Input() zones: MapZone[] = [];
  @Output() zonesChange = new EventEmitter<MapZone[]>();

  currentZone = signal<{x: number, y: number}[]>([]);
  isDrawing = signal(false);
  selectedZone = signal<string | null>(null);
  newZoneLabel = signal('');
  showLabelInput = signal(false);

  constructor() {
    // Effet pour émettre les changements
    effect(() => {
      // Déclenché quand zones change
    });
  }

  onImageClick(event: MouseEvent) {
    if (!this.isDrawing()) return;

    const img = event.target as HTMLElement;
    const rect = img.getBoundingClientRect();
    
    // Coordonnées en pourcentage (arrondi à 2 décimales)
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 10000) / 100;
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 10000) / 100;

    this.currentZone.set([...this.currentZone(), { x, y }]);
  }

  startDrawing() {
    this.isDrawing.set(true);
    this.currentZone.set([]);
    this.showLabelInput.set(false);
  }

  finishZone() {
    if (this.currentZone().length < 3) {
      alert('Une zone doit avoir au moins 3 points');
      return;
    }

    this.isDrawing.set(false);
    this.showLabelInput.set(true);
  }

  saveZone() {
    const label = this.newZoneLabel().trim();
    if (!label) {
      alert('Donne un nom à la zone');
      return;
    }

    const newZone: MapZone = {
      id: `zone_${Date.now()}`,
      label: label,
      points: this.currentZone(),
      isCorrect: this.zones.length === 0 // Première zone = correcte par défaut
    };

    this.zones = [...this.zones, newZone];
    this.zonesChange.emit(this.zones);

    // Reset
    this.currentZone.set([]);
    this.newZoneLabel.set('');
    this.showLabelInput.set(false);
  }

  cancelZone() {
    this.currentZone.set([]);
    this.isDrawing.set(false);
    this.showLabelInput.set(false);
    this.newZoneLabel.set('');
  }

  deleteZone(zoneId: string) {
    this.zones = this.zones.filter(z => z.id !== zoneId);
    this.zonesChange.emit(this.zones);
  }

  toggleCorrectZone(zoneId: string) {
    this.zones = this.zones.map(z => ({
      ...z,
      isCorrect: z.id === zoneId ? !z.isCorrect : z.isCorrect
    }));
    this.zonesChange.emit(this.zones);
  }

  getPolygonPoints(zone: MapZone): string {
    return zone.points.map(p => `${p.x}%,${p.y}%`).join(' ');
  }

  getCurrentZonePoints(): string {
    return this.currentZone().map(p => `${p.x}%,${p.y}%`).join(' ');
  }

  selectZone(zoneId: string) {
    this.selectedZone.set(zoneId);
  }

  getCorrectZonesCount(): number {
    return this.zones.filter(z => z.isCorrect).length;
  }
}

