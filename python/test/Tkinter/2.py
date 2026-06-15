import tkinter as tk;

root =tk.Tk()
# label
label=tk.Label(root,text="hello world")

def on_click():
    label.config(text="按钮被点击",fg="red")

def main():
    
    root.title("窗口名称")
    root.geometry("400x300") # 宽高
    
    
    label.pack(pady=50) #pady => padding y
    
    btn=tk.Button(root,text="click",width=10,height=4,command=on_click)
    btn.pack()
    
    print("start")
    root.mainloop() # 窗口主循环,程序会在这阻塞
    print("exit")


main()