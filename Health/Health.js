/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Health extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("5 Health", "./Health/costumes/5 Health.png", {
        x: 16,
        y: 15
      }),
      new Costume("4 Health", "./Health/costumes/4 Health.png", {
        x: 16,
        y: 15
      }),
      new Costume("3 Health", "./Health/costumes/3 Health.png", {
        x: 16,
        y: 15
      }),
      new Costume("2 Health", "./Health/costumes/2 Health.png", {
        x: 16,
        y: 15
      }),
      new Costume("1 Health", "./Health/costumes/1 Health.png", {
        x: 16,
        y: 15
      }),
      new Costume("0 Health", "./Health/costumes/0 Health.png", {
        x: 16,
        y: 15
      })
    ];

    this.sounds = [
      new Sound("Gain_HealthSE", "./Health/sounds/Gain_HealthSE.wav")
    ];

    this.triggers = [
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
      new Trigger(
        Trigger.BROADCAST,
        { name: "Gain Health" },
        this.whenIReceiveGainHealth
      ),
      new Trigger(Trigger.CLONE_START, this.startAsClone)
    ];

    this.vars.healthClone = "no";
  }

  *whenIReceiveStart() {
    if (this.toString(this.vars.healthClone) === "no") {
      this.goto(-215, -155);
      this.visible = true;
      while (true) {
        if (this.toNumber(this.stage.vars.playerHealth) === 5) {
          this.costume = "5 Health";
        } else {
          if (this.toNumber(this.stage.vars.playerHealth) === 4) {
            this.costume = "4 Health";
          } else {
            if (this.toNumber(this.stage.vars.playerHealth) === 3) {
              this.costume = "3 Health";
            } else {
              if (this.toNumber(this.stage.vars.playerHealth) === 2) {
                this.costume = "2 Health";
              } else {
                if (this.toNumber(this.stage.vars.playerHealth) === 1) {
                  this.costume = "1 Health";
                } else {
                  if (this.toNumber(this.stage.vars.playerHealth) === 0) {
                    this.costume = "0 Health";
                  }
                }
              }
            }
          }
        }
        yield;
      }
    }
  }

  *whenIReceiveStart2() {
    this.vars.healthClone = "no";
    if (this.toString(this.vars.healthClone) === "no") {
      while (true) {
        this.y += 1;
        yield* this.wait(0.4);
        this.y -= 1;
        yield* this.wait(0.4);
        yield;
      }
    }
  }

  *whenIReceiveStart3() {
    if (this.toString(this.vars.healthClone) === "no") {
      yield* this.wait(0.1);
      this.moveAhead();
    }
  }

  *whenIReceiveDamage() {
    if (this.toString(this.vars.healthClone) === "no") {
      for (let i = 0; i < 5; i++) {
        this.x += this.random(-5, 5);
        yield* this.wait(0.01);
        this.goto(-215, -155);
        yield* this.wait(0.01);
        yield;
      }
    }
  }

  *whenIReceiveGainHealth() {
    yield* this.startSound("Gain_HealthSE");
    if (this.toString(this.vars.healthClone) === "no") {
      this.createClone();
      yield* this.wait(0.1);
    }
  }

  *startAsClone() {
    this.vars.healthClone = "yes";
    this.costume = "5 Health";
    for (let i = 0; i < 50; i++) {
      this.y += 1;
      this.effects.ghost += 2;
      yield;
    }
    this.deleteThisClone();
  }
}
