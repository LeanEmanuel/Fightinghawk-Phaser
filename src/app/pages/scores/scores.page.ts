import { Component, OnInit } from '@angular/core';
import {IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-scores',
  templateUrl: './scores.page.html',
  styleUrls: ['./scores.page.scss'],
  imports: [
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    NgForOf,
    IonHeader
  ],
  standalone: true
})
export class ScoresPage implements OnInit {
  public scoreList: { name: string, score: number }[] = [];

  ngOnInit() {
    this.scoreList = [];

    // Recorremos localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('highscore_')) {
        const name = key.replace('highscore_', '');
        const score = parseInt(localStorage.getItem(key) || '0');
        this.scoreList.push({ name, score });
      }
    }

    // Ordenar de mayor a menor
    this.scoreList.sort((a, b) => b.score - a.score);
  }
}

