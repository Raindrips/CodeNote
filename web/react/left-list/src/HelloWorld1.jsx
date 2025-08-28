import React from 'react';

const HelloWorld1 = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-primary mb-6">Hello World - 页面 1</h1>
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-4">欢迎来到第一个页面</h2>
        <p className="text-muted-foreground mb-4">
          这是一个简单的Hello World页面示例。这里可以放置任何你想要的内容。
        </p>
        <div className="bg-accent p-4 rounded-md">
          <p className="text-accent-foreground">
            这是一个带有强调色背景的内容区域，展示了Tailwind CSS的样式功能。
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelloWorld1;

