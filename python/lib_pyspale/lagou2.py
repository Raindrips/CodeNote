# coding=utf-8
# pip install requests
# pip install beautifulsoup4
# pip install XlsxWriter
import re
import json
import requests
import xlsxwriter
from bs4 import BeautifulSoup
from collections import Counter


url = "https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false"
keyword = input('请输入您所需要查找的关键字：')


def get_jobs(url, pn=1, kw=keyword):

    data = {"first":"false", "pn":pn, "kd":kw}
    r = requests.post(url, data=data)
    jobs_data = r.json()
    return jobs_data
    # jobs_data = jobs_data["content"]["positionResult"]["result"]

    # for i in jobs_data:
    #     print(i["companyFullName"])
    #     print(i["city"])
    #     print(i["companyLabelList"])
    #     print(i["workYear"])
    #     print(i["education"])
    #     print(i["salary"])
    #     job_url = "https://www.lagou.com/jobs/" + str(i["positionId"]) + ".html"
    #     print(job_url)

def get_max_page(jobs):
    max_page_num = jobs['content']['pageSize']
    max_page_num = 30 if max_page_num > 30 else max_page_num
    return max_page_num

def read_id(jobs):
    tag = 'positionId'
    page_json = jobs['content']['positionResult']['result']
    company_list = []
    for i in range(15):
        company_list.append(page_json[i].get(tag))
    return company_list

def get_content(company_id):
    job_url = "https://www.lagou.com/jobs/{0}.html".format(company_id)
    r = requests.get(job_url)
    return r.text

def get_result(content):
    soup = BeautifulSoup(content, "html.parser")
    job_description = soup.select('dd[class="job_bt"]')
    job_description = str(job_description[0])
    rule = re.compile(r'<[^>]+>')
    result = rule.sub('', job_description)
    return result

def search_skill(result):
    rule = re.compile(r'[a-zA-Z]+')
    skill_list = rule.findall(result)
    return skill_list

def count_skill(skill_list):
    for i in range(len(skill_list)):
        skill_list[i] = skill_list[i].lower()
    count_dict = Counter(skill_list).most_common(80)
    return count_dict

def save_excel(count_dict, file_name):
    book = xlsxwriter.Workbook(
        r'/Users/ce/workspace/tech/jingfeng/{0}.xls'.format(file_name))
    tmp = book.add_worksheet()
    row_num = len(count_dict)
    for i in range(1, row_num):
        if i == 1:
            tag_pos = 'A%s' % i
            tmp.write_row(tag_pos, ['关键词', '频次'])
        else:
            con_pos = 'A%s' % i
            k_v = list(count_dict[i - 2])
            tmp.write_row(con_pos, k_v)
    chart1 = book.add_chart({'type': 'area'})
    chart1.add_series({
        'name': '=Sheet1!$B$1',
        'categories': '=Sheet1!$A$2:$A$80',
        'values': '=Sheet1!$B$2:$B$80'
    })
    chart1.set_title({'name': '关键词排名'})
    chart1.set_x_axis({'name': '关键词'})
    chart1.set_y_axis({'name': '频次(/次)'})
    tmp.insert_chart('C2', chart1, {'x_offset': 15, 'y_offset': 10})
    book.close()



if __name__ == '__main__':
    jobs = get_jobs(url, pn=2, kw=keyword)
    max_page = get_max_page(jobs)
    fin_skill_list = []
    # for page in range(1, max_page+1):
    for page in range(1):
        print('-----正在抓取第%s页信息-----' % page)
        jobs = get_jobs(url, pn=page, kw=keyword)
        company_list = read_id(jobs)
        for company_id in company_list:
            content = get_content(company_id)
            result = get_result(content)
            skill_list = search_skill(result)
            fin_skill_list.extend(skill_list)
    print('-----开始统计关键字出现频率-----')
    count_dict = count_skill(fin_skill_list)
    file_name = input('请输入要保持文件名：')
    save_excel(count_dict, file_name)
    print('-----正在保存----')

    
    
    
    
    