# -*-coding:utf-8-*-
from PIL import Image
import fileinput


# cut pic for rectangle
def cutPic(filepath, filename, x, y, w, h):
    im = Image.open(filepath)
    # 图片的宽度和高度
    img_size = im.size
    region = im.crop((x, y, x+w, y+h))
    region.save('./temp/'+filename+'.png')

    pass

# read file data


def readline(file_name):
    file = open(file_name)
    while 1:
        line = file.readline()
        if not line:
            break
        # print(line)
        split = line.split()
        (name, wid, hei, x, y, w, h) = split
        print('name='+name+' x='+ x + ' y='+y)
        x=float(x)*1024
        y=float(y)*1024
        w=float(w)*1024
        h=float(h)*1024
        cutPic('atlas.png',name,x,y,w,h)

        # for s in split:
        #     print(s)

        print('------')
    pass

    file.close()
    pass


def main():
    readline('atlas.txt')
    pass


if __name__ == '__main__':
    main()
