enum Change {
    up,
    normal,
    down,
}
function temperatureTrend(
    temperatureA: number[],
    temperatureB: number[]
): number {
    let statusA = getState(temperatureA);
    let statusB = getState(temperatureB);

    let count = 0;
    let max = 0;

    for (let i = 0; i < statusA.length; i++) {
        if (statusA[i] === statusB[i]) {
            count++;
            max = Math.max(count, max);
        } else {
            count = 0;
        }
    }
    return max;
}

function getState(temperature: number[]) {
    let last = temperature[0];
    let arr = [];
    for (let i = 1; i < temperature.length; i++) {
        const value = temperature[i];
        if (last > value) {
            arr.push(Change.down);
        } else if (last === value) {
            arr.push(Change.normal);
        } else {
            arr.push(Change.up);
        }
        last=value;
    }
    console.log(arr);
    return arr;
}

// //TEST
// let a = [21, 18, 18, 18, 31];
// let b = [34, 32, 16, 16, 17];

// let r = temperatureTrend(a, b);
// console.log(r);
