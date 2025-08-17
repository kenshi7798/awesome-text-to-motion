import { ItemData, ItemType, ItemView } from './types';

const formatDate = (year: number, month: number): string => {
    return `${year}-${month.toString().padStart(2, '0')}`;
};

const formatConference = (submission: string, submissionYear: string): string => {
    if (!submission || submission.trim() === '') return '-';
    return `${submission} ${submissionYear}`;
};

export const getGithubStarsShield = (repoUrl?: string): string => {
    if (!repoUrl || !repoUrl.includes('github.com')) return "";
    const parts = repoUrl.split('/');
    const owner = parts[3];
    const repo = parts[4];
    return owner && repo ? `https://img.shields.io/github/stars/${owner}/${repo}` : "";
};

export const getTags = (tagString?: string): string[] => {
    return tagString && typeof tagString === 'string'
        ? tagString.split(',').map(tag => tag.trim())
        : [];
};

export const getViewFromData = (itemData: ItemData, itemType: ItemType): ItemView => {
    let abbr: string = "";
    switch (itemType) {
        case ItemType.Survey:
            abbr = itemData.survey_abbr;
            break;
        case ItemType.Dataset:
            abbr = itemData.dataset_abbr;
            break;
        case ItemType.Model:
            abbr = itemData.model_abbr;
            break;
        default:
            break;
    }
    return {
        arxiv_id: itemData.arxiv_id,
        publication: formatDate(itemData.year, itemData.month),
        authors: itemData.authors,
        abstract: itemData.abstract,
        abbr: abbr,
        title: itemData.title,
        conference: formatConference(itemData.submission, itemData.submission_year),
        link: itemData.url,
        page: itemData.page,
        code: itemData.repo,
        backbone_tags: getTags(itemData.backbone_tags),
        approach_tags: getTags(itemData.approach_tags),
    }
};