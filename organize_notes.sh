#!/bin/bash
set -e

cd 'D:\bak\note' || exit 1

echo "=========================================="
echo "  笔记整理脚本"
echo "=========================================="

# ==========================================
# 第一步：清理无用文件
# ==========================================
echo ""
echo ">>> 第一步：清理无用文件"

# 删除 draw-note（只有 .git）
echo "  删除 draw-note..."
rm -rf draw-note

# 删除 my-note 中的 .obsidian
echo "  删除 my-note/.obsidian..."
rm -rf 'my-note/.obsidian'

# MyNote 清理
echo "  清理 MyNote 无用文件..."
find 'MyNote' -name '.DS_Store' -type f -delete 2>/dev/null
find 'MyNote' -type f \( -name '*.o' -o -name '*.dll' -o -name '*.so' -o -name '*.exe' -o -name '*.lib' \) -delete 2>/dev/null
find 'MyNote' -type f \( -name '*.IAB' -o -name '*.IAD' -o -name '*.IMB' -o -name '*.IMD' -o -name '*.PFI' -o -name '*.PO' -o -name '*.PR' -o -name '*.PRI' -o -name '*.PS' -o -name '*.WK3' -o -name '*.SearchResults' -o -name '*.sisc' -o -name '*.sip_sym' -o -name '*.sip_xab' -o -name '*.sip_xad' -o -name '*.sip_xc' -o -name '*.sip_xf' -o -name '*.sip_xm' -o -name '*.sip_xr' -o -name '*.sip_xsb' -o -name '*.sip_xsd' -o -name '*.siproj' -o -name '*.siproj_settings.xml' -o -name '*.siwork' -o -name '*.snippets.xml' -o -name '*.bookmarks.xml' \) -delete 2>/dev/null
find 'MyNote' -type d \( -name 'Backup' -o -name '.si4project' -o -name 'si' -o -name 'cache' -o -name 'parse' \) -exec rm -rf {} + 2>/dev/null
find 'MyNote' -path '*淘宝网*' -exec rm -rf {} + 2>/dev/null
find 'MyNote' -path '*/pppoe_client_mod/*' -exec rm -rf {} + 2>/dev/null
find 'MyNote' -type f \( -name '*.ppt' -o -name '*.pptx' -o -name '.gdb_history' -o -name '*.vcxproj.user' -o -name '*.vcxproj.filters' -o -name '*.vcxproj' -o -name '*.sln' \) -delete 2>/dev/null

# my-note 清理
echo "  清理 my-note 无用文件..."
find 'my-note' -name '.DS_Store' -type f -delete 2>/dev/null
find 'my-note' -type f \( -name '*.o' -o -name '*.dll' -o -name '*.so' -o -name '*.exe' -o -name '*.lib' -o -name '*.vcxproj.user' -o -name '*.vcxproj.filters' \) -delete 2>/dev/null

echo "  清理完成"

# ==========================================
# 第二步：创建目标目录
# ==========================================
echo ""
echo ">>> 第二步：创建 note/ 和 code/"

rm -rf note code 2>/dev/null
mkdir -p note code

# ==========================================
# 第三步：以 my-note 为主体，构建 note/
# ==========================================
echo ""
echo ">>> 第三步：迁移 my-note → note/"

for dir in code framework game other tools; do
    if [ -d "my-note/$dir" ]; then
        echo "  复制 my-note/$dir → note/$dir"
        cp -r "my-note/$dir" "note/"
    fi
done

if [ -f 'my-note/README.md' ]; then
    cp 'my-note/README.md' 'note/'
fi
echo "  迁移完成"

# ==========================================
# 第四步：合并 MyNote 独有内容（-n 不覆盖已有文件）
# ==========================================
echo ""
echo ">>> 第四步：合并 MyNote 独有内容 → note/"

# 编程语言 → note/code/
for dir in C# cpp java javascript lua mysql python rust ts; do
    if [ -d "MyNote/$dir" ]; then
        echo "  合并 MyNote/$dir → note/code/$dir"
        cp -rn "MyNote/$dir" "note/code/" 2>/dev/null || true
    fi
