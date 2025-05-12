import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from '../../phaser/game.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GameComponent,
  ]
})
export class GamePage  {
  constructor() {}
}

