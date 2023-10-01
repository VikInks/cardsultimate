import json

path_to_json = 'D:\\Project_ongoing\\magicTheGathering_Recon\\script\\cards.json'


def extract_first_element(json_str: str):
    json_data = json.loads(json_str)

    if isinstance(json_data, dict):
        first_key = list(json_data.keys())[0]
        first_value = json_data[first_key]
        print(f"First Key: {first_key}, First Value: {json.dumps(first_value, indent=4)}")
    elif isinstance(json_data, list):
        first_element = json_data[0]
        print(f"First Element: {json.dumps(first_element, indent=4)}")
    else:
        print("Unsupported JSON type")


if __name__ == "__main__":
    with open(path_to_json, 'r', encoding='utf-8') as f:
        json_str = f.read()
    extract_first_element(json_str)
