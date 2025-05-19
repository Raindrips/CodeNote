from pydub import AudioSegment
from pydub.silence import detect_nonsilent
import os
import sys


def split_audio(input_path, output_dir, min_silence_len=100, bitrate="192k"):

    valid_bitrates = ["96k", "128k", "192k", "256k", "320k"]

    # 加载并预处理音频
    audio = AudioSegment.from_mp3(input_path)
    mono_audio = audio.set_channels(1).set_frame_rate(16000)

    # 静默检测参数
    silence_thresh = -50  # 静默阈值（dBFS）
    min_silence = max(min_silence_len, 10)  # 强制最小10ms

    # 检测有效音频段（非静默段）
    sound_ranges = detect_nonsilent(
        mono_audio,
        min_silence_len=min_silence,
        silence_thresh=silence_thresh,
        seek_step=1,
    )

    # 生成文件名模板
    digits = max(len(str(len(sound_ranges))), 1)
    format_str = f"{{:0{digits}d}}.mp3"

    # 自动检测输入文件的比特率
    original_bitrate = audio.frame_rate * audio.frame_width * 8 // 1000
    bitrate = f"{original_bitrate}k" if original_bitrate <= 320 else "320k"
    valid_bitrate = ["96k", "128k", "192k", "256k", "320k"]
    if bitrate not in valid_bitrate:
        bitrate = "192k"

    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)

    # 精确分割音频
    for idx, (start_ms, end_ms) in enumerate(sound_ranges):
        # 精确截取音频段 # 新算法（直接使用声音段边界）
        chunk = audio[start_ms:end_ms]

        # 导出时保持原始属性
        chunk.export(
            os.path.join(output_dir, format_str.format(idx)),
            format="mp3",
            bitrate=bitrate,
            tags={"artist": "AudioSplitter", "title": f"Segment {idx+1}"},
        )


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(
            "Usage: python audio_splitter.py <input.mp3> <output_dir> <min_silence_ms>"
        )
        sys.exit(1)

    input_path = sys.argv[1]
    output_dir = sys.argv[2]
    min_silence = int(sys.argv[3])

    split_audio(input_path, output_dir, min_silence)
