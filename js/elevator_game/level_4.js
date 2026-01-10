const obj =
{
    init: function (elevators, floors)
    {
        let State = {
            none: 0,
            hasFloor,
            moveFloor,
        }
        var rule1 = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 0 }
        var rule2 = { 0: 7, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6 }
        for (let i = 0; i < elevator.length; i++) {
            var elevator = elevators[i];
            var floor = floors[i];

            var current = [];
            for (let i = 0; i < elevators.length; i++) {
                current[i] = 0;
                elevators[i].on("idle", function ()
                {
                    var rule = i == 1 ? rule1 : rule2
                    let to = rule[current[i]];
                    elevators[i].goToFloor(to);
                    current[i] = to;
                });

            }
        }
    },
    update: function (dt, elevators, floors)
    {
        // We normally don't need to do anything here
    }
}