// return the Euclidean distance between two points
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

// return a random number in [lo, hi)
function randomUniform(lo, hi) {
    return (hi - lo) * Math.random() + lo;
}

// return an exponentially distributed random number 
function randomExponential(expected) {
    return Math.log(Math.random()) / -(1 / expected);
} 

// return true if collision is detected between two circles
function isCollision(x1, y1, radius1, x2, y2, radius2) {
    return getDistance(x1, y1, x2, y2) < radius1 + radius2;
}