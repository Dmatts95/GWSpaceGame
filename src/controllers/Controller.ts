// This will be the base class for handling Player, Human, or Network Controllers
// Thinking of using flags representing Up, Down, Left, Right
// Utilized in the Game Entity


export class Controller {
    constructor(){}
    getGameInputs():Array<boolean>{return []}
}