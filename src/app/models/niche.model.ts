export interface ProductNicheDto {
  id?: string;
  idFrom1C?: string;
  updaterId?: string;
  removeOldImages?: boolean;
  code: string;
  sortIndex?: number;
  productCount?: number;
  lastProductCountUpdateDateTime?: string;
  name: string;
  description: string;
  viewType: number;
  imageInstances?: string[];
  backgroundImages?: string[];
}

export interface ProductNiche {
  isDeleted: boolean;
  id: string;
  code: string;
  sortIndex: number;
  productCount: number;
  lastProductCountUpdateDateTime: string;
  name: string;
  description: string;
  viewType: number;
  imageInstanceId?: string;
  imageLink?: string;
  subCategories?: SubCategory[];
  products?: Product[];
  imageInstanceLinks?: string[];
  imageInstances?: any[];
  backgroundImageLinks?: string[];
  backgroundImages?: any[];
}

export interface SubCategory {
  id: string;
  name: string;
  shortName: string;
  imageInstanceLink?: string;
  backgroundImageLink?: string;
  productCount: number;
  viewType: number;
}

export interface ProductCategory {
  isDeleted: boolean;
  id: string;
  code: string;
  shortCode: number;
  name: string;
  shortName: string;
  pseudoName: string;
  description: string;
  viewType: number;
  superCategoryId?: string;
  productCount: number;
  imageInstanceLink?: string;
}

export interface Product {
  id: string;
  fullName: string;
  article: string;
  description: string;
  retailPrice: number;
  retailPriceDest: number;
  productImageLinks?: string[];
  productCategoryIds?: string[];
  productNicheIds?: string[];
}