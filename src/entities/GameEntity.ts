import { IGameEntityPhysicsConfig } from "./GameEntityConfig";
import {Controller} from '../controllers/Controller';
import { GameInputs } from "../controllers/ControllerConfig";
import Phaser from "phaser";

export class GameEntity{
    private controller:Controller; 
    private entity:Phaser.Physics.Arcade.Sprite; 
    private physicsConfig:IGameEntityPhysicsConfig;
    
    constructor(_controller:Controller, _entity:Phaser.Physics.Arcade.Sprite, _physicsConfig:IGameEntityPhysicsConfig){
        this.controller = _controller;
        this.entity = _entity; 
        this.physicsConfig = _physicsConfig
    }
    getPhysicsEntity():Phaser.Physics.Arcade.Sprite {
        return this.entity; 
    }

    private getDamping(dampX:boolean, dampY:boolean):Array<number> {
        const toReturn = [0,0];
        if(dampX){
          if(this.entity.body.velocity.x > 0){
            toReturn[0] = (this.entity.body.velocity.x < this.physicsConfig.damping  )? - this.entity.body.velocity.x : -this.physicsConfig.damping
          } else if (this.entity.body.velocity.x < 0){
            toReturn[0] = (this.entity.body.velocity.x > this.physicsConfig.damping  )? this.entity.body.velocity.x : this.physicsConfig.damping
          }
        }
    
        if(dampY){
          if(this.entity.body.velocity.y > 0){
            toReturn[1] = (this.entity.body.velocity.y < this.physicsConfig.damping  )? - this.entity.body.velocity.y : -this.physicsConfig.damping
          } else if (this.entity.body.velocity.y < 0){
            toReturn[1] = (this.entity.body.velocity.y > this.physicsConfig.damping  )? this.entity.body.velocity.y : this.physicsConfig.damping
          }
        }
        return toReturn;
      }

    update(): void {
        const inputs: Array<boolean> = this.controller.getGameInputs();
        let verticalKeysDown:boolean = false;
        let horizontalKeysDown: boolean = false; 
        let xAcceleration:number = 0; 
        let yAcceleration:number = 0; 


        if(inputs[GameInputs.UP]){
            yAcceleration = -this.physicsConfig.acceleration;
            verticalKeysDown = true; 
        }
         if(inputs[GameInputs.DOWN]){
            yAcceleration = this.physicsConfig.acceleration;
            verticalKeysDown = true;
        }
        if(inputs[GameInputs.LEFT]){
            xAcceleration = -this.physicsConfig.acceleration;
            horizontalKeysDown = true; 
        }
         if(inputs[GameInputs.RIGHT]){
            xAcceleration = this.physicsConfig.acceleration;
            horizontalKeysDown = true; 
        }

        const damping: Array<number> = this.getDamping(!horizontalKeysDown, !verticalKeysDown);
        this.entity.body.velocity.x =  Phaser.Math.Clamp((this.entity.body.velocity.x + xAcceleration + damping[0]) , -this.physicsConfig.velMax, this.physicsConfig.velMax);
        this.entity.body.velocity.y = Phaser.Math.Clamp((this.entity.body.velocity.y + yAcceleration + damping[1]), -this.physicsConfig.velMax, this.physicsConfig.velMax);
    }
}