done

# 框架类 → note/framework/
for dir in Android web wechart; do
    if [ -d "MyNote/$dir" ]; then
        echo "  合并 MyNote/$dir → note/framework/$dir"
        cp -rn "MyNote/$dir" "note/framework/" 2>/dev/null || true
    fi
done

# 工具类 → note/tools/
for dir in excel Git md; do
    if [ -d "MyNote/$dir" ]; then
        echo "  合并 MyNote/$dir → note/tools/$dir"
        cp -rn "MyNote/$dir" "note/tools/" 2>/dev/null || true
    fi
done

# 命令行 → note/tools/
if [ -d 'MyNote/cmd' ]; then
    echo "  合并 MyNote/cmd → note/tools/cmd"
    cp -rn 'MyNote/cmd' 'note/tools/' 2>/dev/null || true
fi

# 产品经理 → note/other/
if [ -d 'MyNote/产品经理' ]; then
    echo "  合并 MyNote/产品经理 → note/other/产品经理"
    cp -rn 'MyNote/产品经理' 'note/other/' 2>/dev/null || true
fi

# 设计模式.md
if [ -f 'MyNote/设计模式.md' ]; then
    cp -n 'MyNote/设计模式.md' 'note/code/' 2>/dev/null || true
fi
if [ -f 'MyNote/README.md' ]; then
    cp -n 'MyNote/README.md' 'note/' 2>/dev/null || true
fi

echo "  合并完成"

# ==========================================
# 第五步：从 note/ 提取源代码到 code/
#   (保持原有目录结构)
# ==========================================
echo ""
echo ">>> 第五步：提取源代码到 code/"

SRC_COUNT=0
find note -type f \( \
    -name '*.c' -o -name '*.cpp' -o -name '*.h' -o -name '*.hpp' \
    -o -name '*.java' -o -name '*.py' -o -name '*.ts' -o -name '*.js' \
    -o -name '*.lua' -o -name '*.cs' -o -name '*.rs' \
    -o -name '*.bat' -o -name '*.sh' \
    -o -name 'Makefile' -o -name 'makefile' \
    -o -name '*.hint' \
\) -not -path '*/.git/*' | while read srcfile; do
    relpath="${srcfile#note/}"
    dest="code/$relpath"
    destdir="$(dirname "$dest")"
    mkdir -p "$destdir"
    mv "$srcfile" "$dest"
done

echo "  提取完成"

# ==========================================
# 第六步：清理空目录
# ==========================================
echo ""
echo ">>> 第六步：清理空目录"
find note -type d -empty -delete 2>/dev/null
find code -type d -empty -delete 2>/dev/null
echo "  空目录已清理"

# ==========================================
# 第七步：删除原始文件夹
# ==========================================
echo ""
echo ">>> 第七步：删除原始文件夹"
rm -rf my-note MyNote
echo "  已删除 my-note/ 和 MyNote/"

# ==========================================
# 完成统计
# ==========================================
echo ""
echo "=========================================="
echo "  整理完成！"
echo "=========================================="
echo ""
echo "  note/ (文档类):"
echo "    $(find note -type f -not -path '*/.git/*' | wc -l) 个文件"
echo ""
echo "  code/ (代码类):"
echo "    $(find code -type f -not -path '*/.git/*' | wc -l) 个文件"
echo ""
echo "  note/ 目录结构:"
find note -mindepth 1 -maxdepth 2 -type d -not -path '*/.git/*' | sort | while read d; do
    count=$(find "$d" -maxdepth 1 -type f | wc -l)
    echo "    $d  ($count 文件)"
done
echo ""
echo "  code/ 目录结构:"
find code -mindepth 1 -maxdepth 3 -type d | sort | while read d; do
    count=$(find "$d" -maxdepth 1 -type f | wc -l)
    echo "    $d  ($count 文件)"
done
