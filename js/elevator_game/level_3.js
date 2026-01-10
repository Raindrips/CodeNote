const obj =
{
    init: function (elevators, floors)
    {
        var elevator = elevators[0];
        var current = 0;
        elevator.on("idle", function ()
        {
            let to = rule1[current];
            elevator.goToFloor(to);
            current = to;
        });
    },
    update: function (dt, elevators, floors)
    {
        // We normally don't need to do anything here
    }
}