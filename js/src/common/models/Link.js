import Model from 'flarum/common/Model';
import mixin from 'flarum/common/utils/mixin';

export default class Link extends mixin(Model, {
  title: Model.attribute('title'),
  icon: Model.attribute('icon'),
  type: Model.attribute('type'),
  url: Model.attribute('url'),
  position: Model.attribute('position'),
  isInternal: Model.attribute('isInternal'),
  isNewtab: Model.attribute('isNewtab'),
  useRelMe: Model.attribute('useRelMe'),
  isChild: Model.attribute('isChild'),
  parent: Model.hasOne('parent'),
  visibility: Model.attribute('visibility'),
}) {}
