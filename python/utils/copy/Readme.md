# 文件过滤复制程序

## GUI
```sh
python main.py
```

## 控制台

入口：main.py 使用 argparse 支持参数：--mode {console,gui}（默认 gui）--src
/ --dst / --include / --exclude / --overwrite

```sh
python main.py --mode console --src 源目录 --dst 目标目录 --overwrite always（include/exclude 可选）
```

## 过滤规则

- 使用 **glob 通配符**（`fnmatch` 或 `pathlib`）：
    - 例：`"*.py"`, `"logs/**"`, `"data/**/*.csv"`。
  - 匹配对象：
    - 文件名：如 `file.txt`
    - 相对路径：如 `subdir/file.txt`
  - 判定流程：
    - 若 `include_patterns` 非空：文件必须命中其中至少一个模式才“有资格被复制”。
    - 然后应用 `exclude_patterns`：命中任一黑名单模式则最终 **不复制**。
    - 即：**黑名单优先级高于白名单**。
  - 若白名单和黑名单都为空：默认复制所有文件。
