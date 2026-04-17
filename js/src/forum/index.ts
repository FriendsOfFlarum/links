import app from 'flarum/forum/app';
import extendHeader from './extendHeader';

export { default as extend } from './extend';

app.initializers.add('fof-links', () => {
  extendHeader();
});
