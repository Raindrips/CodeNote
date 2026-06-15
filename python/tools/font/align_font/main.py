import sys
from bmfont_parse import parse_fnt_data
from bmfont_save import generate_fnt_content
from fnt_data import FntData
from file_utils import read_file, write_file


def format_data(fnt_data: FntData) -> None:
    max_width = 0
    for char in fnt_data.chars:
        max_width = max(char.width, max_width)
    print("maxWidth", max_width)
    for char in fnt_data.chars:
        if char.id == ord(".") or char.id == ord(","):
            continue
        char.xadvance = max_width
        char.xoffset = max_width - char.width


def main() -> None:
    path = sys.argv[1]
    data = read_file(path)
    print(path, "\n", data)
    fnt_data = parse_fnt_data(data)
    format_data(fnt_data)
    bm_font = generate_fnt_content(fnt_data)
    print(bm_font)
    write_file(path, bm_font)


if __name__ == "__main__":
    main()
