/**
 * File Name / utils.js
 * Twitter / https://twitter.com/toshiyamarukubo
 */

class Utils {
  // random number.
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // random color rgb.
  static randomColorRGB() {
    return (
      "rgb(" +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ")"
    );
  }
  // random color hsl.
  static randomColorHSL(hue, saturation, lightness) {
    return (
      "hsl(" +
      hue +
      ", " +
      saturation +
      "%, " +
      lightness +
      "%)"
    );
  }
  // gradient color.
  static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
    const col = cr + "," + cg + "," + cb;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(" + col + ", " + (ca * 1) + ")");
    g.addColorStop(0.5, "rgba(" + col + ", " + (ca * 0.5) + ")");
    g.addColorStop(1, "rgba(" + col + ", " + (ca * 0) + ")");
    return g;
  }
  // create multiple array
  static createMultipleArray(number_one, number_two) {
    let num_one = number_one;
    let num_two = number_two;
    let arr = new Array(num_one);
    for (let i = 0; i < num_one; i++) {
      arr[i] = new Array(num_one);
      for (let j = 0; j < num_two; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
  }
  // framerate
  static calcFPS() {
    const now = (+new Date());
    const fps = 1000 / (now - lastTime);
    lastTime = now;
    return fps.toFixed();
  }
}

/**
 * File Name / vector2d.js
 * Referenced / O'Reilly Programming HTML5 Canvas
 * Twitter / https://twitter.com/toshiyamarukubo
 */

class Vector2d {
  constructor(x, y) {
    this.vx = x;
    this.vy = y;
  }

  scale(scale) {
    this.vx *= scale;
    this.vy *= scale;
  }
  
  mult(v) {
    return new Vector2d(this.vx * v, this.vy * v);
  }

  add(v, x, y) {
    if (v instanceof Vector2d) {
      return new Vector2d(this.vx + v.vx, this.vy + v.vy);
    } else {
      this.vx += x;
      this.vy += y;
    }
  }
  
  sub(v, x, y) {
    if (v instanceof Vector2d) {
      return new Vector2d(this.vx - v.vx, this.vy - v.vy);
    } else {
      this.vx -= x;
      this.vy -= y;
    }
  }
  
  fromAngle(radian) {
    this.vx = Math.cos(radian);
    this.vy = Math.sin(radian);
  }

  negate() {
    this.vx = -this.vx;
    this.vy = -this.vy;
  }

  length() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }

  lengthSquared() {
    return this.vx * this.vx + this.vy * this.vy;
  }

  normalize() {
    let len = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (len) {
      this.vx /= len;
      this.vy /= len;
    }
    return len;
  }

  rotate(angle) {
    let vx = this.vx;
    let vy = this.vy;
    let cosVal = Math.cos(angle);
    let sinVal = Math.sin(angle);
    this.vx = vx * cosVal - vy * sinVal;
    this.vy = vx * sinVal + vy * cosVal;
  }

  toString() {
    return '(' + this.vx.toFixed(3) + ',' + this.vy.toFixed(3) + ')';
  }
}

/**
 * File Name / collision.js
 * Referenced / O'Reilly Programming HTML5 Canvas
 * Twitter / https://twitter.com/toshiyamarukubo
 */

class Collision {
  constructor(targetArr) {
    this.arr = targetArr;
  }

  collideAll() {
    let vec = new Vector2d(0, 0);
    let dist;
    let obj1;
    let obj2;
    let c;
    let i;
    for (c = 0; c < this.arr.length; c++) {
      obj1 = this.arr[c];
      for (i = c + 1; i < this.arr.length; i++) {
        obj2 = this.arr[i];
        vec.vx = obj2.x - obj1.x;
        vec.vy = obj2.y - obj1.y;
        dist = vec.length();
        if (dist < obj1.r + obj2.r) {
          vec.normalize();
          vec.scale(obj1.r + obj2.r - dist);
          vec.negate();
          obj1.x += vec.vx;
          obj1.y += vec.vy;
          this.bounce(obj1, obj2);
        }
      }
    }
  }

