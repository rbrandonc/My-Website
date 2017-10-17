import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  projects = [{
    name: 'GymNOW',
    description: 'An app I helped develop during the summer of 2017. It lets users search for gyms that offer single day passes, and a variety of other offers.',
    images: {
      mobile: ['GymNOW1', 'GymNOW2'],
      desktop: []
    },
    play: 'https://play.google.com/store/apps/details?id=com.gymnowapp.gymnowapp&hl=en',
    apple: 'https://itunes.apple.com/us/app/gymnow/id1181595309?mt=8'
  },
  {
    name: 'Calcuweightor',
    description: 'This is another test description.',
    images: {
      mobile: ['Calcuweightor1', 'Calcuweightor2'],
      desktop: []
    },
    source: 'https://github.com/rbrandonc/calcuweightor',
    play: 'https://play.google.com/store/apps/details?id=io.bcsoft.calcuweightor&hl=en'
  }]

  colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548'];
}

var numpoints = 100;
var radius = 2.0;
var pointcolor = '#000';
var bgcolor = '#381010';
var proximity = 200.0;
var points = [];
var speed = .5;
var maxradius = 6.0;
var w = 0;
var h = 0;

var rcolor = () => {
  var r = parseInt('' + Math.random() * 255);
  var g = parseInt('' + Math.random() * 255);
  var b = parseInt('' + Math.random() * 255);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

var createPoint = (x, y) => {
  var direction = Math.random() * 2 * Math.PI;
  var point = {
    id: 0 + points.length,
    x: x,
    y: y,
    // x: 20+(i*(canvas.width/numpoints)),
    // y: 100,
    v: {
      x: speed*Math.cos(direction),
      y: speed*Math.sin(direction)
      // y: 0
    },
    radius: radius,
    nearby: {},
    color: rcolor()
  }
  points.push(point);
}

document.addEventListener("DOMContentLoaded", function(event) {
  var canvas = <HTMLCanvasElement> document.getElementById('canvas');
  document.getElementById('overlay-container').addEventListener('click', function(event) {
    createPoint(event.x, event.y)
  }, false);

  w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  canvas.height = h;
  canvas.width = w;
  var context = canvas.getContext('2d');

  var maskCanvas = document.createElement('canvas');
  // Ensure same dimensions
  maskCanvas.width = w/2;
  maskCanvas.height = h;
  var maskContext = maskCanvas.getContext('2d');

  // This color is the one of the filled shape
  maskContext.fillStyle = "#381010";

  for(var i = 0; i < numpoints; i++) {
    createPoint(Math.random() * canvas.width, Math.random() * canvas.height);
  }

  setTimeout(function(){
    window.requestAnimationFrame(move);
  }, 1000);

  var nearby = (p1, p2) => {
    var deltax = Math.abs(p1.x - p2.x);
    var deltay = Math.abs(p1.y - p2.y);
    var distance = Math.sqrt(deltax*deltax + deltay*deltay);
    // console.log(p1, p2, 'x ' + deltax, 'y ' + deltay, 'x2 ' + deltax^2, 'y2 ' + deltay^2, 'd ' + distance)
    return distance;
  }

  var move = () => {
    //draw background
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = '#f7f1ec';
    context.fillRect(0,0,w,h);

    // Fill the mask
    maskContext.globalCompositeOperation = 'source-over';
    maskContext.fillStyle = 'rgb(8, 14, 19)';
    maskContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    for(let p1 of points) {

      //move
      p1.x += p1.v.x;
      p1.y += p1.v.y;

      //edge of canvas logic
      if(p1.x <= 0 || p1.x >= canvas.width) { p1.v.x = -1*p1.v.x }
      if(p1.y <= 0 || p1.y >= canvas.height) { p1.v.y = -1*p1.v.y }

      //adjust radius
      if(p1.radius < maxradius && p1.radius < radius + (Object.keys(p1.nearby).length)/2) { p1.radius += .01 }
      if(p1.radius > radius + (Object.keys(p1.nearby).length)/2) { p1.radius -= .01 }

      //draw points
      context.beginPath();
      context.arc(p1.x, p1.y, p1.radius, 0, 2 * Math.PI, false);
      context.fillStyle = 'black';
      // context.strokeStyle = pointcolor;
      context.globalAlpha = 1;
      context.closePath();
      context.fill();

      // Draw the shape you want to take out
      // //draw points
      maskContext.beginPath();
      maskContext.arc(p1.x, p1.y, p1.radius, 0, 2 * Math.PI, false);
      // maskContext.fillStyle = 'rgb(8, 14, 19)';
      // context.strokeStyle = pointcolor;
      maskContext.globalAlpha = 1;
      maskContext.closePath();
      maskContext.fill();
      // maskContext.fillStyle = 'rgb(8, 14, 19)';


      //draw lines to nearby points
      for(let p2 of points) {
        var d = nearby(p1, p2);

        if(d < proximity) {

          context.beginPath();
          context.globalAlpha = (1 - (d / (1/1)) / proximity);
          // var grad = context.createLinearGradient(p1.x,p1.y,p2.x,p2.y);
          // grad.addColorStop(0, p1.color);
          // grad.addColorStop(1, p2.color);
          // context.strokeStyle = grad;
          // context.strokeStyle='rgb(8, 14, 19)';
          context.lineWidth = 1;
          context.moveTo(p1.x, p1.y);
          context.lineTo(p2.x, p2.y);
          context.closePath();
          context.stroke();

          maskContext.beginPath();
          maskContext.strokeStyle='#c2c2c2';

          maskContext.globalAlpha = (1 - (d / (1/1)) / proximity);
          // var grad = context.createLinearGradient(p1.x,p1.y,p2.x,p2.y);
          // grad.addColorStop(0, p1.color);
          // grad.addColorStop(1, p2.color);
          // maskContext.strokeStyle = grad;
          maskContext.lineWidth = 1;
          maskContext.moveTo(p1.x, p1.y);
          maskContext.lineTo(p2.x, p2.y);
          maskContext.closePath();
          maskContext.stroke();
        }
      }
    }
    // context.globalCompositeOperation = 'overlay';
    context.fillStyle = 'white';
    context.fillRect(0,0,w/2,h);
    context.drawImage(maskCanvas, 0, 0);

    // create an in-memory canvas
    var buffer = document.createElement('canvas');
    var b_ctx = buffer.getContext('2d');
    // set its width/height to the required ones
    var overlay = document.getElementById('overlay');
    // var w = ;
    // var h =;
    buffer.width = overlay.clientWidth;
    buffer.height = overlay.clientHeight;
    // draw the main canvas on our buffer one
    // drawImage(source, source_X, source_Y, source_Width, source_Height,
    //  dest_X, dest_Y, dest_Width, dest_Height)
    // b_ctx.webkitImageSmoothingEnabled = false;
    // b_ctx.mozImageSmoothingEnabled = false;
    // b_ctx.imageSmoothingEnabled = false;
    // context.webkitImageSmoothingEnabled = false;
    // context.mozImageSmoothingEnabled = false;
    // context.imageSmoothingEnabled = false;
    b_ctx.drawImage(canvas, overlay.offsetLeft, overlay.offsetTop, overlay.clientWidth, overlay.clientHeight,
                    0, 0, overlay.clientWidth, overlay.clientHeight);
    // context.drawImage(buffer, overlay.offsetLeft-(overlay.clientWidth/2), overlay.offsetTop-(overlay.clientHeight/2));

    document.getElementById('overlay').style['background-image'] = 'url(' + buffer.toDataURL("image/png") + ')';

    window.requestAnimationFrame(move);
  }

});
