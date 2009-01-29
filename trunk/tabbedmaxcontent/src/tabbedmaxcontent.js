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
 * @name Tabbed Max Content
 * @version 1.0
 * @author: Nianwei Liu [nianwei at gmail dot com]
 * @fileoverview This lib provides a similar infowindow behavior avaiable at
 * maps.google.com. The maxContent of info window contains multiple tabs.
 */
(function () {
  /*jslint browser:true */
  /*global GMap2,GMarker,GEvent */
  var defaultStyle = {
    tabBar: {
      background: '#F4F4F4 none repeat scroll 0 0',
      borderBottom: '1px solid #B0B0B0',
      padding: '6px 8px 4px',
      marginRight: '13px',
      whiteSpace: 'nowrap',
      verticalAlign: 'bottom'
    },
    tabLeft: {},
    tabRight: {},
    tabOn: {
      background: '#FFFFFF none repeat scroll 0 0',
      padding: '6px 8px 4px',
      borderTop: '1px solid #B0B0B0',
      borderLeft:  '1px solid #B0B0B0',
      borderRight:  '1px solid #B0B0B0',
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
      overflow: 'auto'
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
      node.innerHTML = content || ''; 
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
  
 /**
 * @name TabbedMaxContent
 * @class This class represent the max content in the info window. It has three parts:
 * summary info; tab Navigation bar, and tabbed contents.
 * There is no public constructor for this class. If needed, it can be accessed via 
 * <code>GMap2.getInfoWindowMaxContent()</code> 
 * @param {GInfoWindow} iw 
 */
  function TabbedMaxContent(iw) {
    this.infoWindow_ = iw;
    GEvent.bind(iw, 'maximizeclick', this, this.onMaximizeClick_);
    GEvent.bind(iw, 'restoreclick', this, this.onRestoreClick_);
    GEvent.bind(iw, 'maximizeend', this, this.onMaximizeEnd_);
    this.style_ = {};
    this.maxNode_ = null;
    this.summaryNode_ = null;
    this.navsNode_ = null;
    this.navNodes_ = [];
    this.contentsNode_ = null;
    this.contentNodes_ = [];
  }
  
  /**
   * Before open infowindow, setup contents
   * @param {Node} sumNode summary node
   * @param {GInfoWindowTabs[]} tabs
   * @param {MaxInfoWindowOptions} opt_maxOptions
   * @private
   */
  TabbedMaxContent.prototype.initialize_ = function (sumNode, tabs, opt_maxOptions) {
    this.navNodes_ = [];
    this.contentNodes_ = [];
    this.selectedTab_ = -1;
    if (this.maxNode_) {
      GEvent.clearNode(this.maxNode_);
      this.maxNode_.innerHTML = '';
    } else {
      this.maxNode_ = createEl('div', {
        id: 'maxcontent'
      });
    }
    opt_maxOptions = opt_maxOptions || {};
    var selectedTab = opt_maxOptions.selectedTab || 0;
    // Note it is possible style can be different from one window open action to another open action.
    // even there is only one maxwindow per map. 
    this.style_ = setVals({}, defaultStyle);
    this.style_ = setVals(this.style_, opt_maxOptions.style);
    this.summaryNode_ = createEl('div', null, sumNode, this.style_.summary, this.maxNode_);
    this.navsNode_ = createEl('div', null, null, this.style_.tabBar, this.maxNode_);
    this.contentsNode_ = createEl('div', null, null, null, this.maxNode_);
    if (tabs && tabs.length) {
      // left
      createEl('span', null, null, this.style_.tabLeft, this.navsNode_);
      for (var i = 0, ct = tabs.length; i < ct; i++) {
        if (i === selectedTab || tabs[i].name === selectedTab) {
          this.selectedTab_ = i;
        }
        // note: used 2 undocumented property to avoid creating a new class.
        //http://code.google.com/p/gmaps-api-issues/issues/detail?id=712
        this.navNodes_.push(createEl('span', null, tabs[i].name, this.style_.tabOff, this.navsNode_));
        var cont = createEl('div', null, tabs[i].contentElem, this.style_.content, this.contentsNode_);
        cont.style.display = 'none';
        cont.name = tabs[i].name;
        this.contentNodes_.push(cont);
      }
      // right
      createEl('span', null, null, this.style_.tabRight, this.navsNode_);
    }
  };
  /**
   * Setup event listeners. The core API seems removed all liteners when restored to normal size
   * @private
   */
  TabbedMaxContent.prototype.onMaximizeClick_ = function () {
    for (var i = 0, ct = this.navNodes_.length; i < ct; i++) {
      GEvent.addDomListener(this.navNodes_[i], 'click', GEvent.callback(this, this.selectTab, i));
    }
  };
  /**
   * Clean up listeners on tabs.
   * @private
   */
  TabbedMaxContent.prototype.onRestoreClick_ = function () {
    if (this.maxNode_) {
      GEvent.clearNode(this.maxNode_);
    }
  };
  /**
   * Clean up listeners on tabs.
   * @private
   */
  TabbedMaxContent.prototype.onMaximizeEnd_ = function () {
    this.checkResize();
   // move into checkResize  this.selectTab(this.selectedTab_);
  };
  /**
   * Select tab at given index or name
   * @param {Number|String} t
   */
  TabbedMaxContent.prototype.selectTab = function (t) {
    var trigger = false;
    for (var i = 0, ct = this.navNodes_.length; i < ct; i++) {
      if (i === t || this.contentNodes_[i].name === t) {
        if (this.contentNodes_[i].style.display === 'none') {
          setVals(this.navNodes_[i].style, this.style_.tabOn);
          this.contentNodes_[i].style.display = 'block';
          this.selectedTab_ = i;  
          trigger = true;
        }
      } else {
        setVals(this.navNodes_[i].style, this.style_.tabOff);
        this.contentNodes_[i].style.display = 'none';
      }
    }
    // avoid excessive event if clicked on a selected tab.
    if (trigger) {
      /**
       * This event is fired after a tab is selected.
       * Passing tab name and container node as parameters.
       * @name TabbedMaxContent#selecttab
       * @param {String} name of selected tab
       * @param {Node} Node of tab container
       * @event
       */
      GEvent.trigger(this, 'selecttab', this.contentNodes_[this.selectedTab_].name, this.contentNodes_[this.selectedTab_]);
    }
  };
  /**
   * Get tab Container at given index or name
   * @param {Number|String} t
   * @return {Node}
   */
  TabbedMaxContent.prototype.getTabContainer = function (t) {
    for (var i = 0, ct = this.contentNodes_.length; i < ct; i++) {
      if (i === t || this.contentNodes_[i].name === t) {
        return this.contentNodes_[i];
      }
    }
  };
  
  /**
   * Adjust sizes of tab containers to fit in the max window. 
   * This method is automatically called on <code>
   * GInfoWindow</code>'s <code>'maximizeend'</code> event. However, in some cases such
   * as ajax action changed summary content may require an additional resize.
   */
  TabbedMaxContent.prototype.checkResize = function () {
    var me = this;
    var container = this.infoWindow_.getContentContainers()[0];
    var contents = this.contentsNode_;
    var summary = this.summaryNode_;
    var contNodes = this.contentNodes_;
    // it appears GInfoWindow.maximizeend event is fired too early, 
    // before DOM is ready. As a workaround use a timeout here.
    // See http://code.google.com/p/gmaps-api-issues/issues/detail?id=1020
    setTimeout(function () {
      var pos = getPosition(contents, container);
      for (var i = 0, ct = contNodes.length; i < ct; i++) {
        contNodes[i].style.width = container.style.width;
        contNodes[i].style.height = (parseInt(container.style.height, 10) - pos.top) + 'px';
      }
      // this should be in onMaxmizeEnd_ but DOM is not ready at that time so move to here to avoid
      // errors in selecttab event.
      me.selectTab(me.selectedTab_);
    }, 0);
  };


  /**
   * @name MaxInfoWindowOptions
   * @class Instances of this class are used in the opts_maxOption argument to the methods 
   * openInfoWindowMaxTabs(), openInfoWindowMaxTabsHtml(). It's basically same as <code>GInfoWindowOptions</code> 
   * and will actually be used to pass in as <code>GInfoWindowOptions</code> to  <code>openInfoWindow</code>
   * Please note the <code>GInfoWindowOptions.maxContent</code> is not applicable. 
   * For other properties, see <a href='http://code.google.com/apis/maps/documentation/reference.html#GInfoWindowOptions'>GInfoWindowOptions</a>
   * @property {Object} [style] the object that hold a set of css style of the max content. It has the following properties:
   *     <code> tabOn, tabOff, tabBar, tabLeft, tabRight, content </code>. Each property is a css object such as 
   *     <code> {backgroundColor: 'gray', opacity: 0.2}</code>. 
   * @property {Number|String} [selectedTab] Selects the tab with the given index or name. index base is 0.
   * @property {String} [maxTitle] 	Specifies title to be shown when the infowindow is maximized. The content may be either an HTML string or an HTML DOM element. 
   */
 
  /**
   * @name GMap2
   * @class These are new methods added to Google Maps API's
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GMap2'>GMap2</a>
   * class.
   */
  /**
   * Opens an info window with max content at the given point.
   * The content of the info window is given as DOM node.
   * The max content has summary info and a set of tabs.
   * The content of each tab is DOM node.
   * @param {GLatLng} latlng
   * @param {Node} node
   * @param {Node} summary
   * @param {GInfoWindowTab[]} tabs
   * @param {MaxInfoWindowOptions} opt_maxOptions
   */
  GMap2.prototype.openInfoWindowMaxTabs = function (latlng, minNode, sumNode, tabs, opt_maxOptions) {
    var max = this.getInfoWindowMaxContent();
    var opts = opt_maxOptions || {};
    max.initialize_(sumNode, tabs, opts);
    opts.maxContent = max.maxNode_;
    if (opts.style) {
      delete opts.style;
    }
    if (opts.selectedTab) {
      delete opts.selectedTab;
    }
    minNode.style.marginTop = '5px';
    this.openInfoWindow(latlng, minNode, opts);
  };
  /**
   * Opens an info window with max content at the given point.
   * The content of the info window is given as HTML text.
   * The max content has summary info and a set of tabs.
   * The content of each tab is html.
   * @param {GLatLng} latlng
   * @param {String} html
   * @param {String} summary
   * @param {GInfoWindowTab[]} tabs
   * @param {MaxInfoWindowOptions} opt_maxOptions
   */
  GMap2.prototype.openInfoWindowMaxTabsHtml = function (latlng, html, summary, tabs, opt_maxOptions) {
    this.openInfoWindowMaxTabs(latlng, createEl('div', null, html), createEl('div', null, summary), tabs, opt_maxOptions);
  };
  /**
   * Returns the TabbedMaxContent for the infowindow.
   * @return {TabbedMaxContent}
   */
  GMap2.prototype.getInfoWindowMaxContent = function () {
    this.maxContent_  = this.maxContent_ || new TabbedMaxContent(this.getInfoWindow());
    return this.maxContent_;
  };
  
  /**
   * @name GMarker
   * @class These are new methods added to Google Maps API's
   * <a href  = 'http://code.google.com/apis/maps/documentation/reference.html#GMarker'>GMarker</a>
   * class.
   */
  /**
   * Opens an info window with max content at the marker.
   * The content of the info window is given as HTML text.
   * The max content has summary info and a set of tabs.
   * The content of each tab is html.
   * @param {GMap2} map
   * @param {String} html
   * @param {String} summary
   * @param {GInfoWindowTab[]} tabs
   * @param {MaxInfoWindowOptions} opt_maxOptions
   */
  GMarker.prototype.openInfoWindowMaxTabsHtml = function (map, html, summary, tabs, opt_maxOptions) {
    map.openInfoWindowMaxTabsHtml(this.getLatLng(), html, summary, tabs, opt_maxOptions);
  };
  /**
   * Opens an info window with max content at the given point.
   * The content of the info window is given as DOM node.
   * The max content has summary info and a set of tabs.
   * The content of each tab is DOM node.
   * @param {GMap2} map
   * @param {Node} node
   * @param {Node} summary
   * @param {GInfoWindowTab[]} tabs
   * @param {MaxInfoWindowOptions} opt_maxOptions
   */
  GMarker.prototype.openInfoWindowMaxTabs = function (map, minNode, sumNode, tabs, opt_maxOptions) {
    map.openInfoWindowMaxTabs(this.getLatLng(), minNode, sumNode, tabs, opt_maxOptions);
  };
})();
