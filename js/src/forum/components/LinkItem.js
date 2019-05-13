/* global m*/

import app from 'flarum/app';
import LinkButton from 'flarum/components/LinkButton';

export default class LinkItem extends LinkButton {
    view() {
        const link = this.props.link;
        let className = 'LinksButton Button Button--link';

        if (link.isInternal()) {
            const currentPath = m.route();
            const linkPath = link.url().replace(app.forum.attribute('baseUrl'), '');
            // The link is active if the current path starts with the link path.
            // Except if it's the base url, in which case only an exact match is considered active
            if (currentPath.indexOf(linkPath) === 0 && (currentPath === '/' || linkPath !== '/')) {
                className += ' active';
            }
        }

        return (
            <a
                className={className}
                target={link.isNewtab() ? '_blank' : ''}
                config={link.isInternal() ? m.route : ''}
                href={link.url()}
                title={link.title()}
            >
                {link.title()}
            </a>
        );
    }
}
