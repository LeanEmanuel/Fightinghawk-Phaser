import Phaser from 'phaser';

/**
 * LevelUI handles displaying and updating the current level.
 */
export class LevelUI {
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;
  private currentLevel: number = 1;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.text = this.scene.add.text(
      this.scene.scale.width - 20,
      16,
      this.getLabel(),
      {
        fontSize: '20px',
        color: '#aa00ff',
        fontFamily: 'Orbitron, Arial, sans-serif',
        stroke: '#000000',
        strokeThickness: 2,
      }
    ).setOrigin(1, 0).setDepth(10);
  }

  private getLabel(): string {
    return `LEVEL ${this.currentLevel}`;
  }

  increase(): void {
    this.currentLevel++;
    this.text.setText(this.getLabel());
  }

  reset(): void {
    this.currentLevel = 1;
    this.text.setText(this.getLabel());
  }

  getLevel(): number {
    return this.currentLevel;
  }
}
