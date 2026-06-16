// HUD.js — puntos, vidas y contador de NPCs

export default class HUD {
    constructor(scene) {
        this.scene = scene;
        const s = { fontSize: '14px', fill: '#ffffff', fontFamily: 'monospace' };

        this.txtPuntos = scene.add.text(10, 8,  'Puntos: 0',     s).setScrollFactor(0).setDepth(20);
        this.txtVidas  = scene.add.text(10, 26, 'Vidas: 3',      s).setScrollFactor(0).setDepth(20);
        this.txtNpcs   = scene.add.text(10, 44, 'Salvados: 0/0', s).setScrollFactor(0).setDepth(20);

        // Barra de fuego
        this.barFondo = scene.add.rectangle(700, 16, 84, 14, 0x333333).setScrollFactor(0).setDepth(20);
        this.barFuego = scene.add.rectangle(700, 16, 80, 10, 0xff6600).setScrollFactor(0).setDepth(21);
        scene.add.text(660, 8, '🔥', { fontSize: '14px' }).setScrollFactor(0).setDepth(20);
    }

    actualizar(puntos, vidas, salvados, total) {
        this.txtPuntos.setText(`Puntos: ${puntos}`);
        this.txtVidas.setText(`Vidas: ${vidas}`);
        this.txtNpcs.setText(`Salvados: ${salvados}/${total}`);

        // Barra se achica con los puntos (máx 100)
        const ancho = Math.max(0, (puntos / 100) * 80);
        this.barFuego.setSize(ancho, 10);
        this.barFuego.setX(700 - (80 - ancho) / 2);

        // Parpadea si está bajo
        if (puntos < 30) this.barFuego.setAlpha(Math.random() > 0.4 ? 1 : 0.3);
        else this.barFuego.setAlpha(1);
    }
}
