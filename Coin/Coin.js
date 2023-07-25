/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Coin extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("coin", "./Coin/costumes/coin.png", { x: 16, y: 16 }),
      new Costume("sparkle", "./Coin/costumes/sparkle.png", { x: 9, y: 8 })
    ];

    this.sounds = [];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Start" },
        this.whenIReceiveStart2
      ),
      new Trigger(Trigger.CLONE_START, this.startAsClone),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Start" },
        this.whenIReceiveStart3
      ),
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart4)
    ];
  }

  *whenIReceiveStart() {
    yield* this.wait(0.01);
    this.effects.ghost = 100;
    this.visible = true;
    for (let i = 0; i < 10; i++) {
      this.effects.ghost -= 10;
      yield;
    }
  }

  *whenIReceiveStart2() {
    this.goto(-211, 153);
    this.costume = "coin";
    while (true) {
      yield* this.wait(this.random(2, 4));
      this.createClone();
      yield;
    }
  }

  *startAsClone() {
    this.costume = "sparkle";
    this.moveAhead();
    this.effects.clear();
    if (this.random(1, 2) === 1) {
      this.goto(-211, 145);
    } else {
      if (this.random(1, 2) === 1) {
        this.goto(-205, 163);
      } else {
        this.goto(-190, 150);
      }
    }
    for (let i = 0; i < 4; i++) {
      this.direction += 10;
      yield;
    }
    for (let i = 0; i < 10; i++) {
      this.effects.ghost += 10;
      this.direction += 10;
      yield;
    }
    this.deleteThisClone();
  }

  *whenIReceiveStart3() {
    while (true) {
      this.y += 1;
      yield* this.wait(0.4);
      this.y -= 1;
      yield* this.wait(0.4);
      yield;
    }
  }

  *whenIReceiveStart4() {
    yield* this.wait(0.1);
    this.moveAhead();
  }
}