  bounce(obj1, obj2) {
    let colnAngle = Math.atan2(obj1.y - obj2.y, obj1.x - obj2.x);
    let length1 = obj1.v.length();
    let length2 = obj2.v.length();
    let dirAngle1 = Math.atan2(obj1.v.vy, obj1.v.vx);
    let dirAngle2 = Math.atan2(obj2.v.vy, obj2.v.vx);
    let newVX1 = length1 * Math.cos(dirAngle1 - colnAngle);
    let newVX2 = length2 * Math.cos(dirAngle2 - colnAngle);
    obj1.v.vy = length1 * Math.sin(dirAngle1 - colnAngle);
    obj2.v.vy = length2 * Math.sin(dirAngle2 - colnAngle);
    obj1.v.vx = ((obj1.r - obj2.r) * newVX1 + (2 * obj2.r) * newVX2) / (obj1.r + obj2.r);
    obj2.v.vx = ((obj2.r - obj1.r) * newVX2 + (2 * obj1.r) * newVX1) / (obj1.r + obj2.r);
    obj1.v.rotate(colnAngle);
    obj2.v.rotate(colnAngle);
  }
}

/**
 * File Name / stopwatch.js
 * Referenced / O'Reilly Programming HTML5 Canvas
 * Twitter / https://twitter.com/toshiyamarukubo
 */

class Stopwatch {
  constructor(time) {
    this.startTime = 0;
    this.running = false;
    this.elapsed = undefined;
  }

  start() {
    this.startTime = +new Date();
    this.elapsedTime = null;
    this.running = true;
  }

  stop() {
    this.elapsed = (+new Date()) - this.startTime;
    this.running = false;
  }

  getElapsedTime() {
    if (this.running) {
      return (+new Date()) - this.startTime;
    } else {
      return this.elapsed;
    }
  }

  isRunning() {
    return this.running;
  }

  reset() {
    this.elapsed = 0;
  }
}

/**
 * File Name / animationTimer.js
 * Referenced / O'Reilly Programming HTML5 Canvas
 * Twitter / https://twitter.com/toshiyamarukubo
 */

class AnimationTimer {
  constructor(duration, timeWarp) {
    if (duration !== undefined) this.duration = duration;
    if (timeWarp !== undefined) this.timeWarp = timeWarp;
    this.stopwatch = new Stopwatch();
  }

  start() {
    this.stopwatch.start();
  }

  stop() {
    this.stopwatch.stop();
  }

  getElapsedTime() {
    const elapsedTime = this.stopwatch.getElapsedTime();
    const percentComplete = elapsedTime / this.duration;
    if (!this.stopwatch.running) return undefined;
    if (this.timeWarp === undefined) return elapsedTime;
    return elapsedTime * (this.timeWarp(percentComplete) / percentComplete);
  }

  isRunning() {
    return this.stopwatch.running;
  }

  isOver() {
    return this.stopwatch.getElapsedTime() > this.duration;
  }

  makeEaseIn(strength) {
    return (percentComplete) => {
      return Math.pow(percentComplete, strength * 2);
    }
  }

  makeEaseOut(strength) {
    return (percentComplete) => {
      return 1 - Math.pow(1 - percentComplete, strength * 2);
    }
  } 

  makeEaseInOut() {
    return (percentComplete) => {
      return percentComplete - Math.sin(percentComplete * 2 * Math.PI) / (2 * Math.PI);
    }
  }
  
  makeElastic(passes) {
    passes = passes || default_elastic_passes;
    return (percentComplete) => {
      return ((1 - Math.cos(percentComplete * Math.PI * passes)) * (1 - percentComplete)) + percentComplete;
    }
  }

  makeBounce(bounces) {
    const fn = this.makeElastic(bounces);
    return (percentComplete) => {
      percentComplete = fn(percentComplete);
      return percentComplete <= 1 ? percentComplete : 2 - percentComplete;
    }
  }

  makeLinear() {
    return (percentComplete) => {
      return percentComplete;
    }
  }
}

/**
 * File Name / angle.js
 * Twitter / https://twitter.com/toshiyamarukubo
 */

class Angle {
  constructor(angle) {
    this.a = angle;
    this.rad = this.a * Math.PI / 180;
  }

  incDec(num) {
    this.a += num;
    this.rad = this.a * Math.PI / 180;
  }
}

/**
 * File Name / template.js
 * Created Date / xx xx, xxxx
 * Author / Toshiya Marukubo
 * Twitter / https://twitter.com/toshiyamarukubo
 */

//global access
let canvas;
// framerate number
let lastTime = 0;

/**
 * Canvas class
 */

