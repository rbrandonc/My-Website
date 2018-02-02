import { Component, OnInit } from '@angular/core';
// import { HostListener} from "@angular/core";



@Component({
  selector: 'hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  canvas: HTMLCanvasElement;
  context: any;
  dpi = 50;
  points = [];
  pointRadius = 2.0;
  maxPointRadius = 6.0;
  pointColor = '#fff';
  canvasColor = '#fff';
  proximity = 200.0;
  speed = .5;
  windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  numpoints = ((this.windowWidth/1000*this.windowHeight)/1000)*this.dpi;
  overlay: any;
  wrap: any;
  originalWrapHeight: any;
  originalOverlayHeight: any;
  originalWrapOffsetTop: any;

  ngOnInit() {
    // Get canvas and set height
  	this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
  	this.canvas.width = this.windowWidth;
  	this.canvas.height = this.windowHeight;
  	this.context = this.canvas.getContext('2d');
    this.wrap = document.getElementById('nav-wrap');
    this.overlay = document.getElementById('overlay');
    this.originalWrapHeight = this.wrap.clientHeight;
    this.originalOverlayHeight = this.overlay.clientHeight;
    this.originalWrapOffsetTop = this.wrap.offsetTop;

  	//Add point when we click
  	this.overlay.click(function(event) {
  	  this.createPoint(event.x, event.y);
  	}.bind(this), false);

  	this.initializePoints();

  	//Start the animation
  	setTimeout(window.requestAnimationFrame(this.move), 1000);
  }

  // @HostListener("window:scroll", [])
  // onWindowScroll() {
  //   console.log('scroll');
  // }

  stickyNav() {
    if(window.scrollY > this.originalWrapOffsetTop - .5*this.originalWrapHeight) {
      return true;
    }
  }

  //returns a random color
  rcolor = () => {
    var r = parseInt('' + Math.random() * 255);
    var g = parseInt('' + Math.random() * 255);
    var b = parseInt('' + Math.random() * 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  //Create a single point
  createPoint = (x, y) => {
    var direction = Math.random() * 2 * Math.PI;
    var point = {
      id: 0 + this.points.length,
      x: x,
      y: y,
      v: {
        x: this.speed*Math.cos(direction),
        y: this.speed*Math.sin(direction)
        // y: 0
      },
      radius: this.pointRadius,
      nearby: {},
      color: this.rcolor()
    }
    this.points.push(point);
  }

  initializePoints = () => {
  	for(var i = 0; i < this.numpoints; i++) {
  	  this.createPoint(Math.random() * this.windowWidth, Math.random() * this.windowHeight);
  	}
  }

  distanceBetween = (p1, p2) => {
    var deltax = Math.abs(p1.x - p2.x);
    var deltay = Math.abs(p1.y - p2.y);
    var distance = Math.sqrt(deltax*deltax + deltay*deltay);
    return distance;
  }

  move = () => {

  //draw background
  this.context.globalCompositeOperation = 'source-over';
  this.context.fillStyle = this.canvasColor;
  this.context.fillRect(0, 0, this.windowWidth, this.windowHeight);

  for(let p1 of this.points) {

    //move
    p1.x += p1.v.x;
    p1.y += p1.v.y;

    //edge of canvas logic
    if(p1.x <= 0 || p1.x >= this.canvas.width) { p1.v.x = -1*p1.v.x }
    if(p1.y <= 0 || p1.y >= this.canvas.height) { p1.v.y = -1*p1.v.y }

    //adjust radius
    if(p1.radius < this.maxPointRadius && p1.radius < this.pointRadius + (Object.keys(p1.nearby).length)/2) { p1.radius += .01 }
    if(p1.radius > this.pointRadius + (Object.keys(p1.nearby).length)/2) { p1.radius -= .01 }

    //draw points
    this.context.beginPath();
    this.context.arc(p1.x, p1.y, p1.radius, 0, 2 * Math.PI, false);
    this.context.fillStyle = p1.color;
    this.context.globalAlpha = 1;
    this.context.closePath();
    this.context.fill();

    //draw lines to nearby points
    for(let p2 of this.points) {
      var d = this.distanceBetween(p1, p2);

      if(d < this.proximity) {

        this.context.beginPath();
        this.context.globalAlpha = (1 - (d / (1/1)) / this.proximity);
        var grad = this.context.createLinearGradient(p1.x,p1.y,p2.x,p2.y);
        grad.addColorStop(0, p1.color);
        grad.addColorStop(1, p2.color);
        this.context.strokeStyle = grad;
        // this.context.strokeStyle='rgb(8, 14, 19)';
        this.context.lineWidth = 1;
        this.context.moveTo(p1.x, p1.y);
        this.context.lineTo(p2.x, p2.y);
        this.context.closePath();
        this.context.stroke();

      }
    }
  }

  // this.context.globalCompositeOperation = 'difference';
  // this.context.fillStyle = 'white';

  // if(this.windowWidth > this.windowHeight) {
  //   this.context.fillRect(0,0,this.canvas.width/2,this.canvas.height);
  // } else {
  //   this.context.fillRect(0,0,this.canvas.width,this.canvas.height/2);
  // }

  // document.getElementById('overlay').style['background-image'] = 'url(' + this.canvas.toDataURL('image/jpeg', .5) + ')';
  window.requestAnimationFrame(this.move);
  }

}