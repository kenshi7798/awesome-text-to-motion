import json


def get_markdown(item, abbr=None):
    text = "- "
    if abbr is not None:
        text += f"**{abbr}**: "
    text += f"\"{item['title']}\". "
    text += f"`{item['submission']}({item['submission_year']})` " if len(
        item['submission']) > 0 else f"`arXiv({item['year']})` "
    text += f"[[URL]]({item['url']})"
    if len(item['page']) > 0:
        text += f" [[Project Page]]({item['page']})"
    if len(item['repo']) > 0:
        text += f" [[Code]]({item['repo']})"
    text += "\n\n"

    return text


def export_readme():
    data = json.load(open("../data/data.json"))

    survey_items, dataset_items, model_items = list(), list(), list()
    for item in data:
        if item['survey']:
            survey_items.append(item)
        if item['dataset']:
            dataset_items.append(item)
        if item['model']:
            model_items.append(item)

    survey_items = sorted(survey_items, key=lambda x: f"{x['year']}{x['month']}", reverse=True)
    dataset_items = sorted(dataset_items, key=lambda x: f"{x['year']}{x['month']}", reverse=True)
    model_items = sorted(model_items, key=lambda x: f"{x['year']}{x['month']}", reverse=True)

    survey_text = ""
    dataset_text = ""
    model_text = ""

    for item in survey_items:
        survey_text += get_markdown(item)
    for item in dataset_items:
        dataset_text += get_markdown(item, item['dataset_abbr'])
    for item in model_items:
        model_text += get_markdown(item, item['model_abbr'])

    template = open("../data/template.md", 'r').read()
    readme = template.format(survey_text, dataset_text, model_text)
    with open("../README.md", 'w') as f:
        f.write(readme)


if __name__ == '__main__':
    export_readme()
