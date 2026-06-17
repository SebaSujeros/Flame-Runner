export default class HUD {
    constructor(scene) {
        this.scene = scene;
        const s = { fontSize: '13px', fill: '#000000', fontFamily: 'monospace' };
        const W = scene.scale.width;

        // Izq: puntos y NPCs
        this.txtPuntos = scene.add.text(10, 8,  'Puntos: 0',     s).setScrollFactor(0).setDepth(20);
        this.txtNpcs   = scene.add.text(10, 24, 'Salvados: 0/0', s).setScrollFactor(0).setDepth(20);

        // Der: corazones de vida (3 de max)
        this.iconosVidas = [];
        for (let i = 0; i < 3; i++) {
            const corazon = scene.add.text(W - 28 - i * 22, 8, '❤️', {
                fontSize: '14px'
            }).setScrollFactor(0).setDepth(20);
            this.iconosVidas.push(corazon);
        }
    }

    actualizar(puntos, vidas, salvados, total) {
        this.txtPuntos.setText(`Puntos: ${puntos}`);
        this.txtNpcs.setText(`Salvados: ${salvados}/${total}`);

        // Corazones: llenos o vacios
        this.iconosVidas.forEach((c, i) => {
            c.setText(i < vidas ? '❤️' : '🖤');
            c.setAlpha(i < vidas ? 1 : 0.4);
        });
    }
}

