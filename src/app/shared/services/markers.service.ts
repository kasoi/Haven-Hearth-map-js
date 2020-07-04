import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { MapMarker, FbAddMarkerResponse, MarkerIcon } from './../interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  @Output() MarkerAdded = new EventEmitter<MapMarker>();

  private icons: MarkerIcon[] = [
    {
      type: 'default',
      icon: './assets/images/resources/markers/marker-icon.png',
      size: [25, 41],
      shadow: './assets/images/resources/markers/marker-shadow.png'},
    {type: 'animal', icon: './assets/images/resources/select/animal.png', size: [24, 24]},
    {type: 'clay', icon: './assets/images/resources/select/clay.png', size: [24, 24]},
    {type: 'tree', icon: './assets/images/resources/select/tree.png', size: [24, 24]},
    {type: 'water', icon: './assets/images/resources/select/water.png', size: [24, 24]},
  ];

  private markers: MapMarker[] = [];

  constructor(private http: HttpClient) { }

  public getMarkerIcon(marker: MapMarker): MarkerIcon {
    const icon = this.icons.find(found => found.type === marker.type);

    if (icon === undefined) {
      return this.icons[0];
    } else {
      return icon;
    }
  }

  public addMarker(marker: MapMarker): Observable<MapMarker> {
    return this.http.post(`${environment.firebaseUrl}/markers.json`, marker)
      .pipe(map( (response: FbAddMarkerResponse) => {
        this.MarkerAdded.emit(marker);

        return {
          ...marker,
          id: response.name
        };
      }));
  }

  public getMarkers(): Observable<MapMarker[]> {
    return this.http.get<MapMarker[]>(`${environment.firebaseUrl}/markers.json`)
      .pipe(map( (response: {[key: string]: any}) => {

        if (response === null || response === undefined) { return []; }

        const data = Object
          .keys(response)
          .map(key => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date)
          }));
        this.markers = data;

        return data;
      }));
  }

  public getLocalMarkers(): MapMarker[] {
    return this.markers;
  }
}
