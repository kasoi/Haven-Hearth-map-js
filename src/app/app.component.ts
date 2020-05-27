import { MapService } from './shared/map.service';
import { MapOptions } from './shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { latLng, CRS, Map, tileLayer, point, LeafletMouseEvent } from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  map: Map;

  constructor(private http: HttpClient, private mapService: MapService) {}

  path: string = 'assets/map/' + '2/tile_1_0.png';

  mapOptions: MapOptions = null;
  options = null;

  title = 'haven';

  ngOnInit(): void {

    this.http.get('assets/map/6/options.json').subscribe( (response) => {
      const scriptMapOptions = response as MapOptions;
      console.log('json response:', response as MapOptions);
      this.createOptions(scriptMapOptions);
    });

    this.mapService.homeClicked.subscribe( (data) => {
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

      // this.map.on("click", e => {
      //   console.log(e.latlng); // get the coordinates
      //   L.marker([e.latlng.lat, e.latlng.lng], this.markerIcon).addTo(this.map); // add the marker onclick
      // });
  }

  onMapClick(value: LeafletMouseEvent) {
    const latlng = value.latlng;
    const layerPoint = value.layerPoint;

    console.log('leaflet click:', 'lat lng:', latlng, 'point:', layerPoint);
    L.marker(latlng).addTo(this.map);
  }

  toggleMenu(): void {

  }
}
