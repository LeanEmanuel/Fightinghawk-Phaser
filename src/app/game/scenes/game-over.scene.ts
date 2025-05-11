import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: { score: number }) {
    const { width, height } = this.scale;

    // Texto principal
    this.add.text(width / 2, height / 2 - 80, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff5555',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Mostrar puntuación final
    this.add.text(width / 2, height / 2 - 20, `Tu puntuación: ${data.score}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Botón "Reintentar"
    const restartText = this.add.text(width / 2, height / 2 + 40, 'REINTENTAR', {
      fontSize: '28px',
      backgroundColor: '#00ccff',
      padding: { x: 20, y: 10 },
      color: '#000',
      fontFamily: 'Arial'
    }).setOrigin(0.5).setInteractive();

    restartText.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Botón "Menú"
    const menuText = this.add.text(width / 2, height / 2 + 100, 'VOLVER AL MENÚ', {
      fontSize: '24px',
      backgroundColor: '#cccccc',
      padding: { x: 20, y: 10 },
      color: '#000',
      fontFamily: 'Arial'
    }).setOrigin(0.5).setInteractive();

    menuText.on('pointerdown', () => {
      window.location.href = '/home';
    });
  }
}
