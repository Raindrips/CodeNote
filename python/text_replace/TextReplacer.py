from typing import Iterable, List
import re
from dataclasses import dataclass, field

"""
文本替换：支持多规则，每条规则可独立配置大小写、正则、整词匹配。
"""


@dataclass
class ReplaceRule:
    """单条替换规则。"""

    pattern: str
    replacement: str
    case_sensitive: bool = True  # 大小写
    use_regex: bool = False  # 使用正则
    whole_word: bool = False  # 全字匹配

    _compiled: re.Pattern[str] | None = field(default=None, repr=False, compare=False)

    def compile(self) -> re.Pattern[str]:
        """编译为内部使用的正则（幂等）。"""
        if self._compiled is not None:
            return self._compiled
        if self.use_regex:
            pat = self.pattern
            if self.whole_word:
                pat = rf"\b(?:{pat})\b"
        else:
            esc = re.escape(self.pattern)
            pat = rf"\b{esc}\b" if self.whole_word else esc
        flags = 0 if self.case_sensitive else re.IGNORECASE
        self._compiled = re.compile(pat, flags)
        return self._compiled


class TextReplacer:
    """按顺序应用多条替换规则。"""

    def __init__(self, rules: Iterable[ReplaceRule] | None = None) -> None:
        self._rules: List[ReplaceRule] = list(rules) if rules else []

    @property
    def rules(self) -> List[ReplaceRule]:
        return self._rules

    def add_rule(self, rule: ReplaceRule) -> None:
        self._rules.append(rule)

    def replace(self, text: str) -> str:
        """对整段文本依次应用所有规则。"""
        out = text
        for rule in self._rules:
            rx = rule.compile()
            out = rx.sub(rule.replacement, out)
        return out

    def replace_lines(self, lines: Iterable[str]) -> List[str]:
        """逐行替换（每行独立应用规则）。"""
        return [self.replace(line) for line in lines]


def replace_text(text: str, rules: Iterable[ReplaceRule]) -> str:
    """函数式入口：用给定规则列表替换文本。"""
    return TextReplacer(rules).replace(text)
