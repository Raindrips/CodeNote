import data from './config.json';

export function MyFn2() {
    console.log('MyFn2()');
}

function getJson() {
    console.log(data);
}

getJson();
