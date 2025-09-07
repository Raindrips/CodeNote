# coding=utf-8
from urllib.request import urlopen
from urllib.parse import quote
from bs4 import BeautifulSoup

def get_prod(keyword):
    url = "https://search.jd.com/Search?keyword=" + quote(keyword) + "&enc=utf-8"
    html = urlopen(url).read().decode('utf-8')
    soup = BeautifulSoup(html)
    li_all = soup.find_all('li', 'gl-item')
    for i in li_all:
        print("title: ", i.a["title"])
        print("url: ", i.a["href"])
        img = i.img["src"] if "src" in i.img else i.img.get("data-lazy-img")
        print("img: ", img)
        print("price: ", i.strong.get("data-price"))



if __name__ == '__main__':
    get_prod("狗粮")