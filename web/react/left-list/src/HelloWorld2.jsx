import React from 'react';

const HelloWorld2 = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-primary mb-6">Hello World - 页面 2</h1>
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-4">欢迎来到第二个页面</h2>
        <p className="text-muted-foreground mb-4">
          这是第二个Hello World页面示例。每个页面都有不同的内容和布局。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary p-4 rounded-md">
            <h3 className="font-semibold text-secondary-foreground mb-2">特性 1</h3>
            <p className="text-secondary-foreground">这里展示了响应式网格布局的使用。</p>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-semibold text-muted-foreground mb-2">特性 2</h3>
            <p className="text-muted-foreground">这里展示了不同的颜色主题变量。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelloWorld2;

