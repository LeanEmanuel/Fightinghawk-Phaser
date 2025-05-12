// src/app/phaser/controller/enemy-manager.ts
import Phaser from 'phaser';

export class EnemyManager {
  private scene: Phaser.Scene;
  private enemies: Phaser.Physics.Arcade.Group;
  private enemyBullets: Phaser.Physics.Arcade.Group;
  private paused: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.enemies = this.scene.physics.add.group();
    this.enemyBullets = this.scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      runChildUpdate: true,
    });

    this.scene.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

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

  private enemyShoot(enemy: Phaser.Physics.Arcade.Image): void {
    if (!enemy.active || this.paused) return;

    const bullet = this.enemyBullets.get(enemy.x, enemy.y + 20, 'enemyBullet') as Phaser.Physics.Arcade.Image;
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setVelocityY(200);
      bullet.setScale(0.4);
      bullet.setAngle(90);
    }
  }

  public getEnemies(): Phaser.Physics.Arcade.Group {
    return this.enemies;
  }

  public getEnemyBullets(): Phaser.Physics.Arcade.Group {
    return this.enemyBullets;
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
  }
}
