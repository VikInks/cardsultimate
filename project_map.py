import os


def list_files(startpath):
    output = []

    for root, dirs, files in os.walk(startpath):
        # Skip the node_modules directory
        if "node_modules" in dirs:
            dirs.remove("node_modules")

        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        output.append(f"{indent}{os.path.basename(root)}/")
        sub_indent = ' ' * 4 * (level + 1)
        for f in files:
            output.append(f"{sub_indent}{f}")

    return "\n".join(output)


if __name__ == "__main__":
    project_path = input("Enter the path to your project: ")
    output_file = input("Enter the name of the output txt file (e.g. output.txt): ")

    with open(output_file, 'w') as f:
        f.write(list_files(project_path))

    print(f"Directories and filenames (excluding node_modules) written to {output_file}")
