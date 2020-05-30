import { AddObjectDialogComponent } from './components/add-object-dialog/add-object-dialog.component';
import { MarkersService } from './shared/services/markers.service';
import { MapService } from './shared/map.service';
import { MapOptions, MapMarker } from './shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { Component, OnInit } from '@angular/core';
import { latLng, CRS, Map, tileLayer, point, LeafletMouseEvent } from 'leaflet';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAddingMarker = false;

  map: Map;

  constructor(
      private http: HttpClient,
      private mapService: MapService,
      private markersService: MarkersService,
      private addMarkerDialog: MatDialog) {}

  path: string = 'assets/map/' + '2/tile_1_0.png';

  mapOptions: MapOptions = null;
  options = null;

  ngOnInit(): void {

    this.http.get('assets/map/6/options.json').subscribe( (response) => {
      const scriptMapOptions = response as MapOptions;
      this.createOptions(scriptMapOptions);
    });

    this.mapService.homeClicked.subscribe( () => {
      this.goHome();
    });
  }

  createOptions(mapOptions: MapOptions): void {

    this.mapOptions = mapOptions;

    this.options = {
      layers: [
        tileLayer('assets/map/' + '{z}/tile_{x}_{y}.png',
        {
          maxZoom: 8, attribution: 'dedushka lox',
          tileSize: 100
        })
      ],
      maxZoom: 6,
      crs: CRS.Simple,
      zoom: 6,
      minZoom: 2,
      center: [0, 0]
    };
  }

  goHome(): void {
    const homeX = this.mapOptions.HomeX * 100;
    const homeY = this.mapOptions.HomeY * 100;

    const pixelPos = point(homeX, homeY);
    const latlngval = this.map.unproject(pixelPos, 6);

    this.map.panTo(latlngval);
  }

  onMapReady(map: Map): void {
    this.map = map;
    this.goHome();

    this.markersService.getMarkers().subscribe(response => {
      for (const marker of response) {
        this.addMarker(marker as MapMarker);
      }
    });
  }

  addMarker(marker: MapMarker): void {
    const m = L.marker(marker.position);
    m.bindPopup(`<b>${marker.header}</b> <br> ${marker.text}`);
    m.addTo(this.map);
  }

  onMapClick(value: LeafletMouseEvent) {
    if (this.isAddingMarker === false) { return; }

    const latlng = value.latlng;
    const layerPoint = value.layerPoint;

    L.marker(latlng).addTo(this.map).bindPopup('new marker');

    const diag = this.addMarkerDialog.open(AddObjectDialogComponent,
      {
        data: { position: latlng }
      });
  }

  startAddMarker(): void {
    L.DomUtil.addClass(this.map.getContainer(), 'crosshair-cursor-enabled');
    this.isAddingMarker = true;
  }

  stopAddMarker(): void {
    L.DomUtil.removeClass(this.map.getContainer(), 'crosshair-cursor-enabled');
    this.isAddingMarker = false;
  }

  toggleMenu(): void {

  }
}
