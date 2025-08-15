import csv
import json

import arxiv


def export_data():
    csv_items = dict()
    with open('../data/arxiv.csv') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            arxiv_id = row[0]
            csv_items[arxiv_id] = {
                'survey': row[1],
                'survey_abbr': row[2],
                'model': row[3],
                'model_abbr': row[4],
                'dataset': row[5],
                'dataset_abbr': row[6],
                'submission': row[7],
                'submission_year': row[8],
                'page': row[9],
                'repo': row[10],
                'backbone_tags': row[11],
                'approach_tags': row[12],
            }

    arxiv_items = []
    client = arxiv.Client()
    search = arxiv.Search(id_list=list(csv_items.keys()))
    for result in client.results(search):
        arxiv_id = result.get_short_id()[:10]
        csv_item = csv_items[arxiv_id]

        arxiv_items.append({
            'arxiv_id': arxiv_id,
            'title': result.title,
            'abstract': result.summary,
            'authors': [author.name for author in result.authors],
            'year': result.published.year,
            'month': result.published.month,
            'url': f"https://arxiv.org/abs/{arxiv_id}",
            'survey': True if csv_item['survey'] == '1' else False,
            'survey_abbr': csv_item['survey_abbr'],
            'model': True if csv_item['model'] == '1' else False,
            'model_abbr': csv_item['model_abbr'],
            'dataset': True if csv_item['dataset'] == '1' else False,
            'dataset_abbr': csv_item['dataset_abbr'],
            'submission': csv_item['submission'],
            'submission_year': csv_item['submission_year'],
            'page': csv_item['page'],
            'repo': csv_item['repo'],
            'backbone_tags': csv_item['backbone_tags'],
            'approach_tags': csv_item['approach_tags'],
        })

    non_arxiv_items = json.load(open('../data/without-arxiv.json', 'r'))
    total_items = arxiv_items + non_arxiv_items

    json.dump(total_items, open('../data/data.json', 'w'), indent=4)


if __name__ == '__main__':
    export_data()
