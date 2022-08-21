const core = require('@actions/core')
const tc = require('@actions/tool-cache')
const cp = require('child_process')

async function setup() {
    // Get version of tool to be installed
    const version = core.getInput('version');

    // Download the specific version of the tool, e.g. as a tarball
    const landoInstaller = await tc.downloadTool(await getDownloadURL(version));

    cp.exec(`sudo dpkg -i ${landoInstaller}`)
}

async function getDownloadURL(version) {
    if (version) {
        return `https://github.com/lando/lando/releases/download/${version}/lando-x64-${version}.deb`
    }

    const res = await fetch('https://api.github.com/repos/lando/lando/releases/latest')
    const releases = await res.json()

    return releases.assets.find(asset => asset.name.endsWith('.deb')).browser_download_url
}

module.exports = setup
