from moviepy.editor import *
from tool import get_all_file_path,split_array

""" 
功能,合并视频文件
clips (list): 要合并的视频文件列表
output_file (str): 合并后的视频文件名
"""


def merge_videos(file_list, output_file):
    print('开始读取视频文件...')
    clips = []
    i=0
    len_file=len(file_list)
    for file in file_list:
        clip = VideoFileClip(file)
        clips.append(clip)
        i+=1
        print(f'已读取{i}个视频,共{len_file}个视频')
    
    print('开始合并')
    # 合并视频
    final_clip = concatenate_videoclips(clips)
    print('输出中...')
    # 输出合并后的视频文件
    final_clip.write_videofile(output_file,8)


if __name__ == "__main__":
    input_list = get_all_file_path("D:\\Downloads\\car_1")
    # print(input_list)
    # input_files = ["video1.mp4", "video2.mp4"]  # 输入视频文件列表
    output_file = ".\\merged_video.mp4"  # 输出合并后的视频文件名
    list_sp=split_array(input_list,10)
    for(i,list) in enumerate(list_sp):
        print(f'开始合并{i}个视频')
        merge_videos(list, f".\\merged_video{i}.mp4")
