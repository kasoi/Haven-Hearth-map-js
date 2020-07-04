import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthInterceptor } from './shared/auth.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AddObjectDialogComponent } from './components/add-object-dialog/add-object-dialog.component';
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS, ISlimScrollOptions } from 'ngx-slimscroll';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
}

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    AddObjectDialogComponent,
  ],
  imports: [
    BrowserModule,
    NgSlimScrollModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    LeafletModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CdkScrollableModule,
    ScrollingModule
  ],
  providers: [INTERCEPTOR_PROVIDER,
    {
      provide: SLIMSCROLL_DEFAULTS,
      useValue: {
        alwaysVisible : false
      } as ISlimScrollOptions
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
