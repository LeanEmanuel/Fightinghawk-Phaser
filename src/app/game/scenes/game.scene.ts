import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private airplane!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;

  private bullets!: Phaser.Physics.Arcade.Group;

  private enemies!: Phaser.Physics.Arcade.Group;

  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;

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
      delay: 3000, // cada 3 segundo
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });


    this.physics.add.overlap(this.bullets, this.enemies, this.destroyEnemy, undefined, this);

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
    this.scoreText = this.add.text(16, 16, 'Puntos: 0', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3
    });

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
  }


}
