import { ESCENAS } from '../utils/constantes.js';

export default class VictoryScene extends Phaser.Scene {
    constructor() { super({ key: ESCENAS.VICTORY }); }

    init(data) {
        this.puntosFinal  = data.puntos       ?? 0;
        this.vidas        = data.vidas        ?? 0;
        this.npcsSalvados = data.npcsSalvados ?? 0;
    }

    create() {
        const cx = this.scale.width  / 2;
        const cy = this.scale.height / 2;

        this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x0a0a1a);

        this.add.text(cx, cy - 80, '🔥 ¡NIVEL COMPLETADO!', {
            fontSize: '28px', fill: '#ff6600',
            fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(cx, cy - 30, `Puntos: ${this.puntosFinal}`, {
            fontSize: '18px', fill: '#ffffff', fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.add.text(cx, cy, `NPCs salvados: ${this.npcsSalvados}`, {
            fontSize: '15px', fill: '#aaaaaa', fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.add.text(cx, cy + 30, `Vidas restantes: ${this.vidas}`, {
            fontSize: '15px', fill: '#aaaaaa', fontFamily: 'monospace'
        }).setOrigin(0.5);

        const boton = this.add.text(cx, cy + 90, '[ MENÚ ]', {
            fontSize: '22px', fill: '#ffffff', fontFamily: 'monospace'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        boton.on('pointerover', () => boton.setStyle({ fill: '#ff6600' }));
        boton.on('pointerout',  () => boton.setStyle({ fill: '#ffffff' }));
        boton.on('pointerdown', () => this.scene.start(ESCENAS.MENU));
    }
}
