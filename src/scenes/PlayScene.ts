import Phaser, { Math, Physics } from 'phaser';

interface IPlayerController{
  xAcceleration: number; 
  yAcceleration: number;
}

const playerDefaults = {
  velMax: 200, 
  acceleration: 5,
  damping: 20,
  shotDelay:200
};

interface IKeyboard{
  W: Phaser.Input.Keyboard.Key,
  A:  Phaser.Input.Keyboard.Key,
  S:  Phaser.Input.Keyboard.Key,
  D:  Phaser.Input.Keyboard.Key
}

const MILLI = 0.001

class Bullet extends Phaser.Physics.Arcade.Sprite {
  private lifespan:number;
  constructor(scene:Phaser.Scene,x:number,y:number) {
    super(scene,x,y,'red');
  } 
  

  fire(x:number,y:number,vx:number,vy:number, lifespan:number):void{
    this.body.setCircle(6)
    this.body.reset(x,y)
		this.setActive(true);
		this.setVisible(true);
    this.body.velocity.set(vx,vy)
    this.lifespan = lifespan
  }

  update(dt:number): void {
      this.lifespan -= dt;
      if(this.lifespan < 0){
        this.setActive(false);
        this.setVisible(false);
      }
  }
}


export default class PlayScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Arc;
  private enemy: Phaser.GameObjects.Arc;
  private reticle: Phaser.GameObjects.Arc;
  private playerController: IPlayerController;
  private shotTimer:number;
  private bullets: Phaser.Physics.Arcade.Group; 

  constructor () {
    super({
      key: 'play',
      physics: {
        arcade: {
          debug: true
        }
      },
    });
    this.playerController = {xAcceleration: 0, yAcceleration: 0}
    this.shotTimer = 0; 
  }

  preload(){
    this.load.setBaseURL('http://labs.phaser.io')
    this.load.image('red', 'assets/particles/red.png')
  }

  dampPlayer(dampX:boolean, dampY:boolean):Array<number> {
    const toReturn = [0,0];
    if(dampX){
      if(this.player.body.velocity.x > 0){
        toReturn[0] = (this.player.body.velocity.x < playerDefaults.damping  )? - this.player.body.velocity.x : -playerDefaults.damping
      } else if (this.player.body.velocity.x < 0){
        toReturn[0] = (this.player.body.velocity.x > playerDefaults.damping  )? this.player.body.velocity.x : playerDefaults.damping
      }
    }

    if(dampY){
      if(this.player.body.velocity.y > 0){
        toReturn[1] = (this.player.body.velocity.y < playerDefaults.damping  )? - this.player.body.velocity.y : -playerDefaults.damping
      } else if (this.player.body.velocity.y < 0){
        toReturn[1] = (this.player.body.velocity.y > playerDefaults.damping  )? this.player.body.velocity.y : playerDefaults.damping
      }
    }
    return toReturn;
  }

  create ():void {
    this.player = this.add.circle(50,50,20,0xff0000);
    this.physics.add.existing(this.player);

    this.enemy = this.add.circle(250,250,22, 0x00ff00);
    this.physics.add.existing(this.enemy);

    
    this.reticle = this.add.circle(50,50,5,0x0000ff);

    this.bullets = new Phaser.Physics.Arcade.Group(this.physics.world, this)
    this.bullets.createMultiple({
      classType: Bullet,
      frameQuantity: 20,
      active: false, 
      visible: false, 
      key: 'bullets',
    })
  }

  fireWeapon(){
    const bullet:Bullet = this.bullets.getFirstDead(false);
    if(bullet){
      const playerPos: Math.Vector2 = new Math.Vector2(this.player.x, this.player.y)
      const retPos: Math.Vector2 = new Math.Vector2(this.reticle.x, this.reticle.y)
      const dir = retPos.subtract(playerPos).normalize();
      const bSpeed = 600;
      bullet.setScale(0.3,0.3).setCircle(30,60,60)
      bullet.fire(this.player.x, this.player.y, dir.x*bSpeed, dir.y*bSpeed, 1000)
    }
  }

  update (time:number, delta:number) {
    this.physics.world.collide(this.bullets.getChildren(),this.enemy, (bodyA, bodyB) => {
      console.log();
      
      this.enemy.setActive(false)
      this.enemy.setVisible(false)
    })

    const cursorKeys = this.input.keyboard.addKeys('W,A,S,D') as IKeyboard;
    const pointer = this.input.mousePointer;

    this.reticle.x = pointer.worldX; 
    this.reticle.y = pointer.worldY; 

    let verticalKeysDown = false;
    let horizontalKeysDown = false; 

    this.playerController.yAcceleration = 0;
    this.playerController.xAcceleration = 0;

    this.bullets.getChildren().forEach(bullet => {
      if(bullet.active){
        bullet.update(delta)
      }
    })

    if(this.shotTimer > 0) this.shotTimer = Phaser.Math.Clamp(this.shotTimer - delta,0,playerDefaults.shotDelay)

    if(cursorKeys.W.isDown){
      this.playerController.yAcceleration = -playerDefaults.acceleration;
      verticalKeysDown=true;
    }else if(cursorKeys.S.isDown){
      this.playerController.yAcceleration = playerDefaults.acceleration;
      verticalKeysDown=true;
    }

    if(cursorKeys.A.isDown){
      this.playerController.xAcceleration = -playerDefaults.acceleration;
      horizontalKeysDown=true;
    }
    else if(cursorKeys.D.isDown){
      this.playerController.xAcceleration = playerDefaults.acceleration;
      horizontalKeysDown=true;
    }

    if(pointer.leftButtonDown()){
      if(this.shotTimer === 0){
        this.fireWeapon()
        this.shotTimer = playerDefaults.shotDelay;
      }
    }

    const damping = this.dampPlayer(!horizontalKeysDown, !verticalKeysDown)
    this.player.body.velocity.x =  Math.Clamp((this.player.body.velocity.x + this.playerController.xAcceleration + damping[0]) , -playerDefaults.velMax, playerDefaults.velMax);
    this.player.body.velocity.y = Math.Clamp((this.player.body.velocity.y + this.playerController.yAcceleration + damping[1]), -playerDefaults.velMax, playerDefaults.velMax);
  
  }
}
