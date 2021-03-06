import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import * as authSelectors from '../store/auth/auth.selectors';
import * as authActions from '../store/auth/auth.actions';
import * as fromAuth from '../store/auth/auth.reducer';
import * as fromRoom from '../store/room';
import { Store, select } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { AuthUser } from '../store/auth/auth.model';
import { AuthService } from '../store/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  name: FormControl;

  constructor(
    private readonly authStore: Store<fromAuth.State>,
    private readonly authService: AuthService,
    private readonly afStore: AngularFirestore,
  ) {
    this.name = new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
    ]);
  }

  ngOnInit() {}

  login() {
    if (this.name.invalid) {
      console.error(`名前を再入力してください`);
      return;
    }
    this.authStore.dispatch(authActions.signInAuth({ name: this.name.value }));
  }

  async logout() {
    const uid = await this.authStore
      .pipe(first(), select(authSelectors.selectAuthUid))
      .toPromise();

    if (!uid) {
      console.warn(`ログインしていないのでログアウト不要`);
      return;
    }
    this.authStore.dispatch(authActions.signOutAuth());
  }

  async changeName() {
    // if (!this.auth.getValue().uid) {
    //   console.warn(`ログインしていないので名前は変更できません`);
    //   return;
    // }
    // if (this.name.invalid) {
    //   console.error(`名前を再入力してください`);
    //   return;
    // }
    // const uid = this.auth.getValue().uid;
    // const doc = this.afStore.doc<AppUser>(`users/${uid}`);
    // await doc.update({ name: this.name.value });
  }
}
