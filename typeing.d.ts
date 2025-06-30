export interface HeroSectionType {
    _id: string
    _createdAt: string
    _type: 'heroSection'
    title: string
    subTitle: string
    imageUrl:string
}

export interface SanitySpan {
    _type: 'span';
    text: string;
    marks?: string[];
}

export interface SanityMarkDef {
    _key: string;
    _type: string;
}

export interface SanityBlock {
    _type: 'block';
    children: SanitySpan[];
    style?: string;
    markDefs?: SanityMarkDef[];
    key?: string;
}

export interface SanityImage {
    _type: 'image';
    asset: { _ref: string; _type: 'reference' };
    alt?: string;
}

export interface SanityVideo {
    _type: 'file';
    asset: { _ref: string; _type: 'reference' };
    alt?: string;
}

export interface ProductType {
    _id: string;
    _createdAt: string;
    _type: 'product';
    title: string;
    price: number;
    description: string;
    imageUrl?: string;
    slug: { _type: 'slug'; current: string };
    body: Array<SanityBlock | SanityImage | SanityVideo>;
}