/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common/extend.ts":
/*!******************************!*\
  !*** ./src/common/extend.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extenders */ "flarum/common/extenders");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_Link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/Link */ "./src/common/models/Link.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default().Store)() //
.add('links', _models_Link__WEBPACK_IMPORTED_MODULE_1__["default"])]);

/***/ }),

/***/ "./src/common/models/Link.ts":
/*!***********************************!*\
  !*** ./src/common/models/Link.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Link)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__);


var Link = /*#__PURE__*/function (_Model) {
  function Link() {
    return _Model.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Link, _Model);
  var _proto = Link.prototype;
  _proto.title = function title() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('title').call(this);
  };
  _proto.icon = function icon() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('icon').call(this);
  };
  _proto.type = function type() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('type').call(this);
  };
  _proto.url = function url() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('url').call(this);
  };
  _proto.position = function position() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('position').call(this);
  };
  _proto.isInternal = function isInternal() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('isInternal').call(this);
  };
  _proto.isNewtab = function isNewtab() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('isNewtab').call(this);
  };
  _proto.useRelMe = function useRelMe() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('useRelMe').call(this);
  };
  _proto.isChild = function isChild() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('isChild').call(this);
  };
  _proto.parent = function parent() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasOne('parent').call(this);
  };
  _proto.isRestricted = function isRestricted() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('isRestricted').call(this);
  };
  _proto.guestOnly = function guestOnly() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('guestOnly').call(this);
  };
  return Link;
}((flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/common/models/index.ts":
/*!************************************!*\
  !*** ./src/common/models/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   models: () => (/* binding */ models)
/* harmony export */ });
/* harmony import */ var _Link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Link */ "./src/common/models/Link.ts");

var models = {
  Link: _Link__WEBPACK_IMPORTED_MODULE_0__["default"]
};

/***/ }),

/***/ "./src/common/utils/index.ts":
/*!***********************************!*\
  !*** ./src/common/utils/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   utils: () => (/* binding */ utils)
/* harmony export */ });
/* harmony import */ var _sortLinks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sortLinks */ "./src/common/utils/sortLinks.js");

var utils = {
  sortLinks: _sortLinks__WEBPACK_IMPORTED_MODULE_0__["default"]
};

/***/ }),

/***/ "./src/common/utils/sortLinks.js":
/*!***************************************!*\
  !*** ./src/common/utils/sortLinks.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sortLinks)
/* harmony export */ });
function sortLinks(links) {
  return links.slice(0).sort(function (a, b) {
    var aPos = a.position();
    var bPos = b.position();
    return aPos > bPos ? 1 : aPos < bPos ? -1 : 0;
  });
}

/***/ }),

/***/ "./src/forum/components/LinkDropdown.js":
/*!**********************************************!*\
  !*** ./src/forum/components/LinkDropdown.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LinkDropdown)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_SplitDropdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/SplitDropdown */ "flarum/common/components/SplitDropdown");
/* harmony import */ var flarum_common_components_SplitDropdown__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_SplitDropdown__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _LinkItem__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./LinkItem */ "./src/forum/components/LinkItem.tsx");
/* harmony import */ var _common_utils_sortLinks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../common/utils/sortLinks */ "./src/common/utils/sortLinks.js");









var LinkDropdown = /*#__PURE__*/function (_SplitDropdown) {
  function LinkDropdown() {
    return _SplitDropdown.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(LinkDropdown, _SplitDropdown);
  LinkDropdown.initAttrs = function initAttrs(attrs) {
    _SplitDropdown.initAttrs.call(this, attrs);
    attrs.className += ' LinkDropdown';
    attrs.buttonClassName += ' Button--link';
  };
  var _proto = LinkDropdown.prototype;
  _proto.view = function view(vnode) {
    var children = this.items().toArray();
    return _SplitDropdown.prototype.view.call(this, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, vnode, {
      children: children
    }));
  };
  _proto.getButton = function getButton(children) {
    // Make a copy of the attrs of the first child component. We will assign
    // these attrs to a new button, so that it has exactly the same behaviour as
    // the first child.
    var firstChild = this.getFirstChild(children);
    firstChild.attrs.className = flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6___default()(firstChild.attrs.className, 'SplitDropdown-button Button', this.attrs.buttonClassName);
    firstChild.attrs.isDropdownButton = true;
    return [firstChild, m("button", {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6___default()('Dropdown-toggle', 'Button', 'Button--icon', this.attrs.buttonClassName),
      "data-toggle": "dropdown"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5___default()('fas fa-caret-down', {
      className: 'Button-caret'
    }))];
  }

  /**
   * Build an item list for the contents of the dropdown menu.
   *
   * @return {ItemList}
   */;
  _proto.items = function items() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default())();
    var parent = this.attrs.link;
    items.add("link" + parent.id(), _LinkItem__WEBPACK_IMPORTED_MODULE_7__["default"].component({
      link: parent
    }));
    (0,_common_utils_sortLinks__WEBPACK_IMPORTED_MODULE_8__["default"])(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().store.all('links')).filter(function (link) {
      return link.parent() === parent;
    }).forEach(function (child) {
      items.add("link" + parent.id() + "-" + child.id(), _LinkItem__WEBPACK_IMPORTED_MODULE_7__["default"].component({
        link: child,
        inDropdown: true
      }));
    });
    return items;
  };
  return LinkDropdown;
}((flarum_common_components_SplitDropdown__WEBPACK_IMPORTED_MODULE_3___default()));


