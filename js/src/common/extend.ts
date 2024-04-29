import Extend from 'flarum/common/extenders';
import Link from './models/Link';

export default [
  new Extend.Store() //
    .add('links', Link),
];
