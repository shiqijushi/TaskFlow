/**
 * TaskFlow 通用JavaScript工具库
 * 包含所有原型页面共享的功能和配置
 */

// 全局配置
window.TaskFlowConfig = {
  // 应用名称
  appName: 'TaskFlow',
  
  // API基础URL（原型中暂未使用）
  apiBaseUrl: '/api',
  
  // 默认页面过渡时间
  transitionDuration: 300,
  
  // 常用颜色
  colors: {
    primary: '#165DFF',
    success: '#00B42A',
    warning: '#FF7D00',
    danger: '#F53F3F',
    dark: '#1D2129',
    'gray-600': '#4E5969',
    'gray-400': '#86909C',
    'gray-100': '#F2F3F5',
  }
};

// Tailwind CSS 配置
window.initTailwindConfig = function() {
  if (!window.tailwindConfigured) {
    tailwind.config = {
      theme: {
        extend: {
          colors: window.TaskFlowConfig.colors,
          fontFamily: {
            inter: ['Inter', 'system-ui', 'sans-serif'],
          },
        },
      }
    };
    window.tailwindConfigured = true;
  }
};

// 通用工具函数
window.TaskFlowUtils = {
  
  /**
   * 页面导航功能
   * @param {string} page - 目标页面名称
   */
  navigateTo: function(page) {
    const pageMap = {
      'dashboard': 'dashboard.html',
      'tasks': 'tasks.html',
      'time-tracking': 'time_tracking.html',
      'reports': 'reports.html',
      'calendar': 'calendar.html',
      'settings': 'settings.html',
      'help-support': 'help_support.html',
      'login': 'login.html'
    };
    
    if (pageMap[page]) {
      window.location.href = pageMap[page];
    }
  },

  /**
   * 显示通知消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型 (success, warning, danger, info)
   * @param {number} duration - 显示时长(毫秒)
   */
  showNotification: function(message, type = 'info', duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg transform transition-all duration-300 translate-x-full`;
    
    // 设置颜色主题
    const themes = {
      success: 'bg-success text-white',
      warning: 'bg-warning text-white',
      danger: 'bg-danger text-white',
      info: 'bg-primary text-white'
    };
    
    notification.className += ` ${themes[type] || themes.info}`;
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">
          <i class="fa fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, duration);
  },

  /**
   * 格式化日期
   * @param {Date|string} date - 日期对象或字符串
   * @param {string} format - 格式类型 (date, datetime, time)
   */
  formatDate: function(date, format = 'date') {
    const d = new Date(date);
    
    const formats = {
      date: d.toLocaleDateString('zh-CN'),
      datetime: d.toLocaleString('zh-CN'),
      time: d.toLocaleTimeString('zh-CN'),
      iso: d.toISOString().split('T')[0]
    };
    
    return formats[format] || formats.date;
  },

  /**
   * 深拷贝对象
   * @param {any} obj - 要拷贝的对象
   */
  deepClone: function(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const copy = {};
      Object.keys(obj).forEach(key => {
        copy[key] = this.deepClone(obj[key]);
      });
      return copy;
    }
  },

  /**
   * 防抖函数
   * @param {Function} func - 要防抖的函数
   * @param {number} wait - 等待时间
   */
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} limit - 时间限制
   */
  throttle: function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// 侧边栏通用功能
window.SidebarManager = {
  
  /**
   * 初始化侧边栏
   * @param {string} activePage - 当前活跃页面
   */
  init: function(activePage) {
    this.setActivePage(activePage);
    this.bindEvents();
  },

  /**
   * 设置活跃页面
   * @param {string} activePage - 活跃页面名称
   */
  setActivePage: function(activePage) {
    // 移除所有活跃状态
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // 根据页面名称设置活跃状态
    const pageSelectors = {
      'dashboard': 'i[class*="dashboard"]',
      'tasks': 'i[class*="tasks"]', 
      'time-tracking': 'i[class*="clock"]',
      'reports': 'i[class*="bar-chart"]',
      'calendar': 'i[class*="calendar"]',
      'settings': 'i[class*="cog"]'
    };
    
    if (pageSelectors[activePage]) {
      const activeItem = document.querySelector(`.sidebar-item ${pageSelectors[activePage]}`);
      if (activeItem) {
        activeItem.closest('.sidebar-item').classList.add('active');
      }
    }
  },

  /**
   * 绑定侧边栏事件
   */
  bindEvents: function() {
    // 为所有侧边栏项绑定点击事件
    document.querySelectorAll('.sidebar-item[onclick]').forEach(item => {
      // 已经有onclick属性的保持不变
    });
  }
};

// 初始化函数
window.initTaskFlow = function() {
  // 初始化Tailwind配置
  window.initTailwindConfig();
  
  // 初始化全局样式
  const style = document.createElement('style');
  style.textContent = `
    /* 通用过渡效果 */
    * {
      transition-property: color, background-color, border-color, box-shadow, transform;
      transition-duration: 150ms;
      transition-timing-function: ease-in-out;
    }
    
    /* 平滑滚动 */
    html {
      scroll-behavior: smooth;
    }
    
    /* 通用hover效果 */
    .hover-lift:hover {
      transform: translateY(-2px);
    }
    
    /* 自定义滚动条 */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `;
  document.head.appendChild(style);
};

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
  window.initTaskFlow();
});