class Canvas {
  constructor(bool) {
    // create canvas.
    this.canvas = document.createElement("canvas");
    // if on screen.
    if (bool === true) {
      this.canvas.style.position = 'relative';
      this.canvas.style.display = 'block';
      this.canvas.style.backgroundColor = 'black';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      document.getElementsByTagName("body")[0].appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    // mouse infomation.
    this.mouseX = null;
    this.mouseY = null;
    this.mouseZ = null;
    // shape
    this.number_of_shapes = 1;
    this.shapes_array = [];
  }
  
  // init, render, resize
  init() {
    for (let i = 0; i < this.number_of_shapes; i++) {
      const s = new Shape(this.ctx, this.width, this.height, i);
      this.shapes_array.push(s);
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.shapes_array.length; i++) {
      this.shapes_array[i].render();
    }
    this.drawFPS();
    window.requestAnimationFrame(() => {
      //this.render();
    });
  }

  drawFPS() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(Utils.calcFPS() + ' FPS', this.width, this.height);
    ctx.restore();
  }
  
  resize() {
    this.shapes_array = [];
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.init();
    this.render();
  }
}

/**
 * Shape class.
 */

class Shape {
  constructor(ctx, w, h, i) {
    this.ctx = ctx;
    this.init(w, h, i);
  }

  init(w, h, i) {
    this.w = w;
    this.h = h;
    this.criterion = w > h ? w : h;
    this.num = 10;
    this.lattice = null;
    this.scalar = null;
    this.base = new Array(2);
    this.setup();
  }
  
  setup() {
    this.scalar = this.criterion / this.num;
    this.makeSqVector();
    this.makeSqLattice();
  }
  
  makeSqVector() {
    this.base[0] = new Vector2d(0, 1);
    this.base[1] = new Vector2d(1, 0);
  }
  
  makeSqLattice() {
    this.lattice = Utils.createMultipleArray(this.num + 1, this.num + 1);
    for (let y = 0; y < this.num + 1; y++) {
      for (let x = 0; x < this.num + 1; x++) {
        const vy = this.base[0].mult(y * this.scalar);
        const vx = this.base[1].mult(x * this.scalar);
        this.lattice[y][x] = new Vector2d(vx.vx, vy.vy);
      }
    }
  }
  
  makeSquare() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = Utils.randomColorRGB();
    let vertex = new Array(4);
    for (let i = 0; i < 4; i++) {
      const a = 2 * Math.PI * (i + 0.5) / 4;
      const v = new Vector2d(Math.cos(a), Math.sin(a));
      v.scale(this.scalar / Math.sqrt(2));
      vertex[i] = v;
    }
    for (let i = 0; i < vertex.length; i++) {
      if (i === 0) {
        ctx.beginPath();
        ctx.moveTo(vertex[i].vx, vertex[i].vy);
      } else {
        ctx.lineTo(vertex[i].vx, vertex[i].vy); 
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  
  drawTiling() {
    const ctx = this.ctx;
    for (let y = 0; y < this.lattice.length; y++) {
      for (let x = 0; x < this.lattice.length; x++) {
        ctx.save();
        ctx.translate(this.lattice[y][x].vx, this.lattice[y][x].vy);
        this.makeSquare();
        ctx.restore();
      }
    }
  }
  
  render() {
    this.drawTiling();
  }
}

/**
 * run
 */

(() => {
  'use strict';
  window.addEventListener('load', () => {
    canvas = new Canvas(true);
    canvas.init();
    canvas.render();
    // event
    window.addEventListener("resize", () => {
      canvas.resize();
    }, false);
    // mouse
    canvas.canvas.addEventListener('mousemove', (e) => {
      canvas.mouseX = e.clientX;
      canvas.mouseY = e.clientY;
    }, false);
    
    // smartphone.
    let touchStartY;
    let touchMoveY;
    let touchEndY;
    
    canvas.canvas.addEventListener('touchstart', (e) => {
      const touch = e.targetTouches[0];
      touchStartY = touch.pageY;
    }, false);
    canvas.canvas.addEventListener('touchmove', (e) => {
      const touch = e.targetTouches[0];
      touchMoveY = touch.pageY;
      touchEndY = touchStartY - touchMoveY;
      canvas.mouseX = touch.pageX;
      canvas.mouseY = touch.pageY;
    }, false);
    canvas.canvas.addEventListener('touchend', (e) => {
      canvas.mouseX = null;
      canvas.mouseY = null;
      touchStartY = null;
      touchMoveY = null;
      touchEndY = null;
    }, false);
  }, false);
})();