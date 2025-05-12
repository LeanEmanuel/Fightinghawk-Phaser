import Phaser from 'phaser';
import { BulletManager } from './bullet-manager';

/**
 * Handles enemy spawning, movement, and shooting.
 */
export class EnemyManager {
  private scene: Phaser.Scene;
  private enemies: Phaser.Physics.Arcade.Group;
  private bullets: BulletManager;
  private paused: boolean = false;

  /**
   * Initializes the enemy manager and sets up the spawn loop.
   * @param scene - The Phaser scene reference.
   * @param bullets - Instance of BulletManager to control enemy bullets.
   */
  constructor(scene: Phaser.Scene, bullets: BulletManager) {
    this.scene = scene;
    this.bullets = bullets;

    this.enemies = this.scene.physics.add.group();

    this.scene.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  /**
   * Spawns a new enemy at a random horizontal position with a downward velocity.
   * Schedules the enemy to shoot 3 times.
   */
  private spawnEnemy(): void {
    if (this.paused) return;

    const x = Phaser.Math.Between(50, this.scene.scale.width - 50);
    const sprite = Phaser.Math.Between(0, 1) === 0 ? 'enemy1' : 'enemy2';

    const enemy = this.enemies.create(x, -50, sprite) as Phaser.Physics.Arcade.Image;
    enemy.setVelocityY(Phaser.Math.Between(100, 150));
    enemy.setScale(0.25);

    this.scene.time.addEvent({
      delay: Phaser.Math.Between(1500, 2500),
      callback: () => this.enemyShoot(enemy),
      callbackScope: this,
      repeat: 2,
    });
  }

  /**
   * Makes a specific enemy shoot a bullet if it's still active.
   * @param enemy - The enemy that will fire the bullet.
   */
  private enemyShoot(enemy: Phaser.Physics.Arcade.Image): void {
    if (!enemy.active || this.paused) return;
    this.bullets.fireEnemyBullet(enemy.x, enemy.y);
  }

  /**
   * Returns the group of active enemies.
   */
  public getEnemies(): Phaser.Physics.Arcade.Group {
    return this.enemies;
  }

  /**
   * Pauses enemy behavior including spawning and shooting.
   */
  public pause(): void {
    this.paused = true;
  }

  /**
   * Resumes enemy behavior after being paused.
   */
  public resume(): void {
    this.paused = false;
  }
}
