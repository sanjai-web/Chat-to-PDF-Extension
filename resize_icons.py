import os
from PIL import Image
import sys

def resize_icons(source_path, output_dir):
    try:
        img = Image.open(source_path)
        sizes = [16, 48, 128]
        
        for size in sizes:
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            output_path = os.path.join(output_dir, f"icon{size}.png")
            resized_img.save(output_path)
            print(f"Created {output_path}")
            
    except ImportError:
        print("Pillow not installed. Installing...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        # Retry
        resize_icons(source_path, output_dir)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    source = "icons/original.png"
    output = "icons"
    resize_icons(source, output)
