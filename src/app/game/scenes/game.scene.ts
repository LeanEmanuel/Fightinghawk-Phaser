import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private airplane!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    this.load.spritesheet('airplanes', 'assets/sprites/jet_01.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create(): void {

    this.airplane = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 100, 'airplanes', 0);
    this.airplane.setCollideWorldBounds(true);

    // Input de teclado
    this.cursors = this.input!.keyboard!.createCursorKeys();
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
  }
}
