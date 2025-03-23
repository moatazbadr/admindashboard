import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {

  const token=localStorage.getItem('token');

const ClonedRequest=req.clone(
  {
    setHeaders: {
      Authorization:`Bearer ${token}`
    }
  }
)

  return next(ClonedRequest);
};
