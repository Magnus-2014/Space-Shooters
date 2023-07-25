/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Bullet extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Bullet1", "./Bullet/costumes/Bullet1.png", { x: 2, y: 1 })
    ];

    this.sounds = [new Sound("pop", "./Bullet/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(Trigger.CLONE_START, this.startAsClone)
    ];
  }

  *whenIReceiveStart() {
    this.visible = false;
  }

  *startAsClone() {
    this.visible = true;
    this.goto(this.sprites["Player"].x, this.sprites["Player"].y);
    this.direction = this.sprites["Player"].direction + this.random(-5, 5);
    this.size = this.sprites["Player"].size;
    while (
      !(
        this.touching("edge") ||
        this.touching(this.sprites["AsteroidLarge"].andClones()) ||
          this.touching(this.sprites["AsteroidMedium"].andClones()) ||
            this.touching(this.sprites["AsteroidSmall"].andClones())
      )
    ) {
      this.move(15);
      yield;
    }
    this.deleteThisClone();
  }
}
