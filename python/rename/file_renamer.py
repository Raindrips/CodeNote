# file_renamer.py
import os

def rename_files_by_count(directory: str, extension: str) -> list[tuple[str, str]]:
    """
    根据文件数量对指定目录下的文件进行批量重命名。

    命名规则:
    - 文件数量是1-9个时: 0.ext, 1.ext, ..., 9.ext
    - 文件数量是10-99个时: 00.ext, 01.ext, ..., 99.ext
    - 以此类推，确保文件名中的数字位数与总文件数量的位数相同。

    Args:
        directory (str): 要重命名文件的目录路径。
        extension (str): 要重命名的文件扩展名 (例如: 'png', 'jpg', 'txt')。

    Returns:
        list[tuple[str, str]]: 一个列表，其中每个元组包含 (旧文件名, 新文件名)。
                               如果发生错误或没有文件被重命名，则返回空列表。
    Raises:
        FileNotFoundError: 如果指定的目录不存在。
        ValueError: 如果没有找到指定扩展名的文件。
        OSError: 如果重命名操作失败。
    """
    if not os.path.isdir(directory):
        raise FileNotFoundError(f"目录 '{directory}' 不存在。")

    files_to_rename = []
    for filename in os.listdir(directory):
        if filename.endswith(f".{extension}") and os.path.isfile(os.path.join(directory, filename)):
            files_to_rename.append(filename)

    if not files_to_rename:
        raise ValueError(f"在目录 '{directory}' 中没有找到扩展名为 '.{extension}' 的文件。")

    num_files = len(files_to_rename)
    # 计算数字部分所需的位数，例如 9 -> 1位, 10 -> 2位, 99 -> 2位, 100 -> 3位
    # len(str(num_files - 1)) 可以正确处理这个逻辑
    num_digits = len(str(num_files - 1)) if num_files > 0 else 1

    files_to_rename.sort() # 确保排序，以便重命名顺序一致

    renamed_pairs = []
    for index, old_filename in enumerate(files_to_rename):
        new_name = "{:0>{}d}.{}".format(index, num_digits, extension)
        old_filepath = os.path.join(directory, old_filename)
        new_filepath = os.path.join(directory, new_name)

        if old_filepath == new_filepath: # 避免对自己重命名
            continue

        try:
            os.rename(old_filepath, new_filepath)
            renamed_pairs.append((old_filename, new_name))
        except OSError as e:
            # 记录错误，但不中断整个流程，因为其他文件可能可以成功重命名
            # 或者选择在此处抛出异常，取决于具体需求
            raise OSError(f"重命名文件 '{old_filename}' 到 '{new_name}' 失败: {e}") from e

    return renamed_pairs