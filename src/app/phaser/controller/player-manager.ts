import Phaser from 'phaser';

export class PlayerManager {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.sprite = this.scene.physics.add.sprite(
      this.scene.scale.width / 2,
      this.scene.scale.height - 100,
      'airplanes',
      0
    );
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setScale(1.2);

    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.spaceKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  public update(): void {
    this.sprite.setVelocityX(0);

    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-200);
      this.sprite.setFrame(0); // izquierda
    } else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(200);
      this.sprite.setFrame(4); // derecha
    } else {
      this.sprite.setFrame(2); // centro
    }
  }

  public isShooting(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.spaceKey);
  }

  public disable(): void {
    this.sprite.setVisible(false);
    this.sprite.disableBody(true, true);
  }
}
