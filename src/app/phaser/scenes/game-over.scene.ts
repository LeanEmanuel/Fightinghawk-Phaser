import Phaser from "phaser";

/**
 * Scene displayed when the game ends.
 * Shows the final score and offers options to retry or return to the home screen.
 */
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  /**
   * Initializes and displays the Game Over screen.
   * @param data - Contains the final score passed from the game scene.
   */
  create(data: { score: number }) {
    const { width, height } = this.scale;

    // Background layers (parallax style)
    this.add.tileSprite(0, 0, width, height, "background_nebula").setOrigin(0, 0).setScrollFactor(0);

    this.add.tileSprite(0, 0, width, height, "background_star").setOrigin(0, 0).setScrollFactor(0);

    // Main "Game Over"
    const gameOverText = this.add
      .text(width / 2, height / 2 - 100, "GAME OVER", {
        fontSize: "48px",
        color: "#ff00cc",
        fontFamily: "Orbitron, sans-serif",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: gameOverText,
      alpha: { from: 0.8, to: 1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Display final score
    this.add
      .text(width / 2, height / 2 - 20, `SCORE: ${data.score}`, {
        fontSize: "32px",
        color: "#ffffff",
        fontFamily: "Orbitron, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Retry button to restart the game
    const restartText = this.add
      .text(width / 2, height / 2 + 60, "RETRY", {
        fontSize: "18px",
        fontFamily: "Orbitron, sans-serif",
        backgroundColor: "#aa00ff",
        padding: { x: 20, y: 10 },
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive();


    restartText.on("pointerdown", () => {
      this.scene.start("GameScene")
    });

    // Home button to go back to the main menu
    const menuText = this.add
      .text(width / 2, height / 2 + 130, "HOME", {
        fontSize: "18px",
        fontFamily: "Orbitron, sans-serif",
        backgroundColor: "#ff00cc",
        padding: { x: 20, y: 10 },
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive();

    menuText.on("pointerdown", () => {
      window.location.href = "/home"
    });
  }
}
