import React from 'react';
import { ItemView } from './types';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { getGithubStarsShield } from './utils';

interface ItemTableProps {
    itemViewList: ItemView[];
}

const ItemTable: React.FC<ItemTableProps> = ({ itemViewList }) => {
    return (
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">Publication</TableHead>
                        <TableHead className="w-[120px]">Abbr.</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="w-[100px]">Conference</TableHead>
                        <TableHead className="w-[50px]">Link</TableHead>
                        <TableHead className="w-[50px]">Page</TableHead>
                        <TableHead className="w-[100px]">Code</TableHead>
                        <TableHead className="w-[180px]">Backbone</TableHead>
                        <TableHead className="w-[180px]">Approach</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {itemViewList.map((itemView) => (
                        <TableRow key={itemView.arxiv_id}>
                            <TableCell className="text-center">{itemView.publication}</TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                                            {itemView.abbr}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[800px]">
                                        <DialogHeader>
                                            <DialogTitle>{itemView.title}</DialogTitle>
                                            <DialogDescription>{itemView.authors.join(', ')}</DialogDescription>
                                        </DialogHeader>
                                        <p className="text-sm text-gray-600">{itemView.abstract}</p>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell className="max-w-xs">
                                <div className="truncate" title={itemView.title}>{itemView.title}</div>
                            </TableCell>
                            <TableCell>{itemView.conference}</TableCell>
                            <TableCell>
                                {itemView.link && (
                                    <a href={itemView.link} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </TableCell>
                            <TableCell>
                                {itemView.page && (
                                    <a href={itemView.page} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </TableCell>
                            <TableCell>
                                {itemView.code && (
                                    <a href={itemView.code} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center">
                                        <Image src={getGithubStarsShield(itemView.code)} alt="GitHub stars" className="h-5" width={90} height={20} unoptimized />
                                    </a>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {itemView.backbone_tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs whitespace-nowrap">{tag}</Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {itemView.approach_tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs whitespace-nowrap">{tag}</Badge>
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ItemTable;