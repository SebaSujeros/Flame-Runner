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

        this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x040810);

        // Título
        this.add.text(cx, cy - 130, '¡LO CONSEGUISTE!', {
            fontSize: '26px', fill: '#ff6600',
            fontFamily: 'monospace', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(cx, cy - 95, 'Salvaste al pueblo congelado', {
            fontSize: '13px', fill: '#aaccff',
            fontFamily: 'monospace', fontStyle: 'italic'
        }).setOrigin(0.5);

        // Separador
        this.add.rectangle(cx, cy - 68, 300, 2, 0x334455);

        // Stats
        const estilo = { fontSize: '16px', fill: '#ffffff', fontFamily: 'monospace' };

        this.add.text(cx, cy - 45, `Congelados salvados:  ${this.npcsSalvados}`, estilo).setOrigin(0.5);
        this.add.text(cx, cy - 15, `Puntos finales:       ${this.puntosFinal}`,  estilo).setOrigin(0.5);
        this.add.text(cx, cy + 15, `Vidas restantes:      ${this.vidas}`,        estilo).setOrigin(0.5);

        // Separador
        this.add.rectangle(cx, cy + 42, 300, 2, 0x334455);

        // Botón
        const boton = this.add.text(cx, cy + 80, '[ VOLVER AL MENÚ ]', {
            fontSize: '18px', fill: '#ffffff', fontFamily: 'monospace'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        boton.on('pointerover', () => boton.setStyle({ fill: '#ff6600' }));
        boton.on('pointerout',  () => boton.setStyle({ fill: '#ffffff' }));
        boton.on('pointerdown', () => this.scene.start(ESCENAS.MENU));

        // Fade de entrada
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
