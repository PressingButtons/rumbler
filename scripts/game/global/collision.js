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
//==========================================================
//  Ray two Rect - enclosed to keep some methods private
//==========================================================
{   
    Collision.Ray2Rect = ( origin, vector, rect ) => {
       const near = NearIntersection( origin, vector, rect); 
       const far  = FarIntersection( origin, vector, rect);
       setPointOrder(near, far);
       //console.log('near,far', near, far)
       if( near.x > far.y || near.y > far.x ) return null;
       let tNear = Math.max( near.x, near.y );
       if( tNear > 1 ) return null;
       let tFar  = Math.min( far.x, far.y) ;
       if( tFar < 0) return null;
       return {
        contact: ContactPoint( origin, vector, tNear),
        normal:  ContactNormal(near, vector),
        t: tNear
       }
    }

    const NearIntersection = (origin, vector, rect) => {
        return { 
            x: (rect.left - origin.x) / vector.x,
            y: (rect.top  - origin.y ) / vector.y
        }
    }

    const FarIntersection = (origin, vector, rect) => {
        return { 
            x: (rect.right   - origin.x)  / vector.x,
            y: (rect.bottom  - origin.y)  / vector.y
        }
    }

    const setPointOrder =( near, far ) => {
        if(near.x > far.x) [near.x, far.x] = [far.x, near.x];
        if(near.y > far.y) [near.y, far.y] = [far.y, near.y]; 
    }

    const ContactPoint = (origin, vector, t) => {
        return {
            x: origin.x + (t * vector.x),
            y: origin.y + (t * vector.y)
        }
    }

    const ContactNormal = ( near, vector ) => {
        if( near.x > near.y ) 
            return vector.x < 0 ? [1, 0] : [-1, 0];
        else if(near.x < near.y )
            return vector.y < 0 ? [0, 1] : [0, -1];
    }
}


//==========================================================
//  Rigid Body to Rigid Body 
//==========================================================
{
    Collision.RigidBody2RigidBody = ( rb1, vector, rb2 ) => {
        if( rb1.velocity.x == 0 && rb1.velocity.y == 0) return null;
        const rect = expandRect( rb1, rb2 );
        return Collision.Ray2Rect( rb1.position, vector, rect );
    }

    const expandRect = ( rb1, rb2) => {
        return {
            top: rb2.top - rb1.body.height * 0.5,
            left: rb2.left - rb1.body.width * 0.5,
            right: rb2.right + rb1.body.width * 0.5,
            bottom: rb2.bottom + rb1.body.height * 0.5
        }
    }
}
