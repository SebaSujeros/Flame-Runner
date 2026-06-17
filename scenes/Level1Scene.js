import { ESCENAS, PUNTOS_POR_NPC, PUNTOS_DECAY_POR_SEG, MIN_NPCS_LEVEL1 } from '../utils/constantes.js';
import Jugador from '../utils/Jugador.js';
import NPC     from '../utils/NPC.js';
import HUD     from '../utils/HUD.js';

export default class Level1Scene extends Phaser.Scene {
    constructor() { super({ key: ESCENAS.LEVEL1 }); }

    init(data) {
        this.puntos              = data.puntos ?? 100;
        this.vidas               = data.vidas  ?? 3;
        this.npcsTotalesSalvados = data.npcsTotalesSalvados ?? 0;
        this.npcsSalvadosNivel   = 0;
        this.npcsEnNivel         = 0;
        this.terminando          = false;
    }

    preload() {
        this.load.image('bg',      'public/assets/bg.png');
        this.load.image('tileset', 'public/assets/tileset.png');
        this.load.tilemapTiledJSON('lvl1', 'public/assets/tilemap/lvl1.json');
        this.load.spritesheet('prota', 'public/assets/prota.png', { frameWidth: 36, frameHeight: 64 });
        this.load.spritesheet('npc',   'public/assets/npc.png',   { frameWidth: 32, frameHeight: 64 });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.add.image(W / 2, H / 2, 'bg').setDisplaySize(W, H).setScrollFactor(0).setDepth(-1);

        // Tilemap
        const map     = this.make.tilemap({ key: 'lvl1' });
        const tileset = map.addTilesetImage('tileset', 'tileset');
        const capaTiles = map.createLayer('tiles', tileset, 0, 0);
        capaTiles.setCollisionByProperty({ colision: true });

        // objt
        const objetos   = map.getObjectLayer('objetos').objects;
        const spawnJug  = objetos.find(o => o.name === 'jugador');
        const spawnMeta = objetos.find(o => o.name === 'meta');
        const spawnsNPC = objetos.filter(o => o.name === 'npc');

        // Player
        this.jugador = new Jugador(this, spawnJug.x, spawnJug.y);
        this.physics.add.collider(this.jugador.getSprite(), capaTiles);

        // npcsmssmsmsmsms
        this.npcs = spawnsNPC.map(s => new NPC(this, s.x, s.y));
        this.npcsEnNivel = this.npcs.length;
        this.npcs.forEach(npc => {
            this.physics.add.collider(npc.getSprite(), capaTiles);
            this.physics.add.overlap(
                this.jugador.getSprite(), npc.getSprite(),
                () => this._salvarNPC(npc)
            );
        });

        // Meeta
        const metaRect = this.add.rectangle(spawnMeta.x, spawnMeta.y, 20, 40);
        this.physics.add.existing(metaRect, true);
        this.meta = metaRect;
        this.physics.add.overlap(
            this.jugador.getSprite(), this.meta,
            () => this._checkMeta()
        );

        // Hud y camara
        this.hud = new HUD(this);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.jugador.getSprite(), true, 0.1, 0.1);
        this.cameras.main.fadeIn(400, 0, 0, 0);

        this.time.addEvent({
            delay: 1000, callback: this._decayPuntos,
            callbackScope: this, loop: true
        });

        this.add.text(10, H - 16, 'NIVEL 1 — Salvá a los congelados y llegá a la meta', {
            fontSize: '10px', fill: '#556677', fontFamily: 'monospace'
        }).setScrollFactor(0).setDepth(20);
    }

    update() {
        if (this.terminando) return;
        this.jugador.update();
        this.hud.actualizar(this.puntos, this.vidas, this.npcsSalvadosNivel, this.npcsEnNivel);
        if (this.vidas <= 0) this._gameOver();
    }

    _salvarNPC(npc) {
        if (npc.salvar()) {
            this.puntos += PUNTOS_POR_NPC;
            this.npcsSalvadosNivel++;
        }
    }

    _checkMeta() {
        if (this.terminando) return;
        if (this.npcsSalvadosNivel >= MIN_NPCS_LEVEL1) this._avanzarNivel();
    }

    _decayPuntos() {
        if (this.terminando) return;
        this.puntos = Math.max(0, this.puntos - PUNTOS_DECAY_POR_SEG);
        if (this.puntos <= 0) { this.vidas--; this.puntos = 100; }
    }

    _avanzarNivel() {
        this.terminando = true;
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(ESCENAS.VICTORY, {
                puntos: this.puntos, vidas: this.vidas,
                npcsSalvados: this.npcsTotalesSalvados + this.npcsSalvadosNivel
            });
        });
    }

    _gameOver() {
        this.terminando = true;
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(ESCENAS.GAMEOVER, {
                puntos: this.puntos,
                npcsSalvados: this.npcsTotalesSalvados + this.npcsSalvadosNivel
            });
        });
    }
}
