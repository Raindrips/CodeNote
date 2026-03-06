const fs = require("fs");
const path = require("path");

/**
 * @typedef {Object} BundleInfo
 * @property {string} name
 * @property {string} root
 */

/**
 * @typedef {Object} AssetInfo
 * @property {string} uuid
 * @property {string} path
 * @property {string} bundle
 */

/** @type {string} */
const PROJECT_ROOT = process.cwd()

/** @type {string} */
const ASSETS_DIR = path.join(PROJECT_ROOT, "assets")

/** @type {string} */
const LIBRARY_DIR = path.join(PROJECT_ROOT, "library")

/** @type {Map<string, BundleInfo>} */
const bundles = new Map()

/** @type {Map<string, AssetInfo>} */
const uuidAssetMap = new Map()

/** @type {Map<string, Set<string>>} */
const bundleAssets = new Map()

/** @type {Map<string, Set<string>>} */
const bundleGraph = new Map()


/**
 * 读取JSON文件
 * @param {string} file
 * @returns {any|null}
 */
function readJson(file)
{
    try {
        const text = fs.readFileSync(file, "utf8")
        return JSON.parse(text)
    } catch {
        return null
    }
}


/**
 * 递归扫描目录
 * @param {string} dir
 * @param {(file:string)=>void} callback
 */
function walk(dir, callback)
{
    const files = fs.readdirSync(dir)

    for (const f of files) {
        const full = path.join(dir, f)
        const stat = fs.statSync(full)

        if (stat.isDirectory()) {
            walk(full, callback)
        } else {
            callback(full)
        }
    }
}


/**
 * 查找所有bundle
 */
function scanBundles()
{
    walk(ASSETS_DIR, (file) =>
    {

        if (!file.endsWith(".meta")) return

        const meta = readJson(file)
        if (!meta) return

        if (meta.userData && meta.userData.isBundle) {

            const dir = file.replace(".meta", "")

            let bundleName = path.basename(dir)

            if (meta.userData.bundleName && meta.userData.bundleName.length > 0) {
                bundleName = meta.userData.bundleName
            }

            bundles.set(bundleName, {
                name: bundleName,
                root: dir
            })

            bundleAssets.set(bundleName, new Set())
            bundleGraph.set(bundleName, new Set())
        }
    })
}


/**
 * 获取资源所属bundle
 * @param {string} assetPath
 * @returns {string}
 */
function resolveBundle(assetPath)
{

    for (const bundle of bundles.values()) {

        if (assetPath.startsWith(bundle.root)) {
            return bundle.name
        }
    }

    return "main"
}


/**
 * 扫描所有资源uuid
 */
function scanAssets()
{

    walk(ASSETS_DIR, (file) =>
    {

        if (!file.endsWith(".meta")) return

        const meta = readJson(file)
        if (!meta || !meta.uuid) return

        const assetPath = file.replace(".meta", "")

        const bundle = resolveBundle(assetPath)

        const info = {
            uuid: meta.uuid,
            path: assetPath,
            bundle: bundle
        }

        uuidAssetMap.set(meta.uuid, info)

        if (!bundleAssets.has(bundle)) {
            bundleAssets.set(bundle, new Set())
        }

        bundleAssets.get(bundle).add(meta.uuid)
    })
}


/**
 * 扫描library依赖
 */
function scanDependencies()
{

    walk(LIBRARY_DIR, (file) =>
    {

        if (!file.endsWith(".json")) return

        const ownerUuid = path.basename(file, ".json")

        const ownerAsset = uuidAssetMap.get(ownerUuid)

        if (!ownerAsset) return

        const text = fs.readFileSync(file, "utf8")

        const matches = text.match(/"__uuid__":\s*"([^"]+)"/g)

        if (!matches) return

        for (const m of matches) {

            const depUuid = m.split('"')[3]

            const depAsset = uuidAssetMap.get(depUuid)

            if (!depAsset) continue

            if (ownerAsset.bundle !== depAsset.bundle) {

                console.log("")
                console.log("FROM bundle:", ownerAsset.bundle)
                console.log(" asset :", ownerAsset.path)
                console.log("TO bundle:", depAsset.bundle)
                console.log(" asset :", depAsset.path)
                console.log("")

                if (!bundleGraph.has(ownerAsset.bundle)) {
                    bundleGraph.set(ownerAsset.bundle, new Set())
                }

                bundleGraph.get(ownerAsset.bundle).add(depAsset.bundle)
            }
        }
    })
}


/**
 * 输出bundle统计
 */
function printBundleStats()
{

    console.log("")
    console.log("Bundle List")

    for (const bundle of bundles.keys()) {
        console.log(" -", bundle)
    }

    console.log("")
    console.log("Bundle Asset Count")

    for (const [bundle, set] of bundleAssets.entries()) {
        console.log(bundle, ":", set.size)
    }


    console.log('base uuid:')
    for (const [bundle, set] of bundleAssets.entries()) {
        if (bundle === 'base-res') {
            console.log(bundle, ":");
            for (const uuid of set) {
                console.log(uuid);
            }
        }

    }
}


/**
 * 输出bundle依赖图
 */
function printBundleGraph()
{

    console.log("")
    console.log("Bundle Dependency Graph")

    for (const [bundle, deps] of bundleGraph.entries()) {

        if (deps.size === 0) continue

        for (const d of deps) {
            console.log(bundle, "->", d)
        }
    }
}


/**
 * 主函数
 */
function main()
{

    console.log("Scanning bundles...")
    scanBundles()

    console.log("Scanning assets...")
    scanAssets()

    printBundleStats()

    console.log("")
    console.log("Scanning dependencies...")
    scanDependencies()

    printBundleGraph()

    console.log("")
    console.log("Scan finished")
}


main()