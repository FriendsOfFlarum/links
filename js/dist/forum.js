(()=>{var t={n:n=>{var r=n&&n.__esModule?()=>n.default:()=>n;return t.d(r,{a:r}),r},d:(n,r)=>{for(var o in r)t.o(r,o)&&!t.o(n,o)&&Object.defineProperty(n,o,{enumerable:!0,get:r[o]})},o:(t,n)=>Object.prototype.hasOwnProperty.call(t,n),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},n={};(()=>{"use strict";t.r(n),t.d(n,{components:()=>M,models:()=>V,utils:()=>T});const r=flarum.core.compat["forum/app"];var o=t.n(r);const e=flarum.core.compat["common/extend"],i=flarum.core.compat["common/components/HeaderPrimary"];var a=t.n(i);function s(t,n){return s=Object.setPrototypeOf||function(t,n){return t.__proto__=n,t},s(t,n)}function l(t,n){t.prototype=Object.create(n.prototype),t.prototype.constructor=t,s(t,n)}const c=flarum.core.compat["common/Model"];var u=t.n(c);const p=flarum.core.compat["common/utils/mixin"];var f=function(t){function n(){return t.apply(this,arguments)||this}return l(n,t),n}(t.n(p)()(u(),{title:u().attribute("title"),icon:u().attribute("icon"),type:u().attribute("type"),url:u().attribute("url"),position:u().attribute("position"),isInternal:u().attribute("isInternal"),isNewtab:u().attribute("isNewtab"),isChild:u().attribute("isChild"),parent:u().hasOne("parent"),visibility:u().attribute("visibility")}));function d(t,n){for(var r=0;r<n.length;r++){var o=n[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}const h=flarum.core.compat["common/components/Link"];var k=t.n(h);const v=flarum.core.compat["common/components/LinkButton"];var b=t.n(v);const y=flarum.core.compat["common/helpers/icon"];var w=t.n(y);const g=flarum.core.compat["common/components/Separator"];var N=t.n(g);const B=flarum.core.compat["common/utils/classList"];var L=t.n(B);const D=flarum.core.compat["common/components/Button"];var O=t.n(D),P=function(t){function n(){for(var n,r=arguments.length,o=new Array(r),e=0;e<r;e++)o[e]=arguments[e];return(n=t.call.apply(t,[this].concat(o))||this).attrs=void 0,n}l(n,t);var r,e,i=n.prototype;return i.view=function(t){return this.isLabel?this.labelView(t):this.linkView(t)},i.labelView=function(t){var n=this,r=this.attrs.link,o=this.attrs.inDropdown?"span":O();return m("[",null,this.attrs.inDropdown&&m(N(),null),m(o,{class:L()(this.class,"LinksButton--label"),onclick:function(t){n.attrs.inDropdown&&t.stopPropagation()},"data-toggle":this.attrs.isDropdownButton?"dropdown":void 0},this.icon," ",r.title()),this.attrs.inDropdown&&m(N(),null))},i.linkView=function(t){var n=this.attrs.link,r={className:this.class,rel:this.rel,target:this.linkTarget,external:!n.isNewtab()&&!n.isInternal(),href:n.url()};return m(k(),r,this.icon," ",n.title())},r=n,(e=[{key:"isInternal",get:function(){var t=this.attrs.link;return t.isInternal()&&!t.isNewtab()}},{key:"isLabel",get:function(){return 0===this.attrs.link.url().length}},{key:"icon",get:function(){var t=this.attrs.link.icon();return t?w()(t,{className:"Button-icon"}):null}},{key:"rel",get:function(){return this.attrs.link.isNewtab()?"noopener noreferrer":void 0}},{key:"class",get:function(){return L()("LinksButton",this.attrs.className||"Button Button--link",{"LinksButton--inDropdown":this.attrs.inDropdown,active:this.isLinkCurrentPage})}},{key:"isLinkCurrentPage",get:function(){var t=this.attrs.link;if(!t.isInternal())return!1;var n=m.route.get()||"/",r=t.url().replace(o().forum.attribute("baseUrl"),"");return""===r&&(r="/"),0===n.indexOf(r)&&("/"===n||"/"!==r)}},{key:"linkTarget",get:function(){var t=this.attrs.link;if(!t.isInternal())return t.isNewtab()?"_blank":void 0}}])&&d(r.prototype,e),n}(b());function j(){return j=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t},j.apply(this,arguments)}const C=flarum.core.compat["common/components/SplitDropdown"];var I=t.n(C);const _=flarum.core.compat["common/utils/ItemList"];var S=t.n(_);function x(t){return t.slice(0).sort((function(t,n){var r=t.position(),o=n.position();return r>o?1:r<o?-1:0}))}var A=function(t){function n(){return t.apply(this,arguments)||this}l(n,t),n.initAttrs=function(n){t.initAttrs.call(this,n),n.className+=" LinkDropdown",n.buttonClassName+=" Button--link"};var r=n.prototype;return r.view=function(n){var r=this.items().toArray();return t.prototype.view.call(this,j({},n,{children:r}))},r.getButton=function(t){var n=this.getFirstChild(t);return n.attrs.className=L()(n.attrs.className,"SplitDropdown-button Button",this.attrs.buttonClassName),n.attrs.isDropdownButton=!0,[n,m("button",{className:L()("Dropdown-toggle","Button","Button--icon",this.attrs.buttonClassName),"data-toggle":"dropdown"},w()("fas fa-caret-down",{className:"Button-caret"}))]},r.items=function(){var t=new(S()),n=this.attrs.link;return t.add("link"+n.id(),P.component({link:n})),x(o().store.all("links")).filter((function(t){return t.parent()===n})).forEach((function(r){t.add("link"+n.id()+"-"+r.id(),P.component({link:r,inDropdown:!0}))})),t},n}(I()),M={LinkDropdown:A,LinkItem:P},T={sortLinks:x},V={Link:f};o().initializers.add("fof-links",(function(){o().store.models.links=f,(0,e.extend)(a().prototype,"items",(function(t){x(o().store.all("links").filter((function(t){return!t.isChild()}))).map((function(n){var r=!!o().store.all("links").filter((function(t){return t.parent()==n})).length;t.add("link"+n.id(),r?A.component({link:n}):P.component({link:n}))}))}))}))})(),module.exports=n})();
//# sourceMappingURL=forum.js.map