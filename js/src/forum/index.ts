import app from 'flarum/forum/app';
import extendHeader from './extendHeader';

export * from './components';
export * from '../common/utils';
export * from '../common/models';

export { default as extend } from './extend';

app.initializers.add('fof-links', () => {
  extendHeader();
});
