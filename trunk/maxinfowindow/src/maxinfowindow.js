/**
 * @name MaxInfoWindow
 * @version 1.0
 * @author: Nianwei Liu [nianwei at gmail dot com]
 * @fileoverview This lib provides a similar infowindow behavior avaiable at
 * maps.google.com. The maxContent of info window contains multiple tabs.
 */
/*!
 *
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
(function () {
  /*jslint browser:true */
  /*global GMap2,GEvent,GInfoWindow */
  
  var tabStyle = {
    bar: {
      background: '#F4F4F4 none repeat scroll 0 0',
      borderBottom: '1px solid #B0B0B0',
      padding: '6px 8px 4px',
      marginRight: '8px',
      whiteSpace: 'nowrap',
      verticalAlign: 'bottom'
    },
    left: {
      padding: '4px'
    },
    right: {
      width: '100%'
    },
    on: {
      background: '#FFFFFF none repeat scroll 0 0',
      padding: '6px 8px 4px',
      borderColor: '#B0B0B0 #B0B0B0 #FFFFFF',
      borderStyle: 'solid',
      borderWidth: '1px',
      color: '#000000',
      textDecoration: 'none'
    },
    off: {
      background: '#F4F4F4 none repeat scroll 0 0',
      padding: '6px 8px 4px',
      color: '#0000FF',
      border: 'none',
      textDecoration: 'underline'
    }
  };
  
  var map;
  var iw;
  var maxClickListener;
  var restoreClickListener;
  var maxEndListener;
  var maxDiv;
  var navs = [];
  var contents = [];
  
  /**
   * set the property of object from another object
   * @param {Object} obj target object
   * @param {Object} vals source object
   */
  function setVals(obj, vals) {
    if (obj && vals) {
      for (var x in vals) {
        if (vals.hasOwnProperty(x)) {
          obj[x] = vals[x];
        }
      }
    }
    return obj;
  }
  /**
   * Create an element 
   * @param {String} tag of element
   * @param {String|Node} content DOM node or HTML
   * @param {Object} style css object to set
   * @param {Node} parent will append the new node to it if supplied
   * @return {Node} the new modified node 
   */
  function createEl(tag, attrs, content, style, parent) {
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
  }
  /**
   * Select tab at given index
   * @param {Object} t
   */
  function selectTab(t) {
    for (var i = 0, ct = navs.length; i < ct; i++) {
      if (i === t) {
        setVals(navs[i].style, tabStyle.on);
        contents[i].style.display = 'block';
      } else {
        setVals(navs[i].style, tabStyle.off);
        contents[i].style.display = 'none';
      }
    }
  }
  function getPosition(el, parent) {
    var leftPos = el.offsetLeft;
    var topPos = el.offsetTop;
    var par = el.offsetParent;
    while (par && par != parent) {
      leftPos += par.offsetLeft;
      topPos += par.offsetTop;
      par = par.offsetParent;
    }
    return {
      left: leftPos,
      top: topPos
    };
    
  }
  function adjustSize() {
     var node = iw.getContentContainers()[0];
     var pos= getPosition(contents[0], node);
     GLog.write(node.style.width + node.style.height + 'left'+pos.left + 'top' + pos.top);
     
  }
  /**
   * Setup event listeners. The core API seems removed all liteners when restored to normal size
   */
  function setupTabs() {
    for (var i = 0, ct = navs.length; i < ct; i++) {
      // it also is possible to avoid a closure here by assing tab index to the node.
      GEvent.addDomListener(navs[i], 'click', GEvent.callback(null, selectTab, i));
    }
  }
  
  /**
   * Clean up listeners on tabs.
   */
  function clearTabs() {
    if (maxDiv) {
      GEvent.clearNode(maxDiv);
      maxDiv = null;
    }
  }
  
  /**
   * Create max content
   * @param {Node|String} summary 
   * @param {GInfoWindowTab[]} tabs
   * @param {Number} selectedTab
   */
  function createMaxContent(summary, tabs, selectedTab) {
    clearTabs();
    navs = [];
    contents = [];
    maxDiv = createEl('div', {id:'maxinfowindow'});
    //maxTabs = tabs;
    createEl('div', null, summary, null, maxDiv);
    var navDiv = createEl('div', null, null, tabStyle.bar, maxDiv);
    var contentDiv = createEl('div', null, null, null, maxDiv);
    if (tabs && tabs.length) {
      createEl('span', null, null, tabStyle.left, navDiv);
      for (var i = 0, ct = tabs.length; i < ct; i++) {
        // note: used 2 undocumented property to avoid create a new class.
        //http://code.google.com/p/gmaps-api-issues/issues/detail?id=712
        navs.push(createEl('span', null, tabs[i].name, (i === selectedTab)? tabStyle.on:tabStyle.off, navDiv));
        var cont = createEl('div', null, tabs[i].contentElem, {display: (i === selectedTab)?'block':'none'}, contentDiv);
        // for later retrieval
        cont.name = tabs[i].name;
        contents.push(cont);
      }
      createEl('span', null, null, tabStyle.right, navDiv);
    }
  }
  /**
   * add listeners to InfoWindow
   */
  function setUpListeners() {
    // we only want the listeners add once to avoid repeat excution.
    // the sample http://gmaps-samples.googlecode.com/svn/trunk/megawindow/maxcontent_ajax_id.html
    // has a bug that adds too many listeners to infoWindow causing repeat execution.
    if (!iw) {
      iw = map.getInfoWindow();
      
      iw.getMaxTabContainer = function(name) {
        for (var i = 0, c = contents.length; i < c; i++) {
          if (contents[i].name === name) {
            return contents[i];
          }
        }
        return null;
      };
      maxClickListener = GEvent.addListener(iw, 'maximizeclick', setupTabs);
      restoreClickListener = GEvent.addListener(iw, 'restoreclick', clearTabs);
      maxEndListener = GEvent.addListener(iw, 'maximizeend', adjustSize);
      
    }
  }
  /**
   * @name GMap2
   * @class This is new methods added to Google Maps API's
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
   * @param {MaxInfoWindowOptions} opts
   */
  GMap2.prototype.openInfoWindowMaxTabs = function (latlng, node, summary, tabs, opts) {
    map = this;
    opts = opts || {};
    createMaxContent(summary, tabs, opts.selectedTab || 0);
    setUpListeners();
    this.openInfoWindow(latlng, node, setVals(opts, {
      maxContent: maxDiv
    }));
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
   * @param {MaxInfoWindowOptions} opts
   */
  GMap2.prototype.openInfoWindowMaxTabsHtml = function (latlng, html, summary, tabs, opts) {
    this.openInfoWindowMaxTabs(latlng, createEl('div', null, html), createEl('div', null, summary), tabs, opts);
  };
  
})();
