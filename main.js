import MenuScene    from './scenes/MenuScene.js';
import Level1Scene  from './scenes/Level1Scene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene  from './scenes/VictoryScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 416,   // 13 tiles × 32px
    backgroundColor: '#080f1a',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: [ MenuScene, Level1Scene, GameOverScene, VictoryScene ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
