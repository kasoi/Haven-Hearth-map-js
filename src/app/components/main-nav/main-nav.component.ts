import { MarkerType } from './../../shared/enums/marker-type.enum';
import { MarkersService } from './../../shared/services/markers.service';
import { User, MapMarker, ResourceMarker } from './../../shared/interfaces';
import { AuthService } from './../../shared/auth.service';
import { environment } from 'src/environments/environment';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MapEvents } from './../../shared/map-events';
import { MapService } from './../../shared/map.service';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { Component, Output, EventEmitter, Input, ViewChild, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LatLng } from 'leaflet';
import { MatSelectChange } from '@angular/material/select';
import {CdkScrollableModule} from '@angular/cdk/scrolling';
import { ISlimScrollOptions } from 'ngx-slimscroll';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  @Input() resources: MapMarker[];

  @Output() typeSelected = new EventEmitter<ResourceMarker>();
  @Output() resourceClicked = new EventEmitter<MapMarker>();

  opts: ISlimScrollOptions;


  @ViewChild('drawer') navbar: MatSidenav;

  form: FormGroup;
  public loginFormOpened = false;

  typeControl: FormControl = new FormControl('', Validators.required);

  resourceTypes: ResourceMarker[] = [
    {type: null, name: 'All'},
    {type: MarkerType.Default, name: 'Default'},
    {type: MarkerType.Tree, name: 'Tree', icon: './assets/images/resources/select/tree.png'},
    {type: MarkerType.Clay, name: 'Clay', icon: './assets/images/resources/select/clay.png'},
    {type: MarkerType.Water, name: 'Water', icon: './assets/images/resources/select/water.png'},
    {type: MarkerType.Animal, name: 'Animal', icon: './assets/images/resources/select/animal.png'}];
  selectedType = this.resourceTypes[0];

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
    public mapService: MapService,
    public auth: AuthService,
    private markersService: MarkersService) {}

  ngOnInit(): void {
    this.form = new FormGroup( {
      email: new FormControl(environment.testLogin, [Validators.email, Validators.required]),
      password: new FormControl(environment.testPassword, [Validators.required])
    });


    this.opts = {
      position: 'right',
      barBackground: '#939393',
      barOpacity: '0.8',
      barWidth: '4',
      barBorderRadius: '1',
      // gridBackground: string; // #D9D9D9
      gridOpacity: '0',
      // gridWidth?: string; // 2
      // gridBorderRadius?: string; // 20
      gridMargin: '10',
      alwaysVisible: true,
      visibleTimeout: 700,
      // scrollSensitivity?: number; // 1
      // alwaysPreventDefaultScroll?: boolean; // true
    }
  }

  login(): void {
    const user: User = { email: this.form.get('email').value, password: this.form.get('password').value  };
    this.auth.login(user).subscribe(result => {
      console.log('login result', result);
    });
  }

  public toggleMenu(): void {
    this.navbar.toggle();
  }

  goHome(): void {
    this.mapService.homeClicked.emit('home');
  }

  sendMarker(): void {
    const num: string = Math.floor(Math.random() * 999).toString();

    const marker: MapMarker = {
      position: new LatLng(-86 + Math.random() * 5, 133 + Math.random() * 5),
      header: ('Test marker# ' + num),
      text: 'check check say wat wat',
      type: MarkerType.Default
    };

    this.markersService.addMarker(marker).subscribe(response => {
      console.log('add marker response:', response);

    });
  }

  typeControl_onSelect(change: MatSelectChange): void {
    const resource: ResourceMarker = change.value as ResourceMarker;
    this.typeSelected.emit(resource);
  }

  onResourceClick(marker: MapMarker): void {
    this.resourceClicked.emit(marker);
  }

}
