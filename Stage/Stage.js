/* eslint-disable require-yield, eqeqeq */

import {
  Stage as StageBase,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Stage extends StageBase {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("backdrop1", "./Stage/costumes/backdrop1.png", {
        x: 480,
        y: 360
      })
    ];

    this.sounds = [
      new Sound("Thor_s_Hammer", "./Stage/sounds/Thor_s_Hammer.wav")
    ];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked2)
    ];

    this.vars.movesmooth = 0;
    this.vars.turnsmooth = 0;
    this.vars.totalAsteroids = 6;
    this.vars.whatSide = 4;
    this.vars.asteroidNumber = 3;
    this.vars.playerHealth = 3;
    this.vars.gameOver = "no";
    this.vars.invincible = "no";
    this.vars.score = 1;
    this.vars.shakex = 0;
    this.vars.shakey = 0;
    this.vars.alienWave = "no";
    this.vars.alienAmount = 0;
    this.vars.alienSide = "left";
    this.vars.alienBulletListCounter = 0;
    this.vars.restart = "no";
    this.vars.asteroidX = [-183, 3, 0];
    this.vars.asteroidY = [-50, 3, 0];
    this.vars.alienBulletX = [];
    this.vars.alienBulletY = [];
  }

  *whenGreenFlagClicked() {
    while (true) {
      yield* this.playSoundUntilDone("Thor_s_Hammer");
      yield;
    }
  }

  *whenGreenFlagClicked2() {
    while (true) {
      while (!(this.toString(this.vars.gameOver) === "yes")) {
        yield;
      }
      for (let i = 0; i < 7; i++) {
        this.audioEffects.volume -= 10;
        yield;
      }
      while (!(this.toString(this.vars.gameOver) === "no")) {
        yield;
      }
      for (let i = 0; i < 7; i++) {
        this.audioEffects.volume += 10;
        yield;
      }
      this.audioEffects.volume = 100;
      yield;
    }
  }
}
