import Phaser from 'phaser';

export class ExplosionManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.scene.anims.create({
      key: 'explode',
      frames: Array.from({ length: 10 }, (_, i) => ({
        key: `explosion${i + 1}`,
      })),
      frameRate: 20,
      hideOnComplete: true,
    });
  }

  /**
   * Spawns and plays an explosion animation at the given coordinates.
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param scale - Optional scale of the explosion (default 0.25)
   */
  public spawn(x: number, y: number, scale: number = 0.25): void {
    const explosion = this.scene.add.sprite(x, y, 'explosion1');
    explosion.setScale(scale);
    explosion.play('explode');
  }
}
