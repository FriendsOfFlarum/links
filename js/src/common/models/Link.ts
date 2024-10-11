import Model from 'flarum/common/Model';

export default class Link extends Model {
  title() {
    return Model.attribute<string>('title').call(this);
  }

  icon() {
    return Model.attribute<string>('icon').call(this);
  }

  type() {
    return Model.attribute<string>('type').call(this);
  }

  url() {
    return Model.attribute<string>('url').call(this);
  }

  position() {
    return Model.attribute<number | null | undefined>('position').call(this);
  }

  isInternal() {
    return Model.attribute<boolean>('isInternal').call(this);
  }

  isNewtab() {
    return Model.attribute<boolean>('isNewtab').call(this);
  }

  useRelMe() {
    return Model.attribute<boolean>('useRelMe').call(this);
  }

  isChild() {
    return Model.attribute<boolean>('isChild').call(this);
  }

  parent() {
    return Model.hasOne<Link>('parent').call(this);
  }

  isRestricted() {
    return Model.attribute<boolean>('isRestricted').call(this);
  }

  guestOnly() {
    return Model.attribute<boolean>('guestOnly').call(this);
  }
}
