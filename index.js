#!/usr/bin/env node

const yargs = require('yargs');
const chalk = require('chalk');

const fs = require('fs');

const pkg = require('./package.json');

const codeMap = {
  '1': {
    title: '消息',
    path: '1xx'
  },
  '2': {
    title: '成功',
    path: '2xx'
  },
  '3': {
    title: '重定向',
    path: '2xx'
  },
  '4': {
    title: '请求错误',
    path: '4xx'
  },
  '5': {
    title: '服务器错误',
    path: '5xx'
  }
};
const { log } = console;

yargs
  .version(`命令行工具【hc】: v${pkg.version}`)
  .usage('用法：hc show <code>')
  .command({
    command: 'show <code>',
    aliases: ['s'],
    desc: '显示状态码详情',
    handler: argv => {
      const { code } = argv;
      if (isNaN(+code)) {
        log(chalk.red('Error: 状态码必须是数字，例：200'));
      } else {
        const startChar = ('' + code).charAt(0);
        const codeObj = codeMap[startChar];
        if (!codeObj) {
          log(chalk.keyword('orange')('Warning: 你输入的状态码不存在'));
        } else {
          const path = `./codes/${codeObj.path}/${code}.json`;
          if (fs.existsSync(path)) {
            const jsonString = fs.readFileSync(path).toString('utf-8');
            const json = JSON.parse(jsonString || '{}');
            log(chalk.green('Done: 查询成功↓↓↓'));
            log(`${codeObj.title}【${chalk.bold.green(code)}】`);
            log(json.detail || '');
          } else {
            log(chalk.keyword('orange')('Warning: 你输入的状态码不存在'));
          }
        }
      }
    }
  })
  .example('hc show 200')
  .help()
  .argv;

yargs.parse();
