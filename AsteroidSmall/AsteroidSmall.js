/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class AsteroidSmall extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Asteroid", "./AsteroidSmall/costumes/Asteroid.png", {
        x: 12,
        y: 9
      }),
      new Costume("Asteroid2", "./AsteroidSmall/costumes/Asteroid2.png", {
        x: 13,
        y: 8
      })
    ];

    this.sounds = [new Sound("BreakSE", "./AsteroidSmall/sounds/BreakSE.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(Trigger.CLONE_START, this.startAsClone),
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart2)
    ];

    this.vars.asteroidX = 2;
    this.vars.asteroidY = 1;
    this.vars.asteroidTurn = 0;
  }

  *whenIReceiveStart() {
    this.visible = false;
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
    this.stage.vars.score += 3;
    this.broadcast("score");
    this.stage.vars.asteroidNumber++;
    this.stage.vars.asteroidX.push(this.x);
    this.stage.vars.asteroidY.push(this.y);
    for (let i = 0; i < 6; i++) {
      this.sprites["Particle"].createClone();
    }
    this.stage.vars.totalAsteroids--;
    this.deleteThisClone();
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
      this.vars.asteroidX = 2;
    } else {
      this.vars.asteroidX = -2;
    }
    if (this.random(1, 2) === 1) {
      this.vars.asteroidY = 2;
    } else {
      this.vars.asteroidY = -2;
    }
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
      this.broadcast("small shake");
      yield* this.wait(0.05);
      yield* this.deleteAsteroid();
    }
  }

  *whenIReceiveStart2() {
    this.deleteThisClone();
  }
}
