# coding=utf-8

'''命令行的火车票查看器

Usage:
    12306 [-gdtkz] <from> <to> <date>

Options:
    -h,--help  显示帮助
    -g         高铁
    -d         动车
    -t         特快
    -k         快速
    -z         直达

Example:
    12306 上海 北京 2016-12-16
    12306 -dg 上海 北京 2016-12-16

pip install requests prettytable docopt colorama
'''
import requests
from docopt import docopt
from stations import stations
from prettytable import PrettyTable
from colorama import init, Fore



class TrainsCollections:

    header = '车次 车站 时间 历时 一等 二等 软卧 硬卧 硬座 无座'.split()

    def __init__(self, available_tranins, options):
        self.available_tranins = available_tranins
        self.options = options

    def _get_duration(self, raw_train):
        # 05:30
        durations = raw_train.get('lishi').replace(':', '小时') + '分'
        return durations
    
    @property
    def trains(self):
        for raw_train in self.available_tranins:
            train_no = raw_train['station_train_code']
            initial = train_no[0].lower()
            if not self.options or initial in self.options:
                train=[
                train_no,
                '\n'.join(
                    [Fore.GREEN + raw_train['from_station_name'] + Fore.RESET,
                     Fore.RED + raw_train['to_station_name'] + Fore.RESET]),
                '\n'.join([Fore.GREEN + raw_train['start_time'] + Fore.RESET,
                           Fore.RED + raw_train['arrive_time'] + Fore.RESET]),
                self._get_duration(raw_train),
                raw_train['zy_num'],
                raw_train['ze_num'],
                raw_train['rw_num'],
                raw_train['yw_num'],
                raw_train['yz_num'],
                raw_train['wz_num'],
                ]
                yield train

    def pretty_print(self):
        pt = PrettyTable()
        pt._set_field_names(self.header)
        for train in self.trains:
            pt.add_row(train)
        print(pt)

def cli():
    '''
    {'-d': True,
     '-g': True,
     '-k': False,
     '-t': False,
     '-z': False,
     '<date>': '2016-12-16',
     '<from>': '上海',
     '<to>': '北京'}
    '''
    arguments = docopt(__doc__)
    from_station = stations.get(arguments['<from>'])
    to_station = stations.get(arguments['<to>'])
    date = arguments['<date>']
    #获取参数
    options = ''.join([ k for k, v in arguments.items() if v is True])
    #构建url
    url = "https://kyfw.12306.cn/otn/lcxxcx/query?purpose_codes=ADULT&queryDate={}&from_station={}&to_station={}".format(date, from_station, to_station)
    r = requests.get(url, verify=False)
    available_tranins = r.json()['data']["datas"]
    TrainsCollections(available_tranins, options).pretty_print()




if __name__ == '__main__':
    cli()


