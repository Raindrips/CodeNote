import subprocess
import sys

from tool import get_all_file_path

""" 
功能,合并视频文件
input_files (list): 要合并的视频文件列表
output_file (str): 合并后的视频文件名
"""
def merge_videos(input_files, output_file):
    input_args = ""
    for file in input_files:
        input_args += f"-i {file} "
    command = f"ffmpeg {input_args} -filter_complex concat=n={len(input_files)}:v=1:a=1 -f mp4 {output_file}"
    subprocess.run(command, shell=True)

if __name__ == "__main__":
    input_path= sys.argv[0]
    input_list=get_all_file_path(input_path)
    # print(input_list)
    # input_files = ["video1.mp4", "video2.mp4"]  # 输入视频文件列表
    output_file = "merged_video.mp4"  # 输出合并后的视频文件名
    merge_videos(input_list, output_file)
    
    
