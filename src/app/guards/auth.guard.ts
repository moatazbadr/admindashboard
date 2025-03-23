import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const tokenExpiration = localStorage.getItem('tokenExpiration'); // Retrieve expiration time

 // console.log("AuthGuard Triggered. Token:", token);

  if (!token || token.trim().length === 0) {
    console.warn("Unauthorized access attempt. Redirecting to login.");
    router.navigateByUrl('/login');
    return false;
  }

  // Check if token is expired
  const now = new Date().getTime();
  if (tokenExpiration && parseInt(tokenExpiration) < now) {
    console.warn("Token expired. Logging out.");
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    alert("Your session has expired. Please log in again.");
    router.navigateByUrl('/login');
    return false;
  }

  return true; // Allow access
};
