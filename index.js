const core = require('@actions/core')
const tc = require('@actions/tool-cache')
const cp = require('child_process')
const waitOn = require('wait-on')

async function setup() {
    const version = core.getInput('version')
    const healthcheck = core.getInput('healthcheck')
    const timeout = core.getInput('timeout')

    const landoInstaller = await getDownloadURL(version)
    core.info(`Downloading lando from ${landoInstaller}`)

    const landoInstallerPath = await tc.downloadTool(landoInstaller);

    cp.exec(`sudo dpkg -i ${landoInstallerPath}`, (err, stdout) => {
        core.debug(stdout)
    })
    cp.exec(`lando version`, (err, stdout) => {
        core.info(stdout)
    })
    cp.exec('lando start', (err, stdout) => {
        core.info(stdout)
    })

    if (healthcheck) {
        await waitOn({
            resources: [healthcheck],
            timeout: parseInt(timeout, 10)
        }).catch(e => {
            console.error(e)
            process.exit(1)
        })
    }
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

if (require.main === module) {
    setup();
}
