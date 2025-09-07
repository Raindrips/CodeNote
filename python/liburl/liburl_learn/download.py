import urlib.request  
import urlretrieve
import request

# 使用urlib.request进行图片下载
def download_url(img_url):
    urlretrieve(img_url,'hh.png')



def main():
    download_url("https://ossqdy.ycpai.cn/ycpai/site/2022-06/17/1402/20220617093547227.png")
