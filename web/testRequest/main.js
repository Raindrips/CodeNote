var client = new XMLHttpRequest();
client.open("GET", "127.0.0.1:7456");
client.timeout = 1000;
client.ontimeout = function (e) {
    console.error("Timeout!!");
};
client.send();


 var i = 0;
(function count() {
    console.log(i++);
    setTimeout(count, 1000);
})()
