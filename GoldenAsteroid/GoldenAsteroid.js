/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class GoldenAsteroid extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Asteroid", "./GoldenAsteroid/costumes/Asteroid.png", {
        x: 13,
        y: 10
      })
    ];

    this.sounds = [new Sound("BreakSE", "./GoldenAsteroid/sounds/BreakSE.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(Trigger.CLONE_START, this.startAsClone),
      new Trigger(Trigger.CLONE_START, this.startAsClone2),
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart2)
    ];

    this.vars.asteroidX = 0;
    this.vars.asteroidY = 0;
    this.vars.asteroidTurn = 1;
  }

  *whenIReceiveStart() {
    this.visible = false;
    if (this.random(1, 10) === 1) {
      this.createClone();
    } else {
      yield* this.wait(1);
    }
    while (true) {
      yield* this.wait(this.random(5, 45));
      this.createClone();
      yield;
    }
  }

  *startAsClone() {
    yield* this.directAsteroids();
    while (true) {
      yield* this.moveAsteroids();
      yield;
    }
  }

  *directAsteroids() {
    this.stage.vars.totalAsteroids++;
    this.effects.ghost = 100;
    this.size = 250;
    this.visible = true;
    this.stage.vars.whatSide = this.random(1, 4);
    if (this.toNumber(this.stage.vars.whatSide) === 1) {
      this.direction = 180;
      this.goto(this.random(-200, 200), 140);
      this.vars.asteroidX = 0;
      this.vars.asteroidY = -4;
    } else {
      if (this.toNumber(this.stage.vars.whatSide) === 2) {
        this.direction = 0;
        this.goto(this.random(-200, 200), -140);
        this.vars.asteroidX = 0;
        this.vars.asteroidY = 4;
      } else {
        if (this.toNumber(this.stage.vars.whatSide) === 3) {
          this.direction = 90;
          this.goto(-200, this.random(140, -140));
          this.vars.asteroidX = 4;
          this.vars.asteroidY = 0;
        } else {
          if (this.toNumber(this.stage.vars.whatSide) === 4) {
            this.direction = -90;
            this.goto(200, this.random(140, -140));
            this.vars.asteroidX = -4;
            this.vars.asteroidY = 0;
          }
        }
      }
    }
    this.vars.asteroidTurn = this.random(1, 2);
  }

  *moveAsteroids() {
    this.x += this.toNumber(this.vars.asteroidX);
    this.y += this.toNumber(this.vars.asteroidY);
    if (this.toNumber(this.vars.asteroidTurn) === 1) {
      this.direction += 0.5;
    } else {
      this.direction -= 0.5;
    }
    this.goto(
      this.x + this.toNumber(this.stage.vars.shakex),
      this.y + this.toNumber(this.stage.vars.shakey)
    );
    if (this.touching(this.sprites["Bullet"].andClones())) {
      /* TODO: Implement stop other scripts in sprite */ null;
      this.broadcast("big shake");
      yield* this.wait(0.05);
      yield* this.deleteAsteroidIsItEdge("no");
    }
    if (this.touching("edge")) {
      /* TODO: Implement stop other scripts in sprite */ null;
      yield* this.wait(0.05);
      yield* this.deleteAsteroidIsItEdge("yes");
    }
  }

  *startAsClone2() {
    for (let i = 0; i < 5; i++) {
      this.effects.ghost -= 20;
      yield;
    }
  }

  *deleteAsteroidIsItEdge(edge) {
    if (this.toString(edge) === "yes") {
      null;
    } else {
      if (this.toString(edge) === "no") {
        this.stage.vars.score += 25;
        this.broadcast("score");
      }
    }
    this.stage.vars.asteroidNumber++;
    this.stage.vars.asteroidX.push(this.x);
    this.stage.vars.asteroidY.push(this.y);
    for (let i = 0; i < 50; i++) {
      this.sprites["Particle"].createClone();
    }
    this.stage.vars.totalAsteroids--;
    this.deleteThisClone();
  }

  *whenIReceiveStart2() {
    this.deleteThisClone();
  }
}
