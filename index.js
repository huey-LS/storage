(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Storage = factory());
}(this, function () { 'use strict';
  var defaultFormat = {
    stringify: function (value, version) {
      return encodeURIComponent(JSON.stringify(value)) + '|' + version;
    },
    parse: function (dataString) {
      var dataArray = dataString ? dataString.split('|') : [];
      return {
        value: dataArray[0] && JSON.parse(decodeURIComponent(dataArray[0])),
        version: dataArray[1]
      }
    }
  }

  var Cookie = {
    set: setCookie,
    get: getCookie,
    remove: removeCookie,
    subscribe: function () {}
  };

  var LocalStorage = {
    set: setLocalStorage,
    get: getLocalStorage,
    remove: removeLocalStorage,
    subscribe: subscribeLocalStorageChange
  };

  var Storage = function (key, options) {
    options = options || {};
    var format = options.format;
    var storage = options.storage || LocalStorage;
    var extraOptions = options.options || {};

    this._key = key;
    this._format = format || defaultFormat;
    this._extraOptions = extraOptions;

    this._storage = storage;
    this._dataVersion = this.getStoredDataVersion();
  };

  Storage.prototype.set = function (value) {
    this._dataVersion = this.createDataVersion();
    return this._storage.set(
      this._key,
      this._format.stringify(value, this._dataVersion),
      this._extraOptions
    )
  }

  Storage.prototype.get = function () {
    var value = this.getCompleteData();
    return value.value;
  }

  Storage.prototype.getCompleteData = function () {
    var value = this._storage.get(this._key);
    var completeData;
    try {
      completeData = this._format.parse(value)
    } catch (e) {}
    return completeData || {};
  }

  Storage.prototype.createDataVersion = function () {
    // TODO:
    return (new Date()).getTime();
  }

  Storage.prototype.getStoredDataVersion = function () {
    var value = this.getCompleteData();
    return value.version;
  }

  Storage.prototype.subscribe = function (callback) {
    var _self = this;
    return this._storage.subscribe(this._key, function (newValue) {
      if (!newValue) {
        newValue = _self.getCompleteData();
      } else {
        newValue = _self._format.parse(newValue);
      }
      console.log('get new value', newValue)
      if (newValue.version && newValue.version !== _self._dataVersion) {
        console.log('update version')
        _self._dataVersion = newValue.version
        callback(newValue.value);
      }
    })
  }

  Storage.prototype.remove = function () {
    return this._storage.remove(this._key);
  }


  return {
    default: Storage,
    storages: {
      cookie: Cookie,
      localStorage: LocalStorage
    },
    formats: {
      default: defaultFormat
    }
  };

  // localStorage
  function setLocalStorage (key, value) {
    return localStorage.setItem(key, value);
  }

  function getLocalStorage (key) {
    return localStorage.getItem(key);
  }

  function removeLocalStorage (key) {
    return localStorage.removeItem(key);
  }

  function subscribeLocalStorageChange (key, callback) {
    var fn = function (e) {
      e = e || window.event;
      if (!e.key) {
        // ie8 没有key, 自动响应一次
        setTimeout(function () {
          callback();
        }, 0)
      } else if (e.key === key) {
        callback(e.newValue);
      }
    }

    var unSubscribe;

    var DEFAULT_VERSION = 9.0;
    var ua = navigator.userAgent;
    var ieReg =  ua.match(/MSIE ([\d.]+)/);
    var ieVersion;
    if (ieReg) {
      ieVersion = ieReg[1];
    }

    if(ieVersion && ieVersion <= DEFAULT_VERSION) {
      var prevValue = getLocaleStorage(key);
      var ts = 100;
      var time;
      var checkChange = function () {
        var newValue = getLocaleStorage(key);;
        if (newValue !== prevValue) {
          // trigger change
          fn({ key: key, newValue: newValue });
          prevValue = newValue;
        }
        time = setTimeout(checkChange, ts);
      };
      time = setTimeout(checkChange, ts);

      unSubscribe = function () {
        clearTimeout(time);
      }
    } else if (window.addEventListener) {
      window.addEventListener('storage', fn, false);
      unSubscribe = function () {
        window.removeEventListener('storage', fn)
      }
    }

    return unSubscribe;
  }

  // cookie
  function setCookie (key, value, options) {
    options = options || {};
    var date = new Date();
    var days = options.expires || 1;
    var maxAge = (days * 24 * 60 * 60);
    var path = options.path;
    var domain = options.domain;
    date.setTime(date.getTime() + (maxAge * 1000));
    var expires = date.toUTCString();
    var cookieArray = [];
    cookieArray.push(key + '=' + encodeURIComponent(value));
    cookieArray.push('expires=' + expires);
    if (path) {
      cookieArray.push('path=' + path);
    }
    if (domain) {
      cookieArray.push('domain=' + domain);
    }
    document.cookie = cookieArray.join(';');
  }

  function getCookie (key) {
    var cookies = document.cookie.split(';');
    var i = 0;
    var len = cookies.length;
    var cookie;
    for (; i < len; i++) {
      cookie = cookies[i].split('=');
      if (cookie[0] === key) {
        return decodeURIComponent(cookie[1])
      }
    }
  }

  function removeCookie (key) {
    document.cookie = key + '=; Max-Age=-99999999;';
  }
}));