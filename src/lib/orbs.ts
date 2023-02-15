import { default as debounce } from 'debounce';
import * as PIXI from 'pixi.js';
import { createNoise2D } from 'simplex-noise';

// return a random number within a range
function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// map a number from 1 range to another
function map(n: number, start1: number, end1: number, start2: number, end2: number) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

interface Bounds {
  x: { min: number; max: number };
  y: { min: number; max: number };
}

// Orb class
export default class Orb {
  // Bounded area for orb movement
  private bounds: Bounds;

  private x: number;
  private y: number;
  private xOff: number;
  private yOff: number;
  private scale: number = 1;
  private radius: number;

  // hexidecimal literal for pixi
  private fill: number;

  // Step value for noise
  private inc: number;

  public graphics: PIXI.Graphics;

  noiseFn = createNoise2D();
  constructor(fill = 0x000000) {
    this.fill = fill;

    this.bounds = this.setBounds();
    this.x = random(this.bounds['x'].min, this.bounds['x'].max);
    this.y = random(this.bounds['y'].min, this.bounds['y'].max);

    this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

    this.xOff = random(0, 1000);
    this.yOff = random(0, 1000);
    this.inc = random(0.0001, 0.0004);

    this.graphics = new PIXI.Graphics();
    this.graphics.alpha = 0.825;

    window.addEventListener(
      'resize',
      debounce(() => {
        this.bounds = this.setBounds();
      }, 250),
    );
  }

  private setBounds() {
    return {
      x: {
        min: -200,
        max: window.innerWidth + 200,
      },
      y: {
        min: -200,
        max: window.innerHeight + 200,
      },
    };
  }

  public update() {
    // self similar "psuedo-random" or noise values at a given point in "time"
    const xNoise = this.noiseFn(this.xOff, this.xOff);
    const yNoise = this.noiseFn(this.yOff, this.yOff);
    const scaleNoise = this.noiseFn(this.xOff, this.yOff);

    // map the xNoise/yNoise values (between -1 and 1) to a point within the orb's bounds
    this.x = map(xNoise, -1, 1, this.bounds['x'].min, this.bounds['x'].max);
    this.y = map(yNoise, -1, 1, this.bounds['y'].min, this.bounds['y'].max);
    // map scaleNoise (between -1 and 1) to a scale value somewhere between half of the orb's original size, and 100% of it's original size
    this.scale = map(scaleNoise, -1, 1, 0.5, 1);

    // step through "time"
    this.xOff += this.inc;
    this.yOff += this.inc;
  }

  public render() {
    // update the PIXI.Graphics position and scale values
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    this.graphics.scale.set(this.scale);

    // clear anything currently drawn to graphics
    this.graphics.clear();

    // tell graphics to fill any shapes drawn after this with the orb's fill color
    this.graphics.beginFill(this.fill);
    // draw a circle at { 0, 0 } with it's size set by this.radius
    this.graphics.drawCircle(0, 0, this.radius);
    // let graphics know we won't be filling in any more shapes
    this.graphics.endFill();
  }
}
