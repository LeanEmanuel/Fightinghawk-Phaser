import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private airplane!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private bullets!: Phaser.Physics.Arcade.Group;
  private spaceKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    this.load.spritesheet('airplanes', 'assets/sprites/jet_01.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.image('bullet', 'assets/sprites/bullet_01_32x32.png');
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

}
