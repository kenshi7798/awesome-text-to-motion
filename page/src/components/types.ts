export interface ItemData {
    arxiv_id: string;
    survey: boolean;
    model: boolean;
    dataset: boolean;
    year: number;
    month: number;
    survey_abbr: string;
    model_abbr: string;
    dataset_abbr: string;
    title: string;
    authors: string[];
    abstract: string;
    submission: string;
    submission_year: string;
    url: string;
    page: string;
    repo: string;
    backbone_tags: string;
    approach_tags: string;
}

export interface ItemView {
    arxiv_id: string;
    publication: string;
    authors: string[];
    abstract: string;
    abbr: string;
    title: string;
    conference: string;
    link: string;
    page: string;
    code: string | null;
    backbone_tags: string[];
    approach_tags: string[];
}

export enum ItemType {
    Survey = 0,
    Dataset = 1,
    Model = 2,
}