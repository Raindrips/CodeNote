def read_file(file_path: str) -> str:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except OSError as err:
        print(f"Error reading file: {err}")
        return ""


def write_file(file_path: str, data: str) -> None:
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(data)
    except OSError as err:
        print(f"Error writing file: {err}")
