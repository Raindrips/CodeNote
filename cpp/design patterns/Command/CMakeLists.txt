
cmake_minimum_required (VERSION 3.8)

## 添加文件
aux_source_directory("./" DIR_SRCS)

# 将源代码添加到此项目的可执行文件。
add_executable (Main ${DIR_SRCS})
