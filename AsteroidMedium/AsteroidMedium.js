/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class AsteroidMedium extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Asteroid", "./AsteroidMedium/costumes/Asteroid.png", {
        x: 22,
        y: 15
      }),
      new Costume("Asteroid2", "./AsteroidMedium/costumes/Asteroid2.png", {
        x: 24,
        y: 13
      })
    ];

    this.sounds = [new Sound("BreakSE", "./AsteroidMedium/sounds/BreakSE.wav")];

    this.triggers = [
      new Trigger(Trigger.CLONE_START, this.startAsClone),
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart2)
    ];

    this.vars.asteroidX = 1;
    this.vars.asteroidY = 0;
    this.vars.asteroidTurn = 0;
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
      this.broadcast("medium shake");
      yield* this.wait(0.05);
      yield* this.deleteAsteroid();
    }
  }

  *directAsteroids() {
    this.costume = this.random(1, 2);
    this.stage.vars.totalAsteroids++;
    this.size = 250;
    this.visible = true;
    this.goto(
      this.toNumber(
        this.itemOf(
          this.stage.vars.asteroidX,
          this.stage.vars.asteroidNumber - 1
        )
      ),
      this.toNumber(
        this.itemOf(
          this.stage.vars.asteroidY,
          this.stage.vars.asteroidNumber - 1
        )
      )
    );
    if (this.random(1, 2) === 1) {
      this.vars.asteroidX = 1.5;
    } else {
      this.vars.asteroidX = -1.5;
    }
    if (this.random(1, 2) === 1) {
      this.vars.asteroidY = 1.5;
    } else {
      this.vars.asteroidY = -1.5;
    }
  }

  *startAsClone() {
    yield* this.directAsteroids();
    while (true) {
      yield* this.moveAsteroids();
      yield;
    }
  }

  *deleteAsteroid() {
    yield* this.startSound("BreakSE");
    this.stage.vars.score += 2;
    this.broadcast("score");
    this.stage.vars.asteroidNumber++;
    this.stage.vars.asteroidX.push(this.x);
    this.stage.vars.asteroidY.push(this.y);
    for (let i = 0; i < 2; i++) {
      this.sprites["AsteroidSmall"].createClone();
    }
    for (let i = 0; i < 12; i++) {
      this.sprites["Particle"].createClone();
    }
    this.stage.vars.totalAsteroids--;
    this.deleteThisClone();
  }

  *whenIReceiveStart() {
    this.visible = false;
  }

  *whenIReceiveStart2() {
    this.deleteThisClone();
  }
}
