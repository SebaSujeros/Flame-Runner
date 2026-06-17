import { ESCENAS } from '../utils/constantes.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() { super({ key: ESCENAS.GAMEOVER }); }

    init(data) {
        this.puntosFinal  = data.puntos       ?? 0;
        this.npcsSalvados = data.npcsSalvados ?? 0;
    }

    create() {
        const cx = this.scale.width  / 2;
        const cy = this.scale.height / 2;

        this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x040810);

        this.add.text(cx, cy - 70, 'TE CONGELASTE', {
            fontSize: '32px', fill: '#88ccff',
            fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(cx, cy - 20, `Puntos: ${this.puntosFinal}`, {
            fontSize: '18px', fill: '#ffffff', fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.add.text(cx, cy + 10, `NPCs salvados: ${this.npcsSalvados}`, {
            fontSize: '15px', fill: '#aaaaaa', fontFamily: 'monospace'
        }).setOrigin(0.5);

        const boton = this.add.text(cx, cy + 70, '[ VOLVER AL MENÚ ]', {
            fontSize: '20px', fill: '#ffffff', fontFamily: 'monospace'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        boton.on('pointerover', () => boton.setStyle({ fill: '#88ccff' }));
        boton.on('pointerout',  () => boton.setStyle({ fill: '#ffffff' }));
        boton.on('pointerdown', () => this.scene.start(ESCENAS.MENU));
    }
}
