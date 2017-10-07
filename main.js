var numpoints = 150;
var radius = 1;
var pointcolor = '#666';
var proximity = 200;
var points = [];
var speed = .5;

document.addEventListener("DOMContentLoaded", function(event) {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var canvas = document.getElementById('canvas');
  canvas.height = h;
  canvas.width = w;
  var context = canvas.getContext('2d');

  for(i = 0; i < numpoints; i++) {
    var direction = Math.random() * 2 * Math.PI;
    var point = {
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      // x: 20+(i*(canvas.width/numpoints)),
      // y: Math.random() * canvas.height/2,
      v: {
        x: speed*Math.cos(direction),
        y: speed*Math.sin(direction)
      },
      nearby: {}
    }
    points.push(point);
  }

  setTimeout(function(){
    window.requestAnimationFrame(move);
  }, 1000);

  var nearby = (p1, p2) => {
    deltax = Math.abs(p1.x - p2.x);
    deltay = Math.abs(p1.y - p2.y);
    distance = Math.sqrt(deltax*deltax + deltay*deltay);

    if(distance <= proximity) {
      console.log(p1, p2, 'x ' + deltax, 'y ' + deltay, 'x2 ' + deltax^2, 'y2 ' + deltay^2, 'd ' + distance)
      return true
    };
    return false;
  }

  var move = () => {
    for(let p1 of points) {
      p1.x += p1.v.x;
      p1.y += p1.v.y;

      if(p1.x <= 0 || p1.x >= canvas.width) { p1.v.x = -1*p1.v.x }
      if(p1.y <= 0 || p1.y >= canvas.height) { p1.v.y = -1*p1.v.y }

      for(let p2 of points) {
        if(p1.id != p2.id && nearby(p1, p2)) {
          p1.nearby[p2.id] = p2;
          p2.nearby[p1.id] = p1;
        } else {
          delete(p1.nearby[p2.id]);
          delete(p2.nearby[p1.id]);
        }
      }
    }

    console.log(points);

    draw();

    window.requestAnimationFrame(move);
  }

  var draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for(let p1 of points) {
      context.beginPath();
      context.arc(p1.x, p1.y, radius + p1.nearby.length, 0, 2 * Math.PI, false);
      context.fillStyle = pointcolor;
      context.globalAlpha = 1;
      context.fill();

      for(let p2 of Object.keys(p1.nearby)) {
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        // console.log(p1.nearby[p2]);
        context.lineTo(p1.nearby[p2].x, p1.nearby[p2].y);
        context.strokeStyle = pointcolor;
        context.lineWidth = 1;
        context.globalAlpha = .1;
        context.closePath();
        context.stroke();
      }
    }
  };

});
