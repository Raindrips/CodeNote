

## 库的创建流程



1. 创建静态库

2. 项目-> 右键 -> 项目依赖项   ☑️勾选要导入的包

3. c/c++ -> 常规 -> 附加包含目录   (一定要注意全局,不能只是Release或Debug)

   ```
   $(SolutionDir)你的库
   $(SolutionDir)Core  (示例)
   ```

4. 项目 ->展开 -> 引用   选择导入的库
   - 另一种方法 链接器 → 输入 → 附加依赖项 添加`Core.lib`(不推荐)



## 全局设置

配置属性 → 常规 → 输出目录   

```
所有 lib 输出到统一目录
$(SolutionDir)Build\Lib\
中间文件统一
$(SolutionDir)Build\Obj\$(ProjectName)\
```