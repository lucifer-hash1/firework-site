// Source - https://stackoverflow.com/q
// Posted by Gurandeer, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-31, License - CC BY-SA 3.0

var nFireworks = 10000;

function initParticleSystem() {

  var particlesData = [];

  for (var i= 0; i < nFireworks; i++) {

    // angulos del cono
    var theta = Math.PI / 6.0 * Math.random();
    var phi   = 5.0 * Math.PI * Math.random();

    // direccion
    var x1 = Math.sin(theta) * Math.cos(phi) ;
    var y1 = velocity;
    var z1 = 0.0;

    // velocidad
    var alpha = Math.random();
    var velocity = (1.4 * alpha) + (0.80 * (1.0 - alpha));

    particlesData[i * 4 + 0] = x1 * velocity;
    particlesData[i * 4 + 1] = y1 * velocity;
    particlesData[i * 4 + 2] = z1 * velocity;
    particlesData[i * 4 + 3] = i * 0.095;

  } 
}
