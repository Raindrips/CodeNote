# CMakeList.txt: 顶层 CMake 项目文件，在此处执行全局配置
# 并包含子项目。
#
cmake_minimum_required (VERSION 3.8)

project ("design patterns")

# 包含子项目。
#add_subdirectory ("Delegator")
#add_subdirectory("observer")
#add_subdirectory("Singleton")
#add_subdirectory("Decorator")

add_subdirectory("Command")
