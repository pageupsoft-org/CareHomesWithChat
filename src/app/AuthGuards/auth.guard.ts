import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { IdentityService } from '../services/identity.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private identityServeice: IdentityService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.identityServeice.loggedIn()) {
      let url: string = state.url;
      return this.checkUserLogin(next, url)
    } else {
      localStorage.clear();
      window.location.pathname = "/login";
    }
  }

  private checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {

    const userRole = Number(this.identityServeice.getRole());
    console.log(route.data);
    if (route.data.role && route.data.role.indexOf(userRole) === -1) {
    // if (route.data.role.includes(Number(userRole))) {
      alert("You don't have access for this route");
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

}
