import { MarkerType as MarkerType } from './enums/marker-type.enum';
import { LatLng } from 'leaflet';

export interface MapOptions {
  HomeX: number;
  HomeY: number;
  CreationDate: string;
}

export interface User {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface FirebaseLoginResponse {
  idToken: string;
  expiresIn: string;
}

export interface MapMarker {
  position: LatLng;
  header: string;
  text: string;
  type: string;
  from?: string;
}

export interface FbAddMarkerResponse {
  name: string;
}

export interface ResourceMarker {
  type: MarkerType;
  name: string;
  icon?: string;
}

export interface AddMarkerInfo {
  position: LatLng;
}
