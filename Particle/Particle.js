/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Particle extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./Particle/costumes/costume1.png", {
        x: 1,
        y: 1
      }),
      new Costume("costume2", "./Particle/costumes/costume2.png", {
        x: 2,
        y: 2
      })
    ];

    this.sounds = [new Sound("pop", "./Particle/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(Trigger.CLONE_START, this.startAsClone)
    ];

    this.vars.particleSpeed = 4;
  }

  *whenIReceiveStart() {
    this.visible = false;
  }

  *startAsClone() {
    this.size = this.random(150, 250);
    this.costume = this.random(1, 2);
    this.effects.clear();
    this.visible = true;
    this.direction = this.random(1, 360);
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
    this.vars.particleSpeed = this.random(1, 5);
    for (let i = 0; i < 50; i++) {
      this.move(this.toNumber(this.vars.particleSpeed));
      this.effects.ghost += 2;
      yield;
    }
    this.deleteThisClone();
  }
}
