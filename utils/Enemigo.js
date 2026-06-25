// Enemigo.js — enemigo patrullero que rebota en su rango
// spritesheet: enem.png — 144x64, 4 frames de 36x64

export default class Enemigo {
    constructor(scene, x, y) {
        this.scene  = scene;
        this.origen = x;
        this.rango  = 64;   // px hacia cada lado desde el spawn
        this.speed  = 80;
        this.dir    = 1;

        this.sprite = scene.physics.add.sprite(x, y, 'enem');
        this.sprite.body.setSize(24, 56);
        this.sprite.body.setOffset(6, 8);
        this.sprite.setCollideWorldBounds(true);

        this._crearAnimaciones();
        this.sprite.anims.play('enem_walk', true);
    }

    _crearAnimaciones() {
        if (this.scene.anims.exists('enem_walk')) return;
        this.scene.anims.create({
            key: 'enem_walk',
            frames: this.scene.anims.generateFrameNumbers('enem', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }

    update() {
        this.sprite.body.setVelocityX(this.speed * this.dir);
        this.sprite.setFlipX(this.dir < 0);

        // Rebote al llegar al límite del rango
        if (this.sprite.x > this.origen + this.rango) {
            this.dir = -1;
        } else if (this.sprite.x < this.origen - this.rango) {
            this.dir = 1;
        }
    }

    getSprite() { return this.sprite; }
}
