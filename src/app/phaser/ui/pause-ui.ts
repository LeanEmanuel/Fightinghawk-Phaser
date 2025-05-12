import Phaser from 'phaser';

/**
 * Displays a pause overlay with Resume and Exit buttons.
 */
export class PauseUI {
  private scene: Phaser.Scene;
  private panel: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;
  private resumeButton: Phaser.GameObjects.Text;
  private exitButton: Phaser.GameObjects.Text;
  private onResume: () => void;
  private onExit: () => void;

  constructor(
    scene: Phaser.Scene,
    onResume: () => void,
    onExit: () => void
  ) {
    this.scene = scene;
    this.onResume = onResume;
    this.onExit = onExit;

    const centerX = scene.scale.width / 2;
    const centerY = scene.scale.height / 2;

    // Create dark background panel
    this.panel = scene.add.rectangle(centerX, centerY, 300, 200, 0x000000, 0.7)
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(10);

    // "PAUSED" text
    this.text = scene.add.text(centerX, centerY - 60, 'PAUSED', {
      fontSize: '40px',
      color: '#ff00cc',
      fontFamily: 'Orbitron, Arial, sans-serif',
      stroke: '#000000',
      strokeThickness: 4,
    })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(10);

    // Resume button
    this.resumeButton = scene.add.text(centerX, centerY - 10, 'Resume', {
      fontSize: '20px',
      backgroundColor: '#aa00ff',
      color: '#ffffff',
      padding: {x: 20, y: 10},
      fontFamily: 'Orbitron, Arial, sans-serif',
    })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false)
      .setDepth(10);

    // Exit button
    this.exitButton = scene.add.text(centerX, centerY + 50, 'Exit', {
      fontSize: '20px',
      backgroundColor: '#cc0000',
      color: '#ffffff',
      padding: {x: 20, y: 10},
      fontFamily: 'Orbitron, Arial, sans-serif',
    })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false)
      .setDepth(10);

    // Button event listeners
    this.resumeButton.on('pointerdown', () => this.onResume());
    this.exitButton.on('pointerdown', () => this.onExit());
  }

  /**
   * Shows the pause panel and its elements.
   */
  show() {
    this.panel.setVisible(true);
    this.text.setVisible(true);
    this.resumeButton.setVisible(true);
    this.exitButton.setVisible(true);
  }

  /**
   * Hides the pause panel and its elements.
   */
  hide() {
    this.panel.setVisible(false);
    this.text.setVisible(false);
    this.resumeButton.setVisible(false);
    this.exitButton.setVisible(false);
  }
}
