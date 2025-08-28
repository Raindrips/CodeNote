import React from 'react';

const Sidebar = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'page1', label: '页面 1', description: 'Hello World 页面 1' },
    { id: 'page2', label: '页面 2', description: 'Hello World 页面 2' }
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-sidebar-foreground">导航菜单</h2>
        <p className="text-sm text-sidebar-foreground/70">选择要查看的页面</p>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
              >
                <div className="font-medium">{item.label}</div>
                <div className="text-sm opacity-70">{item.description}</div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-8 p-3 bg-sidebar-accent/30 rounded-lg">
        <p className="text-xs text-sidebar-foreground/60">
          这是一个简单的侧边导航示例，点击上方按钮切换页面。
        </p>
      </div>
    </div>
  );
};

export default Sidebar;

