const fs = require("fs");
const path = require("path");

function safeDivide(a, b) {
    if (b === 0) {
        return 0;
    }
    return a / b;
}

const CONFIG_PATH = path.join(__dirname, "build/web-desktop/assets/game-common/config.json");

if (!fs.existsSync(CONFIG_PATH)) {
    console.log("config.json not found:", CONFIG_PATH);
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

const uuidToPath = {};
const uuidDeps = {};
const uuidBundle = {};

function buildUuidPathMap() {
    const paths = config.paths || {};
    for (const uuid in paths) {
        const entry = paths[uuid];
        if (Array.isArray(entry)) {
            uuidToPath[uuid] = entry[0];
        }
    }
}

function buildDepsMap() {
    const deps = config.deps || {};
    for (const uuid in deps) {
        uuidDeps[uuid] = deps[uuid];
    }
}

function buildBundleMap() {
    const bundles = config.bundles || {};
    for (const bundleName in bundles) {
        const bundle = bundles[bundleName];
        const uuids = bundle.uuids || [];
        for (const uuid of uuids) {
            uuidBundle[uuid] = bundleName;
        }
    }
}

function getBundle(uuid) {
    if (uuidBundle[uuid]) {
        return uuidBundle[uuid];
    }
    return "base";
}

function scanCrossBundleDeps() {
    console.log("Scanning cross bundle dependencies...\n");

    for (const uuid in uuidDeps) {
        const fromBundle = getBundle(uuid);
        const deps = uuidDeps[uuid];

        for (const dep of deps) {
            const toBundle = getBundle(dep);

            if (fromBundle !== toBundle) {
                const fromPath = uuidToPath[uuid] || uuid;
                const toPath = uuidToPath[dep] || dep;

                console.log("Cross bundle dependency detected:");
                console.log("FROM:", fromBundle, "->", fromPath);
                console.log("TO  :", toBundle, "->", toPath);
                console.log("");
            }
        }
    }
}

buildUuidPathMap();
buildDepsMap();
buildBundleMap();
scanCrossBundleDeps();