from __future__ import annotations

from abc import ABC, abstractmethod
from argparse import Namespace

from models import CopyConfig, CopyStats, CopyProgress


class ICopyView(ABC):
    """复制工具的视图接口，控制台和 GUI 共同遵守。"""

    @abstractmethod
    def get_initial_config(self, cli_args: Namespace) -> CopyConfig | None:
        """根据命令行参数或界面输入构造 CopyConfig。

        返回 None 表示用户取消。
        """

    @abstractmethod
    def on_progress(self, progress: CopyProgress, stats: CopyStats) -> None:
        """展示单个文件的处理进度和当前统计信息。"""

    @abstractmethod
    def show_summary(self, stats: CopyStats) -> None:
        """展示最终统计结果。"""

    @abstractmethod
    def show_error(self, message: str) -> None:
        """展示错误信息。"""

