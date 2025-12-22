export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // for videos
  uploadedAt: Date;
  uploadedBy: string;
  alt?: string;
  caption?: string;
  tags?: string[];
  usage: {
    posts: string[]; // post ids
    portfolios: string[]; // portfolio ids
  };
}

export type MediaType = 'all' | 'image' | 'video';

export type SortOption = 'name' | 'date' | 'size' | 'type';