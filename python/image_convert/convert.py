import sys
import os
from PIL import Image

def convert_image(input_path: str, output_format: str, output_dir: str) -> None:
    """
    Convert an image file to the specified format and save it to the output directory.
    
    Args:
        input_path: Path to the input image file
        output_format: Desired output format (e.g., 'jpg', 'png')
        output_dir: Directory to save the converted image
    """
    try:
        # Validate input file exists
        if not os.path.isfile(input_path):
            print(f"Error: Input file '{input_path}' does not exist.")
            return

        # Validate output directory
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        elif not os.path.isdir(output_dir):
            print(f"Error: '{output_dir}' is not a directory.")
            return

        # Normalize output format (remove leading dot and convert to uppercase)
        output_format = output_format.lstrip('.').lower()
        
        # Supported formats by Pillow
        supported_formats = {
            'jpg': 'JPEG',
            'jpeg': 'JPEG',
            'png': 'PNG',
            'webp': 'WEBP',
            'bmp': 'BMP',
            'gif': 'GIF',
            'tiff': 'TIFF',
            'ico': 'ICO',
            'ppm': 'PPM',
            'pbm': 'PBM',
            'pgm': 'PGM'
        }

        if output_format not in supported_formats:
            print(f"Error: Unsupported output format '{output_format}'. Supported formats: {', '.join(supported_formats.keys())}")
            return

        # Open and convert image
        with Image.open(input_path) as img:
            # Get the base filename without extension
            base_name = os.path.splitext(os.path.basename(input_path))[0]
            # Construct output path
            output_path = os.path.join(output_dir, f"{base_name}.{output_format}")
            
            # Convert RGBA to RGB for formats that don't support transparency (e.g., JPEG)
            if output_format in ['jpg', 'jpeg'] and img.mode == 'RGBA':
                img = img.convert('RGB')
            
            # Save the image in the desired format
            img.save(output_path, format=supported_formats[output_format])
            print(f"Success: Converted '{input_path}' to '{output_path}'")

    except Exception as e:
        print(f"Error: Failed to convert image. {str(e)}")

def main():
    # Check command-line arguments
    if len(sys.argv) != 4:
        print("Usage: python convert.py <input_file> <output_format> <output_dir>")
        print("Example: python convert.py img.webp jpg ./output/")
        return

    input_file = sys.argv[1]
    output_format = sys.argv[2]
    output_dir = sys.argv[3]
    
    convert_image(input_file, output_format, output_dir)

if __name__ == "__main__":
    main()