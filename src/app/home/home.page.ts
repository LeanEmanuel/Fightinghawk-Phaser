import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    FormsModule,
    IonButton,
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

