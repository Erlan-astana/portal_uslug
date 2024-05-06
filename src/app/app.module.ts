import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AppComponent} from './app.component';
import {MaterialModule} from './shared/modules/material.module';
import {RoutingModule} from './routing.module';

import {HeaderComponent} from './pages/header/header.component';
import {SidenavComponent} from './pages/sidenav/sidenav.component';
import {FooterComponent} from './pages/footer/footer.component';
import {CreateTaskComponent} from './pages/create-task/create-task.component';
import {AuthModule} from './core/auth/auth.module';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LayersService} from './services/layers.service';
import {MapControlsService} from './services/map.controls.service';
import {MapService} from './services/map.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GeomService} from './services/geom.service';
import {DicApplicationService} from './services/dic.application.service';
import {FileService} from './services/file.service';
import {SignService} from './services/sign.service';
import {RoleGuard} from './shared/helper/role.guard';
import {MessageBoxComponent} from './components/message-box/message-box.component';

import {MainComponent} from './pages/main/main.component';
import {LoginComponent} from './core/auth/login/login.component';
import {DragDropDirective} from './shared/directives/drag-drop/drag-drop.directive';
import {UserGuideComponent} from './pages/header/user-guide/user-guide.component';
import {HttpConfigInterceptor} from './core/interceptors/httpconfig.interceptor';
import { SelectStorageComponent } from './components/select-storage/select-storage.component';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    CreateTaskComponent,
    MessageBoxComponent,
    MainComponent,
    LoginComponent,
    DragDropDirective,
    UserGuideComponent,
    SelectStorageComponent
  ],
  entryComponents: [
    MessageBoxComponent,
    LoginComponent,
    UserGuideComponent,
    SelectStorageComponent
  ],
  exports: [
    AuthModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RoutingModule,
    AuthModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    LayersService,
    MapControlsService,
    MapService,
    GeomService,
    DicApplicationService,
    FileService,
    SignService,
    RoleGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
