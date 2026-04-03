from pathlib import Path
from typing import FrozenSet, Iterable, Iterator, Sequence, List
from dataclasses import dataclass, field
from TextReplacer import TextReplacer


@dataclass
class FileProcessResult:
    """单个文件的处理结果。"""

    path: Path
    changed: bool
    error: str | None = None


@dataclass
class DirectoryProcessSummary:
    """目录批处理汇总。"""

    root: Path
    scanned: int = 0
    modified: int = 0
    unchanged: int = 0
    failed: int = 0
    results: List[FileProcessResult] = field(default_factory=list)


@dataclass
class DirectoryProcessSummary:
    """目录批处理汇总。"""

    root: Path
    scanned: int = 0
    modified: int = 0
    unchanged: int = 0
    failed: int = 0
    results: List[FileProcessResult] = field(default_factory=list)


def normalize_extensions(extensions: Iterable[str]) -> FrozenSet[str]:
    """将扩展名规范为小写且带前导点，例如 ts / .TS -> .ts。"""
    out: set[str] = set()
    for raw in extensions:
        e = raw.strip().lower()
        if not e:
            continue
        if not e.startswith("."):
            e = "." + e
        out.add(e)
    return frozenset(out)


def replace_in_directory(
    replacer: TextReplacer,
    root: Path | str,
    extensions: Sequence[str] | None = None,
    *,
    encoding: str = "utf-8",
    encoding_errors: str = "strict",
) -> DirectoryProcessSummary:
    """函数式入口：对目录下指定扩展名文件批量替换并写回。"""
    worker = DirectoryTextReplacer(
        replacer,
        root,
        extensions=extensions,
        encoding=encoding,
        encoding_errors=encoding_errors,
    )
    return worker.process_all()


class DirectoryTextReplacer:
    """
    递归遍历目录，按扩展名筛选文件，用 TextReplacer 替换后写回。
    仅当内容实际发生变化时才写入磁盘。
    """

    def __init__(
        self,
        replacer: TextReplacer,
        root: Path | str,
        extensions: Sequence[str] | None = None,
        *,
        encoding: str = "utf-8",
        encoding_errors: str = "strict",
    ) -> None:
        self.replacer = replacer
        self.root = Path(root).resolve()
        self.extensions = normalize_extensions(
            extensions if extensions is not None else (".ts", ".json")
        )
        self.encoding = encoding
        self.encoding_errors = encoding_errors

    def iter_target_files(self) -> Iterator[Path]:
        """深度优先遍历 root 下所有匹配扩展名的文件。"""
        if not self.root.is_dir():
            return
        for path in self.root.rglob("*"):
            if not path.is_file():
                continue
            if path.suffix.lower() in self.extensions:
                yield path

    def process_all(self) -> DirectoryProcessSummary:
        """处理所有匹配文件，返回汇总信息。"""
        summary = DirectoryProcessSummary(root=self.root)
        for path in self.iter_target_files():
            summary.scanned += 1
            res = self._process_one(path)
            summary.results.append(res)
            if res.error is not None:
                summary.failed += 1
            elif res.changed:
                summary.modified += 1
            else:
                summary.unchanged += 1
        return summary

    def _process_one(self, path: Path) -> FileProcessResult:
        try:
            text = path.read_text(encoding=self.encoding, errors=self.encoding_errors)
        except OSError as e:
            return FileProcessResult(path, False, str(e))
        new_text = self.replacer.replace(text)
        if new_text == text:
            return FileProcessResult(path, False, None)
        try:
            path.write_text(new_text, encoding=self.encoding)
        except OSError as e:
            return FileProcessResult(path, False, str(e))
        return FileProcessResult(path, True, None)
