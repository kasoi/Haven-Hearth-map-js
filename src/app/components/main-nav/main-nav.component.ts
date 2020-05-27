import { FormControl, Validators } from '@angular/forms';
import { MapEvents } from './../../shared/map-events';
import { MapService } from './../../shared/map.service';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { Component, Output, EventEmitter, Input, ViewChild, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  @ViewChild('drawer') navbar: MatSidenav;

  typeControl: FormControl = new FormControl('', Validators.required);
  types: string[] = ['all', 'trees', 'resources'];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    isShown(): boolean {
      if (!this.navbar) { return false; }
      return this.navbar.opened;
    }

  constructor(
    private breakpointObserver: BreakpointObserver,
    public mapService: MapService) {}

  public toggleMenu(): void {
    this.navbar.toggle();
  }

  goHome(): void {
    this.mapService.homeClicked.emit('alo');
  }

}
