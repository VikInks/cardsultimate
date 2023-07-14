import re
import json


def parse_rules(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')

    rules = {}
    current_rule = None
    current_subrule = None
    current_text = ""

    for line in lines:
        rule_match = re.match(r"^(\d+)\. (.+)$", line)
        subrule_match = re.match(r"^(\d+\.\d+)([a-z]?)\. (.+)$", line)

        if rule_match:
            if current_rule:
                if current_subrule:
                    rules[current_rule]["subrules"][current_subrule] = current_text.strip()
                    current_subrule = None
                else:
                    rules[current_rule]["text"] = current_text.strip()

            current_rule = rule_match.group(1)
            rules[current_rule] = {"title": rule_match.group(2), "subrules": {}, "text": ""}
            current_text = ""

        elif subrule_match:
            if current_subrule:
                rules[current_rule]["subrules"][current_subrule] = current_text.strip()

            current_subrule = subrule_match.group(1) + (subrule_match.group(2) if subrule_match.group(2) else "")
            current_text = subrule_match.group(3)

        elif current_subrule:
            sub_subrule_match = re.match(r"^(\d+\.\d+[a-z]) (.+)$", line.strip())
            if sub_subrule_match:
                current_sub_subrule = sub_subrule_match.group(1)
                current_text = sub_subrule_match.group(2)
                rules[current_rule]["subrules"][current_sub_subrule] = current_text.strip()
            else:
                current_text += " " + line.strip()
        else:
            current_text += " " + line.strip()

    if current_rule:
        if current_subrule:
            rules[current_rule]["subrules"][current_subrule] = current_text.strip()
        else:
            rules[current_rule]["text"] = current_text.strip()

    return rules


def main():
    input_file = "rules_text.txt"
    output_file = "../rules_json.json"

    rules = parse_rules(input_file)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(rules, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    main()
