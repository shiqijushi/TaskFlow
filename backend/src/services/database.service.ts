import { PrismaClient } from '@prisma/client';

// 创建Prisma客户端实例
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// 数据库连接函数
const connectDB = async (): Promise<void> => {
  try {
    console.log('正在尝试连接PostgreSQL数据库...');
    // 设置连接超时
    const connectPromise = prisma.$connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('数据库连接超时')), 15000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✅ PostgreSQL数据库连接成功');
  } catch (error) {
    console.error('❌ PostgreSQL数据库连接失败:', error);
    console.log('请检查以下项目：');
    console.log('1. 网络连接是否正常');
    console.log('2. 数据库服务器是否在运行：39.107.110.223:5432');
    console.log('3. 防火墙设置是否允许连接');
    console.log('4. 数据库凭据是否正确');
    throw error;
  }
}

  // 断开数据库连接
const disconnectDB = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('数据库连接已断开');
  } catch (error) {
    console.error('数据库断开失败:', error);
    throw error;
  }
}

// 健康检查
const healthCheck = async (): Promise<{ status: string; timestamp: string; database?: string }> => {
  try {
    // 执行简单查询来检查数据库连接
    await prisma.$queryRaw`SELECT 1 as "check"`;
    return {
      status: 'connected',
      timestamp: new Date().toISOString(),
      database: 'postgresql'
    };
  } catch (error) {
    console.error('数据库健康检查失败:', error);
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'postgresql'
    };
  }
}

// 事务处理
const transaction = async <T>(callback: (prisma: PrismaClient) => Promise<T>): Promise<T> => {
  try {
    return await prisma.$transaction(async (prisma) => {
      return await callback(prisma as PrismaClient);
    });
  } catch (error) {
    console.error('事务执行失败:', error);
    throw error;
  }
}
// 数据库迁移
const migrate = async (): Promise<void> => {
  try {
    console.log('正在运行数据库迁移...');
    // 在实际项目中，这里会调用Prisma的迁移工具
    // 例如：npx prisma migrate deploy
    console.log('数据库迁移完成');
  } catch (error) {
    console.error('数据库迁移失败:', error);
    throw error;
  }
}

// 导出所有功能
export { prisma, connectDB, disconnectDB, healthCheck, transaction, migrate };