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

/**
 * HomePage component represents the main menu of the game.
 * It allows the user to enter their name, start the game or view high scores.
 */
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
  // Stores the name entered by the player
  playerName: string = '';

  constructor(private router: Router) {}

  /**
   * Stores the player name in localStorage and navigates to the game scene.
   */
  startGame() {
    const name = this.playerName.trim().substring(0, 8);
    localStorage.setItem('playerName', name);
    this.router.navigateByUrl('/game');
  }

  /**
   * Navigates to the high scores page.
   */
  goToScores() {
    this.router.navigateByUrl('/scores');
  }
}

