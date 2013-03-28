/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @name Max Tab Info
 * @author: Nianwei Liu 
 * @fileoverview This is a V3 migration of the http://gmaps-utility-library-dev.googlecode.com/svn/tags/tabbedmaxcontent/1.0/docs/examples.html 
 * 
 */
(function () {
  /*jslint browser:true */
  var defaultStyle = {
    tabBar: {
      background: '#F4F4F4 none repeat scroll 0 0',
      borderBottom: '1px solid #B0B0B0',
      padding: '6px 8px 4px',
      marginRight: '-2px',
      whiteSpace: 'nowrap',
      verticalAlign: 'bottom'
    },
    tabLeft: {},
    tabRight: {},
    tabOn: {
      background: '#FFFFFF none repeat scroll 0 0',
      padding: '6px 8px 4px',
      borderTop: '1px solid #B0B0B0',
      borderLeft: '1px solid #B0B0B0',
      borderRight: '1px solid #B0B0B0',
      borderBottom: '2px solid #FFFFFF',
      color: '#000000',
      textDecoration: 'none',
      fontWeight: 'bold'
    },
    tabOff: {
      background: '#F4F4F4 none repeat scroll 0 0',
      padding: '6px 8px 4px',
      color: '#0000FF',
      border: 'none',
      textDecoration: 'underline',
      fontWeight: 'normal'
    },
    content: {
      borderStyle: 'none solid solid solid',
      borderWidth: '1px',
      borderColor: '#B0B0B0',
      borderTop: 'none',
      overflow: 'auto',
      padding: '4px 4px 4px'
    },
    summary: {
      overflow: 'auto',
      marginBottom: '5px'
    }
  };
  /**
   * set the property of object from another object
   * @param {Object} obj target object
   * @param {Object} vals source object
   */
  var setVals = function (obj, vals) {
    if (obj && vals) {
      for (var x in vals) {
        if (vals.hasOwnProperty(x)) {
          if (obj[x] && typeof vals[x] === 'object') {
            obj[x] = setVals(obj[x], vals[x]);
          } else {
            obj[x] = vals[x];
          }
        }
      }
    }
    return obj;
  };
  
  var callback = function (thisObj, func, args) {
    return function () {
      func.call(thisObj, args);
    };
  };
  /**
   * Create an element
   * @param {String} tag of element
   * @param {Object} attrs name-value of attributes as json
   * @param {String|Node} content DOM node or HTML
   * @param {Object} style css object to set to the element
   * @param {Node} parent if supplied, the node will be appended to the parent
   * @return {Node} the new or modified node
   */
  var createEl = function (tag, attrs, content, style, parent) {
    var node = content;
    if (!content || (content && typeof content === 'string')) {
      node = document.createElement(tag);
      if (content) { // some tag such as img may not allow innerHTML
        node.innerHTML = content;
      }
      
    }
    if (style) {
      setVals(node.style, style);
    }
    if (attrs) {
      setVals(node, attrs);
    }
    if (parent) {
      parent.appendChild(node);
    }
    return node;
  };
  
  /**
   * Get the offset position up to given parent
   * @param {Node} el
   * @param {Node} parent if null will get the DOM root.
   */
  var getPosition = function (el, parent) {
    var leftPos = 0;
    var topPos = 0;
    var par = el;
    while (par && par !== parent) {
      leftPos += par.offsetLeft;
      topPos += par.offsetTop;
      par = par.offsetParent;
    }
    return {
      left: leftPos,
      top: topPos
    };
  };
  var iconUrl = 'https://maps.gstatic.com/mapfiles/mapcontrols3d7.png';
  
  /**
   * Creates a content tab data structure that can be passed in the <code>tabs</code> argument
   * in the <code>openMaxContentTabs*()</code> methods.
   * @name MaxContentTab
   * @class This class represents a tab in the maximized info window. An array of
   *  instances of this class can be passed in as the {@link tabs} argument to
   *  the methods <code>openMaxContentTabs*()</code> etc.
   * This class is similar to the
   * <a target=_blank href=http://code.google.com/apis/maps/documentation/reference.html#GInfoWindowTab>GInfoWindowTab</a>
   * class in the core API.
   * @param {String} label
   * @param {Node|String} content
   */
  function MaxContentTab(label, content) {
    this.label_ = label;
    this.contentNode_ = createEl('div', null, content, null, null);
    this.navNode_ = null;
  }
  
  /**
   * Returns the label of the tab.
   * @return {String} label
   */
  MaxContentTab.prototype.getLabel = function () {
    return this.label_;
  };
  
  /**
   * Returns the content of the tab.
   * @return {Node} conent
   */
  MaxContentTab.prototype.getContentNode = function () {
    return this.contentNode_;
  };
  
  /**
   * @name TabbedMaxContent
   * @class This class represent the max content in the info window.
   * There is no public constructor for this class. If needed, it can be accessed
   * via  <code>GMap2.getTabbedMaxContent()</code>.
   * @param {GInfoWindow} iw
   */
  function MaxTabInfo(opts_tabbed) {
    opts_tabbed = opts_tabbed || {};
    this.style_ = {};
    this.map_ = null;
    this.anchor_ = null;
    this.selectedTab_ = -1;
    
    if (this.maxNode_) {
      google.maps.event.clearInstanceListeners(this.maxNode_);
      this.maxNode_ = null;
    }
    this.minNode_ = createEl('div', {
      id: 'mincontent'
    }, opts_tabbed.content, this.style_.content);
    this.maxNode_ = createEl('div', {
      id: 'maxcontent'
    }, null, this.style_.content);
    
    var selectedTab = opts_tabbed.selectedTab || 0;
    this.style_ = setVals({}, defaultStyle);
    this.style_ = setVals(this.style_, opts_tabbed.style);
    
    this.toggleNode_ = createEl('div', {
      id: 'tmi_plus'
    }, null, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      top: '-8px',
      right: '10px',
      overflow: 'hidden',
      cursor: 'pointer'
    }, this.minNode_);
    this.imgNode_ = createEl('img', {
      src: iconUrl
    }, null, {
      position: 'absolute',
      left: '-23px',
      top: '-405px'
    }, this.toggleNode_);
    google.maps.event.addDomListener(this.toggleNode_, 'click', callback(this, this.toggle));
    
    this.summaryNode_ = createEl('div', null, opts_tabbed.summary, this.style_.summary, this.maxNode_);
    this.navsNode_ = createEl('div', null, null, this.style_.tabBar, this.maxNode_);
    this.contentsNode_ = createEl('div', null, null, null, this.maxNode_);
    // left
    var tabObjs = opts_tabbed.tabs || [];
    var tabs = [];
    createEl('span', null, null, this.style_.tabLeft, this.navsNode_);
    for (var i = 0; i < tabObjs.length; i++) {
      tabs.push(new MaxContentTab(tabObjs[i].label, tabObjs[i].content));
      if (i === selectedTab || tabs[i].getLabel() === selectedTab) {
        this.selectedTab_ = i;
      }
      tabs[i].navNode_ = createEl('span', null, tabs[i].getLabel(), this.style_.tabOff, this.navsNode_);//);
      var node = createEl('div', null, tabs[i].getContentNode(), this.style_.content, this.contentsNode_);
      node.style.display = 'none';
    }
    // right
    createEl('span', null, null, this.style_.tabRight, this.navsNode_);
    this.tabs_ = tabs;
    google.maps.InfoWindow.call(this, opts_tabbed);
    this.setContent(this.minNode_);
  }
  MaxTabInfo.prototype = new google.maps.InfoWindow();
  
  
  
  
  /**
   * Select a tab using the given index or label.
   * @param {Number|String} identifier
   */
  MaxTabInfo.prototype.selectTab = function (identifier) {
    var trigger = false;
    var hasVisibleTab = false;
    var tab;
    for (var i = 0, ct = this.tabs_.length; i < ct; i++) {
      tab = this.tabs_[i];
      if (i === identifier || tab.getLabel() === identifier) {
        if (tab.getContentNode().style.display === 'none') {
          setVals(tab.navNode_.style, this.style_.tabOn);
          tab.getContentNode().style.display = 'block';
          this.selectedTab_ = i;
          trigger = true;
        }
        hasVisibleTab = true;
      } else {
        setVals(tab.navNode_.style, this.style_.tabOff);
        tab.getContentNode().style.display = 'none';
      }
    }
    // avoid excessive event if clicked on a selected tab.
    if (trigger) {
      /**
       * This event is fired after a tab is selected,
       * passing the selected {@link MaxContentTab} into the callback.
       * @name MaxTabInfo#selecttab
       * @param {MaxContentTab} selected tab
       * @event
       */
      google.maps.event.trigger(this, 'selecttab', this.tabs_[this.selectedTab_]);
    }
    if (!hasVisibleTab) {
      this.selectTab(0);
    }
  };
  /**
   * Return the {@link MaxContentTab} at the given index or label.
   * @param {Number|String} identifier
   * @return {MaxContentTab}
   */
  MaxTabInfo.prototype.getTab = function (identifier) {
    for (var i = 0, ct = this.tabs_.length; i < ct; i++) {
      if (i === identifier || this.tabs_[i].getLabel() === identifier) {
        return this.tabs_[i];
      }
    }
  };
  
  /**
   * Adjust sizes of tabs to fit inside the maximized info window.
   * This method is automatically called on <code>
   * GInfoWindow</code>'s <code>'maximizeend'</code> event. However, there may
   * be cases where additional content is loaded in after that event,
   * and an additional resize is needed.
   */
  MaxTabInfo.prototype.checkResize = function () {
    var container = this.getContent();
    // adjust to API internally forced size.
    container.style.width = container.parentNode.style.width;
    container.style.height = container.parentNode.style.height;
    
    var contents = this.contentsNode_;
    var pos = getPosition(contents, container.parentNode);
    for (var i = 0, ct = this.tabs_.length; i < ct; i++) {
      var t = this.tabs_[i].getContentNode();
      t.style.width = (parseInt(container.style.width, 10) - 2 * parseInt(t.style.padding, 10)) + 'px';
      t.style.height = (parseInt(container.style.height, 10) - pos.top) + 'px';
    }
  };
  
  MaxTabInfo.prototype.maximize = function () {
    this.close();
    //var map = this.getMap();
    // this only force infowindow to be as big as possible. The API has its internal max, so checkresize need to do that to avoid overflow.
    var map = this.map_;
    var h = Math.floor(map.getDiv().offsetHeight * 0.8);
    var w = Math.floor(map.getDiv().offsetWidth * 0.8);
    this.maxNode_.style.height = '' + h + 'px';
    this.maxNode_.style.width = '' + w + 'px';
    
    this.setContent(this.maxNode_);
    this.imgNode_.style.top = '-364px';
    this.maxNode_.appendChild(this.toggleNode_);
    
    var me = this;
    google.maps.event.addListenerOnce(this, 'domready', function () {
      me.checkResize();
    });
    for (var i = 0, ct = this.tabs_.length; i < ct; i++) {
      google.maps.event.addDomListener(this.tabs_[i].navNode_, 'click', callback(this, this.selectTab, i));
    }
    this.selectTab(this.selectedTab_);
    this.open(map, this.anchor_);
  };
  MaxTabInfo.prototype.minimize = function () {
    google.maps.event.clearInstanceListeners(this.navsNode_);
    this.close();
    this.setContent(this.minNode_);
    this.imgNode_.style.top = '-405px';
    this.minNode_.appendChild(this.toggleNode_);
    this.open(this.map_, this.anchor_);
  };
  MaxTabInfo.prototype.toggle = function () {
    if (this.getContent() === this.minNode_) {
      this.maximize();
    } else {
      this.minimize();
    }
  };
  MaxTabInfo.prototype.open = function (map, an) {
    this.map_ = map;
    this.anchor_ = an;
    google.maps.InfoWindow.prototype.open.call(this, map, an);
  };
  
  
  window.MaxTabInfo = MaxTabInfo;
})();
