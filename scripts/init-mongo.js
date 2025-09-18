// MongoDB 初始化脚本
// 这个脚本在 MongoDB 容器首次启动时执行

// 切换到 admin 数据库进行认证
db = db.getSiblingDB('admin');

// 使用 root 用户认证
db.auth('root', 'taskflow123');

// 创建 TaskFlow 数据库
db = db.getSiblingDB('taskflow');

// 创建应用用户
db.createUser({
  user: 'taskflow_user',
  pwd: 'taskflow_password',
  roles: [
    {
      role: 'readWrite',
      db: 'taskflow'
    }
  ]
});

// 创建基础集合和索引
db.createCollection('users');
db.createCollection('tasks');
db.createCollection('projects');

// 为用户集合创建索引
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "name": 1 });
db.users.createIndex({ "createdAt": 1 });

// 为任务集合创建索引
db.tasks.createIndex({ "title": 1 });
db.tasks.createIndex({ "status": 1 });
db.tasks.createIndex({ "priority": 1 });
db.tasks.createIndex({ "assignee": 1 });
db.tasks.createIndex({ "project": 1 });
db.tasks.createIndex({ "createdBy": 1 });
db.tasks.createIndex({ "createdAt": 1 });
db.tasks.createIndex({ "dueDate": 1 });

// 为项目集合创建索引
db.projects.createIndex({ "name": 1 });
db.projects.createIndex({ "status": 1 });
db.projects.createIndex({ "createdBy": 1 });
db.projects.createIndex({ "members": 1 });
db.projects.createIndex({ "createdAt": 1 });

// 创建复合索引
db.tasks.createIndex({ "project": 1, "status": 1 });
db.tasks.createIndex({ "assignee": 1, "status": 1 });
db.tasks.createIndex({ "createdBy": 1, "createdAt": -1 });

print('TaskFlow 数据库初始化完成！');
print('- 数据库名称: taskflow');
print('- 应用用户: taskflow_user');
print('- 集合: users, tasks, projects');
print('- 索引已创建');