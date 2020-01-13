import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from './auth.store';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private authStore: AuthStore) {}

  update(uid: string | null) {
    this.authStore.update({ uid });
  }
}
