import Phaser from "phaser";
import { PauseUI } from "./ui/pause-ui";


/**
 * GameScene handles the core gameplay loop, UI elements, player control, enemy behavior,
 * and pause management for the arcade-style shooter.
 */
export class GameScene extends Phaser.Scene {
  /** Player's spaceship sprite */
  private airplane!: Phaser.Physics.Arcade.Sprite;

  /** Remaining lives (hearts) */
  private lives: number = 3;

  /** Heart icons displayed on the screen */
  private lifeIcons: Phaser.GameObjects.Image[] = [];

  /** Input controls */
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private pauseKey!: Phaser.Input.Keyboard.Key;
  private resumeKey!: Phaser.Input.Keyboard.Key;

  /** Scrolling background layers */
  private background1!: Phaser.GameObjects.TileSprite;
  private background2!: Phaser.GameObjects.TileSprite;

  /** Player bullets group */
  private bullets!: Phaser.Physics.Arcade.Group;

  /** Enemies group */
  private enemies!: Phaser.Physics.Arcade.Group;

  /** Enemy bullets group */
  private enemyBullets!: Phaser.Physics.Arcade.Group;

  /** Score and UI */
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private highScoreText!: Phaser.GameObjects.Text;
  private playerNameText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private bestScore: number = 0;
  private playerName: string = '';

  /** Pause system */
  private pauseUI!: PauseUI;
  private paused: boolean = false;


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

    // Player airplane setup
    this.airplane = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 100, 'airplanes', 0);
    this.airplane.setCollideWorldBounds(true);
    this.airplane.setScale(1.2);

    // Input keys
    this.cursors = this.input!.keyboard!.createCursorKeys();
    this.spaceKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.pauseKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.resumeKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Lives and heart icons
    this.lives = 3;
    this.lifeIcons.forEach(icon => icon.destroy());
    this.lifeIcons = [];

    for (let i = 0; i < this.lives; i++) {
      const heart = this.add.image(this.scale.width - 20 - i * 30, 50, 'heart')
        .setScale(0.05)
        .setScrollFactor(0)
        .setDepth(10);
      this.lifeIcons.push(heart);
    }

    // Group of bullets
    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      runChildUpdate: true
    });

    // Group of enemies
    this.enemies = this.physics.add.group();
    this.time.addEvent({
      delay: 2000, // cada X segundo spawn enemigos
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    // Group enemies bullets
    this.enemyBullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      runChildUpdate: true
    });

    // Collisions
    this.physics.add.overlap(this.bullets, this.enemies, this.destroyEnemy, undefined, this);
    this.physics.add.overlap(this.enemies, this.airplane, this.handlePlayerHit, undefined, this);
    this.physics.add.overlap(this.enemyBullets, this.airplane, this.playerHitByBullet, undefined, this);

    // Animación explosión
    this.anims.create({
      key: 'explode',
      frames: Array.from({length: 10}, (_, i) => ({
        key: `explosion${i + 1}`
      })),
      frameRate: 20,
      hideOnComplete: true
    });

    // Texto scores
    this.scoreText = this.add.text(16, 16, "SCORE: 0", {
      fontSize: "20px",
      color: "#ff00cc",
      fontFamily: "Orbitron, Arial, sans-serif",
      stroke: "#000000",
      strokeThickness: 3,
    });

    //High score
    this.highScoreText = this.add.text(16, 44, `HIGH SCORE: ${this.bestScore}`, {
      fontSize: "14px",
      color: "#ffcc00",
      fontFamily: "Orbitron, Arial, sans-serif",
      stroke: "#000000",
      strokeThickness: 1,
    });

    // Player name
    const playerName = localStorage.getItem('playerName') || 'Player';
    this.playerName = localStorage.getItem('playerName') || 'Player';
    this.bestScore = parseInt(localStorage.getItem(`highscore_${this.playerName}`) || '0');

    this.playerNameText = this.add.text(this.scale.width / 2, 32, playerName.toUpperCase(), {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Orbitron, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Level
    this.levelText = this.add.text(this.scale.width - 20, 16, "LEVEL 1", {
        fontSize: "20px",
        color: "#aa00ff",
        fontFamily: "Orbitron, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(1, 0);


    this.pauseUI = new PauseUI(this, () => this.resumeGame(), () => {
      window.location.href = '/home';
    });


    // Depth adjustment for HUD
    this.scoreText.setDepth(10);
    this.highScoreText.setDepth(10);
    this.playerNameText.setDepth(10);
    this.levelText.setDepth(10);
    this.lifeIcons.forEach(icon => icon.setDepth(10));

    this.add.text(10, this.scale.height - 30, 'Press P to pause', {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: 'Orbitron, Arial, sans-serif',
      stroke: '#000000',
      strokeThickness: 2,
    });
  }

  /**
   * Main game loop, handles movement, shooting, and background scroll.
   */
  override update(): void {

    // Pausar
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.physics.world.pause();
      this.paused = true;
      this.pauseUI.show();
    }

    if (Phaser.Input.Keyboard.JustDown(this.resumeKey)) {
      this.resumeGame();
    }

    if (this.paused) return;

    this.airplane.setVelocityX(0);

    // Movement control
    if (this.cursors.left.isDown) {
      this.airplane.setVelocityX(-200);
      this.airplane.setFrame(0);// izquierda
    } else if (this.cursors.right.isDown) {
      this.airplane.setVelocityX(200);
      this.airplane.setFrame(4) // derecha
    } else {
      this.airplane.setFrame(2); // centro
    }

    // Fire
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
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
   * Spawns a single enemy and sets up its behavior and shooting.
   */
  private spawnEnemy(): void {
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const sprite = Phaser.Math.Between(0, 1) === 0 ? 'enemy1' : 'enemy2';

    const enemy = this.enemies.create(x, -50, sprite) as Phaser.Physics.Arcade.Image;
    // Velocidad hacia abajo aleatoria
    enemy.setVelocityY(Phaser.Math.Between(100, 150));
    // Escala proporcional
    enemy.setScale(0.25);

    this.time.addEvent({
      delay: Phaser.Math.Between(1500, 2500),
      callback: () => this.enemyShoot(enemy),
      callbackScope: this,
      repeat: 2
    });
  }

  /**
   * Spawns a bullet from a given enemy's position.
   * @param enemy - The enemy that is shooting.
   */
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
    this.score += 1;
    this.scoreText.setText('SCORE: ' + this.score);

    // Update record if exceeded
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(`highscore_${this.playerName}`, this.bestScore.toString());
    }
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
    p.setVisible(false);
    p.disableBody(true, true);

    // Transition to Game Over
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', {score: this.score});
    });
  }

  /**
   * Reduces player's life by one and removes a heart icon.
   * @param player - The player's ship.
   * @param bullet - Bullet that hit the player.
   */
  private playerHitByBullet(player: any, bullet: any): void {
    bullet.destroy();
    this.lives--;

    const lostHeart = this.lifeIcons.pop();
    lostHeart?.destroy();

    if (this.lives <= 0) {
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
  }

}
