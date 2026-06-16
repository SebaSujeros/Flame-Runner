import { ESCENAS, VIDAS_INICIALES, PUNTOS_INICIO } from '../utils/constantes.js';

export default class MenuScene extends Phaser.Scene {
    constructor() { super({ key: ESCENAS.MENU }); }

    preload() {
        this.load.image('bg', 'public/assets/bg.png');
    }

    create() {
        const cx = this.scale.width  / 2;
        const cy = this.scale.height / 2;

        this.add.image(cx, cy, 'bg').setDisplaySize(this.scale.width, this.scale.height);

        this.add.text(cx, cy - 80, 'Flame Runner', {
            fontSize: '32px', fill: '#ff6600',
            fontFamily: 'monospace', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(cx, cy - 40, 'Realmente está mal?', {
            fontSize: '13px', fill: '#aaccff',
            fontFamily: 'monospace', fontStyle: 'italic'
        }).setOrigin(0.5);

        const boton = this.add.text(cx, cy + 30, '[ JUGAR ]', {
            fontSize: '24px', fill: '#ffffff', fontFamily: 'monospace',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        boton.on('pointerover', () => boton.setStyle({ fill: '#ff6600' }));
        boton.on('pointerout',  () => boton.setStyle({ fill: '#ffffff' }));
        boton.on('pointerdown', () => this.scene.start(ESCENAS.LEVEL1, {
            puntos: PUNTOS_INICIO,
            vidas:  VIDAS_INICIALES,
            npcsTotalesSalvados: 0
        }));

        this.add.text(cx, cy + 100, '← → moverse   ↑ saltar', {
            fontSize: '11px', fill: '#667788', fontFamily: 'monospace'
        }).setOrigin(0.5);
    }
}
