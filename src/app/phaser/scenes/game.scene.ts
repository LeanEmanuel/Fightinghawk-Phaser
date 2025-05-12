import Phaser from "phaser";
import { PauseUI } from "../ui/pause-ui";
import { LivesUI } from "../ui/lives-ui";
import { ScoreUI } from "../ui/score-ui";
import { LevelUI } from "../ui/level-ui";
import { PlayerManager } from '../controller/player-manager';
import { EnemyManager } from '../controller/enemy-manager';


/**
 * Main gameplay scene for the arcade shooter.
 * Manages background scrolling, UI, player and enemy managers, and game loop.
 */
export class GameScene extends Phaser.Scene {
  /** Player's spaceship sprite */
  private airplane!: Phaser.Physics.Arcade.Sprite;

  private playerManager!: PlayerManager;
  private enemyManager!: EnemyManager;

  /** Player bullets group */
  private bullets!: Phaser.Physics.Arcade.Group;

  /** Scrolling background layers */
  private background1!: Phaser.GameObjects.TileSprite;
  private background2!: Phaser.GameObjects.TileSprite;

  /** Input controls */
  private pauseKey!: Phaser.Input.Keyboard.Key;
  private resumeKey!: Phaser.Input.Keyboard.Key;

  /** Pause system */
  private pauseUI!: PauseUI;
  private paused: boolean = false;

  /** Heart icons displayed on the screen */
  private livesUI!: LivesUI;

  private levelUI!: LevelUI;

  /** Score and UI */
  private scoreUI!: ScoreUI;


  constructor() {
    super({key: 'GameScene'});
  }

  /**
   * Loads all game assets before the scene starts.
   */
  preload(): void {
    this.load.spritesheet('airplanes', 'assets/sprites/jet_01.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Image HP
    this.load.image('heart', 'assets/sprites/hp.png');

    // Bullet
    this.load.image('bullet', 'assets/sprites/bullet_01_32x32.png');

    // Bullet enemies
    this.load.image('enemyBullet', 'assets/sprites/enemy_bullet.png');

    // Images of enemy ships
    this.load.image('enemy1', 'assets/sprites/ship2.png');
    this.load.image('enemy2', 'assets/sprites/ship2b.png');

    // Explosion images
    for (let i = 1; i <= 10; i++) {
      this.load.image(`explosion${i}`, `assets/sprites/explosion/Explosion_${i}.png`);
    }

    // Background
    this.load.image('background_star', 'assets/backgrounds/stars_small_1.png');
    this.load.image('background_nebula', 'assets/backgrounds/nebula_blue.png');
  }


  /**
   * Initializes game objects, UI, and input logic.
   */
  create(): void {

    // Background layers
    this.background1 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background_nebula')
      .setOrigin(0, 0)
      .setScrollFactor(0);

    this.background2 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background_star')
      .setOrigin(0, 0)
      .setScrollFactor(0);

    // Setup player manager and get player sprite
    this.playerManager = new PlayerManager(this);
    this.airplane = this.playerManager.getSprite();

    // Input keys
    this.pauseKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.resumeKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Lives and heart icons
    this.livesUI = new LivesUI(this);
    this.livesUI.reset();

    this.scoreUI = new ScoreUI(this);
    this.levelUI = new LevelUI(this);

    // Setup pause UI
    this.pauseUI = new PauseUI(this, () => this.resumeGame(), () => {
      window.location.href = '/home';
    });

    // Group of bullets
    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      runChildUpdate: true
    });

    // Group of enemies
    this.enemyManager = new EnemyManager(this);


    // Collisions
    this.physics.add.overlap(this.bullets, this.enemyManager.getEnemies(), this.destroyEnemy, undefined, this);
    this.physics.add.overlap(this.enemyManager.getEnemies(), this.airplane, this.handlePlayerHit, undefined, this);
    this.physics.add.overlap(this.enemyManager.getEnemyBullets(), this.airplane, this.playerHitByBullet, undefined, this);

    // Explosion animation
    this.anims.create({
      key: 'explode',
      frames: Array.from({length: 10}, (_, i) => ({
        key: `explosion${i + 1}`
      })),
      frameRate: 20,
      hideOnComplete: true
    });

    // Display pause hint
    this.add.text(10, this.scale.height - 30, 'Press P to pause', {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: 'Orbitron, Arial, sans-serif',
      stroke: '#000000',
      strokeThickness: 2,
    });
  }

  /**
   * Game update loop.
   * Handles input, movement, shooting, and background scrolling.
   */
  override update(): void {

    // Pausar
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.physics.world.pause();
      this.paused = true;
      this.pauseUI.show();
      this.enemyManager.pause();
    }

    if (Phaser.Input.Keyboard.JustDown(this.resumeKey)) {
      this.resumeGame();
    }

    if (this.paused) return;

    this.playerManager.update();

    if (this.playerManager.isShooting()) {
      this.shootBullet();
    }

    // Background
    if (!this.paused) {
      this.background1.tilePositionY -= 0.5; // rápido
      this.background2.tilePositionY -= 0.05; // lento
    }

  }

  /**
   * Creates and fires a bullet from the player's current position.
   */
  private shootBullet(): void {
    const bullet = this.bullets.get(
      this.airplane.x,
      this.airplane.y - 30,
      'bullet'
    ) as Phaser.Physics.Arcade.Image;

    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setVelocityY(-400);
      bullet.setScale(0.5);
      bullet.setAngle(-90);
    }
  }

  /**
   * Destroys an enemy on collision with a bullet and updates score.
   * @param bullet - Bullet that hit the enemy.
   * @param enemy - Enemy being destroyed.
   */
  private destroyEnemy(bullet: any, enemy: any): void {
    const b = bullet as Phaser.GameObjects.Sprite;
    const e = enemy as Phaser.GameObjects.Sprite;

    b.destroy();

    const explosion = this.add.sprite(e.x, e.y, 'explosion1');
    explosion.setScale(0.25);
    explosion.play('explode');

    e.destroy();

    // Increase punctuation and update text
    this.scoreUI.increase(1);

  }

  /**
   * Handles collision between the player and an enemy or bullet, triggering game over.
   * @param player - The player's ship.
   * @param enemy - The enemy (optional).
   */
  private handlePlayerHit(player: any, enemy: any): void {
    const p = player as Phaser.Physics.Arcade.Sprite;

    if (enemy) {
      const e = enemy as Phaser.Physics.Arcade.Image;
      e.destroy();
    }

    // Play explosion at player's position
    const explosion = this.add.sprite(p.x, p.y, 'explosion1');
    explosion.setScale(0.4);
    explosion.play('explode');

    // Deactivate player
    this.playerManager.disable();

    // Transition to Game Over
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', { score: this.scoreUI.getScore() });
    });
  }

  /**
   * Reduces player's life by one and removes a heart icon.
   * @param player - The player's ship.
   * @param bullet - Bullet that hit the player.
   */
  private playerHitByBullet(player: any, bullet: any): void {
    bullet.destroy();

    this.livesUI.loseLife();

    if (this.livesUI.getLives() <= 0) {
      this.handlePlayerHit(player, null);
    }
  }

  /**
   * Resumes the game from paused state.
   */
  private resumeGame(): void {
    this.physics.world.resume();
    this.paused = false;
    this.pauseUI.hide();
    this.enemyManager.resume();
  }
}
