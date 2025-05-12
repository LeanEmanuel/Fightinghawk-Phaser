// src/app/phaser/controller/bullet-manager.ts
import Phaser from 'phaser';

export class BulletManager {
  private scene: Phaser.Scene;

  private playerBullets: Phaser.Physics.Arcade.Group;
  private enemyBullets: Phaser.Physics.Arcade.Group;

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
   * Fires a bullet from the player's ship.
   * @param x - X position of the bullet.
   * @param y - Y position of the bullet.
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
   * Fires a bullet from an enemy ship.
   * @param x - X position of the bullet.
   * @param y - Y position of the bullet.
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

  public getPlayerBullets(): Phaser.Physics.Arcade.Group {
    return this.playerBullets;
  }

  public getEnemyBullets(): Phaser.Physics.Arcade.Group {
    return this.enemyBullets;
  }
}
