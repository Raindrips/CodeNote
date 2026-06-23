"use strict";
var WallMask;
(function (WallMask) {
    WallMask[WallMask["Top"] = 1] = "Top";
    WallMask[WallMask["Right"] = 2] = "Right";
    WallMask[WallMask["Bottom"] = 4] = "Bottom";
    WallMask[WallMask["Left"] = 8] = "Left";
})(WallMask || (WallMask = {}));
class MazeCell {
    constructor() {
        this.wallMask = WallMask.Top |
            WallMask.Right |
            WallMask.Bottom |
            WallMask.Left;
        this.visited = false;
    }
}
