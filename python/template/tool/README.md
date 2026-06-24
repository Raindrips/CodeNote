# 🛠 Python 工具集框架 (PyToolkit)

一个**插件化、可扩展**的 Python 工具集框架，支持 CLI 和 GUI 双入口，
整合已有命令行工具无需修改原始代码。

---

##  目录结构

```
pytoolkit/
├── toolkit.py              ← 统一启动入口
│
├── core/
│   ├── __init__.py
│   └── base.py             ← BaseTool 基类 + ToolRegistry 注册中心
│
├── tools/                  ← 工具插件目录（每个 tool_*.py 是一个插件）
│   ├── __init__.py
│   ├── tool_TEMPLATE.py    ← 新工具模板（复制此文件开始开发）
│   ├── tool_word_count.py  ← 示例：文本统计
│   ├── tool_json_fmt.py    ← 示例：JSON 格式化（包装已有函数）
│   └── tool_sys_info.py    ← 示例：系统信息（调用子进程）
│
├── cli/
│   ├── __init__.py
│   └── main.py             ← CLI 入口
│
└── gui/
    ├── __init__.py
    └── app.py              ← Tkinter GUI 入口
```

---

##  快速开始

### 命令行模式

```bash
# 列出所有工具
python toolkit.py list

# 查看工具详情
python toolkit.py info word_count

# 运行工具
python toolkit.py word_count --text "Hello World 你好"
python toolkit.py word_count --file README.md --format table

python toolkit.py json_fmt --text '{"key":"value"}' --indent 4
python toolkit.py json_fmt --file data.json --sort-keys

python toolkit.py sys_info --mode python
python toolkit.py sys_info --mode pip
python toolkit.py sys_info --mode custom --cmd "ls -la"
```

### GUI 模式

```bash
# 启动 GUI（无参数时自动进入 GUI）
python toolkit.py

# 或显式指定
python toolkit.py --gui
```

---

##  添加新工具（3 步）

**第 1 步**：复制模板

```bash
cp tools/tool_TEMPLATE.py tools/tool_my_new_tool.py
```

**第 2 步**：编辑新文件，填写 TODO

```python
# tools/tool_my_new_tool.py
from core.base import BaseTool, ToolMeta, registry

@registry.register
class MyNewTool(BaseTool):

    @classmethod
    def meta(cls) -> ToolMeta:
        return ToolMeta(
            name="my_new_tool",       # CLI 子命令名
            title="我的新工具",
            description="工具描述",
        )

    def build_parser(self, parser):
        parser.add_argument("--input", help="输入参数")

    def run(self, args, output_callback=None):
        self.emit(f"处理: {args.input}", output_callback)
        return 0  # 0=成功
```

**第 3 步**：完成！框架自动发现并注册，CLI/GUI 立即可用。

---

##  整合已有工具（两种方式）

### 方式 A：导入已有函数（推荐）

```python
def run(self, args, output_callback=None):
    from my_existing_script import process_data   # 原始代码不动
    result = process_data(args.input)
    self.emit(result, output_callback)
    return 0
```

### 方式 B：子进程调用外部命令

```python
def run(self, args, output_callback=None):
    import subprocess
    ret = subprocess.run(
        ["python", "old_tool.py", "--arg", args.input],
        capture_output=True, text=True, timeout=60,
    )
    self.emit(ret.stdout, output_callback)
    return ret.returncode
```

---

## 架构设计

```
┌──────────┐     ┌──────────┐
│  CLI     │     │  GUI     │    ← 双入口，共享同一套工具
└────┬─────┘     └────┬─────┘
     │                │
     └───────┬────────┘
             ▼
      ToolRegistry          ← 单例注册中心，管理所有工具
             │
    ┌────────┴────────┐
    ▼        ▼        ▼
 tool_A   tool_B   tool_C   ← 每个插件继承 BaseTool
    │        │        │
    └─ 可调用已有脚本/函数/命令 ─┘
```

### 核心接口说明

| 方法 | 说明 |
|------|------|
| `meta()` | 返回工具元信息（名称、标题、版本等） |
| `build_parser(parser)` | 向 ArgumentParser 添加参数定义 |
| `run(args, output_callback)` | 执行工具，通过回调路由输出 |
| `self.emit(text, cb)` | 统一输出（CLI → print，GUI → 文本框） |

### output_callback 机制

`run()` 接收一个可选的 `output_callback`，这是框架的核心设计：

- **CLI**：传入 `None` → `emit()` 直接 `print()`
- **GUI**：传入 Tkinter 文本框追加函数 → 输出显示在界面上
- **测试**：传入列表的 `append` → 捕获输出进行断言

```python
# 测试示例
output = []
tool = WordCountTool()
code = tool.run(args, output_callback=output.append)
assert code == 0
assert "行数" in "\n".join(output)
```

---

## 依赖

- Python 3.10+
- 标准库（tkinter、argparse、subprocess 等），**无需第三方依赖**
