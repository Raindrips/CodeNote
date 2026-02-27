from __future__ import annotations

import os
import shutil
from pathlib import Path
from typing import Callable

from models import CopyConfig, CopyProgress


ProgressCallback = Callable[[CopyProgress], None]


class FileCopyService:
    """执行递归复制和过滤的服务。"""

    def run_copy(self, config: CopyConfig, progress_cb: ProgressCallback | None = None) -> None:
        src = config.src_dir
        dst = config.dst_dir

        src = src.resolve()
        dst = dst.resolve()

        for root, _dirs, files in os.walk(src):
            root_path = Path(root)
            for name in files:
                src_path = root_path / name
                rel_path = src_path.relative_to(src)

                if not config.rules.is_allowed(rel_path):
                    if progress_cb:
                        progress_cb(
                            CopyProgress(
                                src_path=src_path,
                                dst_path=dst / rel_path,
                                copied=False,
                                skipped=True,
                                reason="filtered",
                                bytes_copied=0,
                            )
                        )
                    continue

                dst_path = dst / rel_path
                dst_dir = dst_path.parent
                dst_dir.mkdir(parents=True, exist_ok=True)

                if dst_path.exists() and config.overwrite_mode == "skip":
                    if progress_cb:
                        progress_cb(
                            CopyProgress(
                                src_path=src_path,
                                dst_path=dst_path,
                                copied=False,
                                skipped=True,
                                reason="exists",
                                bytes_copied=0,
                            )
                        )
                    continue

                size = src_path.stat().st_size if src_path.exists() else 0

                shutil.copy2(src_path, dst_path)

                if progress_cb:
                    progress_cb(
                        CopyProgress(
                            src_path=src_path,
                            dst_path=dst_path,
                            copied=True,
                            skipped=False,
                            reason=None,
                            bytes_copied=size,
                        )
                    )

