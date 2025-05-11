import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private airplane!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;

  private bullets!: Phaser.Physics.Arcade.Group;

  private enemies!: Phaser.Physics.Arcade.Group;

  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private bestScore: number = 0;
  private playerName: string = '';

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    this.load.spritesheet('airplanes', 'assets/sprites/jet_01.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.image('bullet', 'assets/sprites/bullet_01_32x32.png');

    // Imagenes naves enemigas
    this.load.image('enemy1', 'assets/sprites/ship2.png');
    this.load.image('enemy2', 'assets/sprites/ship2b.png');

    //Imagenes explosión
    for (let i = 1; i <= 10; i++) {
      this.load.image(`explosion${i}`, `assets/sprites/explosion/Explosion_${i}.png`);
    }

  }



  create(): void {

    this.airplane = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 100, 'airplanes', 0);
    this.airplane.setCollideWorldBounds(true);

    // Input de teclado
    this.cursors = this.input!.keyboard!.createCursorKeys();
    this.spaceKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
      frames: Array.from({ length: 10 }, (_, i) => ({
        key: `explosion${i + 1}`
      })),
      frameRate: 20,
      hideOnComplete: true
    });

    // Texto scores
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3
    });

    //High score
    this.add.text(16, 44, `High Score: ${this.bestScore}`, {
      fontSize: '18px',
      color: '#ffcc00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    });

    // Nombre jugador
    const playerName = localStorage.getItem('playerName') || 'Player';
    this.add.text(this.scale.width / 2, 32, playerName, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.playerName = localStorage.getItem('playerName') || 'Player';
    this.bestScore = parseInt(localStorage.getItem(`highscore_${this.playerName}`) || '0');

    // Level
    this.add.text(this.scale.width - 20, 16, 'Level 1', {
      fontSize: '20px',
      color: '#00ffcc',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(1, 0);

  }

  override update(): void {
    this.airplane.setVelocityX(0);

    if (this.cursors.left.isDown) {
      this.airplane.setVelocityX(-200);
      this.airplane.setFrame(0);// izquierda
    } else if (this.cursors.right.isDown) {
      this.airplane.setVelocityX(200);
      this.airplane.setFrame(4) // derecha
    }
    else {
      this.airplane.setFrame(2); // centro
    }

    // Disparo
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.shootBullet();
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
    enemy.setVelocityY(Phaser.Math.Between(80, 120));

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

  private handlePlayerHit(player: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject): void {
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

    // Detener el juego tras un momento
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }
  
}
