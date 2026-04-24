from PIL import Image
import os

def safe_div(a, b):
    return a / b if b != 0 else 0


def clamp(v):
    return max(0, min(255, int(v)))


def blend_add(src, dst):
    return clamp(src + dst)


def blend_multiply(src, dst):
    return clamp(src * dst / 255)


def blend_screen(src, dst):
    return clamp(255 - (255 - src) * (255 - dst) / 255)


def blend_alpha(src, dst, alpha):
    return clamp(src * alpha + dst * (1 - alpha))


def process_pixel(src_rgba, dst_rgb, mode):
    sr, sg, sb, sa = src_rgba
    dr, dg, db = dst_rgb

    alpha = sa / 255.0

    if mode == "add":
        r = blend_add(sr * alpha, dr)
        g = blend_add(sg * alpha, dg)
        b = blend_add(sb * alpha, db)

    elif mode == "multiply":
        r = blend_multiply(sr, dr)
        g = blend_multiply(sg, dg)
        b = blend_multiply(sb, db)

    elif mode == "screen":
        r = blend_screen(sr, dr)
        g = blend_screen(sg, dg)
        b = blend_screen(sb, db)

    elif mode == "alpha":
        r = blend_alpha(sr, dr, alpha)
        g = blend_alpha(sg, dg, alpha)
        b = blend_alpha(sb, db, alpha)

    else:
        raise ValueError("Unsupported mode")

    # 关键：重新计算透明度（伪叠加核心）
    out_a = sa

    return (r, g, b, out_a)


def bake_image(src_path, dst_color, mode, out_path):
    src = Image.open(src_path).convert("RGBA")
    width, height = src.size

    pixels = src.load()

    out = Image.new("RGBA", (width, height))
    out_pixels = out.load()

    for y in range(height):
        for x in range(width):
            src_px = pixels[x, y]
            out_pixels[x, y] = process_pixel(src_px, dst_color, mode)

    out.save(out_path)


def batch_process(input_dir, output_dir, dst_color=(0, 0, 0), mode="add"):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for file in os.listdir(input_dir):
        if not file.lower().endswith(".png"):
            continue

        src_path = os.path.join(input_dir, file)
        out_path = os.path.join(output_dir, file)

        print(f"Processing: {file}")
        bake_image(src_path, dst_color, mode, out_path)

    print("Done.")


if __name__ == "__main__":
    input_dir = "./input"
    output_dir = "./output"

    # 背景颜色（非常关键）
    dst_color = (0, 0, 0)  # 黑底最常见

    # 模式: add / multiply / screen / alpha
    mode = "add"

    batch_process(input_dir, output_dir, dst_color, mode)