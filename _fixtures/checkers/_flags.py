import re

INLINE_CODE = re.compile(r"`[^`]*`")
FLAG = re.compile(r"> (Confirm|TODO):")


def skipped_chunk(name):
    return name.startswith(("15-", "18-"))


def line_flags(line):
    line = INLINE_CODE.sub("", line)
    if line.lstrip().startswith("|"):
        return FLAG.findall(line)
    found = FLAG.match(line)
    return [found.group(1)] if found else []
