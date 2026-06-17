export default class NPC {
    constructor(scene, x, y) {
        this.scene   = scene;
        this.salvado = false;

        this.sprite = scene.physics.add.sprite(x, y, 'npc');
        this.sprite.body.setImmovable(true);
        this.sprite.body.allowGravity = false;
        this.sprite.body.setSize(24, 56);
        this.sprite.body.setOffset(4, 8);

        this._crearAnimaciones();
        this.sprite.anims.play('npc_idle', true);
    }

    _crearAnimaciones() {
        const anims = this.scene.anims;

        if (!anims.exists('npc_idle')) {
            anims.create({
                key: 'npc_idle',
                frames: anims.generateFrameNumbers('npc', { start: 0, end: 7 }),
                frameRate: 6,
                repeat: -1
            });
        }

        if (!anims.exists('npc_saved')) {
            anims.create({
                key: 'npc_saved',
                frames: anims.generateFrameNumbers('npc', { start: 8, end: 8 }),
                frameRate: 1,
                repeat: 0
            });
        }
    }

    salvar() {
        if (this.salvado) return false;
        this.salvado = true;

        this.sprite.anims.play('npc_saved', true);

        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            y: this.sprite.y - 20,
            duration: 700,
            delay: 300,
            ease: 'Power2',
            onComplete: () => this.sprite.destroy()
        });

        return true;
    }

    getSprite() { return this.sprite; }
}
