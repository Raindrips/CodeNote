import tkinter as tk
from tkinter import ttk, filedialog

from main_scale import start_processing


class FolderSelectorApp:
    input = ""
    output = ""
    scale = tk.DoubleVar(value=0.7)

    def __init__(self, root):
        self.root = root
        self.root.title("图片缩放工具")
        self.root.geometry("400x300")
        self.root.resizable(False, False)

        # 应用现代简约风格的 ttk 主题
        style = ttk.Style(self.root)
        style.theme_use("clam")  # 可选 'clam', 'alt', 'default', 'classic'

        # 容器
        frame = ttk.Frame(self.root, padding=20)
        frame.pack(fill=tk.BOTH, expand=True)

        # 按钮：打开对话框
        self.btn_open = ttk.Button(
            frame, text="选择输入文件夹", command=self.open_folder
        )
        self.btn_open.pack(pady=(0, 10))

        # 只读文本框：显示并复制路径
        self.folder_path = tk.StringVar()
        entry = ttk.Entry(
            frame, textvariable=self.folder_path, state="readonly", width=50
        )
        entry.pack()

        self.btn_open_out = ttk.Button(
            frame, text="选择输出文件夹", command=self.open_folder_out
        )
        self.btn_open_out.pack(pady=(0, 10))

        self.folder_path2 = tk.StringVar()
        entry = ttk.Entry(
            frame, textvariable=self.folder_path2, state="readonly", width=50
        )
        entry.pack()

        ttk.Label(frame, text="缩放比：").pack(pady=(10, 0))

        scale_entry = ttk.Entry(frame, textvariable=self.scale, width=10)
        scale_entry.pack(pady=(0, 10))
        scale_entry.bind("<FocusOut>", lambda event: self.update_scale(scale_entry))

        ttk.Button(frame, text="开始处理", command=self.start_processing).pack(
            pady=(10, 0)
        )

    def open_folder(self):
        # 打开文件夹选择对话框
        folder_selected = filedialog.askdirectory(title="请选择文件夹")
        if folder_selected:
            # 保存并在只读文本框中显示
            self.input = folder_selected
            self.folder_path.set(folder_selected)

    def open_folder_out(self):

        folder_selected = filedialog.askdirectory(title="请选择文件夹")
        if folder_selected:
            self.output = folder_selected
            self.folder_path2.set(folder_selected)

    def start_processing(self):
        # 这里可以添加处理逻辑，例如调用其他函数或脚本
        if self.input and self.output:
            print(f"开始处理：{self.input} -> {self.output} {self.scale.get()}")
            # 在这里添加处理代码
            start_processing(self.input, self.output, self.scale.get())
            print("处理完成")
        else:
            print("请确保选择了输入和输出文件夹")

    def update_scale(self, entry):
        try:
            self.scale.set(float(entry.get()))
        except ValueError:
            print("请输入有效的数字")


if __name__ == "__main__":
    root = tk.Tk()
    app = FolderSelectorApp(root)
    root.mainloop()
