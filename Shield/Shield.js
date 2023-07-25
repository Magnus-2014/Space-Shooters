/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Shield extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./Shield/costumes/costume1.png", {
        x: 29,
        y: 29
      })
    ];

    this.sounds = [];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Reset" }, this.whenIReceiveReset)
    ];
  }

  *whenIReceiveReset() {
    this.effects.clear();
    while (true) {
      this.goto(this.sprites["Player"].x, this.sprites["Player"].y);
      this.size = this.sprites["Player"].size;
      if (this.toString(this.stage.vars.invincible) === "yes") {
        this.effects.clear();
        this.effects.ghost = 50;
        this.visible = true;
      } else {
        for (let i = 0; i < 25; i++) {
          this.effects.ghost += 2;
          yield;
        }
        this.visible = false;
      }
      yield;
    }
  }
}
