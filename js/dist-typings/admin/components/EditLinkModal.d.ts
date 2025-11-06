/**
 * The `EditlinksModal` component shows a modal dialog which allows the user
 * to create or edit a link.
 */
export default class EditlinksModal extends FormModal<import("flarum/common/components/FormModal").IFormModalAttrs, undefined> {
    constructor();
    oninit(vnode: any): void;
    link: any;
    itemTitle: any;
    icon: any;
    url: any;
    isInternal: any;
    isNewtab: any;
    useRelMe: any;
    guestOnly: any;
    content(): JSX.Element;
    getGroup(id: any): import("flarum/common/Model").default | undefined;
    items(): ItemList<any>;
    submitData(): {
        title: any;
        icon: any;
        url: any;
        isInternal: any;
        isNewtab: any;
        useRelMe: any;
        guestOnly: any;
    };
    onsubmit(e: any): void;
    delete(): void;
    updateInternalUrl(): void;
}
import FormModal from "flarum/common/components/FormModal";
import ItemList from "flarum/common/utils/ItemList";
