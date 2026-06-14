import { HttpInterceptorFn } from '@angular/common/http';
import { localStorageEnvironment, sessionStorageEnvironment } from '../../evirement';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(`${localStorageEnvironment.authToken.key}`) || sessionStorage.getItem(`${sessionStorageEnvironment.authToken.key}`);

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
