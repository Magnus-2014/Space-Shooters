/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Wave extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Alien Wave START", "./Wave/costumes/Alien Wave START.svg", {
        x: 231.5743495133451,
        y: 39.521986419147964
      }),
      new Costume("Alien Wave END", "./Wave/costumes/Alien Wave END.svg", {
        x: 230.60633270061365,
        y: 37.10494331210273
      })
    ];

    this.sounds = [new Sound("Show SE", "./Wave/sounds/Show SE.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Start" },
        this.whenIReceiveStart2
      ),
      new Trigger(
        Trigger.BROADCAST,
        { name: "ALIEN WAVE" },
        this.whenIReceiveAlienWave
      )
    ];
  }

  *whenIReceiveStart() {
    this.stage.vars.alienWave = "no";
    while (true) {
      if (
        this.toString(this.stage.vars.gameOver) === "no" &&
        this.toString(this.stage.vars.restart) === "no"
      ) {
        while (!(this.toString(this.stage.vars.alienWave) === "no")) {
          yield;
        }
        yield* this.wait(this.random(15, 20));
        this.broadcast("ALIEN WAVE");
      }
      yield;
    }
  }

  *whenIReceiveStart2() {
    yield* this.direct();
    while (true) {
      this.y += 1;
      yield* this.wait(0.4);
      this.y -= 1;
      yield* this.wait(0.4);
      yield;
    }
  }

  *direct() {
    this.goto(0, 0);
    this.direction = 90;
    this.size = 100;
    this.effects.clear();
    this.visible = false;
    this.moveAhead(3);
  }

  *whenIReceiveAlienWave() {
    yield* this.direct();
    this.stage.vars.alienWave = "yes";
    this.costume = "Alien Wave START";
    for (let i = 0; i < 4; i++) {
      this.visible = true;
      yield* this.startSound("Show SE");
      yield* this.wait(0.1);
      this.visible = false;
      yield* this.wait(0.1);
      yield;
    }
    yield* this.startSound("Show SE");
    this.visible = true;
    yield* this.wait(3);
    for (let i = 0; i < 10; i++) {
      this.effects.ghost += 10;
      yield;
    }
    this.visible = false;
    while (!(this.compare(this.stage.vars.alienAmount, 1) < 0)) {
      yield;
    }
    this.stage.vars.alienWave = "no";
    if (this.toString(this.stage.vars.restart) === "no") {
      yield* this.direct();
      this.costume = "Alien Wave END";
      for (let i = 0; i < 4; i++) {
        this.visible = true;
        yield* this.startSound("Show SE");
        yield* this.wait(0.1);
        this.visible = false;
        yield* this.wait(0.1);
        yield;
      }
      yield* this.startSound("Show SE");
      this.visible = true;
      yield* this.wait(3);
      for (let i = 0; i < 10; i++) {
        this.effects.ghost += 10;
        yield;
      }
      this.visible = false;
    }
  }
}
