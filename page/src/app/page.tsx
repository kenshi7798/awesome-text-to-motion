"use client";
import React, { useState, useMemo, useEffect } from 'react';
import itemDataList from '@/assets/data.json';
import { ItemData, ItemType } from '@/components/types';
import { getTags, getViewFromData } from '@/components/utils';
import FilterSection from '@/components/filter-section';
import ItemTable from '@/components/item-table';
import { ExternalLink, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import './globals.css';

function App() {
    const allBackboneTags = useMemo(
        () => ["All", ...new Set(itemDataList.flatMap((paper: ItemData) => getTags(paper.backbone_tags)))],
        []
    );
    const allApproachTags = useMemo(
        () => ["All", ...new Set(itemDataList.flatMap((paper: ItemData) => getTags(paper.approach_tags)))],
        []
    );

    const [selectedBackboneTag, setSelectedBackboneTag] = useState<string>("All");
    const [selectedApproachTag, setSelectedApproachTag] = useState<string>("All");
    const [showPublishedOnly, setShowPublishedOnly] = useState(false);
    const [showWithPageOnly, setShowWithPageOnly] = useState(false);
    const [showWithRepoOnly, setShowWithRepoOnly] = useState(false);


    useEffect(() => {
        setSelectedBackboneTag("All");
        setSelectedApproachTag("All");
    }, [allBackboneTags, allApproachTags]);

    const convertedSurveys = useMemo(() => {
        const filtered = itemDataList.filter((itemData: ItemData) => itemData.survey === true);

        filtered.sort((a, b) => {
            const aValue = a.year * 100 + a.month;
            const bValue = b.year * 100 + b.month;
            return bValue - aValue; // 降序
        });

        return filtered.map((itemData: ItemData) => getViewFromData(itemData, ItemType.Survey));
    }, []);

    const convertedDatasets = useMemo(() => {
        const filtered = itemDataList.filter((itemData: ItemData) => itemData.dataset === true);

        filtered.sort((a, b) => {
            const aValue = a.year * 100 + a.month;
            const bValue = b.year * 100 + b.month;
            return bValue - aValue; // 降序
        });

        return filtered.map((itemData: ItemData) => getViewFromData(itemData, ItemType.Dataset));
    }, []);

    const convertedModels = useMemo(() => {
        const filtered = itemDataList.filter((itemData: ItemData) => {
            if (itemData.model !== true) return false;

            const isPublished = itemData.submission && itemData.submission.trim() !== '';
            if (showPublishedOnly && !isPublished) return false;
            if (showWithPageOnly && (!itemData.page || itemData.page.trim() === '')) return false;
            if (showWithRepoOnly && (!itemData.repo || itemData.repo.trim() === '')) return false;

            const itemBackboneTags = getTags(itemData.backbone_tags);
            const itemApproachTags = getTags(itemData.approach_tags);

            const hasBackboneTag =
                selectedBackboneTag === "All" || itemBackboneTags.includes(selectedBackboneTag);
            const hasApproachTag =
                selectedApproachTag === "All" || itemApproachTags.includes(selectedApproachTag);

            return hasBackboneTag && hasApproachTag;
        });

        filtered.sort((a, b) => {
            const aValue = a.year * 100 + a.month;
            const bValue = b.year * 100 + b.month;
            return bValue - aValue;
        });

        return filtered.map((itemData: ItemData) => getViewFromData(itemData, ItemType.Model));
    }, [selectedBackboneTag, selectedApproachTag, showPublishedOnly, showWithPageOnly, showWithRepoOnly]);

    return (
        <div className="container mx-auto p-0 pb-10 space-y-10 max-w-screen-3xl">
            <h1 className="text-6xl font-bold text-center mb-16 mt-16">awesome-text-to-motion</h1>
            
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-4">
                    <a 
                        href="https://github.com/zilize/awesome-text-to-motion" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ExternalLink className="w-6 h-6" />
                        <span>View on GitHub</span>
                    </a>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="inline-flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground transition-colors">
                                <HelpCircle className="w-6 h-6" />
                                <span>About this collection</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px]">
                            <DialogHeader>
                                <DialogTitle>About This Collection</DialogTitle>
                                <DialogDescription>
                                    Learn more about this text-to-motion research collection
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 text-gray-700">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 What's Included</h3>
                                    <p className="mb-3">
                                        This collection covers comprehensive research on <strong>text-driven human motion generation</strong>, 
                                        focusing on single-person scenarios without human-object/scene interaction.
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li><strong>Surveys:</strong> Comprehensive reviews and surveys of the field</li>
                                        <li><strong>Datasets:</strong> Motion datasets for training and evaluation</li>
                                        <li><strong>Models:</strong> State-of-the-art text-to-motion generation models</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">🔍 Key Features</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Papers are categorized by backbone architectures (Transformer, Diffusion, etc.)</li>
                                        <li>Filter by approach types (Physical, Editing, etc.)</li>
                                        <li>Sort by publication date (newest first)</li>
                                        <li>Direct links to project pages and code repositories</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">🤝 Contributing</h3>
                                    <p className="mb-3">
                                        We welcome contributions to make this collection more comprehensive! 
                                        Please visit our GitHub repository for detailed contribution guidelines.
                                    </p>
                                    <a
                                        href="https://github.com/zilize/awesome-text-to-motion"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Contribution Guide
                                    </a>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>



            <h2 className="text-4xl font-bold text-left">Surveys</h2>
            <ItemTable itemViewList={convertedSurveys} />
            <div className="text-center text-muted-foreground">
                Showing {convertedSurveys.length} / {itemDataList.filter((p: ItemData) => p.survey === true).length} surveys
            </div>

            <h2 className="text-4xl font-bold text-left">Datasets</h2>
            <ItemTable itemViewList={convertedDatasets} />
            <div className="text-center text-muted-foreground">
                Showing {convertedDatasets.length} / {itemDataList.filter((p: ItemData) => p.dataset === true).length} datasets
            </div>

            <h2 className="text-4xl font-bold text-left">Models</h2>
            <div className="space-y-8">
                <FilterSection
                    title="Backbone Tag"
                    allTags={allBackboneTags}
                    selectedTag={selectedBackboneTag}
                    onTagChange={setSelectedBackboneTag}
                />
                <FilterSection
                    title="Approach Tag"
                    allTags={allApproachTags}
                    selectedTag={selectedApproachTag}
                    onTagChange={setSelectedApproachTag}
                />
                <div>
                    <h3 className="text-lg font-semibold mb-2">Filter Options</h3>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showPublishedOnly}
                                onChange={(e) => setShowPublishedOnly(e.target.checked)}
                            />
                            <label>Show Published Only</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showWithPageOnly}
                                onChange={(e) => setShowWithPageOnly(e.target.checked)}
                            />
                            <label>Show with Page Only</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showWithRepoOnly}
                                onChange={(e) => setShowWithRepoOnly(e.target.checked)}
                            />
                            <label>Show with Code Repo Only</label>
                        </div>
                    </div>
                </div>
            </div>

            <ItemTable itemViewList={convertedModels} />
            <div className="text-center text-muted-foreground">
                Showing {convertedModels.length} / {itemDataList.filter((p: ItemData) => p.model === true).length} models
            </div>
        </div>
    );
}

export default App;
