const core = require('@actions/core')
const tc = require('@actions/tool-cache')
const cp = require('child_process')
const waitOn = require('wait-on')
const { promisify } = require('util')
const nodeFetch = require('node-fetch')

const exec = promisify(cp.exec)

async function setup() {
    const version = core.getInput('version')
    const healthcheck = core.getInput('healthcheck')
    const timeout = core.getInput('timeout')

    const landoInstaller = await getDownloadURL(version)
    core.info(`Downloading lando from ${landoInstaller}`)

    const landoInstallerPath = await tc.downloadTool(landoInstaller);

    await core.group('Installing Lando', async function installLando() {
        core.info(await exec(`sudo dpkg -i ${landoInstallerPath}`))
    })
    core.info(`Lando version: ${cp.execSync(`lando version`)}`)
    await core.group('Starting app', async function installLando() {
        core.info(await exec('lando start'))
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
    let arch = 'x64-'
    if (version < 'v3.3.0') {
        arch = ''
    }

    if (version) {
        return `https://github.com/lando/lando/releases/download/${version}/lando-${arch}${version}.deb`
    }

    const res = await nodeFetch.default('https://api.github.com/repos/lando/lando/releases/latest')
    const releases = await res.json()

    return releases.assets.find(asset => asset.name.endsWith('.deb')).browser_download_url
}

module.exports = setup

if (require.main === module) {
    setup();
}
