/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Player extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Idle", "./Player/costumes/Idle.png", { x: 11, y: 14 }),
      new Costume("Move1", "./Player/costumes/Move1.png", { x: 18, y: 14 }),
      new Costume("Move2", "./Player/costumes/Move2.png", { x: 20, y: 14 }),
      new Costume("Move3", "./Player/costumes/Move3.png", { x: 20, y: 14 }),
      new Costume("Boom1", "./Player/costumes/Boom1.png", { x: 8, y: 3 }),
      new Costume("Boom2", "./Player/costumes/Boom2.png", { x: 9, y: 14 }),
      new Costume("Boom3", "./Player/costumes/Boom3.png", { x: 9, y: -3 }),
      new Costume("Boom4", "./Player/costumes/Boom4.png", { x: 11, y: 3 })
    ];

    this.sounds = [
      new Sound("ShootSE", "./Player/sounds/ShootSE.wav"),
      new Sound("RespawnSE", "./Player/sounds/RespawnSE.wav"),
      new Sound("DieSE", "./Player/sounds/DieSE.wav")
    ];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Start" },
        this.whenIReceiveStart2
      ),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Start" },
        this.whenIReceiveStart3
      ),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Damage" },
        this.whenIReceiveDamage
      ),
      new Trigger(Trigger.CLONE_START, this.startAsClone),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Start" },
        this.whenIReceiveStart4
      ),
      new Trigger(Trigger.BROADCAST, { name: "Reset" }, this.whenIReceiveReset)
    ];

    this.vars.blowUpClones = 4;
  }

  *whenGreenFlagClicked() {
    this.broadcast("Start");
  }

  *whenIReceiveStart() {
    while (true) {
      if (
        this.toNumber(this.vars.blowUpClones) === 0 &&
        (this.keyPressed("w") ||
          this.keyPressed("a") ||
            this.keyPressed("s") ||
              this.keyPressed("d") ||
                this.keyPressed("up arrow") ||
                  this.keyPressed("down arrow") ||
                    this.keyPressed("right arrow") ||
                      this.keyPressed("left arrow"))
      ) {
        this.costumeNumber++;
        yield* this.wait(0.05);
        if (this.compare(this.costumeNumber, 3) > 0) {
          this.costume = "Idle";
        }
      } else {
        this.costume = "Idle";
      }
      yield;
    }
  }

  *moveSpeedTurnSpeedFriction(moveSpeed, turnSpeed, friction) {
    if (this.keyPressed("up arrow") || this.keyPressed("w")) {
      this.stage.vars.movesmooth += this.toNumber(moveSpeed);
    }
    if (this.keyPressed("down arrow") || this.keyPressed("s")) {
      this.stage.vars.movesmooth += (this.toNumber(moveSpeed) * -1) / 3;
    }
    if (this.keyPressed("right arrow") || this.keyPressed("d")) {
      this.stage.vars.turnsmooth += this.toNumber(turnSpeed);
    }
    if (this.keyPressed("left arrow") || this.keyPressed("a")) {
      this.stage.vars.turnsmooth += this.toNumber(turnSpeed) * -1;
    }
    this.stage.vars.movesmooth =
      this.toNumber(this.stage.vars.movesmooth) * this.toNumber(friction);
    this.stage.vars.turnsmooth =
      this.toNumber(this.stage.vars.turnsmooth) * this.toNumber(friction);
    this.move(this.toNumber(this.stage.vars.movesmooth));
    this.direction += this.toNumber(this.stage.vars.turnsmooth);
  }

  *whenIReceiveStart2() {
    while (true) {
      if (
        this.keyPressed("space") &&
        this.toNumber(this.vars.blowUpClones) === 0
      ) {
        this.sprites["Bullet"].createClone();
        yield* this.startSound("ShootSE");
        yield* this.wait(0.2);
      }
      yield;
    }
  }

  *whenIReceiveStart3() {
    while (true) {
      if (
        (this.touching(this.sprites["AsteroidLarge"].andClones()) ||
          this.touching(this.sprites["AsteroidMedium"].andClones()) ||
            this.touching(this.sprites["AsteroidSmall"].andClones()) ||
              this.touching(this.sprites["AlienAi"].andClones())) &&
        this.toString(this.stage.vars.invincible) === "no"
      ) {
        if (this.toNumber(this.stage.vars.playerHealth) === 1) {
          this.stage.vars.gameOver = "yes";
          this.stage.vars.playerHealth--;
          this.broadcast("Damage");
        } else {
          this.broadcast("player shake");
          this.stage.vars.playerHealth--;
          this.broadcast("Damage");
          yield* this.wait(0.1);
        }
      }
      yield;
    }
  }

  *whenIReceiveDamage() {
    yield* this.startSound("DieSE");
    this.stage.vars.movesmooth = 0;
    this.stage.vars.turnsmooth = 0;
    this.vars.blowUpClones = 0;
    this.visible = false;
    yield* this.blowUpAnimation();
  }

  *blowUpAnimation() {
    this.vars.blowUpClones = 1;
    this.createClone();
    this.vars.blowUpClones = 2;
    this.createClone();
    this.vars.blowUpClones = 3;
    this.createClone();
    this.vars.blowUpClones = 4;
    this.createClone();
    this.stage.vars.asteroidNumber++;
    this.stage.vars.asteroidX.push(this.x);
    this.stage.vars.asteroidY.push(this.y);
    for (let i = 0; i < 10; i++) {
      this.sprites["Particle"].createClone();
    }
  }

  *startAsClone() {
    this.visible = true;
    this.effects.clear();
    if (this.toNumber(this.vars.blowUpClones) === 1) {
      this.costume = "Boom1";
      for (let i = 0; i < 50; i++) {
        this.effects.ghost += 2;
        this.direction -= 2;
        this.move(1);
        yield;
      }
    } else {
      if (this.toNumber(this.vars.blowUpClones) === 2) {
        this.costume = "Boom2";
        for (let i = 0; i < 50; i++) {
          this.effects.ghost += 2;
          this.direction -= 1;
          this.move(-1);
          yield;
        }
      } else {
        if (this.toNumber(this.vars.blowUpClones) === 3) {
          this.costume = "Boom3";
          for (let i = 0; i < 50; i++) {
            this.effects.ghost += 2;
            this.direction += 1;
            yield;
          }
        } else {
          if (this.toNumber(this.vars.blowUpClones) === 4) {
            this.costume = "Boom4";
            for (let i = 0; i < 50; i++) {
              this.effects.ghost += 2;
              this.direction += 2;
              yield;
            }
          }
        }
      }
    }
    if (this.toString(this.stage.vars.gameOver) === "yes") {
      /* TODO: Implement stop other scripts in sprite */ null;
      this.visible = false;
    } else {
      this.broadcast("Reset");
    }
    this.deleteThisClone();
  }

  *whenIReceiveStart4() {
    this.stage.vars.asteroidX = [];
    this.stage.vars.asteroidY = [];
    this.stage.vars.asteroidNumber = 0;
    this.stage.vars.playerHealth = 5;
    this.stage.vars.gameOver = "no";
    this.broadcast("Reset");
    while (true) {
      if (this.toString(this.stage.vars.gameOver) === "no") {
        this.goto(
          this.x + this.toNumber(this.stage.vars.shakex),
          this.y + this.toNumber(this.stage.vars.shakey)
        );
        if (this.toNumber(this.vars.blowUpClones) === 0) {
          yield* this.moveSpeedTurnSpeedFriction(0.7, 1, 0.9);
        }
      }
      yield;
    }
  }

  *whenIReceiveReset() {
    yield* this.startSound("RespawnSE");
    this.moveAhead();
    this.visible = true;
    this.goto(0, 0);
    this.direction = 0;
    this.stage.vars.movesmooth = 0;
    this.stage.vars.turnsmooth = 0;
    this.vars.blowUpClones = 0;
    this.stage.vars.invincible = "yes";
    yield* this.wait(4);
    this.stage.vars.invincible = "no";
  }
}
