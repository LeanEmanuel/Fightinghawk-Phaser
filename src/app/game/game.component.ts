import {Component, OnInit} from '@angular/core';
import Phaser from 'phaser';
import { GameScene } from './scenes/game.scene';
import { GameOverScene } from './scenes/game-over.scene';

@Component({
  selector: 'app-phaser-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: innerWidth,
      height: innerHeight,
      backgroundColor: '#000000',
      parent: 'game-container',
      scene: [GameScene, GameOverScene],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
    };

    const game = new Phaser.Game(config);}
}
