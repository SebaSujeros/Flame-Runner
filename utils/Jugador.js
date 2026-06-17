export default class Jugador {
    constructor(scene, x, y) {
        this.scene = scene;

        this.sprite = scene.physics.add.sprite(x, y, 'prota');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(24, 56);      // hitbox más chica que el frame
        this.sprite.body.setOffset(6, 8);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.velocidad   = 160;
        this.fuerzaSalto = -400;

        this._crearAnimaciones();
    }

    _crearAnimaciones() {
        const anims = this.scene.anims;

        if (!anims.exists('prota_idle')) {
            anims.create({
                key: 'prota_idle',
                frames: anims.generateFrameNumbers('prota', { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        }

        if (!anims.exists('prota_walk')) {
            anims.create({
                key: 'prota_walk',
                frames: anims.generateFrameNumbers('prota', { start: 2, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    update() {
        const body = this.sprite.body;
        const izq  = this.cursors.left.isDown;
        const der  = this.cursors.right.isDown;

        if (izq) {
            body.setVelocityX(-this.velocidad);
            this.sprite.setFlipX(true);
            this.sprite.anims.play('prota_walk', true);
        } else if (der) {
            body.setVelocityX(this.velocidad);
            this.sprite.setFlipX(false);
            this.sprite.anims.play('prota_walk', true);
        } else {
            body.setVelocityX(0);
            this.sprite.anims.play('prota_idle', true);
        }

        if (this.cursors.up.isDown && body.blocked.down) {
            body.setVelocityY(this.fuerzaSalto);
        }
    }

    getSprite() { return this.sprite; }
}
