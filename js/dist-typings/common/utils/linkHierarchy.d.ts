import type Link from '../models/Link';
export declare function rootLinks(links: Link[]): Link[];
export declare function childrenOf(links: Link[], parent: Link): Link[];
export declare function hasChildren(links: Link[], parent: Link): boolean;
