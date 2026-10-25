#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文件类型识别脚本（基于魔数 / magic bytes）

用法:
    python filetype.py ./file1
    python filetype.py ./file1 ./file2 ./file3
    python filetype.py ./file -n 64          # 显示前 64 字节
    python filetype.py ./file --no-hex       # 只看类型结果
"""

import argparse
import os
import sys
import zipfile


# ---------------------------------------------------------------------------
# 魔数规则表
#   (类型名, 偏移, 签名字节, 掩码, MIME)
#   掩码为 None 表示精确匹配
# ---------------------------------------------------------------------------
RULES = [
    # ---- 图片 ----
    ("PNG image",              0, b"\x89PNG\r\n\x1a\n",  None, "image/png"),
    ("JPEG image",             0, b"\xff\xd8\xff",        None, "image/jpeg"),
    ("GIF image",              0, b"GIF87a",              None, "image/gif"),
    ("GIF image",              0, b"GIF89a",              None, "image/gif"),
    ("BMP image",              0, b"BM",                  None, "image/bmp"),
    ("TIFF image (LE)",        0, b"II*\x00",             None, "image/tiff"),
    ("TIFF image (BE)",        0, b"MM\x00*",             None, "image/tiff"),
    ("ICO icon",               0, b"\x00\x00\x01\x00",    None, "image/x-icon"),
    ("PSD image",              0, b"8BPS",                None, "image/vnd.adobe.photoshop"),

    # ---- 音视频 ----
    ("MP3 audio",              0, b"ID3",                 None, "audio/mpeg"),
    ("MP3 audio",              0, b"\xff\xfb",            None, "audio/mpeg"),
    ("MP3 audio",              0, b"\xff\xf3",            None, "audio/mpeg"),
    ("MP3 audio",              0, b"\xff\xf2",            None, "audio/mpeg"),
    ("FLAC audio",             0, b"fLaC",                None, "audio/flac"),
    ("OGG media",              0, b"OggS",                None, "application/ogg"),
    ("MIDI audio",             0, b"MThd",                None, "audio/midi"),

    # ---- 文档 ----
    ("PDF document",           0, b"%PDF",                None, "application/pdf"),
    ("RTF document",           0, b"{\\rtf",              None, "application/rtf"),
    ("PostScript",             0, b"%!PS",                None, "application/postscript"),

    # ---- 压缩 / 归档 ----
    ("ZIP archive",            0, b"PK\x03\x04",          None, "application/zip"),
    ("ZIP archive (empty)",    0, b"PK\x05\x06",          None, "application/zip"),
    ("ZIP archive (spanned)",  0, b"PK\x07\x08",          None, "application/zip"),
    ("RAR archive",            0, b"Rar!\x1a\x07",        None, "application/vnd.rar"),
    ("7-Zip archive",          0, b"7z\xbc\xaf\x27\x1c",  None, "application/x-7z-compressed"),
    ("GZIP compressed",        0, b"\x1f\x8b",            None, "application/gzip"),
    ("BZIP2 compressed",       0, b"BZh",                 None, "application/x-bzip2"),
    ("XZ compressed",          0, b"\xfd7zXZ\x00",        None, "application/x-xz"),
    ("Zstandard compressed",   0, b"\x28\xb5\x2f\xfd",    None, "application/zstd"),

    # ---- 可执行 / 目标文件 ----
    ("ELF executable",         0, b"\x7fELF",             None, "application/x-executable"),
    ("Java class file",        0, b"\xca\xfe\xba\xbe",    None, "application/java-vm"),
    ("Mach-O 64-bit (LE)",     0, b"\xcf\xfa\xed\xfe",    None, "application/x-mach-binary"),
    ("Mach-O 64-bit (BE)",     0, b"\xfe\xed\xfa\xcf",    None, "application/x-mach-binary"),
    ("Mach-O 32-bit (LE)",     0, b"\xce\xfa\xed\xfe",    None, "application/x-mach-binary"),
    ("Mach-O 32-bit (BE)",     0, b"\xfe\xed\xfa\xce",    None, "application/x-mach-binary"),

    # ---- 数据库 / 容器 ----
    ("SQLite database",        0, b"SQLite format 3\x00", None, "application/vnd.sqlite3"),
    ("OLE2 (Office 97-2003)",  0, b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1", None, "application/x-ole-storage"),

    # ---- 字体 ----
    ("TrueType font",          0, b"\x00\x01\x00\x00\x00", None, "font/ttf"),
    ("OpenType font",          0, b"OTTO",                None, "font/otf"),
    ("WOFF font",              0, b"wOFF",                None, "font/woff"),
    ("WOFF2 font",             0, b"wOF2",                None, "font/woff2"),

    # ---- 文本类（头特征） ----
    ("UTF-8 BOM text",         0, b"\xef\xbb\xbf",        None, "text/plain"),
    ("UTF-16 LE BOM text",     0, b"\xff\xfe",            None, "text/plain"),
    ("UTF-16 BE BOM text",     0, b"\xfe\xff",            None, "text/plain"),
    ("XML document",           0, b"<?xml",               None, "application/xml"),
    ("HTML document",          0, b"<!DOCTYPE html",      None, "text/html"),
    ("HTML document",          0, b"<!doctype html",      None, "text/html"),
    ("HTML document",          0, b"<html",               None, "text/html"),
]

# 预排序：签名越长越优先（避免短签名误判长签名）
RULES_SORTED = sorted(RULES, key=lambda r: -len(r[2]))


# ---------------------------------------------------------------------------
# 工具函数
# ---------------------------------------------------------------------------
def match_rule(data, offset, sig, mask=None):
    """检查 data 的 offset 处是否匹配签名"""
    if len(data) < offset + len(sig):
        return False
    chunk = data[offset:offset + len(sig)]
    if mask is None:
        return chunk == sig
    return all((c & m) == (s & m) for c, s, m in zip(chunk, sig, mask))


def hexdump(data, base_offset=0, width=16):
    """xxd 风格十六进制视图"""
    lines = []
    for i in range(0, len(data), width):
        chunk = data[i:i + width]
        cols = []
        for j in range(width):
            cols.append(f"{chunk[j]:02x}" if j < len(chunk) else "  ")
            if j == width // 2 - 1:
                cols.append("")  # 中间多留一列空格
        hex_str = " ".join(cols)
        ascii_str = "".join(chr(b) if 32 <= b < 127 else "." for b in chunk)
        lines.append(f"{base_offset + i:08x}  {hex_str}  |{ascii_str}|")
    return "\n".join(lines)


def looks_like_text(data):
    """用 UTF-8 解码 + 控制字符比例做启发式判断"""
    if not data:
        return False
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError as e:
        if e.start >= len(data) - 4:  # 允许尾部被截断
            text = data[:e.start].decode("utf-8", "ignore")
        else:
            return False
    if not text:
        return False
    control = sum(1 for ch in text if ord(ch) < 32 and ch not in "\r\n\t")
    return control / len(text) < 0.05


def refine_zip(path):
    """打开 ZIP 看内部结构，判断是 docx/xlsx/pptx/apk/jar/epub 等"""
    try:
        with zipfile.ZipFile(path) as zf:
            names = [n.lower() for n in zf.namelist()]
    except Exception:
        return None

    nameset = set(names)
    if "[content_types].xml" in nameset:
        if any(n.startswith("word/") for n in names):
            return ("DOCX document", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        if any(n.startswith("xl/") for n in names):
            return ("XLSX spreadsheet", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        if any(n.startswith("ppt/") for n in names):
            return ("PPTX presentation", "application/vnd.openxmlformats-officedocument.presentationml.presentation")
    if "meta-inf/manifest.mf" in nameset:
        if "androidmanifest.xml" in nameset:
            return ("Android APK", "application/vnd.android.package-archive")
        return ("Java JAR", "application/java-archive")
    if "mimetype" in nameset:
        try:
            mt = zf.read("mimetype").decode("ascii", "replace").strip()
            if mt == "application/epub+zip":
                return ("EPUB book", "application/epub+zip")
        except Exception:
            pass
    return None


# ---------------------------------------------------------------------------
# 类型判定
# ---------------------------------------------------------------------------
def detect_type(data, path):
    """返回 (类型名, MIME, 判定依据)"""
    if not data:
        return "empty file", "inode/x-empty", ""

    # ---- RIFF 容器 ----
    if len(data) >= 12 and data[:4] == b"RIFF":
        fmt = data[8:12]
        table = {
            b"WAVE": ("WAV audio", "audio/wav"),
            b"AVI ": ("AVI video", "video/x-msvideo"),
            b"WEBP": ("WebP image", "image/webp"),
            b"CDXA": ("CDXA (VCD) video", "video/mpeg"),
        }
        if fmt in table:
            return *table[fmt], f"RIFF form={fmt.decode('latin-1')!r}"
        return "RIFF container", "application/octet-stream", f"form={fmt!r}"

    # ---- ISO Base Media (MP4/HEIC/MOV...) ----
    if len(data) >= 12 and data[4:8] == b"ftyp":
        brand = data[8:12]
        table = {
            b"isom": ("MP4 video", "video/mp4"),
            b"mp41": ("MP4 video", "video/mp4"),
            b"mp42": ("MP4 video", "video/mp4"),
            b"avc1": ("MP4 video", "video/mp4"),
            b"M4V ": ("MP4 video", "video/mp4"),
            b"M4A ": ("M4A audio", "audio/mp4"),
            b"qt  ": ("QuickTime video", "video/quicktime"),
            b"heic": ("HEIC image", "image/heic"),
            b"heix": ("HEIC image", "image/heic"),
            b"mif1": ("HEIF image", "image/heif"),
            b"3gp4": ("3GPP video", "video/3gpp"),
        }
        if brand in table:
            return *table[brand], f"ftyp brand={brand.decode('latin-1')!r}"
        return "ISO BMFF media", "video/mp4", f"ftyp brand={brand!r}"

    # ---- Windows PE / DOS ----
    if data[:2] == b"MZ":
        if len(data) >= 0x40:
            e_lfanew = int.from_bytes(data[0x3c:0x40], "little")
            if 0 < e_lfanew < len(data) - 4 and data[e_lfanew:e_lfanew + 4] == b"PE\x00\x00":
                return ("PE executable (EXE/DLL)",
                        "application/vnd.microsoft.portable-executable",
                        "MZ + PE 头")
        return "DOS MZ executable", "application/x-dosexec", ""

    # ---- TAR（签名在偏移 257）----
    if len(data) >= 262 and data[257:262] == b"ustar":
        return "TAR archive", "application/x-tar", "offset 257 处为 'ustar'"

    # ---- ZIP 细化（docx/xlsx/apk/jar/epub...）----
    if data[:4] in (b"PK\x03\x04", b"PK\x05\x06", b"PK\x07\x08"):
        sub = refine_zip(path)
        if sub:
            return sub[0], sub[1], "ZIP 容器（内部结构判定）"
        return "ZIP archive", "application/zip", ""

    # ---- 规则表匹配 ----
    for name, off, sig, mask, mime in RULES_SORTED:
        if match_rule(data, off, sig, mask):
            note = f"offset={off}" if off else ""
            return name, mime, note

    # ---- 文本兜底 ----
    if looks_like_text(data):
        text = data.decode("utf-8", "ignore").lstrip()
        if text and text[0] in "{[":
            return "text (possibly JSON)", "text/plain", "以 { 或 [ 开头"
        return "text (UTF-8/ASCII)", "text/plain", ""

    return "unknown binary data", "application/octet-stream", ""


# ---------------------------------------------------------------------------
# 主程序
# ---------------------------------------------------------------------------
def analyze(path, show_bytes=32, no_hex=False):
    sep = "=" * 78
    print(sep)
    print(f"文件: {path}")

    if not os.path.exists(path):
        print("  [错误] 文件不存在")
        return
    if not os.path.isfile(path):
        print("  [错误] 不是普通文件")
        return

    size = os.path.getsize(path)
    print(f"大小: {size:,} 字节")

    # 读取：显示 show_bytes 字节，但检测最多用 1024 字节（够覆盖 TAR 等偏移）
    read_len = min(max(show_bytes, 1024), size) if size else 0
    try:
        with open(path, "rb") as f:
            data = f.read(read_len)
    except OSError as e:
        print(f"  [错误] 无法读取: {e}")
        return

    # 十六进制视图
    if not no_hex and data:
        print("-" * 78)
        print(hexdump(data[:show_bytes]))
        if size > show_bytes:
            print(f"... (仅显示前 {show_bytes} 字节，共 {size:,} 字节)")

    # 类型识别
    name, mime, note = detect_type(data, path)
    print("-" * 78)
    print(f"类型: {name}")
    print(f"MIME: {mime}")
    if note:
        print(f"依据: {note}")
    print(sep + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="通过文件头字节（魔数）识别文件类型",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="示例:\n"
               "  python filetype.py ./photo.jpg\n"
               "  python filetype.py ./a.bin ./b.bin -n 64\n"
               "  python filetype.py ./* --no-hex",
    )
    parser.add_argument("files", nargs="+", help="要检测的文件")
    parser.add_argument("-n", "--bytes", type=int, default=32,
                        help="显示的头部字节数（默认 32，范围 1~4096）")
    parser.add_argument("--no-hex", action="store_true", help="只输出识别结果")
    args = parser.parse_args()

    n = max(1, min(args.bytes, 4096))
    for path in args.files:
        analyze(path, n, args.no_hex)


if __name__ == "__main__":
    main()