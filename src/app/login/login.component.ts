import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppUser } from '../types/appuser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  name: FormControl;

  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly afStore: AngularFirestore,
  ) {
    this.name = new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
    ]);
  }

  ngOnInit() {}

  async login() {
    if (this.name.invalid) {
      console.error(`名前を再入力してください`);
      return;
    }
    if (this.afAuth.auth.currentUser) {
      console.error(`ログイン済みです`);
      return;
    }
    const userCredential = await this.afAuth.auth.signInAnonymously();
    if (!userCredential.user) {
      console.error('uidが正しく取得できませんでした');
      return;
    }
    const uid = userCredential.user.uid;
    const doc = this.afStore.doc<AppUser>(`users/${uid}`);
    doc.set({
      uid,
      name: this.name.value,
    });
    console.log(`ログインしました`);
  }

  async logout() {
    if (!this.afAuth.auth.currentUser) {
      console.warn(`ログインしていないのでログアウト不要`);
      return;
    }
    const uid = this.afAuth.auth.currentUser.uid;
    const doc = this.afStore.doc<AppUser>(`users/${uid}`);
    await doc.delete();
    await this.afAuth.auth.signOut();
  }

  async changeName() {
    if (!this.afAuth.auth.currentUser) {
      console.warn(`ログインしていないので名前は変更できません`);
      return;
    }
    if (this.name.invalid) {
      console.error(`名前を再入力してください`);
      return;
    }
    const uid = this.afAuth.auth.currentUser.uid;
    const doc = this.afStore.doc<AppUser>(`users/${uid}`);
    await doc.update({ name: this.name.value });
  }
}
