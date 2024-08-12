let myWorker;

document.getElementById("startWorker").addEventListener("click", () => {
    if (window.Worker) {
        myWorker = new Worker("worker.js");

        myWorker.onmessage = function (event) {
            console.log("onmessage:", event);
            document.getElementById("result").textContent =
                "Result: " + event.data;
        };

        myWorker.onerror = function (error) {
            console.log("onerror:", error);
            console.error("Worker error:", error.message);
        };

        // 向 Worker 发送数据
        myWorker.postMessage(1000000);
    } else {
        console.log("Your browser does not support Web Workers.");
    }
});

document.getElementById("sendMessage").addEventListener("click", () => {
    // 向 Worker 发送数据
    myWorker.postMessage(1000000);
});

document.getElementById("stopWorker").addEventListener("click", () => {
    if (myWorker) {
        myWorker.terminate();
        myWorker = null;
        document.getElementById("result").textContent = "Worker terminated";
    }
});
