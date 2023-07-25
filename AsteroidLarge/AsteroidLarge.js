/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class AsteroidLarge extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Asteroid", "./AsteroidLarge/costumes/Asteroid.png", {
        x: 33,
        y: 34
      }),
      new Costume("Asteroid2", "./AsteroidLarge/costumes/Asteroid2.png", {
        x: 31,
        y: 36
      })
    ];

    this.sounds = [new Sound("BreakSE", "./AsteroidLarge/sounds/BreakSE.wav")];

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
    yield* this.wait(1);
    while (true) {
      if (this.toString(this.stage.vars.alienWave) === "no") {
        if (this.compare(this.stage.vars.totalAsteroids, 8) < 0) {
          this.createClone();
          yield* this.wait(3);
        }
      }
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
    this.costume = this.random(1, 2);
    this.stage.vars.totalAsteroids++;
    this.effects.ghost = 100;
    this.size = 250;
    this.visible = true;
    this.stage.vars.whatSide = this.random(1, 4);
    if (this.toNumber(this.stage.vars.whatSide) === 1) {
      this.direction = 180;
      this.goto(this.random(-200, 200), 140);
      this.vars.asteroidX = 0;
      this.vars.asteroidY = -1;
    } else {
      if (this.toNumber(this.stage.vars.whatSide) === 2) {
        this.direction = 0;
        this.goto(this.random(-200, 200), -140);
        this.vars.asteroidX = 0;
        this.vars.asteroidY = 1;
      } else {
        if (this.toNumber(this.stage.vars.whatSide) === 3) {
          this.direction = 90;
          this.goto(-200, this.random(140, -140));
          this.vars.asteroidX = 1;
          this.vars.asteroidY = 0;
        } else {
          if (this.toNumber(this.stage.vars.whatSide) === 4) {
            this.direction = -90;
            this.goto(200, this.random(140, -140));
            this.vars.asteroidX = -1;
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
    if (this.compare(this.y, 179) > 0) {
      this.y = this.y * -1;
    } else {
      if (this.compare(this.y, -179) < 0) {
        this.y = this.y * -1;
      } else {
        if (this.compare(this.x, 239) > 0) {
          this.x = this.x * -1;
        } else {
          if (this.compare(this.x, -239) < 0) {
            this.x = this.x * -1;
          }
        }
      }
    }
    this.goto(
      this.x + this.toNumber(this.stage.vars.shakex),
      this.y + this.toNumber(this.stage.vars.shakey)
    );
    if (this.touching(this.sprites["Bullet"].andClones())) {
      /* TODO: Implement stop other scripts in sprite */ null;
      this.broadcast("big shake");
      yield* this.wait(0.05);
      yield* this.deleteAsteroid();
    }
  }

  *startAsClone2() {
    for (let i = 0; i < 5; i++) {
      this.effects.ghost -= 20;
      yield;
    }
  }

  *deleteAsteroid() {
    yield* this.startSound("BreakSE");
    this.stage.vars.score++;
    this.broadcast("score");
    this.stage.vars.asteroidNumber++;
    this.stage.vars.asteroidX.push(this.x);
    this.stage.vars.asteroidY.push(this.y);
    for (let i = 0; i < 2; i++) {
      this.sprites["AsteroidMedium"].createClone();
    }
    for (let i = 0; i < 25; i++) {
      this.sprites["Particle"].createClone();
    }
    this.stage.vars.totalAsteroids--;
    this.deleteThisClone();
  }

  *whenIReceiveStart2() {
    this.stage.vars.totalAsteroids = 0;
    this.deleteThisClone();
  }
}
