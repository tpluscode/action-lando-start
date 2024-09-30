const core = require('@actions/core')
const { exec, execSync } = require('child_process')
const waitOn = require('wait-on')

async function setup() {
    const healthcheck = core.getInput('healthcheck')
    const timeout = core.getInput('timeout')
    const ignoreErrors = core.getInput('ignore-errors') === 'true'

    await core.group('Starting app', async function () {
        await promisifyExec('lando start', ignoreErrors)
    })

    if (healthcheck) {
        await waitOn({
            resources: [healthcheck],
            timeout: parseInt(timeout, 10),
            log: true
        }).catch(e => {
            console.error(e)
            process.exit(1)
        })
    }
}

function promisifyExec(command, ignoreErrors) {
   return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            core.info(stdout)
            core.info(stderr)

            if (!error || ignoreErrors) {
                resolve()
            } else {
                reject(error)
            }
        })
    })
}

module.exports = setup

if (require.main === module) {
    setup();
}
