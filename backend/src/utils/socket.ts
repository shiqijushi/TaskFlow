// WebSocket 设置
export const setupSocketIO = (io: any) => {
  // 连接处理
  io.on('connection', (socket: any) => {
    console.log(`用户 ${socket.id} 已连接`);

    // 用户加入房间（基于用户ID或项目ID）
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      console.log(`用户 ${socket.id} 加入房间 ${roomId}`);
    });

    // 离开房间
    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`用户 ${socket.id} 离开房间 ${roomId}`);
    });

    // 任务更新事件
    socket.on('task-updated', (data: any) => {
      // 广播任务更新到项目房间
      socket.to(data.projectId).emit('task-updated', data);
    });

    // 时间追踪事件
    socket.on('time-tracking-start', (data: any) => {
      socket.to(data.projectId).emit('time-tracking-started', {
        userId: data.userId,
        taskId: data.taskId,
        startTime: new Date().toISOString(),
      });
    });

    socket.on('time-tracking-stop', (data: any) => {
      socket.to(data.projectId).emit('time-tracking-stopped', {
        userId: data.userId,
        taskId: data.taskId,
        endTime: new Date().toISOString(),
      });
    });

    // 通知事件
    socket.on('send-notification', (data: any) => {
      // 发送给特定用户
      socket.to(`user-${data.userId}`).emit('notification', data);
    });

    // 断开连接
    socket.on('disconnect', () => {
      console.log(`用户 ${socket.id} 已断开连接`);
    });
  });

  // 全局广播函数
  const broadcast = {
    taskCreated: (task: any) => {
      io.to(task.projectId).emit('task-created', task);
    },
    
    taskUpdated: (task: any) => {
      io.to(task.projectId).emit('task-updated', task);
    },
    
    taskDeleted: (taskId: string, projectId: string) => {
      io.to(projectId).emit('task-deleted', { taskId, projectId });
    },
    
    projectUpdated: (project: any) => {
      io.to(project.id).emit('project-updated', project);
    },
    
    notificationSent: (notification: any) => {
      io.to(`user-${notification.userId}`).emit('notification', notification);
    },
  };

  return { io, broadcast };
};
