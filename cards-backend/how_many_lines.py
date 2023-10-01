import os
from tqdm import tqdm


def count_lines_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        return len(f.readlines())


def count_lines_in_project(root_folder):
    total_lines = 0

    all_files = [os.path.join(dp, f) for dp, dn, filenames in os.walk(root_folder) for f in filenames]
    print(f"Total files in project: {len(all_files)}")

    for file_path in tqdm(all_files, desc="Counting lines"):
        if file_path.endswith('.py') or file_path.endswith('.ts'):
            total_lines += count_lines_in_file(file_path)

    return total_lines


if __name__ == "__main__":
    root_folder = "D:\Project_ongoing\cardsultimate\cards-backend\src"
    total_lines = count_lines_in_project(root_folder)
    print(f"Total lines of code in the project: {total_lines}")
