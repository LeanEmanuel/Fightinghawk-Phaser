import {Component, OnInit} from '@angular/core';
import Phaser from 'phaser';
import { GameScene } from './scenes/game.scene';

@Component({
  selector: 'app-game',
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
      scene: [GameScene],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
    };

    const game = new Phaser.Game(config);}
}
