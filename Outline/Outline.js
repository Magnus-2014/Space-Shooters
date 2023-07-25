/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Outline extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./Outline/costumes/costume1.svg", {
        x: 239.759805,
        y: 180.86776000000003
      })
    ];

    this.sounds = [new Sound("pop", "./Outline/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart)
    ];
  }

  *whenIReceiveStart() {
    this.moveAhead();
    while (true) {
      this.goto(0, 0);
      yield;
    }
  }
}
