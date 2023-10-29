import os

IGNORED_DIRS = ['node_modules', 'test', '.github', '.git', '.idea', '__pycache__', 'pnpm-lock.yaml', 'package-lock.json', 'venv', 'data']


def scan_directory(dir_path, indentation=''):
    result = []

    for item in os.listdir(dir_path):
        full_path = os.path.join(dir_path, item)

        if os.path.isdir(full_path):
            if item not in IGNORED_DIRS:
                result.append(indentation + item + '/')
                result.extend(scan_directory(full_path, indentation + '  '))
        else:
            result.append(indentation + item)

    return result


def main():
    dir_structure = scan_directory('.')
    with open('output.txt', 'w') as file:
        file.write('\n'.join(dir_structure))


if __name__ == "__main__":
    main()
