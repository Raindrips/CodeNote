import tkinter as tk;

def on_click(entry:tk.Entry,label:tk.Label):
    txt=entry.get()
    label.config(text=f"按钮文字:{txt}",fg="red")

def main():
    root =tk.Tk()

    root.title("窗口名称")
    root.geometry("400x300") # 宽高
    
    label=tk.Label(root,text="hello world")
    label.pack(pady=50) #pady => padding y
    
    entry=tk.Entry(root,width=25)
    entry.pack(pady=5)
    
    btn=tk.Button(root,text="click",width=10,height=4,command=lambda:on_click(entry,label))
    btn.pack()
    
    
    
    print("start")
    root.mainloop() # 窗口主循环,程序会在这阻塞
    print("exit")


main()