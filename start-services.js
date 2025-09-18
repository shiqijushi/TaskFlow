#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 正在启动 TaskFlow 服务...\n');

// 启动后端服务
const backendProcess = spawn('node', ['-r', 'tsx/cjs', 'src/index.ts'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

backendProcess.on('error', (error) => {
  console.error('❌ 后端启动失败:', error);
});

// 等待后端启动后再启动前端
setTimeout(() => {
  console.log('\n📱 正在启动前端服务...\n');
  
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true
  });

  frontendProcess.on('error', (error) => {
    console.error('❌ 前端启动失败:', error);
  });
}, 3000);

// 处理退出信号
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务...');
  backendProcess.kill();
  process.exit(0);
});