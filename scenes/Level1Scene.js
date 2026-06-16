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

        // Fondo en código, no en Tiled
        this.add.image(W / 2, H / 2, 'bg').setDisplaySize(W, H).setScrollFactor(0).setDepth(-1);

        // ── Tilemap ───────────────────────────────────────────────────
        const map     = this.make.tilemap({ key: 'lvl1' });
        const tileset = map.addTilesetImage('tileset', 'tileset');

        const capaTiles = map.createLayer('tiles', tileset, 0, 0);
        capaTiles.setCollisionByProperty({ colision: true });

        // ── Objetos del mapa ──────────────────────────────────────────
        const objetos  = map.getObjectLayer('objetos').objects;
        const spawnJug = objetos.find(o => o.name === 'jugador');
        const spawnMeta= objetos.find(o => o.name === 'meta');
        const spawnsNPC= objetos.filter(o => o.name === 'npc');

        // ── Jugador ───────────────────────────────────────────────────
        this.jugador = new Jugador(this, spawnJug.x, spawnJug.y);
        this.physics.add.collider(this.jugador.getSprite(), capaTiles);

        // ── NPCs ──────────────────────────────────────────────────────
        this.npcs = spawnsNPC.map(s => new NPC(this, s.x, s.y));
        this.npcsEnNivel = this.npcs.length;

        this.npcs.forEach(npc => {
            this.physics.add.collider(npc.getSprite(), capaTiles);
            this.physics.add.overlap(
                this.jugador.getSprite(), npc.getSprite(),
                () => this._salvarNPC(npc)
            );
        });

        // ── Meta ──────────────────────────────────────────────────────
        this.meta = this.physics.add.sprite(spawnMeta.x, spawnMeta.y, 'tileset');
        this.meta.body.setImmovable(true);
        this.meta.body.allowGravity = false;
        this.meta.setAlpha(0);   // invisible, la flecha ya está en el tilemap

        this.physics.add.overlap(
            this.jugador.getSprite(), this.meta,
            () => this._checkMeta()
        );

        // ── HUD y cámara ──────────────────────────────────────────────
        this.hud = new HUD(this);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.jugador.getSprite(), true, 0.1, 0.1);

        // ── Decay de fuego ────────────────────────────────────────────
        this.time.addEvent({
            delay: 1000,
            callback: this._decayPuntos,
            callbackScope: this,
            loop: true
        });

        this.add.text(10, H - 20, 'NIVEL 1 — Encontrá y salvá a todos los congelados', {
            fontSize: '10px', fill: '#556677', fontFamily: 'monospace'
        }).setScrollFactor(0).setDepth(20);
    }

    update() {
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
        if (this.npcsSalvadosNivel >= MIN_NPCS_LEVEL1) {
            this.time.delayedCall(300, () => this._avanzarNivel());
        }
    }

    _decayPuntos() {
        this.puntos = Math.max(0, this.puntos - PUNTOS_DECAY_POR_SEG);
        if (this.puntos <= 0) { this.vidas--; this.puntos = 100; }
    }

    _avanzarNivel() {
        this.scene.start(ESCENAS.VICTORY, {   // cambiar a LEVEL2 cuando esté listo
            puntos: this.puntos,
            vidas:  this.vidas,
            npcsSalvados: this.npcsTotalesSalvados + this.npcsSalvadosNivel
        });
    }

    _gameOver() {
        this.scene.start(ESCENAS.GAMEOVER, {
            puntos: this.puntos,
            npcsSalvados: this.npcsTotalesSalvados + this.npcsSalvadosNivel
        });
    }
}
