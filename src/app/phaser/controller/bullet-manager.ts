import Phaser from 'phaser';

/**
 * Manages bullet creation and behavior for both the player and enemies.
 */
export class BulletManager {
  private scene: Phaser.Scene;

  private playerBullets: Phaser.Physics.Arcade.Group;
  private enemyBullets: Phaser.Physics.Arcade.Group;

  /**
   * Initializes bullet groups for player and enemy bullets.
   * @param scene - The Phaser scene to which bullets belong.
   */
  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.playerBullets = this.scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      runChildUpdate: true
    });

    this.enemyBullets = this.scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      runChildUpdate: true
    });
  }

  /**
   * Fires a bullet upward from the player's ship.
   * @param x - The horizontal position to spawn the bullet.
   * @param y - The vertical position to spawn the bullet.
   */
  public firePlayerBullet(x: number, y: number): void {
    const bullet = this.playerBullets.get(x, y - 30, 'bullet') as Phaser.Physics.Arcade.Image;
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setVelocityY(-400);
      bullet.setScale(0.5);
      bullet.setAngle(-90);
    }
  }

  /**
   * Fires a bullet downward from an enemy ship.
   * @param x - The horizontal position to spawn the bullet.
   * @param y - The vertical position to spawn the bullet.
   */
  public fireEnemyBullet(x: number, y: number): void {
    const bullet = this.enemyBullets.get(x, y + 20, 'enemyBullet') as Phaser.Physics.Arcade.Image;
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setVelocityY(200);
      bullet.setScale(0.4);
      bullet.setAngle(90);
    }
  }

  /**
   * Returns the group of player bullets.
   */
  public getPlayerBullets(): Phaser.Physics.Arcade.Group {
    return this.playerBullets;
  }

  /**
   * Returns the group of enemy bullets.
   */
  public getEnemyBullets(): Phaser.Physics.Arcade.Group {
    return this.enemyBullets;
  }
}
