import Phaser from 'phaser';

/**
 * Manages the player's ship, movement, shooting, and visibility.
 */
export class PlayerManager {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey: Phaser.Input.Keyboard.Key;

  /**
   * Initializes the player's sprite and input controls.
   * @param scene - The Phaser scene the player belongs to.
   */
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

  /**
   * Returns the player sprite instance.
   */
  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  /**
   * Updates the player's horizontal movement based on input.
   * Handles animation frames depending on direction.
   */
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

  /**
   * Checks if the player has just pressed the shoot button (SPACE).
   * @returns True if the player is shooting this frame.
   */
  public isShooting(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.spaceKey);
  }

  /**
   * Disables and hides the player sprite (e.g., after being hit).
   */
  public disable(): void {
    this.sprite.setVisible(false);
    this.sprite.disableBody(true, true);
  }
}
