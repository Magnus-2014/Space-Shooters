/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Thumbnail extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./Thumbnail/costumes/costume1.svg", {
        x: 332,
        y: 267.50552
      }),
      new Costume("costume2", "./Thumbnail/costumes/costume2.svg", {
        x: 192.82957458496094,
        y: 193.81637573242188
      })
    ];

    this.sounds = [new Sound("pop", "./Thumbnail/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(
        Trigger.TIMER_GREATER_THAN,
        { VALUE: 0.1 },
        this.whengreaterthan
      )
    ];
  }

  *whenGreenFlagClicked() {
    this.visible = false;
    while (true) {
      this.moveAhead();
      this.restartTimer();
      yield;
    }
  }

  *whengreaterthan() {
    this.visible = true;
    this.moveAhead();
  }
}