/***/ }),

/***/ "./src/forum/components/LinkItem.tsx":
/*!*******************************************!*\
  !*** ./src/forum/components/LinkItem.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LinkItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Separator */ "flarum/common/components/Separator");
/* harmony import */ var flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_8__);


/* global m*/








var LinkItem = /*#__PURE__*/function (_LinkButton) {
  function LinkItem() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _LinkButton.call.apply(_LinkButton, [this].concat(args)) || this;
    // Just definitions to satisfy TypeScript
    _this.attrs = void 0;
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(LinkItem, _LinkButton);
  var _proto = LinkItem.prototype;
  _proto.view = function view(vnode) {
    if (this.isLabel) return this.labelView(vnode);
    return this.linkView(vnode);
  };
  _proto.labelView = function labelView(vnode) {
    var _this2 = this;
    var link = this.attrs.link;
    var LinkLabelNode = this.attrs.inDropdown ? 'span' : (flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_8___default());
    return m('[', null, this.attrs.inDropdown && m((flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6___default()), null), m(LinkLabelNode, {
      "class": flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7___default()(this["class"], 'LinksButton--label'),
      onclick: function onclick(e) {
        if (_this2.attrs.inDropdown) {
          // don't close dropdown when clicking label
          e.stopPropagation();
        }
      },
      "data-toggle": this.attrs.isDropdownButton ? 'dropdown' : undefined
    }, this.icon, m("span", {
      className: "LinksButton-title"
    }, link.title())), this.attrs.inDropdown && m((flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6___default()), null));
  };
  _proto.linkView = function linkView(vnode) {
    var link = this.attrs.link;
    var linkAttrs = {
      className: this["class"],
      rel: this.rel,
      target: this.linkTarget,
      external: link.isNewtab() ? false : !link.isInternal(),
      href: this.linkHref
    };
    return m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3___default()), linkAttrs, this.icon, m("span", {
      className: "LinksButton-title"
    }, link.title()));
  };
  return (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_0__["default"])(LinkItem, [{
    key: "isInternal",
    get: function get() {
      var link = this.attrs.link;
      return link.isInternal() && !link.isNewtab();
    }
  }, {
    key: "isLabel",
    get: function get() {
      return this.attrs.link.url().length === 0;
    }
  }, {
    key: "linkHref",
    get: function get() {
      var link = this.attrs.link;
      var url = link.url();
      if (url.startsWith('/') && link.isInternal()) {
        return flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().forum.attribute('baseUrl') + url;
      }
      return url;
    }
  }, {
    key: "icon",
    get: function get() {
      var link = this.attrs.link;
      var iconClass = link.icon();
      if (iconClass) {
        return flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5___default()(iconClass, {
          className: 'Button-icon LinksButton-icon'
        });
      }
      return null;
    }
  }, {
    key: "rel",
    get: function get() {
      // Prevent security risk on older browsers.
      // Modern browsers now have `noopener` by default and
      // require `opener` to enable `window.opener`.
      //
      // Learn more:
      // https://web.dev/external-anchors-use-rel-noopener

      return flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7___default()(this.attrs.link.isNewtab() && 'noopener noreferrer', this.attrs.link.useRelMe() && 'me') || undefined;
    }
  }, {
    key: "class",
    get: function get() {
      return flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7___default()('LinksButton', this.attrs.className || 'Button Button--link', {
        'LinksButton--inDropdown': this.attrs.inDropdown,
        active: this.isLinkCurrentPage
      });
    }
  }, {
    key: "isLinkCurrentPage",
    get: function get() {
      var link = this.attrs.link;
      if (!link.isInternal()) return false;
      var base = flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().forum.attribute('baseUrl');

      // Mithril returns the current path relative to the origin, which isn't necessarily the base forum URL
      var currentUrl = new URL(m.route.get() || '/', base);
      var currentPath = currentUrl.href.replace(base, '');

      // The link from `this.linkHref` should already be absolute, but we'll make sure
      var linkUrl = new URL(this.linkHref, base);
      var linkPath = linkUrl.href.replace(base, '');

      // The link is active if the current path starts with the link path.
      // Except if it's the base url, in which case only an exact match is considered active
      return currentPath.indexOf(linkPath) === 0 && (currentPath === '/' || linkPath !== '/');
    }
  }, {
    key: "linkTarget",
    get: function get() {
      var link = this.attrs.link;
      if (this.isInternal) return undefined;
      return link.isNewtab() ? '_blank' : undefined;
    }
  }]);
}((flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_4___default()));


