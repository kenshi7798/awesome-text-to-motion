"use client";
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterSectionProps {
    title: string;
    allTags: string[];
    selectedTag: string;
    onTagChange: (tag: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    allTags,
    selectedTag,
    onTagChange
}) => {
    return (
        <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Select value={selectedTag} onValueChange={onTagChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                    {allTags.map(tag => (
                        <SelectItem key={tag} value={tag}>
                            {tag}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default FilterSection;
