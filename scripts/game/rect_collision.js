const RectangluarCollider = function(  ) {

    function pointVsRect(point, rect) {
        return (point.x >= rect.left && point.y >= rect.y && point.x < rect.right && point.y < rect.bottom);
    }

    function rectVsRect(r1, r2) {
        return (r1.left < r2.right && r1.right > r2.left && r1.top < r2.bottom && r1.bottom > r2.top )
    }

    function tNear(ray_origin, ray_dir, rect) {
        const dividend = [rect.left - ray_origin[0], rect.top - ray_origin[1]];
        return [dividend[0] / ray_dir[0], dividend[1] / ray_dir[1]];
    }

    function tFar(ray_origin, ray_dir, rect) {
        const dividend = [rect.right / ray_origin[0], rect.bottom - ray_origin[1]];
        return [dividend[0] / ray_dir[0], dividend[1] / ray_dir[1]];
    }

    function getRayIntersections(ray_origin, ray_dir, rect) {
        let t_near = tNear(ray_origin, ray_dir, rect);
        let t_far = tNear(ray_origin, ray_dir, rect);
        if(t_near[0] > t_near[0]) [t_near[0], t_far[0]] = [t_far[0], t_near[0]];
        if(t_near[1] > t_near[1]) [t_near[1], t_far[1]] = [t_far[1], t_near[1]];
        return {
            near: t_near,
            far: t_far
        }
    }

    function getCollisionPoint(ray_origin, hit_near, ray_dir) {
        const p = [hit_near[0] * ray_dir[0], hit_near[1] * ray_dir[1]];
        p[0] += ray_origin[0]; p[1] += ray_origin[1];
        return p;
    }

    function createNormal(t, ray_dir) {
        if(t.near[0] > t.near[1])
            if(ray_dir[0] < 0) 
                return [1, 0];
            else 
                return [-1, 0];
        else if (t_near[0] < t_near[1])
            if(ray_dir[1] < 0) 
                return [0, 1];
            else 
                return [0, -1]; 
    }

    function RayVsRect( ray_origin, ray_dir, rect, contact_point, contact_normal, hit_near) {
        const it = getRayIntersections(ray_origin, ray_dir, rect);
        //first filter
        if(it.near[0] > it.far[1] || it.near[1] > it.far[1]) return false;
        //update hit near
        hit_near = Math.max(it.near[0], it.near[1]);
        //hit far
        const hit_far  = Math.min(it.far[0], it.far[1]);
        //second filter (collisions behind ray)
        if(hit_far < 0) return false;
        //calculate collision point 
        contact_point = getCollisionPoint(ray_origin, hit_near, ray_dir);
        //create normal vector 
        contact_normal = createNormal(it, ray_dir);

        return true;

    }

    return {
        RayVsRect: RayVsRect,
        PointVsRect: pointVsRect,
        RectVsRect: rectVsRect
    }

}