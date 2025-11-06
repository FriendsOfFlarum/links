import Model from 'flarum/common/Model';
export default class Link extends Model {
    title(): string;
    icon(): string;
    type(): string;
    url(): string;
    position(): number | null | undefined;
    isInternal(): boolean;
    isNewtab(): boolean;
    useRelMe(): boolean;
    isChild(): boolean;
    parent(): false | Link;
    isRestricted(): boolean;
    guestOnly(): boolean;
}
