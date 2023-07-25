/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Shaker extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./Shaker/costumes/costume1.svg", { x: 0, y: 0 })
    ];

    this.sounds = [new Sound("pop", "./Shaker/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(
        Trigger.BROADCAST,
        { name: "player shake" },
        this.whenIReceivePlayerShake
      ),
      new Trigger(
        Trigger.BROADCAST,
        { name: "big shake" },
        this.whenIReceiveBigShake
      ),
      new Trigger(
        Trigger.BROADCAST,
        { name: "medium shake" },
        this.whenIReceiveMediumShake
      ),
      new Trigger(
        Trigger.BROADCAST,
        { name: "small shake" },
        this.whenIReceiveSmallShake
      )
    ];
  }

  *whenIReceiveStart() {
    this.visible = false;
    this.direction = 90;
    this.goto(0, 0);
    this.stage.vars.shakex = 0;
    this.stage.vars.shakey = 0;
  }

  *shaker(amount, min, max) {
    for (let i = 0; i < this.toNumber(amount); i++) {
      this.stage.vars.shakex = this.random(
        this.toNumber(min),
        this.toNumber(max)
      );
      this.stage.vars.shakey = this.random(
        this.toNumber(min),
        this.toNumber(max)
      );
      yield;
    }
    this.stage.vars.shakex = 0;
    this.stage.vars.shakey = 0;
  }

  *whenIReceivePlayerShake() {
    yield* this.shaker(10, -4, 4);
  }

  *whenIReceiveBigShake() {
    yield* this.shaker(10, -3, 3);
  }

  *whenIReceiveMediumShake() {
    yield* this.shaker(7, -2, 2);
  }

  *whenIReceiveSmallShake() {
    yield* this.shaker(5, -2, 2);
  }
}
