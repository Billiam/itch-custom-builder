#!/usr/bin/env node

const URL = require("url").URL;
const fs = require('fs')
const chalk = require('chalk')

const sywac = require('sywac')
const install = require('./lib/install')
const template = require('./lib/template')

const cli = sywac.command('setup', {
  desc: 'Install config files, create templates from an Itch.io project, profile, or jam URL',
  setup: sywac => {
    sywac.positional('<url>', { paramsDesc: 'Project, profile, or jam URL' })
      .check((argv, ctx) => {
        if (argv.url) {
          try {
            const url = new URL(argv.url)
            if (! (/(^|\.)itch\.io$/.test(url.host) && ['https:', 'http:'].includes(url.protocol))) {
              ctx.cliMessage(chalk`{red ${argv.url} is not a valid itch.io url}`)
            }
          } catch(err) {
            ctx.cliMessage(chalk`{red ${argv.url} is not a valid url}`)
          }
        }
      })
  },
  run (argv, context) {
    install()
    template(argv.url)
  }
}).command('serve', {
  desc: 'Run local development server',
  setup: sywac => {
    sywac.number(chalk`{green -p, --port} {blue <number>}`, { desc: 'Development server port', defaultValue: 1234 })
  },
  run (argv, context) {
    console.log('got serve', argv)
    console.log(context)
  }
}).command('build', {
  desc: 'Compile custom html and scss',
  run (argv, context) {
    console.log('got build', argv)
  }
}).help('-h, --help')
  .style({
    flags: s => chalk.green(s),
    desc: s => chalk.white(s),
    hints: s => chalk.dim(s)
  })
  .version('-v, --version')
  .showHelpByDefault()
  .outputSettings({ maxWidth: 75 })

module.exports = cli

async function main () {
  cli.parseAndExit()
}

if (require.main === module) main()
//
// const options = yargs(hideBin(process.argv))
//   .updateStrings({
//     'Positionals:': chalk.blue('Positionals:'),
//     'Options:': chalk.blue('Options:'),
//     'Examples:': chalk.blue('Examples:')
//   })
//   .usage('Usage: $0 <command> [options]')
//   .help('h')
//   .alias('h', 'help')
//   .command('setup <url>', 'Install config files, create templates from project, profile, or jam URL', function(yargs) {
//     return yargs.example('$0 setup https://yourname.itch.io/project-name')
//       .positional('url', {
//         describe: 'URL to fetch template and content from',
//         type: 'string'
//       }).wrap(null)
//       .argv
//   }, function (installArgs) {
//   })
//   .command('template', 'Fetch template from your itch page', function (yargs) {
//     return yargs.example('$0 template -t game -u https://yourname.itch.io/project-name')
//       .alias('t', 'type')
//       .alias('u', 'url')
//       .describe('t', 'Type of page being fetched (one of: [game, gamejam, profile])')
//       .describe('u', 'URL of page to fetch')
//       .wrap(null)
//       .argv
//   }, function(template_args) {
//
//   }).argv
