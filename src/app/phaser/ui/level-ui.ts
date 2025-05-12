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

    // Display the level in the top-right corner
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

  /**
   * Advances to the next level and updates the label.
   */
  increase(): void {
    this.currentLevel++;
    this.text.setText(this.getLabel());
  }

  /**
   * Resets the level display to level 1.
   */
  reset(): void {
    this.currentLevel = 1;
    this.text.setText(this.getLabel());
  }

  /**
   * Returns the current level number.
   */
  getLevel(): number {
    return this.currentLevel;
  }
}
