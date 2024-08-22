(function ()
{
    const CACHE_NAME = "vfish_sw_cache";

    console.log("js is run");
    window.addEventListener("fetch", (e) =>
    {
        log("fetch", e.request.url);
    });

    window.addEventListener("message", (e) =>
    {
        log("message", e.request.url);
    });

    console.log(self);
    console.log(caches);
})();
