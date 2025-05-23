import Phaser from 'phaser';

/**
 * ScoreUI manages and displays the current and high score on screen.
 */
export class ScoreUI {
  private scene: Phaser.Scene;
  private score: number = 0;
  private bestScore: number = 0;
  private readonly playerName: string;
  private scoreText: Phaser.GameObjects.Text;
  private highScoreText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.playerName = localStorage.getItem('playerName') || 'Player';
    this.bestScore = parseInt(localStorage.getItem(`highscore_${this.playerName}`) || '0');

    // Current score
    this.scoreText = this.scene.add.text(16, 16, 'SCORE: 0', {
      fontSize: '20px',
      color: '#ff00cc',
      fontFamily: 'Orbitron, Arial, sans-serif',
      stroke: '#000000',
      strokeThickness: 3
    }).setDepth(10);

    // Best score
    this.highScoreText = this.scene.add.text(16, 44, `HIGH SCORE: ${this.bestScore}`, {
      fontSize: '14px',
      color: '#ffcc00',
      fontFamily: 'Orbitron, Arial, sans-serif',
      stroke: '#000000',
      strokeThickness: 1
    }).setDepth(10);

    // Player name
    const playerNameText = this.scene.add.text(this.scene.scale.width / 2, 32, this.playerName.toUpperCase(), {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Orbitron, Arial, sans-serif',
      stroke: '#000000',
      strokeThickness: 3,
    })
      .setOrigin(0.5)
      .setDepth(10);
  }

  /**
   * Increases the current score and updates the display.
   * Also updates high score if exceeded.
   */
  increase(points: number = 1): void {
    this.score += points;
    this.scoreText.setText(`SCORE: ${this.score}`);

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(`highscore_${this.playerName}`, this.bestScore.toString());
      this.highScoreText.setText(`HIGH SCORE: ${this.bestScore}`);
    }
  }

  /**
   * Returns the current score.
   */
  getScore(): number {
    return this.score;
  }
}
