export enum GameInputs{
    UP,
    DOWN, 
    LEFT,
    RIGHT,
    SHOOT,
    NUM_GAME_INPUTS
}

export interface IKeyboard{
    W: Phaser.Input.Keyboard.Key,
    A:  Phaser.Input.Keyboard.Key,
    S:  Phaser.Input.Keyboard.Key,
    D:  Phaser.Input.Keyboard.Key
}