/* global m*/
/* global confirm*/

import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Stream from 'flarum/utils/Stream';
import icon from 'flarum/helpers/icon';
import withAttr from 'flarum/utils/withAttr';

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
                <div className="Form">
                    <div className="Form-group">
                        <label>{app.translator.trans('fof-links.admin.edit_link.title_label')}</label>
                        <input
                            className="FormControl"
                            placeholder={app.translator.trans('fof-links.admin.edit_link.title_placeholder')}
                            bidi={this.itemTitle}
                        />
                    </div>

                    <div className="Form-group">
                        <label>{app.translator.trans('fof-links.admin.edit_link.icon_label')}</label>
                        <div className="helpText">
                            {app.translator.trans('fof-links.admin.edit_link.icon_text', {
                                a: <a href="https://fontawesome.com/icons?m=free" tabindex="-1" />,
                            })}
                        </div>
                        <input className="FormControl" placeholder="fas fa-bolt" value={this.icon()} oninput={withAttr('value', this.icon)} />
                    </div>

                    <div className="Form-group">
                        <label>{app.translator.trans('fof-links.admin.edit_link.url_label')}</label>
                        <input
                            className="FormControl"
                            placeholder={app.translator.trans('fof-links.admin.edit_link.url_placeholder')}
                            type="url"
                            bidi={this.url}
                        />
                    </div>

                    <div className="Form-group">
                        <div>
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    value="1"
                                    checked={this.isInternal()}
                                    onchange={e => {
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
                                    onchange={e => {
                                        if (this.isNewtab(e.target.checked)) {
                                            this.isInternal(false);
                                        }
                                    }}
                                />
                                {app.translator.trans('fof-links.admin.edit_link.open_newtab')}
                            </label>
                        </div>
                    </div>

                    <div className="Form-group">
                        {Button.component({
                            type: 'submit',
                            className: 'Button Button--primary EditLinkModal-save',
                            loading: this.loading,
                        }, app.translator.trans('fof-links.admin.edit_link.submit_button'))}
                        {this.link.exists ? (
                            <button type="button" className="Button EditLinkModal-delete" onclick={() => this.delete()}>
                                {app.translator.trans('fof-links.admin.edit_link.delete_link_button')}
                            </button>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        );
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
            })
            .then(
                () => this.hide(),
                response => {
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
