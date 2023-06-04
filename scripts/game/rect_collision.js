{
    const RectangluarCollider = function(  ) {

        function pointVsRect(point, rect) {
            return (point.x >= rect.left && point.y >= rect.top && point.x < rect.right && point.y < rect.bottom);
        }

        function rectVsRect(r1, r2) {
            return (r1.left < r2.right && r1.right > r2.left && r1.top < r2.bottom && r1.bottom > r2.top )
        }

        function tHit(pos, ray_origin, ray_vector) {
            return {
                x: (pos.x - ray_origin.x) / ray_vector.x,
                y: (pos.y - ray_origin.y) / ray_vector.y
            }
        }


        function getCollisionPoint(ray_origin, hit_near, ray_dir) {
            const point = {x: (hit_near * ray_dir.x), y: (hit_near * ray_dir.y)}
            point.x += ray_origin.x;
            point.y += ray_origin.y;
            return point;
        }

        function createNormal(t, ray_dir) {
            if(t.near[0] > t.near[1])
                if(ray_dir[0] < 0) 
                    return [1, 0];
                else 
                    return [-1, 0];
            else if (t.near[0] < t.near[1])
                if(ray_dir[1] < 0) 
                    return [0, 1];
                else 
                    return [0, -1]; 
        }

        function RayVsRect( ray_origin, ray_dir, rect) {

            const t_near = { 
                x: (rect.left - ray_origin.x) / ray_dir.x,
                y: (rect.top  - ray_origin.y) / ray_dir.y,
            }

            const t_far = { 
                x: (rect.right - ray_origin.x) / ray_dir.x,
                y: (rect.bottom  - ray_origin.y) / ray_dir.y,
            }

            if(t_near.x > t_far.x) [t_near.x, t_far.x] = [t_far.x, t_near.x];
            if(t_near.y > t_far.y) [t_near.y, t_far.y] = [t_far.y, t_near.y];

            //first filter
            if(t_near.x > t_far.y || t_near.y > t_far.x) return false;
            //update hit "timings"
            const t_hit_near = Math.max(t_near.x, t_near.y);
            if(t_hit_near > 1) return false;
            const t_hit_far  = Math.min(t_far.x, t_far.y);
            //second filter (collisions behind ray)
            if(t_hit_far < 0) return false;
            //calculate collision point 
            Object.assign(contact_point, getCollisionPoint(ray_origin, t_hit_near, ray_dir));
            //create normal vector 
            if(t_near.x > t_near.y) {
                if(ray_dir.x < 0) contact_normal.set([1, 0]);
                else contact_normal.set([-1, 0]);
            } else if(t_near.x < t_near.y) {
                if(ray_dir.y < 0) contact_normal.set([0, 1]);
                else contact_normal.set([0, -1]);
            }

            return {
                contact_normal: contact_normal,
                contact_point: contact_point
            }

        }

        return {
            RayVsRect: RayVsRect,
            PointVsRect: pointVsRect,
            RectVsRect: rectVsRect
        }

    }

    self.Collider = new RectangluarCollider( );

}