import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
  Route,
  UrlSegment,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromAuth from '../store/auth';
import { map, filter, skipUntil } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class BeforeLoginOnlyGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authStore: Store<fromAuth.State>,
    private afAuth: AngularFireAuth,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const authIsInitialized$ = this.authStore.pipe(
      select(fromAuth.selectAuthIsInitialized),
      filter(x => x),
    );
    return this.authStore.pipe(
      skipUntil(authIsInitialized$),
      select(fromAuth.selectAuthUid),
      map(uid => {
        console.log(uid);
        if (uid) {
          return this.router.parseUrl('room');
        } else {
          return this.router.parseUrl('');
        }
      }),
    );
  }
}
