import os
import glob
from PIL import Image

def convert_webp_to_png(directory):
    count = 0
    # Process all webp files in the directory
    for webp_file in glob.glob(os.path.join(directory, "*.webp")):
        png_file = webp_file.rsplit('.', 1)[0] + '.png'
        try:
            # Open and convert
            with Image.open(webp_file) as img:
                img.save(png_file, 'PNG')
            # Remove original webp
            os.remove(webp_file)
            count += 1
            print(f"Converted: {os.path.basename(png_file)}")
        except Exception as e:
            print(f"Failed to convert {webp_file}: {e}")
    print(f"Total converted: {count}")

if __name__ == "__main__":
    convert_webp_to_png(r"c:\Web Development\pwguide\images\fishes")
