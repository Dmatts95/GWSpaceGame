import Phaser,{ Physics } from "phaser";
import { PlayerController } from "../controllers/PlayerController";
import { IGameEntityPhysicsConfig } from "../entities/GameEntityConfig";
import { GameEntity } from "../entities/GameEntity";


export default class GETestScene extends Phaser.Scene {
    private player:GameEntity;
    constructor () {
        super({
            key: 'ge',
            physics: {
            arcade: {
              debug: true
            }
          },
        });
    }

    preload():void{
        this.load.setBaseURL('http://labs.phaser.io')
        this.load.image('red', 'assets/particles/red.png')
    }

    create():void{
        console.log(this.load.textureManager);
        
        const pSprite:Phaser.Physics.Arcade.Sprite = new Phaser.Physics.Arcade.Sprite(this, 20,20, 'red');
        this.physics.add.existing(pSprite);
        this.add.existing(pSprite)
        const pController:PlayerController = new PlayerController(this);
        const pPhysicsConfig:IGameEntityPhysicsConfig = {
            velMax: 200, 
            acceleration: 5,
            damping: 20,
        }
        this.player = new GameEntity(pController,pSprite,pPhysicsConfig);
    }

    update(time: number, delta: number): void {
        this.player.update();
    }
}