import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MapMarker, FbAddMarkerResponse } from './../interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  constructor(private http: HttpClient) { }

  public addMarker(marker: MapMarker): Observable<MapMarker> {
    return this.http.post(`${environment.firebaseUrl}/markers.json`, marker)
      .pipe(map( (response: FbAddMarkerResponse) => {
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
        return data;
      }));
  }
}
