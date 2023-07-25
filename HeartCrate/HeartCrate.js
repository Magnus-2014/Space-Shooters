/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class HeartCrate extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./HeartCrate/costumes/costume1.png", {
        x: 20,
        y: 21
      })
    ];

    this.sounds = [new Sound("BreakSE", "./HeartCrate/sounds/BreakSE.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(Trigger.CLONE_START, this.startAsClone),
      new Trigger(Trigger.CLONE_START, this.startAsClone2),
      new Trigger(Trigger.CLONE_START, this.startAsClone3)
    ];

    this.vars.healthCrateTurn = 12941675;
  }

  *whenIReceiveStart() {
    this.visible = false;
    while (true) {
      yield* this.wait(this.random(10, 20));
      this.createClone();
      yield;
    }
  }

  *startAsClone() {
    this.visible = true;
    this.goto(this.random(-200, 200), 140);
    while (!(this.compare(this.y, -160) < 0)) {
      this.y -= 2;
      yield;
    }
    /* TODO: Implement stop other scripts in sprite */ null;
    yield* this.deleteCrate("yes");
  }

  *deleteCrate(isItEdge) {
    yield* this.startSound("BreakSE");
    if (this.toString(isItEdge) === "yes") {
      null;
    } else {
      if (this.toString(isItEdge) === "no") {
        this.stage.vars.playerHealth += 3;
        if (this.compare(this.stage.vars.playerHealth, 4) > 0) {
          this.stage.vars.playerHealth = 5;
        }
        this.stage.vars.score++;
        this.broadcast("score");
        this.broadcast("Gain Health");
      }
    }
    this.stage.vars.asteroidNumber++;
    this.stage.vars.asteroidX.push(this.x);
    this.stage.vars.asteroidY.push(this.y);
    for (let i = 0; i < 25; i++) {
      this.sprites["Particle"].createClone();
    }
    this.stage.vars.totalAsteroids--;
    this.deleteThisClone();
  }

  *startAsClone2() {
    while (true) {
      if (this.touching(this.sprites["Bullet"].andClones())) {
        /* TODO: Implement stop other scripts in sprite */ null;
        yield* this.deleteCrate("no");
        this.broadcast("medium shake");
        yield* this.wait(0.05);
      }
      yield;
    }
  }

  *startAsClone3() {
    this.vars.healthCrateTurn = 0;
    while (true) {
      this.vars.healthCrateTurn += 5;
      this.direction =
        Math.sin(this.degToRad(this.toNumber(this.vars.healthCrateTurn))) * 10 +
        90;
      yield;
    }
  }
}
