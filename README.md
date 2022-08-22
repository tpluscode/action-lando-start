# Set up Lando

This action downloads and installs [Lando](https://lando.dev) in your workflow.

‼️ Right now only workflows running ubuntu containers are supported

## Usage

To use a GitHub action you can just reference it on your Workflow file
(for more info check [this article by Github](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-a-workflow))

```yml
name: 'My Workflow'

on:
  release:
    types: [published]

jobs:
  test:
    steps:
      - uses: tpluscode/action-setup-lando@master
```

### Inputs

As most GitHub actions, this action requires and uses some inputs, that you define in
your workflow file.

The inputs this action uses are:

|     Name      | Required | Default |                                                                                                    Description                                                                                                    |
|:-------------:|:--------:|:-------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   `version`   | `false`  |   N/A   | Lando version to install. When specified, it must match a version number listed on [https://github.com/lando/lando/releases](https://github.com/lando/lando/releases). By default installs latest stable releasee |
| `healthcheck` |  `false`  |   N/A   |                                                                                 Service URL to await before continuing execution                                                                                  |
|   `timeout`   |  `false`  | `10000` |                                                                            Time (in milliseconds) to  wait for `healthcheck` to reply                                                                             |

## Examples

#### Wait for service to be ready

After starting the app, wait 30s for `https://api.my-project.lndo.site`

```yaml
jobs:
  test:
    steps:
      - uses: tpluscode/action-setup-lando@master
        with:
          healthcheck: https://api.my-project.lndo.site
          timeout: 30000 
```

#### Specify lando version

```yaml
jobs:
  test:
    steps:
      - uses: tpluscode/action-setup-lando@master
        with:
          version: v3.4.0
```
