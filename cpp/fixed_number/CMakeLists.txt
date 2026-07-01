cmake_minimum_required(VERSION 3.20)
project(MyProject LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# ── 源文件收集 ──────────────────────────────────────
file(GLOB_RECURSE PRIVATE_SOURCES
    "${CMAKE_SOURCE_DIR}/private/*.cpp"
)

set(ALL_SOURCES
    ${CMAKE_SOURCE_DIR}/main.cpp
    ${PRIVATE_SOURCES}
)

# ── 可执行目标 ──────────────────────────────────────
add_executable(${PROJECT_NAME} ${ALL_SOURCES})

# ── 头文件路径 ──────────────────────────────────────
file(GLOB_RECURSE ALL_HEADERS
    "${CMAKE_SOURCE_DIR}/public/*.h"
    "${CMAKE_SOURCE_DIR}/private/*.h"
)
target_sources(${PROJECT_NAME} PRIVATE ${ALL_HEADERS})

#   public/  → 对外暴露的头文件（外部可 #include）
#   private/ → 仅内部使用的头文件
target_include_directories(${PROJECT_NAME}
    PUBLIC
        "${CMAKE_SOURCE_DIR}/public"
    PRIVATE
        "${CMAKE_SOURCE_DIR}/private"
)