from PIL import Image
import os;
import re

## 图片宽度调整到250
def compressFile(infile,outfile):
  im = Image.open(infile)
  (x,y) = im.size   #read image size
  x_s = int(250)         #define standard width
  y_s = int(y * x_s / x) #calc height based on standard width
  out = im.resize((x_s,y_s),Image.Resampling.NEAREST) #resize image with high-quality
  out.save(outfile)

  print ('original size: ',x,y)
  print ('adjust size: ',x_s,y_s)

def ScaleImage(input_path,output_path,scale):
  im = Image.open(input_path)
  (x,y) = im.size   #read image size
  x_s = int(x*scale)         #define standard width
  y_s = int(y * scale) #calc height based on standard width
  out = im.resize((x_s,y_s)) #resize image with high-quality
  out.save(output_path)

def compressImage(input_path,output_path,quality):
 im = Image.open(input_path)
 im.save(output_path,quality=quality)

# 检查是否是图片
def match_file(filename):
  pattern = re.compile(u'\\.jpg$|\\.png$')
  # mat= re.search(filename,pattern)
  return pattern.search(filename)!=None

# 遍历目录内的文件
def get_file_list(path):
  filelist=[]
  filenames=os.listdir(path)
  for filename in filenames:
    if match_file(filename):
      print(filename)
      filelist.append(filename)
  
  return filelist

def check_file_list(list_file):
  t=[]
  for item in list_file:
    if match_file(item):
      print(item)
      t.append(item)
  return t

# 遍历文件目录
def get_all_files(path):
  # file=[]
  for filepath,dirnames,filenames in os.walk(path):
      for filename in filenames:
          file.append(dirnamesfilename)

  # return file


def main():
  infile = r'D:\git\TD-Game\td-game\TDGame\Assets\1_MarvelTower\Texture/'
  outfile =r'D:/Downloads/1/'
  # compressFile(infile,ou
  # tfile);
  filelist= get_all_files(infile)
  relist=check_file_list(filelist)
  for file in relist:
    ScaleImage(infile+file,outfile+file,0.2)
    # compressImage(infile+file,outfile+file,25)
    pass

main()