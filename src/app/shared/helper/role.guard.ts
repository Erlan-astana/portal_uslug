import {Injectable} from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class RoleGuard implements CanActivate {

  jwtHelper: JwtHelperService;

  constructor(
    public auth: AuthService,
    public router: Router
  ) {
    this.jwtHelper = new JwtHelperService();
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    const roles = route.data.roles;
    const token = localStorage.getItem('access_token');
    const tokenData = this.jwtHelper.decodeToken(token);
    let hasPermission = false;
    if (roles && Array.isArray(roles)) {
      roles.forEach(role => {
        if (tokenData.authorities.some(e => e === role)) {
          hasPermission = true;
        }
      });
    }

    if (!roles && this.auth.isAuthenticated()) {
      hasPermission = true;
    }
    return hasPermission;
  }
}
