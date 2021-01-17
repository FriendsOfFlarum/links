/* global m*/

import app from 'flarum/app';
import Link from 'flarum/components/Link';
import LinkButton from 'flarum/components/LinkButton';
import icon from 'flarum/helpers/icon';

export default class LinkItem extends LinkButton {
    view() {
        const link = this.attrs.link;
        let className = `LinksButton ${this.attrs.className || 'Button Button--link'}`;
        const iconName = link.icon();

        if (link.isInternal()) {
            const currentPath = m.route.get() || '/';
            let linkPath = link.url().replace(app.forum.attribute('baseUrl'), '');

            if (linkPath === '') linkPath = '/';

            // The link is active if the current path starts with the link path.
            // Except if it's the base url, in which case only an exact match is considered active
            if (currentPath.indexOf(linkPath) === 0 && (currentPath === '/' || linkPath !== '/')) {
                className += ' active';
            }
        }

        const linkAttrs = {
            className: className,
            target: link.isNewtab() ? '_blank' : '',
            title: link.title(),
            external: !link.isInternal(),
            href: link.url(),
        };

        return (
            <Link {...linkAttrs}>
                {iconName ? icon(iconName, { className: 'Button-icon' }) : ''}
                {link.title()}
            </Link>
        );
    }
}
