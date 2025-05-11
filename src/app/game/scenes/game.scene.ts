import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private airplane!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;

  private background1!: Phaser.GameObjects.TileSprite;
  private background2!: Phaser.GameObjects.TileSprite;

  private bullets!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;

  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private bestScore: number = 0;
  private playerName: string = '';

  private pauseKey!: Phaser.Input.Keyboard.Key;
  private resumeKey!: Phaser.Input.Keyboard.Key;
  private paused: boolean = false;
  private pauseText!: Phaser.GameObjects.Text;
  private resumeButton!: Phaser.GameObjects.Text;
  private exitButton!: Phaser.GameObjects.Text;
  private pausePanel!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({key: 'GameScene'});
  }

  preload(): void {
    this.load.spritesheet('airplanes', 'assets/sprites/jet_01.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    //Balas
    this.load.image('bullet', 'assets/sprites/bullet_01_32x32.png');

    // Imagenes naves enemigas
    this.load.image('enemy1', 'assets/sprites/ship2.png');
    this.load.image('enemy2', 'assets/sprites/ship2b.png');

    //Imagenes explosión
    for (let i = 1; i <= 10; i++) {
      this.load.image(`explosion${i}`, `assets/sprites/explosion/Explosion_${i}.png`);
    }

    // background
    this.load.image('background_star', 'assets/backgrounds/stars_small_1.png');
    this.load.image('background_nebula', 'assets/backgrounds/nebula_blue.png');
  }


  create(): void {

    this.background1 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background_nebula')
      .setOrigin(0, 0)
      .setScrollFactor(0);

    this.background2 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background_star')
      .setOrigin(0, 0)
      .setScrollFactor(0);

    this.airplane = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 100, 'airplanes', 0);
    this.airplane.setCollideWorldBounds(true);

    // Input de teclado
    this.cursors = this.input!.keyboard!.createCursorKeys();
    this.spaceKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.pauseKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.resumeKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Grupo de balas
    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      runChildUpdate: true
    });

    // Grupo de enemigos
    this.enemies = this.physics.add.group();
    this.time.addEvent({
      delay: 2000, // cada X segundo spawn enemigos
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    this.physics.add.overlap(this.bullets, this.enemies, this.destroyEnemy, undefined, this);
    this.physics.add.overlap(this.enemies, this.airplane, this.handlePlayerHit, undefined, this);

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
    this.add.text(16, 44, `HIGH SCORE: ${this.bestScore}`, {
      fontSize: "14px",
      color: "#ffcc00",
      fontFamily: "Orbitron, Arial, sans-serif",
      stroke: "#000000",
      strokeThickness: 1,
    });

    // Nombre jugador
    const playerName = localStorage.getItem('playerName') || 'Player';
    this.playerName = localStorage.getItem('playerName') || 'Player';
    this.bestScore = parseInt(localStorage.getItem(`highscore_${this.playerName}`) || '0');

    this.add
      .text(this.scale.width / 2, 32, playerName.toUpperCase(), {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Orbitron, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Level
    this.add
      .text(this.scale.width - 20, 16, "LEVEL 1", {
        fontSize: "20px",
        color: "#aa00ff",
        fontFamily: "Orbitron, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(1, 0);

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.pausePanel = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      300,
      200,
      0x000000,
      0.7
    ).setOrigin(0.5);
    this.pausePanel.setVisible(false);

    // Texto que aparece al pausar
    this.pauseText = this.add
      .text(centerX, centerY - 60, "PAUSED", {
        fontSize: "40px",
        color: "#ff00cc",
        fontFamily: "Orbitron, Arial, sans-serif",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
    this.pauseText.setVisible(false);

    // Botón de reanudar
    this.resumeButton = this.add
      .text(centerX, centerY - 10, "Resume", {
        fontSize: "20px",
        backgroundColor: "#aa00ff",
        color: "#ffffff",
        padding: {x: 20, y: 10},
        fontFamily: "Orbitron, Arial, sans-serif",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.resumeButton.setName("resumeButton");
    this.resumeButton.setVisible(false);

    // Efecto hover
    this.resumeButton.on("pointerover", () => {
      this.resumeButton.setStyle({backgroundColor: "#b742f3"})
    });

    this.resumeButton.on("pointerout", () => {
      this.resumeButton.setStyle({backgroundColor: "#aa00ff"})
    });

    this.resumeButton.on("pointerdown", () => {
      this.resumeGame()
    });

    this.exitButton = this.add
      .text(centerX, centerY + 50, "Exit", {
        fontSize: "20px",
        backgroundColor: "#cc0000",
        color: "#ffffff",
        padding: {x: 20, y: 10},
        fontFamily: "Orbitron, Arial, sans-serif",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.exitButton.setVisible(false);

    // Efecto hover
    this.exitButton.on("pointerover", () => {
      this.exitButton.setStyle({backgroundColor: "#ff0000"})
    });

    this.exitButton.on("pointerout", () => {
      this.exitButton.setStyle({backgroundColor: "#cc0000"})
    });

    this.exitButton.on("pointerdown", () => {
      window.location.href = "/home"
    });
  }

  override update(): void {

    // Pausar
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.physics.world.pause();
      this.paused = true;
      this.pauseText.setVisible(true);
      this.resumeButton.setVisible(true);
      this.exitButton.setVisible(true);
      this.pausePanel.setVisible(true);
    }

    if (Phaser.Input.Keyboard.JustDown(this.resumeKey)) {
      this.resumeGame();
    }

    if (this.paused) return;

    this.airplane.setVelocityX(0);

    if (this.cursors.left.isDown) {
      this.airplane.setVelocityX(-200);
      this.airplane.setFrame(0);// izquierda
    } else if (this.cursors.right.isDown) {
      this.airplane.setVelocityX(200);
      this.airplane.setFrame(4) // derecha
    } else {
      this.airplane.setFrame(2); // centro
    }

    // Disparo
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.shootBullet();
    }

    // Background
    if (!this.paused) {
      this.background1.tilePositionY -= 0.5; // rápido
      this.background2.tilePositionY -= 0.05; // lento
    }

  }

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

  private spawnEnemy(): void {
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const sprite = Phaser.Math.Between(0, 1) === 0 ? 'enemy1' : 'enemy2';

    const enemy = this.enemies.create(x, -50, sprite) as Phaser.Physics.Arcade.Image;
    // Velocidad hacia abajo aleatoria
    enemy.setVelocityY(Phaser.Math.Between(100, 150));

    // Escala proporcional
    enemy.setScale(0.25);

  }

  private destroyEnemy(bullet: any, enemy: any): void {
    const b = bullet as Phaser.GameObjects.Sprite;
    const e = enemy as Phaser.GameObjects.Sprite;

    b.destroy();

    const explosion = this.add.sprite(e.x, e.y, 'explosion1');
    explosion.setScale(0.25);
    explosion.play('explode');

    e.destroy();

    // Aumentar puntuación y actualizar texto
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);

    // Actualizar récord si se supera
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(`highscore_${this.playerName}`, this.bestScore.toString());
    }
  }

  private handlePlayerHit(player: any, enemy: any): void {
    const p = player as Phaser.Physics.Arcade.Sprite;
    const e = enemy as Phaser.Physics.Arcade.Image;

    // Destruir enemigo
    e.destroy();

    // Reproducir explosión en la posición del jugador
    const explosion = this.add.sprite(p.x, p.y, 'explosion1');
    explosion.setScale(0.4);
    explosion.play('explode');

    // Desactivar jugador
    p.setVisible(false);
    p.disableBody(true, true);

    // Transición a Game Over
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', {score: this.score});
    });
  }

  private resumeGame(): void {
    this.physics.world.resume();
    this.paused = false;
    this.pauseText.setVisible(false);
    this.resumeButton.setVisible(false);
    this.exitButton.setVisible(false);
    this.pausePanel.setVisible(false);
  }

}
