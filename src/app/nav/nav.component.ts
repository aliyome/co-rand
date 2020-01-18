import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';
import { map, shareReplay, filter, tap, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../store/auth';
import { Store } from '@ngrx/store';
import * as fromAuth from '../store/auth';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay(),
    );

  user$: Observable<firebase.User | null>;
  userName$: Observable<string>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private readonly afStore: AngularFirestore,
    private readonly authStore: Store<fromAuth.State>,
  ) {
    // const doc$ = auth.select('uid').pipe(
    //   switchMap(uid => {
    //     if (uid === null) {
    //       return of(undefined);
    //     } else {
    //       return afStore.doc<AppUser>(`users/${uid}`).valueChanges();
    //     }
    //   }),
    // );
    // this.userName$ = doc$.pipe(map(d => (!!d ? d.name : '')));
  }

  logout() {
    this.authStore.dispatch(fromAuth.signOutAuth());
  }
}
