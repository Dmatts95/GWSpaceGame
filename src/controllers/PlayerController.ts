import { GameInputs, IKeyboard } from "./ControllerConfig";
import { Controller } from "./Controller";

export class PlayerController extends Controller{
    private gameScene:Phaser.Scene;
    constructor(_scene:Phaser.Scene){
        super();
        this.gameScene = _scene;
    }

    getGameInputs():Array<boolean>{
        const inputArray: boolean[] = new Array(GameInputs.NUM_GAME_INPUTS).fill(false);
        const cursorKeys:IKeyboard = this.gameScene.input.keyboard.addKeys('W,A,S,D') as IKeyboard;
        if(cursorKeys.W.isDown) inputArray[GameInputs.UP] = true;
        if(cursorKeys.A.isDown) inputArray[GameInputs.LEFT] = true;
        if(cursorKeys.S.isDown) inputArray[GameInputs.DOWN] = true;
        if(cursorKeys.D.isDown) inputArray[GameInputs.RIGHT] = true;
        return inputArray;
    }
}