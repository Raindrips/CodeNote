# coding=utf-8
# pip install requests
import json
import requests

def get_jobs(pn=1, kw="python"):
    url = "https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false"
    data = {"first":"false", "pn":pn, "kd":kw}
    r = requests.post(url, data=data)
    jobs_data = r.json()
    jobs_data = jobs_data["content"]["positionResult"]["result"]

    for i in jobs_data:
        print(i["companyFullName"])
        print(i["city"])
        print(i["companyLabelList"])
        print(i["workYear"])
        print(i["education"])
        print(i["salary"])
        job_url = "https://www.lagou.com/jobs/" + str(i["positionId"]) + ".html"
        print(job_url)

if __name__ == '__main__':
    get_jobs(pn=2, kw="运维")
    
    
    
    
    