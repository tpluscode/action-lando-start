const core = require('@actions/core')
const tc = require('@actions/tool-cache')
const { exec, execSync } = require('child_process')
const waitOn = require('wait-on')
const nodeFetch = require('node-fetch')

async function setup() {
    const version = core.getInput('version')
    const healthcheck = core.getInput('healthcheck')
    const timeout = core.getInput('timeout')

    const landoInstaller = await getDownloadURL(version)
    core.info(`Downloading lando from ${landoInstaller}`)

    const landoInstallerPath = await tc.downloadTool(landoInstaller);

    await core.group('Installing Lando', async function installLando() {
        await promisifyExec( `sudo dpkg -i ${landoInstallerPath}`)
    })
    core.info(`Lando version: ${execSync(`lando version`)}`)
    await core.group('Starting app', async function installLando() {
        await promisifyExec('lando start')
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

function promisifyExec(command) {
   return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            core.info(stdout)
            core.error(stderr)

            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })
}

module.exports = setup

if (require.main === module) {
    setup();
}
