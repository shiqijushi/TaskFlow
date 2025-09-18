/**
 * TaskFlow 资源管理器
 * 用于优化资源加载和性能
 */

window.ResourceManager = {
  
  // 资源缓存
  cache: new Map(),
  
  // 预加载资源
  preloadResources: function() {
    const resources = [
      'https://cdn.tailwindcss.com',
      'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css',
      'https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js'
    ];
    
    resources.forEach(url => {
      this.preloadResource(url);
    });
  },
  
  // 预加载单个资源
  preloadResource: function(url) {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }
    
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      
      if (url.includes('.css')) {
        link.as = 'style';
      } else if (url.includes('.js')) {
        link.as = 'script';
      }
      
      link.onload = () => {
        this.cache.set(url, true);
        resolve(true);
      };
      
      link.onerror = () => {
        console.warn(`预加载资源失败: ${url}`);
        reject(false);
      };
      
      document.head.appendChild(link);
    });
  },
  
  // 懒加载图片
  lazyLoadImages: function() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // 降级处理：直接加载所有图片
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  },
  
  // 优化字体加载
  optimizeFonts: function() {
    // 预加载关键字体
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.onload = function() { this.rel = 'stylesheet'; };
    document.head.appendChild(fontLink);
  },
  
  // 压缩和缓存数据
  compressData: function(data) {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error('数据压缩失败:', error);
      return data;
    }
  },
  
  // 缓存管理
  setCache: function(key, value, expiration = 3600000) { // 默认1小时过期
    const item = {
      value: value,
      timestamp: Date.now(),
      expiration: expiration
    };
    
    try {
      localStorage.setItem(`taskflow_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('缓存设置失败:', error);
    }
  },
  
  getCache: function(key) {
    try {
      const item = localStorage.getItem(`taskflow_${key}`);
      if (!item) return null;
      
      const data = JSON.parse(item);
      const now = Date.now();
      
      if (now - data.timestamp > data.expiration) {
        localStorage.removeItem(`taskflow_${key}`);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.warn('缓存获取失败:', error);
      return null;
    }
  },
  
  // 清理过期缓存
  cleanExpiredCache: function() {
    const now = Date.now();
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('taskflow_')) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (now - item.timestamp > item.expiration) {
            keysToRemove.push(key);
          }
        } catch (error) {
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },
  
  // 资源监控
  monitorPerformance: function() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          
          console.log('页面加载性能统计:');
          console.log(`- DNS查询: ${perfData.domainLookupEnd - perfData.domainLookupStart}ms`);
          console.log(`- TCP连接: ${perfData.connectEnd - perfData.connectStart}ms`);
          console.log(`- 请求响应: ${perfData.responseEnd - perfData.requestStart}ms`);
          console.log(`- DOM解析: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
          console.log(`- 资源加载: ${loadTime}ms`);
          
          // 发送性能数据到分析服务（原型中仅记录）
          this.setCache('performance_data', {
            loadTime: loadTime,
            timestamp: Date.now()
          });
        }, 0);
      });
    }
  },
  
  // 初始化性能优化
  init: function() {
    // 预加载关键资源
    this.preloadResources();
    
    // 优化字体加载
    this.optimizeFonts();
    
    // 清理过期缓存
    this.cleanExpiredCache();
    
    // 监控性能
    this.monitorPerformance();
    
    // 页面加载完成后执行
    document.addEventListener('DOMContentLoaded', () => {
      // 懒加载图片
      this.lazyLoadImages();
      
      // 为外部链接添加预加载
      document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('mouseenter', () => {
          this.preloadResource(link.href);
        });
      });
    });
  }
};

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ResourceManager.init();
  });
} else {
  window.ResourceManager.init();
}