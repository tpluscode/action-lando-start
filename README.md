# Start Lando

This action starts [Lando](https://lando.dev) in your workflow.

## Usage

To use a GitHub action you can just reference it on your Workflow file
(for more info check [this article by Github](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-a-workflow))

```yml
name: 'My Workflow'

on:
  release:
    types: [ published ]

jobs:
  test:
    steps:
      - name: Setup Lando
        uses: lando/setup-lando@v3
        with:
          lando-version: 3.21.2
      - uses: tpluscode/action-lando-start@v0.2.1
```

### Inputs

As most GitHub actions, this action requires and uses some inputs that you define in
your workflow file.

The inputs this action uses are:

|     Name      | Required | Default |                        Description                         |
|:-------------:|:--------:|:-------:|:----------------------------------------------------------:|
| `healthcheck` | `false`  |   N/A   |      Service URL to await before continuing execution      |
|   `timeout`   | `false`  | `10000` | Time (in milliseconds) to  wait for `healthcheck` to reply |
| `ignore-errors`| `false` | `false` |       Continue execution even if `lando start` fails       |

## Examples

#### Wait for service to be ready

After starting the app, wait 30s for `https://api.my-project.lndo.site`

```yaml
jobs:
  test:
    steps:
      - name: setup-docker
        uses: docker-practice/actions-setup-docker@1.0.4
      - uses: tpluscode/action-lando-start@v0.2.1
        with:
          healthcheck: https://api.my-project.lndo.site
          timeout: 30000 
```
