import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  name: FormControl;

  constructor(private readonly afAuth: AngularFireAuth) {
    this.name = new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
    ]);
  }

  ngOnInit() {}

  async login() {
    if (this.afAuth.auth.currentUser) {
      console.error(`ログイン済みです`);
      return;
    }
    await this.afAuth.auth.signInAnonymously();
    console.log(`ログインしました`);
  }
}
