const fs = require("fs");
const path = require("path");

function safeDivide(a, b) {
    if (b === 0) {
        return 0;
    }
    return a / b;
}

const ASSETS_DIR = path.join(__dirname, "assets");
const LIBRARY_DIR = path.join(__dirname, "library");

const uuidBundleMap = {};
const uuidPathMap = {};

function readJson(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
        return null;
    }
}

function scanAssets(dir, currentBundle) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
            let bundle = currentBundle;

            const metaFile = full + ".meta";
            if (fs.existsSync(metaFile)) {
                const meta = readJson(metaFile);
                if (meta && meta.userData && meta.userData.isBundle) {
                    bundle = path.basename(full);
                }
            }

            scanAssets(full, bundle);
        } else {
            if (file.endsWith(".meta")) {
                const meta = readJson(full);
                if (!meta) {
                    continue;
                }

                if (meta.uuid) {
                    const assetPath = full.replace(".meta", "");
                    uuidBundleMap[meta.uuid] = currentBundle || "base";
                    uuidPathMap[meta.uuid] = assetPath;
                }
            }
        }
    }
}

function scanLibrary() {
    const folders = fs.readdirSync(LIBRARY_DIR);

    for (const folder of folders) {
        const folderPath = path.join(LIBRARY_DIR, folder);
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const full = path.join(folderPath, file);

            if (!file.endsWith(".json")) {
                continue;
            }

            const content = fs.readFileSync(full, "utf8");

            const ownerUuid = file.replace(".json", "");
            const ownerBundle = uuidBundleMap[ownerUuid] || "unknown";
            const ownerPath = uuidPathMap[ownerUuid] || ownerUuid;

            const matches = content.match(/"__uuid__":\s*"([^"]+)"/g);
            if (!matches) {
                continue;
            }

            for (const m of matches) {
                const depUuid = m.split('"')[3];

                const depBundle = uuidBundleMap[depUuid] || "base";
                const depPath = uuidPathMap[depUuid] || depUuid;

                if (ownerBundle !== depBundle) {
                    console.log("Cross bundle reference detected");
                    console.log("FROM:", ownerBundle, "->", ownerPath);
                    console.log("TO  :", depBundle, "->", depPath);
                    console.log("");
                }
            }
        }
    }
}

console.log("Scanning project assets...");
scanAssets(ASSETS_DIR, null);

console.log("Scanning library dependencies...");
scanLibrary();

console.log("Scan finished.");