import { Project } from "https://unpkg.com/leopard@^1/dist/index.esm.js";

import Stage from "./Stage/Stage.js";
import Player from "./Player/Player.js";
import Shield from "./Shield/Shield.js";
import Bullet from "./Bullet/Bullet.js";
import AsteroidLarge from "./AsteroidLarge/AsteroidLarge.js";
import AsteroidMedium from "./AsteroidMedium/AsteroidMedium.js";
import AsteroidSmall from "./AsteroidSmall/AsteroidSmall.js";
import GoldenAsteroid from "./GoldenAsteroid/GoldenAsteroid.js";
import Stars1 from "./Stars1/Stars1.js";
import Stars2 from "./Stars2/Stars2.js";
import Stars3 from "./Stars3/Stars3.js";
import Particle from "./Particle/Particle.js";
import Health from "./Health/Health.js";
import ScoreCounter from "./ScoreCounter/ScoreCounter.js";
import Coin from "./Coin/Coin.js";
import Shaker from "./Shaker/Shaker.js";
import Outline from "./Outline/Outline.js";
import Wave from "./Wave/Wave.js";
import AlienAi from "./AlienAi/AlienAi.js";
import HeartCrate from "./HeartCrate/HeartCrate.js";
import GameOver from "./GameOver/GameOver.js";
import Thumbnail from "./Thumbnail/Thumbnail.js";

const stage = new Stage({ costumeNumber: 1 });

const sprites = {
  Player: new Player({
    x: -2,
    y: 15,
    direction: 0,
    costumeNumber: 1,
    size: 200,
    visible: false,
    layerOrder: 19
  }),
  Shield: new Shield({
    x: -2,
    y: 15,
    direction: 90,
    costumeNumber: 1,
    size: 200,
    visible: false,
    layerOrder: 9
  }),
  Bullet: new Bullet({
    x: 241,
    y: 56.38026624094602,
    direction: 86.06950838803355,
    costumeNumber: 1,
    size: 200,
    visible: false,
    layerOrder: 3
  }),
  AsteroidLarge: new AsteroidLarge({
    x: 148,
    y: 140,
    direction: 90,
    costumeNumber: 2,
    size: 250,
    visible: false,
    layerOrder: 7
  }),
  AsteroidMedium: new AsteroidMedium({
    x: 85.99999999999999,
    y: 16,
    direction: 90,
    costumeNumber: 2,
    size: 250,
    visible: false,
    layerOrder: 4
  }),
  AsteroidSmall: new AsteroidSmall({
    x: -17,
    y: 132,
    direction: 89.5,
    costumeNumber: 1,
    size: 250,
    visible: false,
    layerOrder: 5
  }),
  GoldenAsteroid: new GoldenAsteroid({
    x: 14.729298965042892,
    y: 42.000977393076475,
    direction: 90,
    costumeNumber: 1,
    size: 250,
    visible: false,
    layerOrder: 6
  }),
  Stars1: new Stars1({
    x: 0.2,
    y: -1.5,
    direction: 90,
    costumeNumber: 1,
    size: 150,
    visible: true,
    layerOrder: 2
  }),
  Stars2: new Stars2({
    x: 0.4,
    y: -3,
    direction: 90,
    costumeNumber: 1,
    size: 150,
    visible: true,
    layerOrder: 1
  }),
  Stars3: new Stars3({
    x: 0.6,
    y: -4.5,
    direction: 90,
    costumeNumber: 1,
    size: 150,
    visible: true,
    layerOrder: 20
  }),
  Particle: new Particle({
    x: 239,
    y: 57.20888862379569,
    direction: 40,
    costumeNumber: 2,
    size: 233,
    visible: false,
    layerOrder: 8
  }),
  Health: new Health({
    x: -215,
    y: -155,
    direction: 90,
    costumeNumber: 3,
    size: 200,
    visible: true,
    layerOrder: 17
  }),
  ScoreCounter: new ScoreCounter({
    x: -197,
    y: 147,
    direction: 90,
    costumeNumber: 10,
    size: 100,
    visible: false,
    layerOrder: 10
  }),
  Coin: new Coin({
    x: -211,
    y: 153,
    direction: 90,
    costumeNumber: 1,
    size: 250,
    visible: true,
    layerOrder: 18
  }),
  Shaker: new Shaker({
    x: 0,
    y: 0,
    direction: 90,
    costumeNumber: 1,
    size: 100,
    visible: false,
    layerOrder: 11
  }),
  Outline: new Outline({
    x: 0,
    y: 0,
    direction: 90,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 16
  }),
  Wave: new Wave({
    x: 0,
    y: 0,
    direction: 90,
    costumeNumber: 1,
    size: 100,
    visible: false,
    layerOrder: 15
  }),
  AlienAi: new AlienAi({
    x: -197.38079017450787,
    y: 180,
    direction: -36.289895258773086,
    costumeNumber: 1,
    size: 250,
    visible: false,
    layerOrder: 12
  }),
  HeartCrate: new HeartCrate({
    x: 36,
    y: 28,
    direction: 95.735764363,
    costumeNumber: 1,
    size: 200,
    visible: false,
    layerOrder: 13
  }),
  GameOver: new GameOver({
    x: 0,
    y: 0,
    direction: 90,
    costumeNumber: 1,
    size: 100,
    visible: false,
    layerOrder: 14
  }),
  Thumbnail: new Thumbnail({
    x: 0,
    y: 0,
    direction: 90,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 21
  })
};

const project = new Project(stage, sprites, {
  frameRate: 30 // Set to 60 to make your project run faster
});
export default project;
