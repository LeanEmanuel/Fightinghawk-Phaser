import Phaser from 'phaser';

/**
 * Handles the display and update of player lives (heart icons).
 */
export class LivesUI {
  private scene: Phaser.Scene;
  private hearts: Phaser.GameObjects.Image[] = [];
  private readonly maxLives: number;
  private readonly startX: number;
  private readonly startY: number;

  constructor(scene: Phaser.Scene, maxLives: number = 3, x: number = 50, y: number = 50) {
    this.scene = scene;
    this.maxLives = maxLives;
    this.startX = scene.scale.width - x;
    this.startY = y;

    this.createHearts();
  }

  /**
   * Creates heart icons for the initial lives.
   */
  private createHearts(): void {
    this.hearts = [];

    for (let i = 0; i < this.maxLives; i++) {
      const heart = this.scene.add.image(this.startX - i * 30, this.startY, 'heart')
        .setScale(0.05)
        .setScrollFactor(0)
        .setDepth(10);

      this.hearts.push(heart);
    }
  }

  /**
   * Updates the UI by removing a heart icon.
   */
  public loseLife(): void {
    const heart = this.hearts.pop();
    heart?.destroy();
  }

  /**
   * Resets the hearts to full.
   */
  public reset(): void {
    this.hearts.forEach(h => h.destroy());
    this.createHearts();
  }

  /**
   * Returns the current remaining lives.
   */
  public getLives(): number {
    return this.hearts.length;
  }
}
