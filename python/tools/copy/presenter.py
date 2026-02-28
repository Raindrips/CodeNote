from __future__ import annotations

from argparse import Namespace

from models import CopyStats, CopyConfig
from services import FileCopyService
from views.base_view import ICopyView


class CopyPresenter:
    """协调 View 和 Service 的 Presenter。"""

    def __init__(self, view: ICopyView, service: FileCopyService | None = None) -> None:
        self._view = view
        self._service = service or FileCopyService()
        self._stats = CopyStats()

    def run(self, cli_args: Namespace) -> None:
        try:
            config = self._view.get_initial_config(cli_args)
            if config is None:
                return

            self._reset_stats()
            self._service.run_copy(config, progress_cb=self._on_progress)
            self._view.show_summary(self._stats)
        except Exception as exc:  # noqa: BLE001
            self._view.show_error(str(exc))

    def _reset_stats(self) -> None:
        self._stats = CopyStats()

    def _on_progress(self, progress) -> None:
        from models import CopyProgress  # 局部导入避免循环

        if not isinstance(progress, CopyProgress):
            return

        self._stats.total_files += 1
        self._stats.total_bytes += progress.bytes_copied
        if progress.copied:
            self._stats.copied_files += 1
            self._stats.copied_bytes += progress.bytes_copied
        if progress.skipped:
            self._stats.skipped_files += 1

        self._view.on_progress(progress, self._stats)

