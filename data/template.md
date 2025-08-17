# awesome-text-to-motion

<a href='https://zilize.github.io/awesome-text-to-motion/'>
  <img src='https://img.shields.io/badge/Project-Page-%23df5b46?style=flat&logo=Google%20chrome&logoColor=%23df5b46'  alt="project_page"/></a> 
<a href='https://zilize.github.io/awesome-text-to-motion/'>
  <img src='https://img.shields.io/badge/Interactive-Charts-%2346a5df?style=flat&logo=plotly&logoColor=white' alt="interactive_charts"/></a>
<a href='https://github.com/Zilize/awesome-text-to-motion/actions/workflows/static.yml'>
  <img src='https://img.shields.io/github/actions/workflow/status/zilize/awesome-text-to-motion/static.yml'  alt="workflow"/></a> 
<a href="https://zhuanlan.zhihu.com/p/1940481020941043393">
  <img src="https://img.shields.io/badge/知乎-文章-%23f5f5f5?style=flat&logo=Zhihu&logoColor=%23188de0" alt="知乎文章"/>
</a>

Text-driven human motion generation surveys, datasets and models, focusing on single-person scenarios without human-object/scene interaction.
Please refer to the [project page](https://zilize.github.io/awesome-text-to-motion/) for a better browsing experience with interactive visualizations and statistical charts.

<details>
<summary><b>Contribution Guide</b> (Click to expand)</summary>

---

We welcome contributions to make this repository more comprehensive and up-to-date! 

### How to Contribute

1. **Fork this repository** to your GitHub account
2. **Create a new branch** for your contribution
3. **Add your papers** following the guidelines below
4. **Submit a Pull Request** with a clear description of your changes

### Adding Papers

#### For Papers with arXiv IDs:
- **File**: `data/arxiv.csv`
- **Format**: Add a new row with the following columns:
  - `arxiv_id`: The arXiv ID (e.g., "2507.05419")
  - `survey`: "1" if it's a survey paper, "0" otherwise
  - `survey_abbr`: Abbreviation for survey papers (e.g., "Survey2507")
  - `model`: "1" if it's a model paper, "0" otherwise
  - `model_abbr`: Abbreviation for model papers (e.g., "MotionGen")
  - `dataset`: "1" if it's a dataset paper, "0" otherwise
  - `dataset_abbr`: Abbreviation for dataset papers (e.g., "MotionX")
  - `submission`: Conference/journal name (e.g., "CVPR")
  - `submission_year`: Year of submission (e.g., "2025")
  - `page`: Project page URL (if available)
  - `repo`: GitHub repository URL (if available)
  - `backbone_tags`: Comma-separated backbone tags (e.g., "Transformer, Diffusion")
  - `approach_tags`: Comma-separated approach tags (e.g., "Physical, Editing")

#### For Papers without arXiv IDs:
- **File**: `data/without-arxiv.json`
- **Format**: Add a new JSON object with the following structure:
```json
{{
    "arxiv_id": "random-key-for-your-interest",
    "title": "Paper Title",
    "abstract": "Paper abstract...",
    "authors": ["Author 1", "Author 2"],
    "year": 2025,
    "month": 7,
    "url": "https://paper-url.com",
    "survey": false,
    "survey_abbr": "",
    "model": true,
    "model_abbr": "ModelName",
    "dataset": false,
    "dataset_abbr": "",
    "submission": "Conference",
    "submission_year": "2025",
    "page": "https://project-page.com",
    "repo": "https://github.com/user_name/repo",
    "backbone_tags": "Transformer, Diffusion",
    "approach_tags": "Physical, Editing"
}}
```

Thank you for contributing to the awesome-text-to-motion collection! 🚀

---

</details>

## Contents

- [Surveys](#surveys)
- [Datasets](#datasets)
- [Models](#models)

## Surveys

{}

## Datasets

{}

## Models

{}
