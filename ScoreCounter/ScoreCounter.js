/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class ScoreCounter extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("1", "./ScoreCounter/costumes/1.svg", {
        x: 7.442641003667774,
        y: 32.22043334504514
      }),
      new Costume("2", "./ScoreCounter/costumes/2.svg", {
        x: 13.644840000000016,
        y: 31.83796000000001
      }),
      new Costume("3", "./ScoreCounter/costumes/3.svg", {
        x: 11.577439999999996,
        y: 31.83796000000001
      }),
      new Costume("4", "./ScoreCounter/costumes/4.svg", {
        x: 13.644839999999988,
        y: 31.83796000000001
      }),
      new Costume("5", "./ScoreCounter/costumes/5.svg", {
        x: 13.644840000000016,
        y: 31.83796000000001
      }),
      new Costume("6", "./ScoreCounter/costumes/6.svg", {
        x: 13.644840000000045,
        y: 31.83796000000001
      }),
      new Costume("7", "./ScoreCounter/costumes/7.svg", {
        x: 13.644840000000073,
        y: 31.83796000000001
      }),
      new Costume("8", "./ScoreCounter/costumes/8.svg", {
        x: 13.644840000000102,
        y: 31.83796000000001
      }),
      new Costume("9", "./ScoreCounter/costumes/9.svg", {
        x: 13.644840000000016,
        y: 31.83796000000001
      }),
      new Costume("0", "./ScoreCounter/costumes/0.svg", {
        x: 13.644839999999988,
        y: 31.83796000000001
      })
    ];

    this.sounds = [new Sound("ScoreSE", "./ScoreCounter/sounds/ScoreSE.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Start" }, this.whenIReceiveStart),
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(Trigger.CLONE_START, this.startAsClone),
      new Trigger(Trigger.CLONE_START, this.startAsClone2),
      new Trigger(Trigger.BROADCAST, { name: "score" }, this.whenIReceiveScore)
    ];

    this.vars.numberCounter = 11;
  }

  *whenIReceiveStart() {
    this.y = 147;
  }

  *whenGreenFlagClicked() {
    this.stage.vars.score = 0;
    this.visible = false;
    this.vars.numberCounter = 1;
    for (let i = 0; i < 10; i++) {
      this.createClone();
      this.vars.numberCounter++;
      yield;
    }
  }

  *startAsClone() {
    this.direction = 90;
    this.size = 115;
    while (true) {
      this.moveAhead();
      this.goto(this.toNumber(this.vars.numberCounter) * 30 - 195, this.y);
      if (
        this.compare(
          this.toString(this.stage.vars.score).length,
          this.vars.numberCounter
        ) < 0
      ) {
        this.visible = false;
      } else {
        this.visible = true;
        this.costume = this.letterOf(
          this.stage.vars.score,
          this.vars.numberCounter - 1
        );
      }
      yield;
    }
  }

  *startAsClone2() {
    while (true) {
      this.y += 1;
      yield* this.wait(0.4);
      this.y -= 1;
      yield* this.wait(0.4);
      yield;
    }
  }

  *whenIReceiveScore() {
    if (this.compare(this.size, 116) < 0) {
      this.size += 15;
    }
    yield* this.wait(0.1);
    this.size = 100;
  }
}
