import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const isLoggedIn = authService.isLoggedInGuard;
  if(!isLoggedIn){
    router.navigate(['/login']);
    return false;
  }
  return true;
};
