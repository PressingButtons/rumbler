const Collision = { };

Collision.Point2Rect = ( p, rect ) => {
    return ( p.x >= rect.left && p.x <= rect.right && p.y >= rect.top && p.y <= rect.bottom );
}

Collision.Rect2Rect = ( r1, r2 ) => {
    return (
        r1.left < r2.right && 
        r1.right > r2.left && 
        r1.top < r2.bottom && 
        r1.bottom > r2.top
    )
}