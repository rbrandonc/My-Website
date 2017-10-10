var numpoints = 70;
var radius = 2.0;
var pointcolor = '#666';
var bgcolor = '#1f1f1f'
var proximity = 200.0;
var points = [];
var speed = .5;
var maxradius = 5.0;
var w = 0;
var h = 0;

var rcolor = () => {
  var r = parseInt(Math.random() * 255);
  var g = parseInt(Math.random() * 255);
  var b = parseInt(Math.random() * 255);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

var createPoint = (x, y) => {
  var direction = Math.random() * 2 * Math.PI;
  var point = {
    id: i,
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
  var canvas = document.getElementById('canvas');
  canvas.addEventListener('click', function(event) {
    createPoint(event.x, event.y)
  }, false);
  
  w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var canvas = document.getElementById('canvas');
  canvas.height = h;
  canvas.width = w;
  var context = canvas.getContext('2d');

  for(i = 0; i < numpoints; i++) {
    createPoint(Math.random() * canvas.width, Math.random() * canvas.height);
  }

  setTimeout(function(){
    window.requestAnimationFrame(move);
  }, 1000);

  var nearby = (p1, p2) => {
    deltax = Math.abs(p1.x - p2.x);
    deltay = Math.abs(p1.y - p2.y);
    distance = Math.sqrt(deltax*deltax + deltay*deltay);
    // console.log(p1, p2, 'x ' + deltax, 'y ' + deltay, 'x2 ' + deltax^2, 'y2 ' + deltay^2, 'd ' + distance)
    return distance;
  }

  var move = () => {
    context.fillStyle = bgcolor;
    context.fillRect(0,0,w,h);

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

      //redraw
      context.beginPath();
      context.arc(p1.x, p1.y, p1.radius, 0, 2 * Math.PI, false);
      context.fillStyle = p1.color;
      context.strokeStyle = pointcolor;
      context.globalAlpha = 1;
      context.closePath();
      context.fill();

      //draw lines to nearby points
      for(let p2 of points) {
        var d = nearby(p1, p2);

        if(d < proximity) {

          context.beginPath();
          context.globalAlpha = (1 - (d / (1/1)) / proximity);

          var grad = context.createLinearGradient(p1.x,p1.y,p2.x,p2.y);
          grad.addColorStop(0, p1.color);
          grad.addColorStop(1, p2.color);
          context.strokeStyle = grad;
          context.lineWidth = .5;
          context.moveTo(p1.x, p1.y);
          context.lineTo(p2.x, p2.y);
          context.closePath();
          context.stroke();

        }


      }
    }

    window.requestAnimationFrame(move);
  }

});
