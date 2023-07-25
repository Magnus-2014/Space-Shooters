/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Stars2 extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./Stars2/costumes/costume1.png", {
        x: 480,
        y: 352
      })
    ];

    this.sounds = [new Sound("pop", "./Stars2/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart)
    ];
  }

  *whenIReceiveStart() {
    this.visible = true;
    while (true) {
      this.moveBehind();
      this.goto(
        this.sprites["Player"].x * -0.2,
        this.sprites["Player"].y * -0.2
      );
      yield;
    }
  }
}
