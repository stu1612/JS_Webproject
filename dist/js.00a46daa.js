// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/index.js":[function(require,module,exports) {
var controller;
var slideScene;
var pageScene;
var detailScene;

function animateSlides() {
  // init controller
  controller = new ScrollMagic.Controller(); // Select e

  var sliders = document.querySelectorAll('.slide');
  var header = document.querySelector('.nav-header'); // loop over slides

  sliders.forEach(function (slide, index, slides) {
    var revealImg = slide.querySelector('.reveal-img');
    var img = slide.querySelector('img');
    var revealText = slide.querySelector('.reveal-text'); //GSAP

    var slideTl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "slow"
      }
    });
    slideTl.fromTo(revealImg, {
      x: '0%'
    }, {
      x: '100%'
    });
    slideTl.fromTo(img, {
      scale: 2
    }, {
      scale: 1
    }, '-=1');
    slideTl.fromTo(revealText, {
      y: '0%'
    }, {
      y: '100%'
    }, '-=.85'); // slideTl.fromTo(header, { y: '-100%' }, { y: '0%' });
    // create scene

    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: .5,
      reverse: false
    }).setTween(slideTl) // .addIndicators({ colorStart: 'white', colorTrigger: 'white', name: 'slide' })
    .addTo(controller); //New ANimation

    var pageTl = gsap.timeline();
    var nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, {
      y: "0%"
    }, {
      y: "50%"
    });
    pageTl.fromTo(slide, {
      opacity: 1,
      scale: 1
    }, {
      opacity: 0,
      scale: 0.5
    });
    pageTl.fromTo(nextSlide, {
      y: "50%"
    }, {
      y: "0%"
    }, "-=0.5"); //Create new scene

    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0
    }) // .addIndicators({
    //   colorStart: "white",
    //   colorTrigger: "white",
    //   name: "page",
    //   indent: 200
    // })
    .setPin(slide, {
      pushFollowers: false
    }).setTween(pageTl).addTo(controller);
  });
}

var mouse = document.querySelector(".cursor");
var mouseTxt = mouse.querySelector("span");
var burger = document.querySelector(".burger");

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  var item = e.target;

  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }

  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, {
      y: "0%"
    });
    mouseTxt.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    mouseTxt.innerText = "";
    gsap.to(".title-swipe", 1, {
      y: "100%"
    });
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, {
      rotate: "45",
      y: 5,
      background: "black"
    });
    gsap.to(".line2", 0.5, {
      rotate: "-45",
      y: -5,
      background: "black"
    });
    gsap.to("#logo", 1, {
      color: "black"
    });
    gsap.to(".nav-bar", 1, {
      clipPath: "circle(2500px at 100% -10%)"
    });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, {
      rotate: "0",
      y: 0,
      background: "white"
    });
    gsap.to(".line2", 0.5, {
      rotate: "0",
      y: 0,
      background: "white"
    });
    gsap.to("#logo", 1, {
      color: "white"
    });
    gsap.to(".nav-bar", 1, {
      clipPath: "circle(50px at 100% -10%)"
    });
    document.body.classList.remove("hide");
  }
} //Barba Page Transitions


var logo = document.querySelector("#logo");
barba.init({
  views: [{
    namespace: "home",
    beforeEnter: function beforeEnter() {
      animateSlides();
      logo.href = "./index.html";
    },
    beforeLeave: function beforeLeave() {
      slideScene.destroy();
      pageScene.destroy();
      controller.destroy();
    }
  }, {
    namespace: "fashion",
    beforeEnter: function beforeEnter() {
      logo.href = "../index.html";
      detailAnimation();
    },
    beforeLeave: function beforeLeave() {
      controller.destroy();
      detailScene.destroy();
    }
  }],
  transitions: [{
    leave: function leave(_ref) {
      var current = _ref.current,
          next = _ref.next;
      var done = this.async(); //An Animation

      var tl = gsap.timeline({
        defaults: {
          ease: "power2.inOut"
        }
      });
      tl.fromTo(current.container, 1, {
        opacity: 1
      }, {
        opacity: 0
      });
      tl.fromTo(".swipe", 0.75, {
        x: "-100%"
      }, {
        x: "0%",
        onComplete: done
      }, "-=0.5");
    },
    enter: function enter(_ref2) {
      var current = _ref2.current,
          next = _ref2.next;
      var done = this.async(); //Scroll to the top

      window.scrollTo(0, 0); //An Animation

      var tl = gsap.timeline({
        defaults: {
          ease: "power2.inOut"
        }
      });
      tl.fromTo(".swipe", 1, {
        x: "0%"
      }, {
        x: "100%",
        stagger: 0.2,
        onComplete: done
      });
      tl.fromTo(next.container, 1, {
        opacity: 0
      }, {
        opacity: 1
      });
      tl.fromTo(".nav-header", 1, {
        y: "-100%"
      }, {
        y: "0%",
        ease: "power2.inOut"
      }, "-=1.5");
    }
  }]
});

function detailAnimation() {
  controller = new ScrollMagic.Controller();
  var slides = document.querySelectorAll(".detail-slide");
  slides.forEach(function (slide, index, slides) {
    var slideTl = gsap.timeline({
      defaults: {
        duration: 1
      }
    });
    var nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    var nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, {
      opacity: 1
    }, {
      opacity: 0
    });
    slideTl.fromTo(nextSlide, {
      opacity: 0
    }, {
      opacity: 1
    }, "-=1");
    slideTl.fromTo(nextImg, {
      x: "50%"
    }, {
      x: "0%"
    }); //Scene

    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0
    }).setPin(slide, {
      pushFollowers: false
    }).setTween(slideTl) // .addIndicators({
    //   colorStart: "white",
    //   colorTrigger: "white",
    //   name: "detailScene"
    // })
    .addTo(controller);
  });
} //EventListeners


burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
},{}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57131" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map