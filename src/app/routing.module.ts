import {NgModule} from '@angular/core';
import {NavigationEnd, Router, RouterModule, Routes} from '@angular/router';

import {MainComponent} from './pages/main/main.component';


const appRoutes: Routes = [
  {
    path: 'arch',
    loadChildren: './departments/architecture/architecture.module#ArchitectureModule'
  },
  {
    path: 'cn',
    loadChildren: './service-departments/cn/cn.module#CnModule'
  },
  {
    path: 'own',
    loadChildren: './service-departments/ownership/ownership.module#OwnershipModule'
  },
  {
    path: 'sketch',
    loadChildren: './service-departments/sketch/sketch.module#SketchModule'
  },
  {
    path: 'short-service',
    loadChildren: './service-departments/short-service/short-service.module#ShortServiceModule'
  },
  {
    path: 'apz',
    loadChildren: './service-departments/apz/apz.module#ApzModule'
  },
  {
    path: 'bez-torg-reg',
    loadChildren: './service-departments/bez-torg-reg/bez-torg-reg.module#BezTorgRegModule'
  },
  {
    path: 'beztorgreg2',
    loadChildren: './service-departments/beztorgreg2/beztorgreg2.module#Beztorgreg2Module'
  },
  {
    path: 'zu-pl',
    loadChildren: './service-departments/zu-pl/zu-pl.module#ZuPlModule'
  },
  {
    path: 'admin',
    loadChildren: './departments/admin/admin.module#AdminModule'
  },
  {
    path: 'directory',
    loadChildren: './departments/directory/directory.module#DirectoryModule'
  },
  {
    path: 'specreg',
    loadChildren: './departments/specreg/specreg.module#SpecregModule'
  },
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'create-app',
    loadChildren: './departments/build-application/build-application.module#BuildApplicationModule'
  },
  {
    path: 'auth',
    loadChildren: './core/auth/auth.module#AuthModule'
  },
  {
    path: '**',
    redirectTo: ''
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      enableTracing: false,
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule],
  providers: []
})
export class RoutingModule {
  constructor(
    router: Router
  ) {
    // Scroll to top
    router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
