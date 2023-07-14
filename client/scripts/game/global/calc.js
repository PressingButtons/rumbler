const Calc = { };

Calc.Lerp = ( start, end, rate ) => {
    return ( 1 - rate ) * start + (rate * end);
}

Calc.Distance = ( pos1, pos2 ) => {
    return Math.pow(
        Math.pow((pos2.x - pos1.x), 2) +
        Math.pow((pos2.y - pos1.y), 2),
        0.5
    )   
}

Calc.Midpoint = ( pos1, pos2 ) => {
    return {x: (pos1.x + pos2.x) * 0.5, y: (pos1.y + pos2.y) * 0.5};
}