import json
import os
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent


def _next_backup_path(path: Path) -> Path:
    base = Path(str(path) + ".bak")
    if not base.exists():
        return base
    i = 1
    while True:
        candidate = Path(str(path) + f".bak{i}")
        if not candidate.exists():
            return candidate
        i += 1


def _process_json_file(path: Path) -> tuple[bool, str]:
    try:
        raw = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        raw = path.read_text(encoding="utf-8-sig")

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        return False, f"JSON 解析失败: {e}"

    if not isinstance(data, dict):
        return False, "顶层不是 object，跳过"

    if "client" not in data:
        return False, "缺少 client 字段，跳过"

    client_value = data["client"]

    backup_path = _next_backup_path(path)
    shutil.copy2(path, backup_path)

    # 仅保留 client 字段里的数据（文件内容替换为 client 的值本身）
    path.write_text(
        json.dumps(client_value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return True, f"已写入（备份: {backup_path.name}）"


def main() -> int:
    json_files: list[Path] = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        # 跳过常见依赖目录
        dirnames[:] = [d for d in dirnames if d not in {"node_modules", ".git", "dist", "build"}]
        for fn in filenames:
            if not fn.lower().endswith(".json"):
                continue
            if ".bak" in fn.lower():
                continue
            json_files.append(Path(dirpath) / fn)

    json_files.sort()

    ok = 0
    skipped = 0
    failed = 0
    for p in json_files:
        changed, msg = _process_json_file(p)
        if changed:
            ok += 1
            print(f"[OK] {p.relative_to(ROOT)}: {msg}")
        else:
            # changed=False 既可能是 skip 也可能是 fail，这里按 msg 归类
            if msg.startswith("JSON 解析失败"):
                failed += 1
                print(f"[FAIL] {p.relative_to(ROOT)}: {msg}")
            else:
                skipped += 1
                print(f"[SKIP] {p.relative_to(ROOT)}: {msg}")

    print()
    print(f"总计: {len(json_files)} | 写入: {ok} | 跳过: {skipped} | 失败: {failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())

