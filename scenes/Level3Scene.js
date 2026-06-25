import { ESCENAS, PUNTOS_POR_NPC, PUNTOS_DECAY_POR_SEG } from '../utils/constantes.js';
import Jugador  from '../utils/Jugador.js';
import NPC      from '../utils/NPC.js';
import Enemigo  from '../utils/Enemigo.js';
import HUD      from '../utils/HUD.js';

const MIN_NPCS_LEVEL3 = 3;

export default class Level3Scene extends Phaser.Scene {
    constructor() { super({ key: ESCENAS.LEVEL3 }); }

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
        this.load.tilemapTiledJSON('lvl3', 'public/assets/tilemap/lvl3.json');
        this.load.spritesheet('prota', 'public/assets/prota.png', { frameWidth: 36, frameHeight: 64 });
        this.load.spritesheet('npc',   'public/assets/npc.png',   { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('enem',  'public/assets/enem.png',  { frameWidth: 36, frameHeight: 64 });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.add.image(W / 2, H / 2, 'bg').setDisplaySize(W, H).setScrollFactor(0).setDepth(-1);

        // ── Tilemap ───────────────────────────────────────────────────
        const map      = this.make.tilemap({ key: 'lvl3' });
        const tileset  = map.addTilesetImage('tileset', 'tileset');
        this.capaTiles = map.createLayer('tiles', tileset, 0, 0);
        this.capaTiles.setCollisionByProperty({ colision: true });

        // ── Objetos ───────────────────────────────────────────────────
        const objetos    = map.getObjectLayer('objetos').objects;
        const spawnJug   = objetos.find(o => o.name === 'jugador');
        const spawnMeta  = objetos.find(o => o.name === 'meta');
        const spawnsNPC  = objetos.filter(o => o.name === 'npc');
        const spawnsEnem = objetos.filter(o => o.name === 'enemigo');

        // ── Jugador ───────────────────────────────────────────────────
        this.jugador = new Jugador(this, spawnJug.x, spawnJug.y);
        this.physics.add.collider(this.jugador.getSprite(), this.capaTiles);

        // ── NPCs ──────────────────────────────────────────────────────
        this.npcs = spawnsNPC.map(s => new NPC(this, s.x, s.y));
        this.npcsEnNivel = this.npcs.length;
        this.npcs.forEach(npc => {
            this.physics.add.collider(npc.getSprite(), this.capaTiles);
            this.physics.add.overlap(
                this.jugador.getSprite(), npc.getSprite(),
                () => this._salvarNPC(npc)
            );
        });

        // ── Enemigos ──────────────────────────────────────────────────
        this.enemigos = spawnsEnem.map(s => new Enemigo(this, s.x, s.y));
        this.enemigos.forEach(e => {
            this.physics.add.collider(e.getSprite(), this.capaTiles);
            this.physics.add.overlap(
                this.jugador.getSprite(), e.getSprite(),
                () => this._morir()
            );
        });

        // ── Meta ──────────────────────────────────────────────────────
        const metaRect = this.add.rectangle(spawnMeta.x, spawnMeta.y, 20, 40);
        this.physics.add.existing(metaRect, true);
        this.meta = metaRect;
        this.physics.add.overlap(
            this.jugador.getSprite(), this.meta,
            () => this._checkMeta()
        );

        // ── HUD y cámara ──────────────────────────────────────────────
        this.hud = new HUD(this);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.jugador.getSprite(), true, 0.1, 0.1);
        this.cameras.main.fadeIn(400, 0, 0, 0);

        this.time.addEvent({
            delay: 1000, callback: this._decayPuntos,
            callbackScope: this, loop: true
        });
    }

    update() {
        if (this.terminando) return;
        this.jugador.update();
        this.enemigos.forEach(e => e.update());
        this.hud.actualizar(this.puntos, this.vidas, this.npcsSalvadosNivel, this.npcsEnNivel);

        // Daño por espinas
        this.capaTiles.forEachTile(tile => {
            if (!tile || !tile.properties || !tile.properties.daño) return;
            const j  = this.jugador.getSprite();
            const dx = Math.abs(j.x - (tile.pixelX + tile.width  / 2));
            const dy = Math.abs(j.y - (tile.pixelY + tile.height / 2));
            if (dx < tile.width / 2 + 8 && dy < tile.height / 2 + 8) this._morir();
        }, this, 0, 0, this.capaTiles.width, this.capaTiles.height, { isNotEmpty: true });
    }

    _salvarNPC(npc) {
        if (npc.salvar()) {
            this.puntos += PUNTOS_POR_NPC;
            this.npcsSalvadosNivel++;
        }
    }

    _checkMeta() {
        if (this.terminando) return;
        if (this.npcsSalvadosNivel >= MIN_NPCS_LEVEL3) this._victoria();
    }

    _decayPuntos() {
        if (this.terminando) return;
        this.puntos = Math.max(0, this.puntos - PUNTOS_DECAY_POR_SEG);
        if (this.puntos <= 0) this._morir();
    }

    _morir() {
        if (this.terminando) return;
        this.terminando = true;
        this.puntos = 0;
        this.hud.actualizar(this.puntos, this.vidas, this.npcsSalvadosNivel, this.npcsEnNivel);
        this.vidas--;
        this.jugador.getSprite().setVisible(false);

        if (this.vidas <= 0) {
            this.time.delayedCall(500, () => {
                this.cameras.main.fadeOut(600, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start(ESCENAS.GAMEOVER, {
                        puntos: this.puntos,
                        npcsSalvados: this.npcsTotalesSalvados + this.npcsSalvadosNivel
                    });
                });
            });
        } else {
            this.time.delayedCall(600, () => {
                this.cameras.main.fadeOut(400, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start(ESCENAS.LEVEL3, {
                        puntos: 100, vidas: this.vidas,
                        npcsTotalesSalvados: this.npcsTotalesSalvados
                    });
                });
            });
        }
    }

    _victoria() {
        this.terminando = true;
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(ESCENAS.VICTORY, {
                puntos: this.puntos, vidas: this.vidas,
                npcsSalvados: this.npcsTotalesSalvados + this.npcsSalvadosNivel
            });
        });
    }
}
