// Authentication Types
export interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  created_at: string;
  last_login: string;
}

export interface Asset {
  id: string;
  title: string;
  description: string | null;
  alt_text: string | null;
  file_type: string;
  file_size: number;
  dimensions: {
    width: number;
    height: number;
  };
  urls: {
    original: string;
    small: string;
    medium: string;
    large: string;
  };
  tags: string[];
  categories: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface AssetVersion {
  id: string;
  asset_id: string;
  version: number;
  file_url: string;
  metadata: Record<string, any>;
  user_id: string;
  created_at: string;
}

export interface AssetMetadata {
  title: string;
  description: string | null;
  alt_text: string | null;
  tags: string[];
  categories: string[];
}