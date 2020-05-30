import { MarkerType } from './../../shared/enums/marker-type.enum';
import { MarkersService } from './../../shared/services/markers.service';
import { User, MapMarker } from './../../shared/interfaces';
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

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  @ViewChild('drawer') navbar: MatSidenav;

  form: FormGroup;

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
    public mapService: MapService,
    private auth: AuthService,
    private markersService: MarkersService) {}

  ngOnInit(): void {
    this.form = new FormGroup( {
      email: new FormControl(environment.testLogin, [Validators.email, Validators.required]),
      password: new FormControl(environment.testPassword, [Validators.required])
    });
  }

  login(): void {
    console.log('try to login. Login: ', this.form.get('email').value, 'password:', this.form.get('password').value);
    console.log('form:', this.form);
    const user: User = { email: this.form.get('email').value, password: this.form.get('password').value  };
    this.auth.login(user).subscribe(result => {
      console.log('login????????? result', result);

    });
  }

  public toggleMenu(): void {
    this.navbar.toggle();
  }

  goHome(): void {
    this.mapService.homeClicked.emit('alo');
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

}
