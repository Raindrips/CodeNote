import os
import sys
import shutil


def main():
    if len(sys.argv) != 3:
        print(f"Usage: python {sys.argv[0]} <Dir_A> <Dir_B>")
        sys.exit(1)

    dir_a = sys.argv[1]
    dir_b = sys.argv[2]

    if not os.path.isdir(dir_a):
        print(f"Error: '{dir_a}' is not a valid directory.")
        sys.exit(1)
    if not os.path.isdir(dir_b):
        print(f"Error: '{dir_b}' is not a valid directory.")
        sys.exit(1)

    # Step 1: Collect top-level files in A  (no recursion, no folders)
    a_files = {}
    for entry in os.listdir(dir_a):
        full_path = os.path.join(dir_a, entry)
        if os.path.isfile(full_path):
            a_files[entry] = full_path

    if not a_files:
        print("No files found in Dir_A.")
        sys.exit(0)

    print(f"Dir_A contains {len(a_files)} file(s):")
    for name in sorted(a_files):
        print(f"  {name}")
    print()

    # Step 2: Walk B recursively, match by basename, overwrite
    overwritten = 0
    for root, _, files in os.walk(dir_b):
        for filename in files:
            if filename in a_files:
                src = a_files[filename]
                dst = os.path.join(root, filename)
                shutil.copy2(src, dst)
                print(f"  Overwritten: {dst}")
                overwritten += 1

    print(f"\nDone. {overwritten} file(s) overwritten in Dir_B.")


if __name__ == "__main__":
    main()
