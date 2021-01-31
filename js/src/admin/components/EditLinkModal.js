/* global m*/
/* global confirm*/

import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Stream from 'flarum/utils/Stream';
import icon from 'flarum/helpers/icon';
import withAttr from 'flarum/utils/withAttr';
import ItemList from 'flarum/utils/ItemList';
import Select from 'flarum/components/Select';

/**
 * The `EditlinksModal` component shows a modal dialog which allows the user
 * to create or edit a link.
 */
export default class EditlinksModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        this.link = this.attrs.link || app.store.createRecord('links');

        this.itemTitle = Stream(this.link.title() || '');
        this.icon = Stream(this.link.icon() || '');
        this.url = Stream(this.link.url() || '');
        this.isInternal = Stream(this.link.isInternal() && true);
        this.isNewtab = Stream(this.link.isNewtab() && true);
        this.visibility = Stream(this.link.visibility() || 'everyone');
    }

    className() {
        return 'EditLinkModal Modal--small';
    }

    title() {
        const title = this.itemTitle();
        return title ? [this.icon() ? [icon(this.icon()), ' '] : '', title] : app.translator.trans('fof-links.admin.edit_link.title');
    }

    content() {
        return (
            <div className="Modal-body">
                <div className="Form">{this.items().toArray()}</div>
            </div>
        );
    }

    items() {
        const items = new ItemList();

        items.add(
            'title',
            [
                <div className="Form-group">
                    <label>{app.translator.trans('fof-links.admin.edit_link.title_label')}</label>
                    <input
                        className="FormControl"
                        placeholder={app.translator.trans('fof-links.admin.edit_link.title_placeholder')}
                        bidi={this.itemTitle}
                    />
                </div>,
            ],
            100
        );

        items.add(
            'icon',
            [
                <div className="Form-group">
                    <label>{app.translator.trans('fof-links.admin.edit_link.icon_label')}</label>
                    <div className="helpText">
                        {app.translator.trans('fof-links.admin.edit_link.icon_text', {
                            a: <a href="https://fontawesome.com/icons?m=free" tabindex="-1" />,
                        })}
                    </div>
                    <input className="FormControl" placeholder="fas fa-bolt" value={this.icon()} oninput={withAttr('value', this.icon)} />
                </div>,
            ],
            80
        );

        items.add(
            'url',
            [
                <div className="Form-group">
                    <label>{app.translator.trans('fof-links.admin.edit_link.url_label')}</label>
                    <input
                        className="FormControl"
                        placeholder={app.translator.trans('fof-links.admin.edit_link.url_placeholder')}
                        type="url"
                        bidi={this.url}
                    />
                </div>,
            ],
            60
        );

        items.add(
            'checkboxes',
            [
                <div className="Form-group">
                    <div>
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                value="1"
                                checked={this.isInternal()}
                                onchange={(e) => {
                                    if (this.isInternal(e.target.checked)) {
                                        this.isNewtab(false);
                                    }
                                }}
                            />
                            {app.translator.trans('fof-links.admin.edit_link.internal_link')}
                        </label>
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                value="1"
                                checked={this.isNewtab()}
                                onchange={(e) => {
                                    if (this.isNewtab(e.target.checked)) {
                                        this.isInternal(false);
                                    }
                                }}
                            />
                            {app.translator.trans('fof-links.admin.edit_link.open_newtab')}
                        </label>
                    </div>
                </div>,
            ],
            40
        );

        items.add(
            'visibility',
            [
                <div className="Form-group">
                    <label>{app.translator.trans('fof-links.admin.edit_link.visibility')}</label>
                    {Select.component({
                        value: this.visibility(),
                        onchange: this.visibility,
                        options: this.typeOptions(),
                    })}
                </div>,
            ],
            20
        );

        items.add(
            'actions',
            [
                <div className="Form-group">
                    {Button.component(
                        {
                            type: 'submit',
                            className: 'Button Button--primary EditLinkModal-save',
                            loading: this.loading,
                        },
                        app.translator.trans('fof-links.admin.edit_link.submit_button')
                    )}
                    {this.link.exists ? (
                        <button type="button" className="Button EditLinkModal-delete" onclick={() => this.delete()}>
                            {app.translator.trans('fof-links.admin.edit_link.delete_link_button')}
                        </button>
                    ) : (
                        ''
                    )}
                </div>,
            ],
            0
        );

        return items;
    }

    typeOptions() {
        let opts;
        opts = ['everyone', 'members', 'guests'].reduce((o, key) => {
            o[key] = app.translator.trans(`fof-links.admin.edit_link.${key}-label`);

            return o;
        }, {});
        return opts;
    }

    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        this.link
            .save({
                title: this.itemTitle(),
                icon: this.icon(),
                url: this.url(),
                isInternal: this.isInternal(),
                isNewtab: this.isNewtab(),
                visibility: this.visibility(),
            })
            .then(
                () => this.hide(),
                (response) => {
                    this.loading = false;
                    this.handleErrors(response);
                }
            );
    }

    delete() {
        if (confirm(app.translator.trans('fof-links.admin.edit_link.delete_link_confirmation'))) {
            this.link.delete().then(() => m.redraw());
            this.hide();
        }
    }
}
