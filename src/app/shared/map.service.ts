import { Injectable, EventEmitter, HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  @HostListener('homeClicked')
  public homeClicked = new EventEmitter();

}
