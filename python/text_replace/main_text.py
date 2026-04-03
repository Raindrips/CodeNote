from __future__ import annotations

from TextReplacer import TextReplacer, ReplaceRule
from pathlib import Path
from Directory import DirectoryTextReplacer, replace_in_directory


def test():
    sample = "Hello hello HELLO world. foo bar foobar."

    rules = [
        ReplaceRule(
            "hello", "Hi", case_sensitive=False, use_regex=False, whole_word=False
        ),
        ReplaceRule(
            r"\bfoo\b", "FOO", case_sensitive=True, use_regex=True, whole_word=False
        ),
        ReplaceRule(
            "bar", "BAR", case_sensitive=True, use_regex=False, whole_word=True
        ),
    ]

    r = TextReplacer(rules)
    print("原文:", sample)
    print("结果:", r.replace(sample))


def test_replace():
    rules = [
        ReplaceRule(
            """"morn-slot": "git+http://192.168.0.6:3000/client_npm/morn-slot-js.git",""",
            "",
            case_sensitive=False,
        )
    ]
    path = r"D:/project_v4"
    replacer = TextReplacer(rules)
    # 方式一：类
    worker = DirectoryTextReplacer(
        replacer,
        Path(path),
        extensions=[ ".json"],  # 可改成任意扩展名
        encoding="utf-8",
    )
    summary = worker.process_all()
    print(summary.modified, summary.unchanged, summary.failed)

    # 方式二：函数
    # summary = replace_in_directory(
    #     replacer, r"D:\proj\src", extensions=[".ts", ".json"]
    # )


if __name__ == "__main__":
    test_replace()