/***/ }),

/***/ "./src/forum/components/index.ts":
/*!***************************************!*\
  !*** ./src/forum/components/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* binding */ components)
/* harmony export */ });
/* harmony import */ var _LinkDropdown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LinkDropdown */ "./src/forum/components/LinkDropdown.js");
/* harmony import */ var _LinkItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LinkItem */ "./src/forum/components/LinkItem.tsx");


var components = {
  LinkDropdown: _LinkDropdown__WEBPACK_IMPORTED_MODULE_0__["default"],
  LinkItem: _LinkItem__WEBPACK_IMPORTED_MODULE_1__["default"]
};

/***/ }),

/***/ "./src/forum/extend.ts":
/*!*****************************!*\
  !*** ./src/forum/extend.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/extend */ "./src/common/extend.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([].concat(_common_extend__WEBPACK_IMPORTED_MODULE_0__["default"]));

/***/ }),

/***/ "./src/forum/extendHeader.tsx":
/*!************************************!*\
  !*** ./src/forum/extendHeader.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ extendHeader)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_HeaderPrimary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/HeaderPrimary */ "flarum/forum/components/HeaderPrimary");
/* harmony import */ var flarum_forum_components_HeaderPrimary__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_HeaderPrimary__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_utils_sortLinks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils/sortLinks */ "./src/common/utils/sortLinks.js");
/* harmony import */ var _components_LinkItem__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/LinkItem */ "./src/forum/components/LinkItem.tsx");
/* harmony import */ var _components_LinkDropdown__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/LinkDropdown */ "./src/forum/components/LinkDropdown.js");






function extendHeader() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_HeaderPrimary__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'items', function (items) {
    var allLinks = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store.all('links');
    var links = allLinks.filter(function (link) {
      return !link.isChild();
    });
    var addLink = function addLink(parent) {
      var hasChildren = allLinks.some(function (link) {
        return link.parent() == parent;
      });

      // If the link has no URL and no children, do not display it.
      if (!(parent != null && parent.url()) && !hasChildren) {
        return;
      }
      items.add("link" + (parent == null ? void 0 : parent.id()), hasChildren ? _components_LinkDropdown__WEBPACK_IMPORTED_MODULE_5__["default"].component({
        link: parent
      }) : _components_LinkItem__WEBPACK_IMPORTED_MODULE_4__["default"].component({
        link: parent
      }));
    };
    (0,_common_utils_sortLinks__WEBPACK_IMPORTED_MODULE_3__["default"])(links).map(addLink);
  });
}

/***/ }),

/***/ "./src/forum/index.ts":
/*!****************************!*\
  !*** ./src/forum/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_2__.components),
/* harmony export */   extend: () => (/* reexport safe */ _extend__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   models: () => (/* reexport safe */ _common_models__WEBPACK_IMPORTED_MODULE_4__.models),
/* harmony export */   utils: () => (/* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_3__.utils)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _extendHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extendHeader */ "./src/forum/extendHeader.tsx");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components */ "./src/forum/components/index.ts");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils */ "./src/common/utils/index.ts");
/* harmony import */ var _common_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/models */ "./src/common/models/index.ts");
/* harmony import */ var _extend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./extend */ "./src/forum/extend.ts");






flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('fof-links', function () {
  (0,_extendHeader__WEBPACK_IMPORTED_MODULE_1__["default"])();
});

/***/ }),

/***/ "flarum/common/Model":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['common/Model']" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Model'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/Link":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/components/Link']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Link'];

/***/ }),

/***/ "flarum/common/components/LinkButton":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['common/components/LinkButton']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LinkButton'];

/***/ }),

/***/ "flarum/common/components/Separator":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['common/components/Separator']" ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Separator'];

/***/ }),

/***/ "flarum/common/components/SplitDropdown":
/*!************************************************************************!*\
  !*** external "flarum.core.compat['common/components/SplitDropdown']" ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/SplitDropdown'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/extenders":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/extenders']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extenders'];

/***/ }),

/***/ "flarum/common/helpers/icon":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/icon']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/icon'];

/***/ }),

/***/ "flarum/common/utils/ItemList":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/ItemList']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/ItemList'];

/***/ }),

/***/ "flarum/common/utils/classList":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/utils/classList']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/classList'];

/***/ }),

/***/ "flarum/forum/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['forum/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/app'];

/***/ }),

/***/ "flarum/forum/components/HeaderPrimary":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['forum/components/HeaderPrimary']" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/HeaderPrimary'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t, o);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function toPrimitive(t, r) {
  if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function toPropertyKey(t) {
  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t, "string");
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : i + "";
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.components),
/* harmony export */   extend: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.extend),
/* harmony export */   models: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.models),
/* harmony export */   utils: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.utils)
/* harmony export */ });
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.ts");
/*
 * This file is part of fof/links.
 *
 * Copyright (c) 2018 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map