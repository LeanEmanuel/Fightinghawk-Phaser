import {Component, OnInit} from '@angular/core';
import {
  IonButton,
  IonContent,
} from "@ionic/angular/standalone";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-scores',
  templateUrl: './scores.page.html',
  styleUrls: ['./scores.page.scss'],
  imports: [
    IonContent,
    NgForOf,
    IonButton,
  ],
  standalone: true
})

/**
 * This component displays the top scores stored in localStorage.
 * It reads all entries starting with "highscore_", extracts player names and scores,
 * sorts them in descending order, and presents them in a list.
 */
export class ScoresPage implements OnInit {

  constructor(private router: Router) {}

  /** List of players and their scores, to be displayed in the view */
  public scoreList: { name: string, score: number }[] = [];

  /**
   * OnInit lifecycle hook: populates the score list from localStorage
   */
  ngOnInit() {
    this.scoreList = [];

    // Iterate through localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('highscore_')) {
        const name = key.replace('highscore_', '');
        const score = parseInt(localStorage.getItem(key) || '0');
        this.scoreList.push({name, score});
      }
    }

    // Sort scores in descending order and take the top 5
    this.scoreList = this.scoreList
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  /**
   * Navigates back to the home screen
   */
  goToHome() {
    this.router.navigateByUrl('/home');
  }
}

