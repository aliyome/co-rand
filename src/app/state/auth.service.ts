import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from './auth.store';
import { tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly authStore: AuthStore,
    private readonly afAuth: AngularFireAuth,
  ) {}

  sync() {
    this.afAuth.user.subscribe(u =>
      this.authStore.update({ uid: u ? u.uid : null }),
    );
  }

  update(uid: string | null) {
    this.authStore.update({ uid });
  }

  async signIn() {
    await this.afAuth.auth.signInAnonymously();
  }
  async signOut() {
    await this.afAuth.auth.signOut();
  }
}
