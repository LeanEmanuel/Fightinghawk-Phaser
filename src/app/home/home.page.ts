import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel, IonRouterLink,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    FormsModule,
    IonButton,
    IonRouterLink
  ]
})
export class HomePage {
  playerName: string = '';

  constructor(private router: Router) {}

  startGame() {
    localStorage.setItem('playerName', this.playerName.trim());
    this.router.navigateByUrl('/game');
  }

  goToScores() {
    this.router.navigateByUrl('/scores');
  }
}

