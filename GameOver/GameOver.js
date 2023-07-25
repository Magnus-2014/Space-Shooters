/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class GameOver extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("text", "./GameOver/costumes/text.svg", {
        x: 168.98402133664734,
        y: 75.06601841773912
      }),
      new Costume("background", "./GameOver/costumes/background.svg", {
        x: 253.81579151206384,
        y: 200.1315805546135
      })
    ];

    this.sounds = [new Sound("pop", "./GameOver/sounds/pop.wav")];

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
    this.size = 100;
    this.visible = false;
    yield* this.wait(1);
    while (!(this.compare(this.stage.vars.playerHealth, 1) < 0)) {
      yield;
    }
    this.goto(0, 0);
    this.createClone();
    this.moveAhead();
    yield* this.wait(1);
    this.moveAhead();
    this.visible = true;
    this.costume = "text";
    this.effects.ghost = 100;
    for (let i = 0; i < 25; i++) {
      this.effects.ghost -= 5;
      yield;
    }
    this.effects.clear();
    while (!this.keyPressed("space")) {
      yield;
    }
    this.size = 90;
    yield* this.wait(0.2);
    this.size = 100;
    yield* this.wait(0.1);
    this.broadcast("Start");
    this.stage.vars.score = 0;
  }

  *whenIReceiveStart2() {
    this.stage.vars.restart = "yes";
    yield* this.wait(3);
    this.stage.vars.restart = "no";
  }

  *startAsClone() {
    this.visible = true;
    this.costume = "background";
    this.effects.ghost = 100;
    this.moveAhead();
    this.goto(0, 0);
    for (let i = 0; i < 25; i++) {
      this.effects.ghost -= 2;
      yield;
    }
  }

  *whenIReceiveStart3() {
    this.deleteThisClone();
  }

  *whenIReceiveStart4() {
    while (true) {
      this.y += 1;
      yield* this.wait(0.4);
      this.y -= 1;
      yield* this.wait(0.4);
      yield;
    }
  }
}
