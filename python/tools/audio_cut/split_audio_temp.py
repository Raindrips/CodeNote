from pydub import AudioSegment
from pydub.silence import detect_nonsilent
import os
import sys
import math

def split_audio(input_path, output_dir, min_silence_len=100):
    # 转换为WAV处理
    audio = AudioSegment.from_mp3(input_path)
    samples = audio.set_channels(1).set_frame_rate(16000)
    
    # 静默检测参数
    silence_thresh = -50  # 静默阈值（dBFS）
    min_silence = max(min_silence_len, 10)  # 强制最小10ms
    
    # 检测非静默段
    nonsilent_ranges = detect_nonsilent(
        samples,
        min_silence_len=min_silence,
        silence_thresh=silence_thresh,
        seek_step=1
    )
    
    # 生成分割点
    split_points = []
    for i in range(1, len(nonsilent_ranges)):
        prev_end = nonsilent_ranges[i-1][1]
        next_start = nonsilent_ranges[i][0]
        split_points.append((prev_end + next_start) // 2)

    # 分割音频
    chunks = []
    last_end = 0
    for point in split_points:
        chunks.append((last_end, point))
        last_end = point
    chunks.append((last_end, len(audio)))

    # 生成文件名
    digits = len(str(len(chunks))) if len(chunks) > 0 else 1
    format_str = f"{{:0{digits}d}}.mp3"

    # 保存结果
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for i, (start, end) in enumerate(chunks):
        chunk = audio[start:end]
        chunk.export(
            os.path.join(output_dir, format_str.format(i)),
            format="mp3",
            bitrate="192k"
        )

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python audio_splitter.py <input.mp3> <output_dir> <min_silence_ms>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_dir = sys.argv[2]
    min_silence = int(sys.argv[3])
    
    split_audio(input_path, output_dir, min_silence)