import re
import requests
from bs4 import BeautifulSoup

def get_pm25(city):
    url = 'http://www.pm25.com/city/' + city +'.html'
    r = requests.get(url)
    html = r.text
    soup = BeautifulSoup(html, 'html.parser')
    city = soup.find("span", {"class": "city_name"})
    aqi = soup.find("a", {"class": "cbol_aqi_num"})
    wuranwu = soup.find("a", {"class": "cbol_wuranwu_num "})
    wuranwu = wuranwu.string if wuranwu else "暂未统计"
    pm25 = soup.find("span", {"class", "cbol_nongdu_num_1"})
    pm25_danwei = soup.find("span", {"class": "cbol_nongdu_num_2"})

    quality = soup.find("span", {"class": re.compile('cbor_gauge_level\d$')})
    tips = soup.find("div", {"class": "cbor_tips"})
    re_rule = re.compile("<.*?>")
    tips = re_rule.sub('', str(tips))
    space = re.compile(" ")
    tips = space.sub("", tips)
    print(city.string + '\nAQI指数：' + aqi.string + '\n主要污染物：' + wuranwu + '\nPM2.5浓度：' + pm25.string + pm25_danwei.string + '\n空气质量：' + quality.string + tips)

if __name__ == '__main__':
    city = input("请输入想要查看的城市名称：（eg: beijing）")
    get_pm25(city)