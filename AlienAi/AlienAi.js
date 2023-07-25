/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class AlienAi extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Alien Ship1", "./AlienAi/costumes/Alien Ship1.png", {
        x: 12,
        y: 7
      }),
      new Costume("Alien Ship2", "./AlienAi/costumes/Alien Ship2.png", {
        x: 12,
        y: 7
      }),
      new Costume("Bullet", "./AlienAi/costumes/Bullet.png", { x: 1, y: 1 })
    ];

    this.sounds = [
      new Sound("ShootSE", "./AlienAi/sounds/ShootSE.wav"),
      new Sound("BreakSE", "./AlienAi/sounds/BreakSE.wav")
    ];

    this.triggers = [
      new Trigger(
        Trigger.BROADCAST,
        { name: "ALIEN WAVE" },
        this.whenIReceiveAlienWave
      ),
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(Trigger.CLONE_START, this.startAsClone),
      new Trigger(Trigger.CLONE_START, this.startAsClone2),
      new Trigger(Trigger.CLONE_START, this.startAsClone3),
      new Trigger(Trigger.CLONE_START, this.startAsClone4)
    ];

    this.vars.cloneId = 1;
    this.vars.alienState = 0;
  }

  *whenIReceiveAlienWave() {
    this.stage.vars.alienAmount = 8;
    yield* this.wait(3);
    this.vars.cloneId = 1;
    for (let i = 0; i < this.toNumber(this.stage.vars.alienAmount); i++) {
      yield* this.wait(0.4);
      this.createClone();
      yield;
    }
  }

  *whenIReceiveStart() {
    for (let i = 0; i < 10; i++) {
      yield* this.wait(0.1);
      this.stage.vars.alienAmount = 0;
      this.stage.vars.alienBulletX = [];
      this.stage.vars.alienBulletY = [];
      this.stage.vars.alienBulletListCounter = 0;
      this.visible = false;
      this.deleteThisClone();
      yield;
    }
  }

  *startAsClone() {
    if (this.toNumber(this.vars.cloneId) === 1) {
      yield* this.alienSpaceShip();
    } else {
      yield* this.alienBullet();
    }
  }

  *startAsClone2() {
    while (true) {
      if (this.toNumber(this.vars.cloneId) === 1) {
        this.costume = "Alien Ship1";
        this.y += 1;
        yield* this.wait(0.4);
        this.costume = "Alien Ship2";
        this.y -= 1;
        yield* this.wait(0.4);
      }
      yield;
    }
  }

  *alienSpaceShip() {
    this.visible = true;
    this.effects.clear();
    this.size = 250;
    this.costume = "Alien Ship1";
    this.rotationStyle = Sprite.RotationStyle.DONT_ROTATE;
    this.direction = 90;
    if (this.toString(this.stage.vars.alienSide) === "right") {
      this.goto(215, this.random(-150, 150));
      this.stage.vars.alienSide = "left";
    } else {
      this.goto(-215, this.random(-150, 150));
      this.stage.vars.alienSide = "right";
    }
    this.vars.alienState = "moving";
    while (true) {
      if (this.toString(this.vars.alienState) === "moving") {
        while (
          !(
            this.compare(this.x, 210) > 0 ||
            !(this.toString(this.vars.alienState) === "moving")
          )
        ) {
          this.x += 3;
          yield;
        }
        while (
          !(
            this.compare(this.x, -210) < 0 ||
            !(this.toString(this.vars.alienState) === "moving")
          )
        ) {
          this.x -= 3;
          yield;
        }
      }
      yield;
    }
  }

  *startAsClone3() {
    if (this.toNumber(this.vars.cloneId) === 1) {
      while (true) {
        if (this.touching(this.sprites["Bullet"].andClones())) {
          yield* this.deleteClone();
        }
        yield;
      }
    }
  }

  *deleteClone() {
    yield* this.startSound("BreakSE");
    this.stage.vars.score += 5;
    this.broadcast("medium shake");
    this.broadcast("score");
    this.stage.vars.asteroidNumber++;
    this.stage.vars.asteroidX.push(this.x);
    this.stage.vars.asteroidY.push(this.y);
    for (let i = 0; i < 25; i++) {
      this.sprites["Particle"].createClone();
    }
    this.stage.vars.alienAmount--;
    this.deleteThisClone();
  }

  *startAsClone4() {
    while (true) {
      if (this.toNumber(this.vars.cloneId) === 1) {
        yield* this.wait(this.random(3, 5));
        this.vars.alienState = "attacking";
        this.direction = this.radToScratch(
          Math.atan2(
            this.sprites["Player"].y - this.y,
            this.sprites["Player"].x - this.x
          )
        );
        for (let i = 0; i < this.random(5, 15); i++) {
          this.move(4);
          yield;
        }
        this.vars.cloneId = 2;
        this.stage.vars.alienBulletListCounter++;
        this.stage.vars.alienBulletX.push(this.x);
        this.stage.vars.alienBulletY.push(this.y);
        this.createClone();
        this.vars.cloneId = 1;
        yield* this.wait(1);
        this.vars.alienState = "moving";
      }
      yield;
    }
  }

  *alienBullet() {
    yield* this.startSound("ShootSE");
    this.rotationStyle = Sprite.RotationStyle.ALL_AROUND;
    this.costume = "Bullet";
    this.goto(
      this.toNumber(
        this.itemOf(
          this.stage.vars.alienBulletX,
          this.stage.vars.alienBulletListCounter - 1
        )
      ),
      this.toNumber(
        this.itemOf(
          this.stage.vars.alienBulletY,
          this.stage.vars.alienBulletListCounter - 1
        )
      )
    );
    this.direction = this.radToScratch(
      Math.atan2(
        this.sprites["Player"].y - this.y,
        this.sprites["Player"].x - this.x
      )
    );
    this.move(4);
    this.visible = true;
    this.effects.clear();
    while (
      !(
        this.touching("edge") ||
        this.touching(this.sprites["Player"].andClones())
      )
    ) {
      this.move(2);
      yield;
    }
    this.deleteThisClone();
  }
}
