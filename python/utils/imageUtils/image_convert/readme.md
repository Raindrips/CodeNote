依赖

```bash
pip install pillow
```

工具

```bash
python convert.py img.webp jpg ./output/
```

## app 打包

```
pyinstaller --onefile --noconsole .\CompressApp.py --icon=app_press.ico
pyinstaller --onefile --noconsole .\FoldSelectorApp.py

```

打包成功后,后续可以直接通过配置文件进行打包

```
pyinstaller CompressApp.spec
```