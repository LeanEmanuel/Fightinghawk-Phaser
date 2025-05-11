import Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create(data: { score: number }) {
    const { width, height } = this.scale;

    // Fondo
    this.add.tileSprite(0, 0, width, height, "background_nebula").setOrigin(0, 0).setScrollFactor(0);

    this.add.tileSprite(0, 0, width, height, "background_star").setOrigin(0, 0).setScrollFactor(0);

    // Texto principal con estilo neón
    const gameOverText = this.add
      .text(width / 2, height / 2 - 100, "GAME OVER", {
        fontSize: "48px",
        color: "#ff00cc",
        fontFamily: "Orbitron, sans-serif",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Efecto de brillo para el texto
    this.tweens.add({
      targets: gameOverText,
      alpha: { from: 0.8, to: 1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Mostrar puntuación final con estilo arcade
    this.add
      .text(width / 2, height / 2 - 20, `SCORE: ${data.score}`, {
        fontSize: "32px",
        color: "#ffffff",
        fontFamily: "Orbitron, sans-serif",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Botón "Reintentar" con estilo arcade
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

    // Botón "Menú" con estilo arcade
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
