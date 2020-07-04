import { MarkerType } from './shared/enums/marker-type.enum';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddObjectDialogComponent } from './components/add-object-dialog/add-object-dialog.component';
import { MarkersService } from './shared/services/markers.service';
import { MapService } from './shared/map.service';
import { MapOptions, MapMarker, ResourceMarker } from './shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { latLng, CRS, Map, tileLayer, point, LeafletMouseEvent } from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from './shared/auth.service';

interface MarkerDataItem {
  data: MapMarker;
  marker: L.Marker;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('popOverState', [
      state('show', style({
        'margin-left': 150
      })),
      state('hide', style({
        'margin-left': 0
      })),
      transition('show <=> hide', animate('200ms ease-out'))
    ])
  ]
})
export class AppComponent implements OnInit {

  @ViewChild('mainmenu') mainMenu: MainNavComponent;

  isAddingMarker = false;

  map: Map;
  mapMarkers: MarkerDataItem[] = [];

  menuShown = false;

  constructor(
      private http: HttpClient,
      public auth: AuthService,
      private mapService: MapService,
      private markersService: MarkersService,
      private addMarkerDialog: MatDialog) {}

  get stateName() {
    if (this.mainMenu == null) { return 'show'; }
    return this.mainMenu.isShown() ? 'show' : 'hide';
  }

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
    console.log(this.mainMenu);

    this.map = map;
    this.goHome();

    this.markersService.getMarkers().subscribe(response => {
      for (const marker of response) {
        this.addMarker(marker as MapMarker);
      }
      this.showMarkers(null);
    });
    this.markersService.MarkerAdded.subscribe((addingMarker: MapMarker) => {
      this.addMarker(addingMarker);
    });
    this.map.on('contextmenu', () => {
      if (this.isAddingMarker) {
        this.stopAddMarker();
      }
    });
  }

  addMarker(marker: MapMarker): void {
    const markerIcon = this.markersService.getMarkerIcon(marker);

    const options = {
      icon: L.icon({
        iconUrl: markerIcon.icon,
        iconSize: markerIcon.size,
        iconAnchor: [markerIcon.size[0] / 2, 1],
        shadowUrl: markerIcon.shadow,
      }),
      type: marker.type
    };

    const m = L.marker(marker.position, options);

    m.bindPopup(`<b>${marker.header}</b> <br> ${marker.text || ''}`);
    m.addTo(this.map);
    m.on('contextmenu', () => {
      console.log('mark context menu?');
    });
    this.mapMarkers.push({data: marker, marker: m});
  }

  onMapClick(value: LeafletMouseEvent) {
    if (this.isAddingMarker === false) { return; }

    const latlng = value.latlng;
    const layerPoint = value.layerPoint;

    const diag = this.addMarkerDialog.open(AddObjectDialogComponent,
      {
        data: { position: latlng }
      });
  }

  startAddMarker(): void {
    if (this.isAddingMarker) {
      this.stopAddMarker();
      return;
    }
    L.DomUtil.addClass(this.map.getContainer(), 'crosshair-cursor-enabled');
    this.isAddingMarker = true;
  }

  stopAddMarker(): void {
    L.DomUtil.removeClass(this.map.getContainer(), 'crosshair-cursor-enabled');
    this.isAddingMarker = false;
  }

  hideMarkers(): void {

  }

  showMarkers(type: string): void {
    const currentMarkers = [];

    this.mapMarkers.forEach(element => {
      const marker = element.marker;
      const data = element.data;

      if (type === null) {
        currentMarkers.push(data);
        marker.setOpacity(1);
        return;
      }

      if (data.type !== type) { marker.setOpacity(0); }
      else {
        marker.setOpacity(1);
        currentMarkers.push(data);
      }
    });

    this.mainMenu.resources = currentMarkers;
  }

  onTypeSelected(resource: ResourceMarker): void {
    this.showMarkers(resource.type);
  }

  onResourceClicked(markerData: MapMarker): void {
    const item = this.mapMarkers.find(mapMarker => mapMarker.data === markerData);

    const marker = item.marker;
    marker.openPopup();
    this.map.panTo(marker.getLatLng());

  }
}
