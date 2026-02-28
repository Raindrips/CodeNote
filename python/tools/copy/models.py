from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional, Literal

import fnmatch


OverwriteMode = Literal["always", "skip"]


@dataclass
class CopyRule:
    """文件过滤规则，支持白名单和黑名单模式（glob）。"""

    include_patterns: List[str] = field(default_factory=list)
    exclude_patterns: List[str] = field(default_factory=list)

    def _matches_any(self, patterns: List[str], value: str) -> bool:
        value_norm = value.replace("\\", "/")
        for pattern in patterns:
            if not pattern:
                continue
            pattern_norm = pattern.replace("\\", "/")
            if fnmatch.fnmatch(value_norm, pattern_norm):
                return True
        return False

    def is_allowed(self, relative_path: Path) -> bool:
        """根据规则判断该相对路径对应的文件是否允许复制。"""

        rel_str = str(relative_path).replace("\\", "/")
        name = relative_path.name

        if self.include_patterns:
            if not (
                self._matches_any(self.include_patterns, rel_str)
                or self._matches_any(self.include_patterns, name)
            ):
                return False

        if self.exclude_patterns:
            if self._matches_any(self.exclude_patterns, rel_str) or self._matches_any(
                self.exclude_patterns, name
            ):
                return False

        return True


@dataclass
class CopyConfig:
    """一次复制任务的配置。"""

    src_dir: Path
    dst_dir: Path
    rules: CopyRule = field(default_factory=CopyRule)
    overwrite_mode: OverwriteMode = "always"


@dataclass
class CopyStats:
    """复制任务统计信息。"""

    total_files: int = 0
    copied_files: int = 0
    skipped_files: int = 0
    total_bytes: int = 0
    copied_bytes: int = 0


@dataclass
class CopyProgress:
    """单个文件处理进度信息。"""

    src_path: Path
    dst_path: Path
    copied: bool
    skipped: bool = False
    reason: Optional[str] = None
    bytes_copied: int = 0

