/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "4e30d8dbae2364789394"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(Object.defineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(Object.defineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _GLHelpers = __webpack_require__(2);

	var _GLHelpers2 = _interopRequireDefault(_GLHelpers);

	var _SceneLine = __webpack_require__(23);

	var _SceneLine2 = _interopRequireDefault(_SceneLine);

	var _datGui = __webpack_require__(131);

	var _datGui2 = _interopRequireDefault(_datGui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import Scene from './Scene';

	// import Scene from './ScenePlaneToSphere';
	window.addEventListener('DOMContentLoaded', _init);
	window.GL = _GLHelpers2.default;

	var scene,
	    gl,
	    mouseX,
	    mouseY,
	    globalTime = Math.random() * 10000,
	    canvas;

	function _init() {
	  // console.log(GLHelpers);


	  window.isMobile = false;
	  (function (a) {
	    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true;
	  })(navigator.userAgent || navigator.vendor || window.opera);
	  var iPad = navigator.userAgent.toLowerCase().indexOf('ipad') !== -1;

	  if (!isMobile) {

	    isMobile = iPad;
	  }

	  canvas = document.createElement('canvas');
	  canvas.className = 'canvas';
	  document.body.appendChild(canvas);

	  var p = document.createElement("p");
	  p.setAttribute("id", "info");
	  p.innerHTML = isMobile ? "TOUCH SCREEN" : "PRESS (SPACE)";

	  document.body.appendChild(p);

	  gl = canvas.getContext("webgl");
	  if (!gl) {

	    return;
	  }

	  _GLHelpers2.default.reset(gl);

	  // window.gui = new dat.GUI({ width:300 });

	  // create the shaders

	  window.addEventListener('mousemove', function (e) {
	    mouseX = (e.clientX / window.innerWidth - 0.5) * 2.0;
	    mouseY = (e.clientY / window.innerHeight - 0.5) * 2.0;
	  });

	  window.addEventListener('resize', resize);

	  resize();

	  scene = new _SceneLine2.default();

	  update();
	}

	// function resizeCanvasToDisplaySize(canvas, multiplier) {
	//   multiplier = multiplier || 1;
	//   var width  = canvas.clientWidth  * multiplier | 0;
	//   var height = canvas.clientHeight * multiplier | 0;
	//
	//   if (canvas.width !== width ||  canvas.height !== height) {
	//     canvas.width  = width;
	//     canvas.height = height;
	//
	//     canvas.style.top = (window.innerHeight - height)/2 + "px";
	//     canvas.style.left = (window.innerWidth - width)/2 + "px";
	//
	//     return true;
	//   }
	//   return false;
	// }

	function update() {

	  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	  globalTime += 0.01;
	  scene.update();

	  window.requestAnimationFrame(update);
	}

	function resize() {
	  var width = Math.min(window.innerWidth, window.innerHeight, 500);
	  var height = width;

	  if (scene) {
	    scene.resize(window.innerWidth, window.innerHeight);
	  }
	  _GLHelpers2.default.resize(window.innerWidth, window.innerHeight);
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var getAttribLoc = function getAttribLoc(gl, shaderProgram, name) {
		if (shaderProgram.cacheAttribLoc === undefined) {
			shaderProgram.cacheAttribLoc = {};
		}
		if (shaderProgram.cacheAttribLoc[name] === undefined) {
			shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name);
		}

		return shaderProgram.cacheAttribLoc[name];
	};

	var gl = void 0;

	var GLHelpers = function () {
		function GLHelpers() {
			(0, _classCallCheck3.default)(this, GLHelpers);

			this.gl = null;
			this.canvas = null;
			this.width = 0;
			this.height = 0;
			this.aspectRatio = 0;

			this.camera = null;
			this.shader = null;
			this.shaderProgram = null;

			this._enabledVertexAttribute = [];
			this._lastMesh = null;
		}

		(0, _createClass3.default)(GLHelpers, [{
			key: 'reset',
			value: function reset(_gl) {
				this.gl = _gl;
				gl = _gl;
				this.canvas = gl.canvas;
			}
		}, {
			key: 'useShader',
			value: function useShader(shader) {
				this.shader = shader;
				this.shaderProgram = this.shader.shaderProgram;

				// console.log(this.shaderProgram.id);
				// this.draw(); // for the main uniforms
			}
		}, {
			key: 'setMatrices',
			value: function setMatrices(camera) {
				this.camera = camera;
			}
		}, {
			key: 'draw',
			value: function draw(mMesh, mDrawingType) {

				if (this._lastMesh !== mMesh) {
					this._bindBuffers(mMesh);
				}

				if (this.camera && this.camera !== undefined && this.camera.projection) {
					this.shader.uniform('u_worldViewProjection', 'mat4', this.camera.projection);
					this.shader.uniform('u_world', 'mat4', this.camera.matrix);
				}

				var drawType = mMesh.drawType;
				if (mDrawingType !== undefined) {
					drawType = mDrawingType;
				}

				// if(drawType === gl.POINTS) {
				// 	gl.drawArrays(drawType, 0, mMesh.vertexSize);
				// } else {

				gl.drawElements(drawType, mMesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				// }
			}
		}, {
			key: '_bindBuffers',
			value: function _bindBuffers(mMesh) {
				//	ATTRIBUTES
				for (var i = 0; i < mMesh._attributes.length; i++) {

					var attribute = mMesh._attributes[i];
					gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
					var attrPosition = getAttribLoc(gl, this.shaderProgram, attribute.name);

					// console.log(attribute.name + " " +  attrPosition + " // size " + attribute.itemSize);
					gl.vertexAttribPointer(attrPosition, attribute.itemSize, gl.FLOAT, false, 0, 0);

					if (this._enabledVertexAttribute.indexOf(attrPosition) === -1) {
						gl.enableVertexAttribArray(attrPosition);
						this._enabledVertexAttribute.push(attrPosition);
					}
				}

				//	BIND INDEX BUFFER
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mMesh.iBuffer);

				this._lastMesh = mMesh;
			}
		}, {
			key: 'resize',
			value: function resize(width, height) {

				this.canvas.style.width = width + 'px';
				this.canvas.style.height = height + 'px';
				this.canvas.style.top = (window.innerHeight - height) / 2 + 'px';
				this.canvas.style.left = (window.innerWidth - width) / 2 + 'px';

				this.width = width;
				this.height = height;

				this.canvas.width = this.width;
				this.canvas.height = this.height;
				this.aspectRatio = this.width / this.height;

				this.gl.viewport(0, 0, this.width, this.height);
			}
		}]);
		return GLHelpers;
	}();

	var gh = new GLHelpers();

	exports.default = gh;
	// export default GLHelpers;

	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(5);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(6), __esModule: true };

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(7);
	var $Object = __webpack_require__(10).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(8);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(18), 'Object', {defineProperty: __webpack_require__(14).f});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(9)
	  , core      = __webpack_require__(10)
	  , ctx       = __webpack_require__(11)
	  , hide      = __webpack_require__(13)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 9 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 10 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(12);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(14)
	  , createDesc = __webpack_require__(22);
	module.exports = __webpack_require__(18) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(15)
	  , IE8_DOM_DEFINE = __webpack_require__(17)
	  , toPrimitive    = __webpack_require__(21)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(18) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(18) && !__webpack_require__(19)(function(){
	  return Object.defineProperty(__webpack_require__(20)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(19)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16)
	  , document = __webpack_require__(9).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(16);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(35);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(82);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(86);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _Scene2 = __webpack_require__(94);

	var _Scene3 = _interopRequireDefault(_Scene2);

	var _Easings = __webpack_require__(118);

	var _Easings2 = _interopRequireDefault(_Easings);

	var _ViewLine = __webpack_require__(119);

	var _ViewLine2 = _interopRequireDefault(_ViewLine);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SceneLine = function (_Scene) {
	  (0, _inherits3.default)(SceneLine, _Scene);

	  function SceneLine() {
	    (0, _classCallCheck3.default)(this, SceneLine);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (SceneLine.__proto__ || (0, _getPrototypeOf2.default)(SceneLine)).call(this));

	    var gl = GL.gl;
	    // gl.enable(0x8861);
	    _this.firstTime = true;
	    _this.tick = 0;

	    _this.viewLine = new _ViewLine2.default();

	    // TEXTURE

	    // var image = new Image();
	    // image.src = "../../assets/images/circle.png";  // MUST BE SAME DOMAIN!!!
	    // image.onload = function() {
	    //   var texture = gl.createTexture();
	    //   gl.bindTexture(gl.TEXTURE_2D, texture);
	    //
	    //   // Set the parameters so we can render any size image.
	    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    //
	    //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	    //
	    //   this.shader.uniform("u_image", "int", 0);
	    //
	    // }.bind(this)


	    // Upload the image into the texture.

	    // gui.add(this, 'percentage', 0, 1);

	    return _this;
	  }

	  (0, _createClass3.default)(SceneLine, [{
	    key: 'render',
	    value: function render() {

	      (0, _get3.default)(SceneLine.prototype.__proto__ || (0, _getPrototypeOf2.default)(SceneLine.prototype), 'render', this).call(this);

	      this.viewLine.render();
	      // Easings.instance.update();
	      // this.tick++;
	    }
	  }]);
	  return SceneLine;
	}(_Scene3.default);

	exports.default = SceneLine;
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(25), __esModule: true };

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(26);
	module.exports = __webpack_require__(10).Object.getPrototypeOf;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(27)
	  , $getPrototypeOf = __webpack_require__(29);

	__webpack_require__(34)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(28);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(30)
	  , toObject    = __webpack_require__(27)
	  , IE_PROTO    = __webpack_require__(31)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(32)('keys')
	  , uid    = __webpack_require__(33);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(9)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(8)
	  , core    = __webpack_require__(10)
	  , fails   = __webpack_require__(19);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(36);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(37);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(66);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(38), __esModule: true };

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(39);
	__webpack_require__(61);
	module.exports = __webpack_require__(65).f('iterator');

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(40)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(42)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(41)
	  , defined   = __webpack_require__(28);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(43)
	  , $export        = __webpack_require__(8)
	  , redefine       = __webpack_require__(44)
	  , hide           = __webpack_require__(13)
	  , has            = __webpack_require__(30)
	  , Iterators      = __webpack_require__(45)
	  , $iterCreate    = __webpack_require__(46)
	  , setToStringTag = __webpack_require__(59)
	  , getPrototypeOf = __webpack_require__(29)
	  , ITERATOR       = __webpack_require__(60)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(13);

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(47)
	  , descriptor     = __webpack_require__(22)
	  , setToStringTag = __webpack_require__(59)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(13)(IteratorPrototype, __webpack_require__(60)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(15)
	  , dPs         = __webpack_require__(48)
	  , enumBugKeys = __webpack_require__(57)
	  , IE_PROTO    = __webpack_require__(31)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(20)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(58).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(14)
	  , anObject = __webpack_require__(15)
	  , getKeys  = __webpack_require__(49);

	module.exports = __webpack_require__(18) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(50)
	  , enumBugKeys = __webpack_require__(57);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(30)
	  , toIObject    = __webpack_require__(51)
	  , arrayIndexOf = __webpack_require__(54)(false)
	  , IE_PROTO     = __webpack_require__(31)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(52)
	  , defined = __webpack_require__(28);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(53);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(51)
	  , toLength  = __webpack_require__(55)
	  , toIndex   = __webpack_require__(56);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(41)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(41)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9).document && document.documentElement;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(14).f
	  , has = __webpack_require__(30)
	  , TAG = __webpack_require__(60)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(32)('wks')
	  , uid        = __webpack_require__(33)
	  , Symbol     = __webpack_require__(9).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(62);
	var global        = __webpack_require__(9)
	  , hide          = __webpack_require__(13)
	  , Iterators     = __webpack_require__(45)
	  , TO_STRING_TAG = __webpack_require__(60)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(63)
	  , step             = __webpack_require__(64)
	  , Iterators        = __webpack_require__(45)
	  , toIObject        = __webpack_require__(51);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(42)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(60);

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(67), __esModule: true };

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(68);
	__webpack_require__(79);
	__webpack_require__(80);
	__webpack_require__(81);
	module.exports = __webpack_require__(10).Symbol;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(9)
	  , has            = __webpack_require__(30)
	  , DESCRIPTORS    = __webpack_require__(18)
	  , $export        = __webpack_require__(8)
	  , redefine       = __webpack_require__(44)
	  , META           = __webpack_require__(69).KEY
	  , $fails         = __webpack_require__(19)
	  , shared         = __webpack_require__(32)
	  , setToStringTag = __webpack_require__(59)
	  , uid            = __webpack_require__(33)
	  , wks            = __webpack_require__(60)
	  , wksExt         = __webpack_require__(65)
	  , wksDefine      = __webpack_require__(70)
	  , keyOf          = __webpack_require__(71)
	  , enumKeys       = __webpack_require__(72)
	  , isArray        = __webpack_require__(75)
	  , anObject       = __webpack_require__(15)
	  , toIObject      = __webpack_require__(51)
	  , toPrimitive    = __webpack_require__(21)
	  , createDesc     = __webpack_require__(22)
	  , _create        = __webpack_require__(47)
	  , gOPNExt        = __webpack_require__(76)
	  , $GOPD          = __webpack_require__(78)
	  , $DP            = __webpack_require__(14)
	  , $keys          = __webpack_require__(49)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(77).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(74).f  = $propertyIsEnumerable;
	  __webpack_require__(73).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(43)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(13)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(33)('meta')
	  , isObject = __webpack_require__(16)
	  , has      = __webpack_require__(30)
	  , setDesc  = __webpack_require__(14).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(19)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(9)
	  , core           = __webpack_require__(10)
	  , LIBRARY        = __webpack_require__(43)
	  , wksExt         = __webpack_require__(65)
	  , defineProperty = __webpack_require__(14).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(49)
	  , toIObject = __webpack_require__(51);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(49)
	  , gOPS    = __webpack_require__(73)
	  , pIE     = __webpack_require__(74);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 73 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 74 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(53);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(51)
	  , gOPN      = __webpack_require__(77).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(50)
	  , hiddenKeys = __webpack_require__(57).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(74)
	  , createDesc     = __webpack_require__(22)
	  , toIObject      = __webpack_require__(51)
	  , toPrimitive    = __webpack_require__(21)
	  , has            = __webpack_require__(30)
	  , IE8_DOM_DEFINE = __webpack_require__(17)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(18) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 79 */
/***/ function(module, exports) {

	

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(70)('asyncIterator');

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(70)('observable');

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _getOwnPropertyDescriptor = __webpack_require__(83);

	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

	  if (desc === undefined) {
	    var parent = (0, _getPrototypeOf2.default)(object);

	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;

	    if (getter === undefined) {
	      return undefined;
	    }

	    return getter.call(receiver);
	  }
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(84), __esModule: true };

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(85);
	var $Object = __webpack_require__(10).Object;
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $Object.getOwnPropertyDescriptor(it, key);
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject                 = __webpack_require__(51)
	  , $getOwnPropertyDescriptor = __webpack_require__(78).f;

	__webpack_require__(34)('getOwnPropertyDescriptor', function(){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(87);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(91);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(36);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(89);
	module.exports = __webpack_require__(10).Object.setPrototypeOf;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(8);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(90).set});

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(16)
	  , anObject = __webpack_require__(15);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(11)(Function.call, __webpack_require__(78).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(92), __esModule: true };

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(93);
	var $Object = __webpack_require__(10).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(8)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(47)});

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _Matrices = __webpack_require__(95);

	var _Matrices2 = _interopRequireDefault(_Matrices);

	var _Camera = __webpack_require__(96);

	var _Camera2 = _interopRequireDefault(_Camera);

	var _GLShader = __webpack_require__(97);

	var _GLShader2 = _interopRequireDefault(_GLShader);

	var _GLHelpers = __webpack_require__(2);

	var _GLHelpers2 = _interopRequireDefault(_GLHelpers);

	var _OrbitalControl = __webpack_require__(98);

	var _OrbitalControl2 = _interopRequireDefault(_OrbitalControl);

	var _Floor = __webpack_require__(99);

	var _Floor2 = _interopRequireDefault(_Floor);

	var _ViewBackground = __webpack_require__(108);

	var _ViewBackground2 = _interopRequireDefault(_ViewBackground);

	var _AxisY = __webpack_require__(111);

	var _AxisY2 = _interopRequireDefault(_AxisY);

	var _ViewSphere = __webpack_require__(114);

	var _ViewSphere2 = _interopRequireDefault(_ViewSphere);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import ViewCube from './views/ViewCube';
	// import DirectionalLight from './helpers/gl_helpers/lights/DirectionalLight';
	// import PointLight from './helpers/gl_helpers/lights/PointLight';

	var gl = void 0;

	var Scene = function () {
	  function Scene() {
	    (0, _classCallCheck3.default)(this, Scene);

	    gl = _GLHelpers2.default.gl;
	    this.tick = 0;

	    gl.enable(gl.DEPTH_TEST);
	    gl.enable(gl.BLEND);
	    // gl.enable(0x8642)
	    // gl.enable(gl.CULL_FACE);
	    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	    this.orbitalControl = new _OrbitalControl2.default();
	    this.camera = new _Camera2.default();

	    // this.directionalLight = new DirectionalLight();
	    // this.pointLight = new PointLight();

	    this.viewBackground = new _ViewBackground2.default();
	    this.viewFloor = new _Floor2.default();
	    this.viewSphere = new _ViewSphere2.default();
	    // this.viewCube = new ViewCube();

	    // this.viewCube.attachLights(this.directionalLight);

	    window.addEventListener('resize', this.resize.bind(this));
	  }

	  (0, _createClass3.default)(Scene, [{
	    key: 'update',
	    value: function update() {

	      this.render();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      _GLHelpers2.default.setMatrices(this.camera);

	      this.tick++;
	      this.orbitalControl.offsetPosition[0] = 0;
	      this.orbitalControl.offsetPosition[1] = 250;
	      this.orbitalControl.radius = 800; // + Math.cos(this.tick/100) * 100;
	      // this.orbitalControl.angleA = Math.PI/2 + Math.cos(this.tick/200) * Math.PI/8;
	      this.orbitalControl.angleA += 0.004;
	      // this.orbitalControl.angleA = Math.PI /2;
	      this.orbitalControl.update();
	      this.camera.position = this.orbitalControl.position;

	      this.camera.perspective(60 * Math.PI / 180, _GLHelpers2.default.aspectRatio, 1, 2000);
	      var target = [0, 0, 0];
	      var up = [0, 1, 0];

	      this.camera.lookAt(target, up);

	      gl.disable(gl.DEPTH_TEST);
	      // this.viewBackground.render();
	      gl.enable(gl.DEPTH_TEST);

	      // this.viewFloor.render();


	      // this.viewSphere.render();
	      // this.viewCube.render();
	    }
	  }, {
	    key: 'resize',
	    value: function resize() {
	      _GLHelpers2.default.resize(window.innerWidth, window.innerHeight);
	      this.camera.setAspectRatio(_GLHelpers2.default.aspectRatio);
	    }
	  }]);
	  return Scene;
	}();

	exports.default = Scene;
	module.exports = exports['default'];

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Matrices = function () {
	  function Matrices() {
	    (0, _classCallCheck3.default)(this, Matrices);
	  }

	  (0, _createClass3.default)(Matrices, [{
	    key: "multiply",
	    value: function multiply(a, b, dst) {
	      dst = dst || new Float32Array(16);
	      var b00 = b[0 * 4 + 0];
	      var b01 = b[0 * 4 + 1];
	      var b02 = b[0 * 4 + 2];
	      var b03 = b[0 * 4 + 3];
	      var b10 = b[1 * 4 + 0];
	      var b11 = b[1 * 4 + 1];
	      var b12 = b[1 * 4 + 2];
	      var b13 = b[1 * 4 + 3];
	      var b20 = b[2 * 4 + 0];
	      var b21 = b[2 * 4 + 1];
	      var b22 = b[2 * 4 + 2];
	      var b23 = b[2 * 4 + 3];
	      var b30 = b[3 * 4 + 0];
	      var b31 = b[3 * 4 + 1];
	      var b32 = b[3 * 4 + 2];
	      var b33 = b[3 * 4 + 3];
	      var a00 = a[0 * 4 + 0];
	      var a01 = a[0 * 4 + 1];
	      var a02 = a[0 * 4 + 2];
	      var a03 = a[0 * 4 + 3];
	      var a10 = a[1 * 4 + 0];
	      var a11 = a[1 * 4 + 1];
	      var a12 = a[1 * 4 + 2];
	      var a13 = a[1 * 4 + 3];
	      var a20 = a[2 * 4 + 0];
	      var a21 = a[2 * 4 + 1];
	      var a22 = a[2 * 4 + 2];
	      var a23 = a[2 * 4 + 3];
	      var a30 = a[3 * 4 + 0];
	      var a31 = a[3 * 4 + 1];
	      var a32 = a[3 * 4 + 2];
	      var a33 = a[3 * 4 + 3];
	      dst[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
	      dst[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
	      dst[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
	      dst[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
	      dst[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
	      dst[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
	      dst[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
	      dst[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
	      dst[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
	      dst[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
	      dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
	      dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
	      dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
	      dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
	      dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
	      dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
	      return dst;
	    }
	  }, {
	    key: "projection",
	    value: function projection(width, height, dst) {
	      dst = dst || this.identity();
	      // Note: This matrix flips the Y axis so that 0 is at the top.
	      dst = [2 / width, 0, 0, 0, 0, -2 / height, 0, 0, -1, 1, 1, 0, 0, 0, 0, 1];
	      return dst;
	    }
	  }, {
	    key: "yRotate",
	    value: function yRotate(m, angleInRadians, dst) {
	      // this is the optimized verison of
	      // return multiply(m, yRotation(angleInRadians), dst);
	      dst = dst || new Float32Array(16);

	      var m00 = m[0 * 4 + 0];
	      var m01 = m[0 * 4 + 1];
	      var m02 = m[0 * 4 + 2];
	      var m03 = m[0 * 4 + 3];
	      var m20 = m[2 * 4 + 0];
	      var m21 = m[2 * 4 + 1];
	      var m22 = m[2 * 4 + 2];
	      var m23 = m[2 * 4 + 3];
	      var c = Math.cos(angleInRadians);
	      var s = Math.sin(angleInRadians);

	      dst[0] = c * m00 - s * m20;
	      dst[1] = c * m01 - s * m21;
	      dst[2] = c * m02 - s * m22;
	      dst[3] = c * m03 - s * m23;
	      dst[8] = c * m20 + s * m00;
	      dst[9] = c * m21 + s * m01;
	      dst[10] = c * m22 + s * m02;
	      dst[11] = c * m23 + s * m03;

	      if (m !== dst) {
	        dst[4] = m[4];
	        dst[5] = m[5];
	        dst[6] = m[6];
	        dst[7] = m[7];
	        dst[12] = m[12];
	        dst[13] = m[13];
	        dst[14] = m[14];
	        dst[15] = m[15];
	      }

	      return dst;
	    }
	  }, {
	    key: "translate",
	    value: function translate(m, tx, ty, tz, dst) {
	      // This is the optimized version of
	      // return multiply(m, translation(tx, ty, tz), dst);
	      dst = dst || new Float32Array(16);

	      var m00 = m[0];
	      var m01 = m[1];
	      var m02 = m[2];
	      var m03 = m[3];
	      var m10 = m[1 * 4 + 0];
	      var m11 = m[1 * 4 + 1];
	      var m12 = m[1 * 4 + 2];
	      var m13 = m[1 * 4 + 3];
	      var m20 = m[2 * 4 + 0];
	      var m21 = m[2 * 4 + 1];
	      var m22 = m[2 * 4 + 2];
	      var m23 = m[2 * 4 + 3];
	      var m30 = m[3 * 4 + 0];
	      var m31 = m[3 * 4 + 1];
	      var m32 = m[3 * 4 + 2];
	      var m33 = m[3 * 4 + 3];

	      if (m !== dst) {
	        dst[0] = m00;
	        dst[1] = m01;
	        dst[2] = m02;
	        dst[3] = m03;
	        dst[4] = m10;
	        dst[5] = m11;
	        dst[6] = m12;
	        dst[7] = m13;
	        dst[8] = m20;
	        dst[9] = m21;
	        dst[10] = m22;
	        dst[11] = m23;
	      }

	      dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
	      dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
	      dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
	      dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

	      return dst;
	    }
	  }, {
	    key: "translation",
	    value: function translation(tx, ty, tz, dst) {
	      dst = dst || new Float32Array(16);

	      dst[0] = 1;
	      dst[1] = 0;
	      dst[2] = 0;
	      dst[3] = 0;
	      dst[4] = 0;
	      dst[5] = 1;
	      dst[6] = 0;
	      dst[7] = 0;
	      dst[8] = 0;
	      dst[9] = 0;
	      dst[10] = 1;
	      dst[11] = 0;
	      dst[12] = tx;
	      dst[13] = ty;
	      dst[14] = tz;
	      dst[15] = 1;

	      return dst;
	    }
	  }, {
	    key: "yRotation",
	    value: function yRotation(angleInRadians, dst) {
	      dst = dst || new Float32Array(16);
	      var c = Math.cos(angleInRadians);
	      var s = Math.sin(angleInRadians);

	      dst[0] = c;
	      dst[1] = 0;
	      dst[2] = -s;
	      dst[3] = 0;

	      dst[4] = 0;
	      dst[5] = 1;
	      dst[6] = 0;
	      dst[7] = 0;

	      dst[8] = s;
	      dst[9] = 0;
	      dst[10] = c;
	      dst[11] = 0;

	      dst[12] = 0;
	      dst[13] = 0;
	      dst[14] = 0;
	      dst[15] = 1;

	      return dst;
	    }
	  }, {
	    key: "rotationMatrix",
	    value: function rotationMatrix(axis, angle, matrice) {
	      matrice = matrice || this.identity();

	      axis = this.normalize(axis);
	      var s = Math.sin(angle);
	      var c = Math.cos(angle);
	      var oc = 1.0 - c;

	      return [oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0, oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0, oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0, 0.0, 0.0, 0.0, 1.0];
	    }
	  }, {
	    key: "identity",
	    value: function identity(dst) {
	      dst = dst || new Float32Array(16);

	      dst[0] = 1;
	      dst[1] = 0;
	      dst[2] = 0;
	      dst[3] = 0;
	      dst[4] = 0;
	      dst[5] = 1;
	      dst[6] = 0;
	      dst[7] = 0;
	      dst[8] = 0;
	      dst[9] = 0;
	      dst[10] = 1;
	      dst[11] = 0;
	      dst[12] = 0;
	      dst[13] = 0;
	      dst[14] = 0;
	      dst[15] = 1;

	      return dst;
	    }
	  }, {
	    key: "transpose",
	    value: function transpose(m, dst) {
	      dst = dst || new Float32Array(16);

	      dst[0] = m[0];
	      dst[1] = m[4];
	      dst[2] = m[8];
	      dst[3] = m[12];
	      dst[4] = m[1];
	      dst[5] = m[5];
	      dst[6] = m[9];
	      dst[7] = m[13];
	      dst[8] = m[2];
	      dst[9] = m[6];
	      dst[10] = m[10];
	      dst[11] = m[14];
	      dst[12] = m[3];
	      dst[13] = m[7];
	      dst[14] = m[11];
	      dst[15] = m[15];

	      return dst;
	    }
	  }, {
	    key: "inverse",
	    value: function inverse(m, dst) {
	      dst = dst || new Float32Array(16);
	      var m00 = m[0 * 4 + 0];
	      var m01 = m[0 * 4 + 1];
	      var m02 = m[0 * 4 + 2];
	      var m03 = m[0 * 4 + 3];
	      var m10 = m[1 * 4 + 0];
	      var m11 = m[1 * 4 + 1];
	      var m12 = m[1 * 4 + 2];
	      var m13 = m[1 * 4 + 3];
	      var m20 = m[2 * 4 + 0];
	      var m21 = m[2 * 4 + 1];
	      var m22 = m[2 * 4 + 2];
	      var m23 = m[2 * 4 + 3];
	      var m30 = m[3 * 4 + 0];
	      var m31 = m[3 * 4 + 1];
	      var m32 = m[3 * 4 + 2];
	      var m33 = m[3 * 4 + 3];
	      var tmp_0 = m22 * m33;
	      var tmp_1 = m32 * m23;
	      var tmp_2 = m12 * m33;
	      var tmp_3 = m32 * m13;
	      var tmp_4 = m12 * m23;
	      var tmp_5 = m22 * m13;
	      var tmp_6 = m02 * m33;
	      var tmp_7 = m32 * m03;
	      var tmp_8 = m02 * m23;
	      var tmp_9 = m22 * m03;
	      var tmp_10 = m02 * m13;
	      var tmp_11 = m12 * m03;
	      var tmp_12 = m20 * m31;
	      var tmp_13 = m30 * m21;
	      var tmp_14 = m10 * m31;
	      var tmp_15 = m30 * m11;
	      var tmp_16 = m10 * m21;
	      var tmp_17 = m20 * m11;
	      var tmp_18 = m00 * m31;
	      var tmp_19 = m30 * m01;
	      var tmp_20 = m00 * m21;
	      var tmp_21 = m20 * m01;
	      var tmp_22 = m00 * m11;
	      var tmp_23 = m10 * m01;

	      var t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
	      var t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
	      var t2 = tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
	      var t3 = tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

	      var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

	      dst[0] = d * t0;
	      dst[1] = d * t1;
	      dst[2] = d * t2;
	      dst[3] = d * t3;
	      dst[4] = d * (tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30 - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
	      dst[5] = d * (tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30 - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
	      dst[6] = d * (tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30 - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
	      dst[7] = d * (tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20 - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
	      dst[8] = d * (tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33 - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
	      dst[9] = d * (tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33 - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
	      dst[10] = d * (tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33 - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
	      dst[11] = d * (tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23 - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
	      dst[12] = d * (tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12 - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
	      dst[13] = d * (tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22 - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
	      dst[14] = d * (tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02 - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
	      dst[15] = d * (tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12 - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

	      return dst;
	    }
	  }, {
	    key: "cross",
	    value: function cross(a, b, dst) {
	      dst = dst || new Float32Array(3);
	      dst[0] = a[1] * b[2] - a[2] * b[1];
	      dst[1] = a[2] * b[0] - a[0] * b[2];
	      dst[2] = a[0] * b[1] - a[1] * b[0];
	      return dst;
	    }
	  }, {
	    key: "normalize",
	    value: function normalize(v, dst) {
	      dst = dst || new Float32Array(3);
	      var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	      // make sure we don't divide by 0.
	      if (length > 0.00001) {
	        dst[0] = v[0] / length;
	        dst[1] = v[1] / length;
	        dst[2] = v[2] / length;
	      }
	      return dst;
	    }
	  }, {
	    key: "multiplyVectorsScalar",
	    value: function multiplyVectorsScalar(scalar, a, dst) {
	      dst = dst || new Float32Array(3);
	      dst[0] = a[0] * scalar;
	      dst[1] = a[1] * scalar;
	      dst[2] = a[2] * scalar;

	      return dst;
	    }
	  }, {
	    key: "subtractVectors",
	    value: function subtractVectors(a, b, dst) {
	      dst = dst || new Float32Array(3);
	      dst[0] = a[0] - b[0];
	      dst[1] = a[1] - b[1];
	      dst[2] = a[2] - b[2];
	      return dst;
	    }
	  }, {
	    key: "addVectors",
	    value: function addVectors(a, b, dst) {
	      dst = dst || new Float32Array(3);
	      dst[0] = a[0] + b[0];
	      dst[1] = a[1] + b[1];
	      dst[2] = a[2] + b[2];
	      return dst;
	    }
	  }]);
	  return Matrices;
	}();

	var m = new Matrices();

	exports.default = m;
	// export default Matrices;

	module.exports = exports['default'];

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _Matrices = __webpack_require__(95);

	var _Matrices2 = _interopRequireDefault(_Matrices);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Camera = function () {
	  function Camera() {
	    (0, _classCallCheck3.default)(this, Camera);

	    // camera
	    this.aspectRatio = _Matrices2.default.identity();
	    this.matrix = _Matrices2.default.identity();
	    this.projection = _Matrices2.default.identity();
	    this.position = [0, 0, 0];
	  }

	  (0, _createClass3.default)(Camera, [{
	    key: 'lookAt',
	    value: function lookAt(target, up, dst) {
	      dst = dst || new Float32Array(16);
	      var zAxis = _Matrices2.default.normalize(_Matrices2.default.subtractVectors(this.position, target));
	      var xAxis = _Matrices2.default.normalize(_Matrices2.default.cross(up, zAxis));
	      var yAxis = _Matrices2.default.normalize(_Matrices2.default.cross(zAxis, xAxis));

	      dst[0] = xAxis[0];
	      dst[1] = xAxis[1];
	      dst[2] = xAxis[2];
	      dst[3] = 0;
	      dst[4] = yAxis[0];
	      dst[5] = yAxis[1];
	      dst[6] = yAxis[2];
	      dst[7] = 0;
	      dst[8] = zAxis[0];
	      dst[9] = zAxis[1];
	      dst[10] = zAxis[2];
	      dst[11] = 0;
	      dst[12] = this.position[0];
	      dst[13] = this.position[1];
	      dst[14] = this.position[2];
	      dst[15] = 1;

	      this.matrix = dst;

	      return dst;
	    }
	  }, {
	    key: 'setAspectRatio',
	    value: function setAspectRatio(aspectRatio) {
	      this.aspectRatio = aspectRatio;
	      this.perspective(this.fov, aspectRatio, this.near, this.far);
	    }
	  }, {
	    key: 'perspective',
	    value: function perspective(fov, aspect, near, far, dst) {
	      this.fov = fov;
	      this.near = near;
	      this.far = far;

	      dst = dst || new Float32Array(16);
	      var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
	      var rangeInv = 1.0 / (near - far);

	      dst[0] = f / aspect;
	      dst[1] = 0;
	      dst[2] = 0;
	      dst[3] = 0;
	      dst[4] = 0;
	      dst[5] = f;
	      dst[6] = 0;
	      dst[7] = 0;
	      dst[8] = 0;
	      dst[9] = 0;
	      dst[10] = (near + far) * rangeInv;
	      dst[11] = -1;
	      dst[12] = 0;
	      dst[13] = 0;
	      dst[14] = near * far * rangeInv * 2;
	      dst[15] = 0;

	      this.projection = _Matrices2.default.multiply(dst, _Matrices2.default.inverse(this.matrix));

	      return this.projection;
	    }
	  }, {
	    key: 'orthographic',
	    value: function orthographic(left, right, bottom, top, near, far, dst) {
	      dst = dst || new Float32Array(16);

	      dst[0] = 2 / (right - left);
	      dst[1] = 0;
	      dst[2] = 0;
	      dst[3] = 0;
	      dst[4] = 0;
	      dst[5] = 2 / (top - bottom);
	      dst[6] = 0;
	      dst[7] = 0;
	      dst[8] = 0;
	      dst[9] = 0;
	      dst[10] = 2 / (near - far);
	      dst[11] = 0;
	      dst[12] = (left + right) / (left - right);
	      dst[13] = (bottom + top) / (bottom - top);
	      dst[14] = (near + far) / (near - far);
	      dst[15] = 1;

	      return dst;
	    }
	  }]);
	  return Camera;
	}();

	// const  gh = new Camera();

	// export default gh;


	exports.default = Camera;
	module.exports = exports['default'];

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _GLHelpers = __webpack_require__(2);

	var _GLHelpers2 = _interopRequireDefault(_GLHelpers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var gl = void 0;

	function isSame(array1, array2) {
		if (array1.length !== array2.length) {
			return false;
		}

		for (var i = 0; i < array1.length; i++) {
			if (array1[i] !== array2[i]) {
				return false;
			}
		}

		return true;
	};

	var uniformMapping = {
		float: 'uniform1f',
		vec2: 'uniform2fv',
		vec3: 'uniform3fv',
		vec4: 'uniform4fv',
		int: 'uniform1i',
		mat3: 'uniformMatrix3fv',
		mat4: 'uniformMatrix4fv'
	};

	function addLineNumbers(string) {
		var lines = string.split('\n');
		for (var i = 0; i < lines.length; i++) {
			lines[i] = i + 1 + ': ' + lines[i];
		}
		return lines.join('\n');
	};

	var GLShader = function () {
		function GLShader(vertexShader, fragmentShader) {
			(0, _classCallCheck3.default)(this, GLShader);


			gl = _GLHelpers2.default.gl;
			this.parameters = [];
			this.uniformTextures = [];

			// this.vsShader = this._createShaderProgram(vertexShader, true);
			// this.fsShader = this._createShaderProgram(fragmentShader, false);

			// console.log(vsShader);
			// console.log(fsShader);

			var vsShader = this._createShaderProgram(vertexShader, true);
			var fsShader = this._createShaderProgram(fragmentShader, false);
			this._attachShaderProgram(vsShader, fsShader);
		}

		(0, _createClass3.default)(GLShader, [{
			key: 'bind',
			value: function bind() {

				// if(GL.shader === this) {
				// 	return;
				// }
				if (_GLHelpers2.default.shader === this) {
					return;
				}
				gl.useProgram(this.shaderProgram);
				_GLHelpers2.default.useShader(this);
				this.uniformTextures = [];
				// gl.useProgram(this.shaderProgram);
				// GL.useShader(this);
			}
		}, {
			key: 'uniform',
			value: function uniform(mName, mType, mValue) {
				function cloneArray(mArray) {
					if (mArray.slice) {
						return mArray.slice(0);
					} else {
						return new Float32Array(mArray);
					}
				}

				if (mValue === undefined || mValue === null) {
					console.warn('mValue Error:', mName);
					return;
				}

				var uniformType = uniformMapping[mType] || mType;
				var isNumber = uniformType === 'uniform1i' || uniformType === 'uniform1f';
				var hasUniform = false;
				var oUniform = void 0;
				var parameterIndex = -1;

				for (var i = 0; i < this.parameters.length; i++) {
					oUniform = this.parameters[i];
					if (oUniform.name === mName) {
						hasUniform = true;
						parameterIndex = i;
						break;
					}
				}

				if (!hasUniform) {
					this.shaderProgram[mName] = gl.getUniformLocation(this.shaderProgram, mName);
					if (isNumber) {
						this.parameters.push({ name: mName, type: uniformType, value: mValue, uniformLoc: this.shaderProgram[mName] });
					} else {
						this.parameters.push({ name: mName, type: uniformType, value: cloneArray(mValue), uniformLoc: this.shaderProgram[mName] });
					}

					parameterIndex = this.parameters.length - 1;
				} else {
					this.shaderProgram[mName] = oUniform.uniformLoc;
				}

				if (!this.parameters[parameterIndex].uniformLoc) {
					return;
				}

				if (uniformType.indexOf('Matrix') === -1) {

					if (!isNumber) {
						if (!isSame(this.parameters[parameterIndex].value, mValue) || !hasUniform) {
							gl[uniformType](this.shaderProgram[mName], mValue);
							this.parameters[parameterIndex].value = cloneArray(mValue);
						}
					} else {
						var needUpdate = this.parameters[parameterIndex].value !== mValue || !hasUniform;
						if (needUpdate) {
							gl[uniformType](this.shaderProgram[mName], mValue);
							this.parameters[parameterIndex].value = mValue;
						}
					}
				} else {
					if (!isSame(this.parameters[parameterIndex].value, mValue) || !hasUniform) {
						// console.log("here");
						gl[uniformType](this.shaderProgram[mName], false, mValue);
						this.parameters[parameterIndex].value = cloneArray(mValue);
					}
				}
			}
		}, {
			key: 'createProgram',
			value: function createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
				var errFn = function errFn(msg) {
					console.log("error ------");
					console.log(msg);
				};

				var program = gl.createProgram();
				shaders.forEach(function (shader) {
					gl.attachShader(program, shader);
				});
				if (opt_attribs) {
					opt_attribs.forEach(function (attrib, ndx) {
						gl.bindAttribLocation(program, opt_locations ? opt_locations[ndx] : ndx, attrib);
					});
				}
				gl.linkProgram(program);

				// Check the link status
				var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
				if (!linked) {
					// something went wrong with the link
					var lastError = gl.getProgramInfoLog(program);
					errFn("Error in program linking:" + lastError);

					gl.deleteProgram(program);
					return null;
				}

				return program;
			}

			// createShaderFromScript(gl, scriptId, opt_shaderType, opt_errorCallback) {
			//   var shaderSource = "";
			//   var shaderType;
			//   var shaderScript = document.getElementById(scriptId);
			//   if (!shaderScript) {
			//     throw ("*** Error: unknown script element" + scriptId);
			//   }
			//   shaderSource = shaderScript.text;
			//
			//   if (!opt_shaderType) {
			//     if (shaderScript.type === "x-shader/x-vertex") {
			//       shaderType = gl.VERTEX_SHADER;
			//     } else if (shaderScript.type === "x-shader/x-fragment") {
			//       shaderType = gl.FRAGMENT_SHADER;
			//     } else if (shaderType !== gl.VERTEX_SHADER && shaderType !== gl.FRAGMENT_SHADER) {
			//       throw ("*** Error: unknown shader type");
			//     }
			//   }
			//
			//   return this.loadShader(gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType, opt_errorCallback);
			// }

		}, {
			key: 'createProgramFromScripts',
			value: function createProgramFromScripts(gl, shadersSources, opt_attribs, opt_locations, opt_errorCallback) {
				var shaders = [this.vsShader, this.fsShader];
				//  for (var ii = 0; ii < shaderScriptIds.length; ++ii) {
				//  shaders.push(vsShader);
				//  }
				this.shaderProgram = this.createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
			}

			//  loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
			//   var errFn = opt_errorCallback || error;
			//   // Create the shader object
			//   var shader = gl.createShader(shaderType);
			//
			//   // Load the shader source
			//   gl.shaderSource(shader, shaderSource);
			//
			//   // Compile the shader
			//   gl.compileShader(shader);
			//
			//   // Check the compile status
			//   var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
			//   if (!compiled) {
			//     // Something went wrong during compilation; get the error
			//     var lastError = gl.getShaderInfoLog(shader);
			//     errFn("*** Error compiling shader '" + shader + "':" + lastError);
			//     gl.deleteShader(shader);
			//     return null;
			//   }
			//
			//   return shader;
			// }

		}, {
			key: '_createShaderProgram',
			value: function _createShaderProgram(mShaderStr, isVertexShader) {

				var shaderType = isVertexShader ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
				var shader = gl.createShader(shaderType);

				gl.shaderSource(shader, mShaderStr);
				gl.compileShader(shader);

				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.warn('Error in Shader : ', gl.getShaderInfoLog(shader));
					return null;
				}

				return shader;
			}
		}, {
			key: '_createShaderProgram',
			value: function _createShaderProgram(mShaderStr, isVertexShader) {

				var shaderType = isVertexShader ? _GLHelpers2.default.gl.VERTEX_SHADER : _GLHelpers2.default.gl.FRAGMENT_SHADER;
				var shader = gl.createShader(shaderType);

				gl.shaderSource(shader, mShaderStr);
				gl.compileShader(shader);

				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.warn('Error in Shader : ', gl.getShaderInfoLog(shader));
					// console.log(addLineNumbers(mShaderStr));
					return null;
				}

				return shader;
			}
		}, {
			key: '_attachShaderProgram',
			value: function _attachShaderProgram(mVertexShader, mFragmentShader) {

				this.shaderProgram = gl.createProgram();

				this.shaderProgram.id = Math.random() * 10;
				gl.attachShader(this.shaderProgram, mVertexShader);
				gl.attachShader(this.shaderProgram, mFragmentShader);
				gl.linkProgram(this.shaderProgram);
			}

			//
			// _attachShaderProgram(mVertexShader, mFragmentShader) {
			//
			// 	this.shaderProgram = gl.createProgram();
			// 	gl.attachShader(this.shaderProgram, mVertexShader);
			// 	gl.attachShader(this.shaderProgram, mFragmentShader);
			// 	gl.linkProgram(this.shaderProgram);
			//
			//   var linked = gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS);
			//   if (!linked) {
			//       // something went wrong with the link
			//       var lastError = gl.getProgramInfoLog(this.shaderProgram);
			//       errFn("Error in this.shaderProgram linking:" + lastError);
			//
			//       gl.deleteProgram(this.shaderProgram);
			//       return null;
			//   }
			//
			// }

		}]);
		return GLShader;
	}();

	exports.default = GLShader;
	module.exports = exports['default'];

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _Matrices = __webpack_require__(95);

	var _Matrices2 = _interopRequireDefault(_Matrices);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var OrbitalControl = function () {
	  function OrbitalControl() {
	    (0, _classCallCheck3.default)(this, OrbitalControl);

	    this.offsetPosition = [0, 0, 0];
	    this.position = [0, 0, 0];
	    this.target = [0, 0, 0];
	    this.up = [0, 1, 0];
	    this.radius = 800;

	    this.angleA = 0;
	    this.angleB = 0;
	    this.tr = 0;
	  }

	  (0, _createClass3.default)(OrbitalControl, [{
	    key: 'update',
	    value: function update() {
	      this.position[1] = Math.sin(this.angleB) * this.radius;

	      this.tr = Math.cos(this.angleB) * this.radius;
	      this.position[0] = Math.cos(this.angleA) * this.tr;
	      this.position[2] = Math.sin(this.angleA) * this.tr;

	      this.position = _Matrices2.default.addVectors(this.position, this.offsetPosition);
	      // glm.vec3.add(this.position, this.position, this.positionOffset);


	      // return [x, y, z];
	    }
	  }]);
	  return OrbitalControl;
	}();

	exports.default = OrbitalControl;
	module.exports = exports['default'];

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _ViewPlane = __webpack_require__(100);

	var _ViewPlane2 = _interopRequireDefault(_ViewPlane);

	var _ViewPlaneDetailed = __webpack_require__(106);

	var _ViewPlaneDetailed2 = _interopRequireDefault(_ViewPlaneDetailed);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Floor = function () {
	  function Floor() {
	    (0, _classCallCheck3.default)(this, Floor);

	    this.viewPlane = new _ViewPlane2.default();
	    this.viewPlaneDetailed = new _ViewPlaneDetailed2.default();
	  }

	  (0, _createClass3.default)(Floor, [{
	    key: 'render',
	    value: function render() {
	      this.viewPlaneDetailed.render();
	      this.viewPlane.render();
	    }
	  }]);
	  return Floor;
	}();

	exports.default = Floor;
	module.exports = exports['default'];

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _GLShader = __webpack_require__(97);

	var _GLShader2 = _interopRequireDefault(_GLShader);

	var _Plane = __webpack_require__(101);

	var _Plane2 = _interopRequireDefault(_Plane);

	var _PlaneSquare = __webpack_require__(103);

	var _PlaneSquare2 = _interopRequireDefault(_PlaneSquare);

	var _plane = __webpack_require__(104);

	var _plane2 = _interopRequireDefault(_plane);

	var _plane3 = __webpack_require__(105);

	var _plane4 = _interopRequireDefault(_plane3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import PlaneSquare from '../helpers/gl_helpers/geometry/PlaneSquare';

	// import GL from './helpers/GLHelpers';
	var ViewPlane = function () {
	  function ViewPlane() {
	    (0, _classCallCheck3.default)(this, ViewPlane);

	    this.shader = new _GLShader2.default(_plane2.default, _plane4.default);
	    this.shader.bind();
	    this.plane = new _PlaneSquare2.default(this.shader.shaderProgram, 3000, 3000, 20, "xz", undefined, GL.gl.LINES);
	    this.plane.position = [0, 0, 0];

	    this.shader.uniform("alpha", "float", .2);
	  }

	  (0, _createClass3.default)(ViewPlane, [{
	    key: 'render',
	    value: function render() {
	      this.shader.bind(); // just to use propgram
	      // this.plane.render();

	      GL.draw(this.plane);
	    }
	  }]);
	  return ViewPlane;
	}();

	exports.default = ViewPlane;
	module.exports = exports['default'];

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(35);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(86);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _GLHelpers = __webpack_require__(2);

	var _GLHelpers2 = _interopRequireDefault(_GLHelpers);

	var _Mesh2 = __webpack_require__(102);

	var _Mesh3 = _interopRequireDefault(_Mesh2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var gl = void 0,
	    pivotX = void 0,
	    pivotY = void 0,
	    axis = void 0;

	var Plane = function (_Mesh) {
	  (0, _inherits3.default)(Plane, _Mesh);

	  function Plane(program, w, h, subdivision, axis) {
	    var attribPositionName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "a_position";
	    var drawMode = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _GLHelpers2.default.gl.TRIANGLES;
	    (0, _classCallCheck3.default)(this, Plane);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (Plane.__proto__ || (0, _getPrototypeOf2.default)(Plane)).call(this, program, drawMode));

	    gl = _GLHelpers2.default.gl;

	    _this.attribPositionName = attribPositionName;

	    _this.subdivision = subdivision;
	    _this.axis = axis || "xy";
	    _this.w = w;
	    _this.h = h;

	    _this.plane(_this.w, _this.h, _this.subdivision, _this.axis);

	    return _this;
	  }

	  (0, _createClass3.default)(Plane, [{
	    key: 'plane',
	    value: function plane(w, h, subdivision, axis) {

	      pivotX = -this.w / 2;
	      pivotY = -this.h / 2;

	      var positions = [];
	      var indices = [];

	      var index = 0;

	      var offset = 0;

	      // for (var i = subdivision - 1; i > -1; i--) {
	      //   for (var j = subdivision - 1; j > -1; j--) {
	      for (var i = 0; i < subdivision; i++) {
	        for (var j = 0; j < subdivision; j++) {

	          if (this.axis === "xy") {
	            positions.push(this.getPos(i, j));
	            positions.push(this.getPos(i + 1, j));
	            positions.push(this.getPos(i + 1, j + 1));
	            positions.push(this.getPos(i, j + 1));
	          } else {

	            // positions.push(this.getPos(i, j+1));
	            // positions.push(this.getPos(i+1, j+1));
	            // positions.push(this.getPos(i+1, j));
	            // positions.push(this.getPos(i, j));

	            positions.push(this.getPos(i, j));
	            positions.push(this.getPos(i + 1, j));
	            positions.push(this.getPos(i + 1, j + 1));
	            positions.push(this.getPos(i, j + 1));
	          }

	          indices.push(index * 4 + 0);
	          indices.push(index * 4 + 1);
	          indices.push(index * 4 + 2);
	          indices.push(index * 4 + 0);
	          indices.push(index * 4 + 2);
	          indices.push(index * 4 + 3);

	          index++;

	          // offset += 10
	        }
	      }
	      // var tempPos = []
	      // for (var i = 0; i < positions.length; i++) {
	      //   for (var j = 0; j < positions[i].length; j++) {
	      //     tempPos.push(positions[i][j])
	      //   }
	      // }

	      // var pos = new Float32Array(positions);
	      // var pos = new Float32Array(positions);


	      this.bufferIndex(indices);
	      this.bufferVertex(positions, false, this.attribPositionName);
	    }
	  }, {
	    key: 'getPos',
	    value: function getPos(i, j) {

	      // var x = this.w / this.subdivision * i + pivotX + this.position[0];
	      // var y = this.h / this.subdivision * j + pivotY + this.position[1];
	      // var z = 0 + this.position[2];
	      var x = this.w / this.subdivision * i + pivotX;
	      var y = this.h / this.subdivision * j + pivotY;
	      var z = 0;

	      if (this.axis === "xy") {
	        // return [x + this.position[0], y + this.position[0], z + this.position[0]];
	        return [x, y, z];
	      } else {
	        // return [x + this.position[0], z + this.position[1], y + this.position[2]];
	        return [x, 0, y];
	      }
	    }

	    // bufferIndices(indices){
	    //   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	    //   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	    //
	    // }
	    //
	    // bufferVertex(vertices){
	    //   gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	    //   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	    //   // gl.enableVertexAttribArray(this.positionLocation);
	    //   // gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0)
	    // }

	  }, {
	    key: 'render',
	    value: function render() {
	      // this.plane(this.w, this.h, this.subdivision, this.axis);
	      // this.positionLocation = gl.getAttribLocation(this.program, "a_position");
	      // gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	      // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	      //
	      // gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0)
	      // gl.enableVertexAttribArray(this.positionLocation);
	      //
	      // gl.drawElements(gl.TRIANGLES, (this.subdivision * this.subdivision * 6), gl.UNSIGNED_SHORT, this.indexBuffer, 0);
	    }
	  }]);
	  return Plane;
	}(_Mesh3.default);

	exports.default = Plane;
	module.exports = exports['default'];

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import GL from '../../GLHelpers';

	var gl = void 0;

	var Mesh = function () {
		function Mesh(program) {
			var drawingType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
			(0, _classCallCheck3.default)(this, Mesh);

			this.program = program;

			gl = GL.gl;

			this.position = [0, 0, 0];
			this.rotation = [0, 0, 0];

			// this.vertexBuffer = gl.createBuffer();
			// this.indexBuffer = gl.createBuffer();

			this.drawType = drawingType;
			this._attributes = [];
			this._instancedAttributes = [];
			this._vertexSize = 0;

			this._vertices = [];
			this._texCoords = [];
			this._normals = [];
			this._faceNormals = [];
			this._tangents = [];
			this._indices = [];
			this._faces = [];
		}

		// bindBuffers(){
		//
		// }

		(0, _createClass3.default)(Mesh, [{
			key: 'bufferVertex',
			value: function bufferVertex(mArrayVertices) {
				var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
				var posAttribName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "a_position";

				// console.log("ADD ATTRIBUTE HERE");
				this._vertexSize = mArrayVertices.length;
				this.bufferData(mArrayVertices, posAttribName, 3, isDynamic);
				this._vertices = mArrayVertices;

				// const tempNormals = [];
				// for (let i = 0; i < mArrayVertices.length; i++) {
				// 	tempNormals.push([1, 0, 0]);
				// }
				//
				// if (this._normals.length < this._vertices.length) {
				// 	this.bufferNormal(tempNormals, isDynamic);
				// }

				// if (this._indices.length > 0 && this.drawType === GL.TRIANGLES) {
				// 	this._generateFaces();
				// }
			}
		}, {
			key: 'bufferTexCoord',
			value: function bufferTexCoord(mArrayTexCoords) {
				var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


				this.bufferData(mArrayTexCoords, 'a_textureCoord', 2, isDynamic);
				this._texCoords = mArrayTexCoords;
			}
		}, {
			key: 'bufferNormal',
			value: function bufferNormal(mNormals) {
				var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


				this.bufferData(mNormals, 'a_normal', 3, isDynamic);
				this._normals = mNormals;
			}
		}, {
			key: 'bufferIndex',
			value: function bufferIndex(mArrayIndices) {
				var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


				var drawType = isDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
				this._indices = mArrayIndices;
				if (!this.iBuffer) {
					this.iBuffer = gl.createBuffer();
				}
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mArrayIndices), drawType);
				this.iBuffer.itemSize = 1;
				this.iBuffer.numItems = mArrayIndices.length;

				// if (this._vertices.length > 0 && this.drawType === GL.TRIANGLES) {
				// 	this._generateFaces();
				// }
			}
		}, {
			key: 'bufferData',
			value: function bufferData(mData, mName, mItemSize) {
				var isDynamic = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


				var index = -1;
				var i = 0;
				var drawType = isDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
				var bufferData = [];
				var buffer = void 0;
				var dataArray = void 0;
				if (!mItemSize) {
					mItemSize = mData[0].length;
				}

				//	Check for existing attributes
				for (i = 0; i < this._attributes.length; i++) {
					if (this._attributes[i].name === mName) {
						this._attributes[i].data = mData;
						index = i;
						break;
					}
				}

				//	flatten buffer data
				for (i = 0; i < mData.length; i++) {
					for (var j = 0; j < mData[i].length; j++) {
						bufferData.push(mData[i][j]);
					}
				}

				if (index === -1) {

					//	attribute not exist yet, create new buffer
					// console.log(mName, "doesnt exist");
					// console.log(mName);
					buffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

					dataArray = new Float32Array(bufferData);
					gl.bufferData(gl.ARRAY_BUFFER, dataArray, drawType);
					this._attributes.push({ name: mName, data: mData, itemSize: mItemSize, buffer: buffer, dataArray: dataArray });

					// if(this.vao) {
					// 	gl.enableVertexAttribArray(attrPosition);
					// 	const attrPosition = getAttribLoc(gl, this.shader.shaderProgram, mName);
					// 	gl.vertexAttribPointer(attrPosition, mItemSize, gl.FLOAT, false, 0, 0);
					// }
				} else {
					// console.log("mName : ", mName);
					//	attribute existed, replace with new data
					buffer = this._attributes[index].buffer;
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
					dataArray = new Float32Array(bufferData);
					gl.bufferData(gl.ARRAY_BUFFER, dataArray, drawType);

					var attribute = this._attributes.find(function (a) {
						return a.name === mName;
					});
					attribute.data = mData;
					attribute.itemSize = mItemSize;
					attribute.dataArray = dataArray;
				}
			}
		}]);
		return Mesh;
	}();

	exports.default = Mesh;
	module.exports = exports['default'];

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(35);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(86);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _GLHelpers = __webpack_require__(2);

	var _GLHelpers2 = _interopRequireDefault(_GLHelpers);

	var _Mesh2 = __webpack_require__(102);

	var _Mesh3 = _interopRequireDefault(_Mesh2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var gl = void 0,
	    pivotX = void 0,
	    pivotY = void 0,
	    axis = void 0;

	var PlaneSquare = function (_Mesh) {
	  (0, _inherits3.default)(PlaneSquare, _Mesh);

	  function PlaneSquare(program, w, h, subdivision, axis) {
	    var attribPositionName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "a_position";
	    var drawMode = arguments[6];
	    (0, _classCallCheck3.default)(this, PlaneSquare);


	    drawMode = drawMode || _GLHelpers2.default.gl.POINTS;

	    var _this = (0, _possibleConstructorReturn3.default)(this, (PlaneSquare.__proto__ || (0, _getPrototypeOf2.default)(PlaneSquare)).call(this, program, drawMode));

	    gl = _GLHelpers2.default.gl;

	    _this.attribPositionName = attribPositionName;

	    _this.subdivision = subdivision;
	    _this.axis = axis || "xy";
	    _this.w = w;
	    _this.h = h;

	    _this.plane(_this.w, _this.h, _this.subdivision, _this.axis);
	    return _this;
	  }

	  (0, _createClass3.default)(PlaneSquare, [{
	    key: 'plane',
	    value: function plane(w, h, subdivision, axis) {

	      pivotX = -this.w / 2;
	      pivotY = -this.h / 2;

	      var positions = [];
	      var indices = [];

	      var index = 0;

	      var offset = 0;

	      for (var i = 0; i < subdivision; i++) {

	        for (var j = 0; j < subdivision; j++) {

	          if (this.axis === "xy") {
	            positions.push(this.getPos(i, j));
	            positions.push(this.getPos(i + 1, j));
	            positions.push(this.getPos(i + 1, j + 1));
	            positions.push(this.getPos(i, j + 1));
	          } else {
	            positions.push(this.getPos(i, j + 1));
	            positions.push(this.getPos(i + 1, j + 1));
	            positions.push(this.getPos(i + 1, j));
	            positions.push(this.getPos(i, j));
	          }

	          indices.push(index * 4 + 0);
	          indices.push(index * 4 + 1);
	          indices.push(index * 4 + 2);

	          indices.push(index * 4 + 3);
	          indices.push(index * 4 + 2);
	          indices.push(index * 4 + 1);

	          index++;

	          // offset += 10
	        }
	      }

	      this.bufferIndex(indices);
	      this.bufferVertex(positions, false, this.attribPositionName);
	    }
	  }, {
	    key: 'getPos',
	    value: function getPos(i, j) {

	      var x = this.w / this.subdivision * i + pivotX;
	      var y = this.h / this.subdivision * j + pivotY;
	      var z = 0;

	      if (this.axis === "xy") {
	        return [x + this.position[0], y + this.position[1], z + this.position[2]];
	      } else {
	        return [x + this.position[2], z + this.position[1], y + this.position[0]];
	      }
	    }
	  }]);
	  return PlaneSquare;
	}(_Mesh3.default);

	exports.default = PlaneSquare;
	module.exports = exports['default'];

/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\nattribute vec4 a_position;\n\nuniform mat4 u_world;\nuniform mat4 u_worldViewProjection;\n// uniform mat4 u_worldInverseTranspose;\n\n\nvoid main() {\n  // Multiply the position by the matrix.\n\n  vec3 surfaceWorldPosition = (u_world * a_position).xyz;\n\n\n  vec3 position = a_position.xyz;\n\n  // position.yz = rotate(position.yz, sin(time * 0.1));\n  // position.xz = rotate(position.xz, time * 2.1);\n\n  gl_Position = u_worldViewProjection * vec4(position, a_position.w);\n\n}\n"

/***/ },
/* 105 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\n#define GLSLIFY 1\n\n\nuniform float alpha;\n\nvoid main() {\n  vec3 color = vec3(.2,.2,.2);\n\n  gl_FragColor = vec4(color, 1.0);\n  gl_FragColor *= .1;\n}\n"

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _GLShader = __webpack_require__(97);

	var _GLShader2 = _interopRequireDefault(_GLShader);

	var _Plane = __webpack_require__(101);

	var _Plane2 = _interopRequireDefault(_Plane);

	var _PlaneSquare = __webpack_require__(103);

	var _PlaneSquare2 = _interopRequireDefault(_PlaneSquare);

	var _plane = __webpack_require__(104);

	var _plane2 = _interopRequireDefault(_plane);

	var _plane_opacity_less = __webpack_require__(107);

	var _plane_opacity_less2 = _interopRequireDefault(_plane_opacity_less);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import GL from './helpers/GLHelpers';
	var ViewPlaneDetailed = function () {
	  function ViewPlaneDetailed() {
	    (0, _classCallCheck3.default)(this, ViewPlaneDetailed);

	    this.shader = new _GLShader2.default(_plane2.default, _plane_opacity_less2.default);
	    this.shader.bind();
	    this.plane = new _Plane2.default(this.shader.shaderProgram, 3000, 3000, 60, "xz", undefined, GL.gl.POINTS);
	    // this.plane = new PlaneSquare(this.shader.shaderProgram, 3000, 3000, 60, "xz");
	    // this.plane.position = [0, 0, 0]

	    // this.drawPlane();
	  }

	  (0, _createClass3.default)(ViewPlaneDetailed, [{
	    key: 'drawPlane',
	    value: function drawPlane() {}
	  }, {
	    key: 'render',
	    value: function render() {
	      this.shader.bind(); // just to use propgram
	      GL.draw(this.plane);
	      // this.plane.render();
	    }
	  }]);
	  return ViewPlaneDetailed;
	}();

	exports.default = ViewPlaneDetailed;
	module.exports = exports['default'];

/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\n#define GLSLIFY 1\n\n\nuniform float alpha;\n\nvoid main() {\n  vec3 color = vec3(1.0,1.0,1.0);\n\n  gl_FragColor = vec4(color, 1.0);\n  gl_FragColor *= .6;\n}\n"

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _GLShader = __webpack_require__(97);

	var _GLShader2 = _interopRequireDefault(_GLShader);

	var _Plane = __webpack_require__(101);

	var _Plane2 = _interopRequireDefault(_Plane);

	var _plane_bg = __webpack_require__(109);

	var _plane_bg2 = _interopRequireDefault(_plane_bg);

	var _plane_bg3 = __webpack_require__(110);

	var _plane_bg4 = _interopRequireDefault(_plane_bg3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ViewBackground = function () {
	  function ViewBackground() {
	    (0, _classCallCheck3.default)(this, ViewBackground);

	    this.shader = new _GLShader2.default(_plane_bg2.default, _plane_bg4.default);
	    this.shader.bind();
	    this.plane = new _Plane2.default(this.shader.shaderProgram, 4000, 4000, 20, "xy");
	    // this.plane.position = [0, 0, 0]
	  }

	  (0, _createClass3.default)(ViewBackground, [{
	    key: 'render',
	    value: function render() {

	      this.shader.bind(); // just to use propgram
	      this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);
	      //   12.0/255.0, 98.0/255.0, 137.0/255.0
	      // 239.0/255.0, 246.0/255.0, 247.0/255.0
	      this.shader.uniform("colorTop", "vec3", [239.0 / 255.0, 246.0 / 255.0, 247.0 / 255.0]);
	      this.shader.uniform("colorBottom", "vec3", [12.0 / 255.0, 98.0 / 255.0, 137.0 / 255.0]);
	      GL.draw(this.plane);
	    }
	  }]);
	  return ViewBackground;
	}();
	// import GL from './helpers/GLHelpers';


	exports.default = ViewBackground;
	module.exports = exports['default'];

/***/ },
/* 109 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\nattribute vec4 a_position;\n\nuniform mat4 u_world;\nuniform mat4 u_worldViewProjection;\n// uniform mat4 u_worldInverseTranspose;\n\n\nvoid main() {\n  // Multiply the position by the matrix.\n\n  // vec3 surfaceWorldPosition = (u_world * a_position).xyz;\n\n\n  vec3 position = a_position.xyz;\n\n  // position.yz = rotate(position.yz, sin(time * 0.1));\n  // position.xz = rotate(position.xz, time * 2.1);\n\n  gl_Position = vec4(position, a_position.w);\n\n}\n"

/***/ },
/* 110 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nuniform vec2 resolutions;\nuniform vec3 colorBottom;\nuniform vec3 colorTop;\n\nfloat plot(vec2 st, float pct){\n  return  smoothstep( pct-0.02, pct, st.y) -\n          smoothstep( pct, pct+0.02, st.y);\n}\n\nvoid main() {\n\n  vec2 st = gl_FragCoord.xy/resolutions;\n  float y = pow(st.y - 1.05, 5.0);\n\n  // vec3 colorBottom = vec3(12.0/255.0, 98.0/255.0, 137.0/255.0);\n  // vec3 colorTop = vec3(239.0/255.0, 246.0/255.0, 247.0/255.0);\n\n  vec3 color = mix(colorBottom, colorTop, 1.0- y);\n  gl_FragColor = vec4(color, 1);\n}\n\n\n// precision mediump float;\n//\n// uniform vec2 resolutions;\n//\n// float plot (vec2 st, float pct){\n//   return  smoothstep( pct, pct, st.y) -\n//           smoothstep( pct, pct, st.y);\n// }\n//\n// void main() {\n//\n//   vec3 colorBottom = vec3(239.0/255.0, 246.0/255.0, 247.0/255.0);\n//   vec3 colorTop = vec3(10.0/255.0, 50.0/255.0, 57.0/255.0);\n//\n//   vec2 st = gl_FragCoord.xy/resolutions.xy;\n//\n//   vec3 pct = vec3(1.0 - st.y);\n//   vec3 color = mix(colorBottom, colorTop, pct);\n//\n//     // Plot transition lines for each channel\n//   color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));\n//   color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));\n//   color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));\n//\n//\n//   // vec3 color = mix(colorBottom, colorTop, 1.0 - gl_FragCoord.y/resolutions.y);\n//   gl_FragColor = vec4(color, 1);\n// }\n"

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _GLShader = __webpack_require__(97);

	var _GLShader2 = _interopRequireDefault(_GLShader);

	var _Plane = __webpack_require__(101);

	var _Plane2 = _interopRequireDefault(_Plane);

	var _plane = __webpack_require__(112);

	var _plane2 = _interopRequireDefault(_plane);

	var _plane3 = __webpack_require__(113);

	var _plane4 = _interopRequireDefault(_plane3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ViewPlane = function () {
	  function ViewPlane() {
	    (0, _classCallCheck3.default)(this, ViewPlane);

	    this.shader = new _GLShader2.default(_plane2.default, _plane4.default);
	    this.shader.bind();
	    this.plane = new _Plane2.default(this.shader.shaderProgram, 1000, 1000, 1, "xydwdw");
	  }

	  (0, _createClass3.default)(ViewPlane, [{
	    key: 'render',
	    value: function render() {
	      this.shader.bind(); // just to use propgram
	      this.plane.render();
	    }
	  }]);
	  return ViewPlane;
	}();
	// import GL from './helpers/GLHelpers';


	exports.default = ViewPlane;
	module.exports = exports['default'];

/***/ },
/* 112 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\nattribute vec4 a_position;\n\nuniform mat4 u_world;\nuniform mat4 u_worldViewProjection;\n// uniform mat4 u_worldInverseTranspose;\n\n\nvoid main() {\n  // Multiply the position by the matrix.\n\n  vec3 surfaceWorldPosition = (u_world * a_position).xyz;\n\n\n  vec3 position = a_position.xyz;\n\n  // position.yz = rotate(position.yz, sin(time * 0.1));\n  // position.xz = rotate(position.xz, time * 2.1);\n\n  gl_Position = u_worldViewProjection * vec4(position, a_position.w);\n\n}\n"

/***/ },
/* 113 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\n#define GLSLIFY 1\n\n\nvoid main() {\n  vec3 color = vec3(0,0,0);\n  gl_FragColor = vec4(color, .4);\n}\n"

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _GLShader = __webpack_require__(97);

	var _GLShader2 = _interopRequireDefault(_GLShader);

	var _Matrices = __webpack_require__(95);

	var _Matrices2 = _interopRequireDefault(_Matrices);

	var _weirdSphere = __webpack_require__(115);

	var _weirdSphere2 = _interopRequireDefault(_weirdSphere);

	var _weirdSphere3 = __webpack_require__(116);

	var _weirdSphere4 = _interopRequireDefault(_weirdSphere3);

	var _Sphere = __webpack_require__(117);

	var _Sphere2 = _interopRequireDefault(_Sphere);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ViewSphere = function () {
	  function ViewSphere() {
	    (0, _classCallCheck3.default)(this, ViewSphere);

	    this.tick = 0;
	    this.shader = new _GLShader2.default(_weirdSphere2.default, _weirdSphere4.default);
	    this.shader.bind();
	    this.sphere = new _Sphere2.default(this.shader.shaderProgram, 128, 150);
	    this.sphere.position = [0, 200, 100];

	    this.back = false;
	    var rot = _Matrices2.default.identity();
	    rot = _Matrices2.default.multiply(rot, _Matrices2.default.yRotate(rot, Math.PI));
	    this.shader.uniform("back", "float", 1);
	    this.shader.uniform("time", "float", 0);
	    this.shader.uniform("u_matrix", "mat4", rot);

	    this.backValue = 0;
	    this.targetValue = 0;

	    // this.tick =
	  }

	  (0, _createClass3.default)(ViewSphere, [{
	    key: 'render',
	    value: function render() {

	      this.shader.bind(); // just to use propgram
	      // // console.log(this.back, this.tick);
	      // if(this.back){
	      //   this.tick -= 1/20;
	      //   this.targetValue = -1;
	      //   this.shader.uniform("back", "float", this.backValue);
	      //   if(this.tick < -10){
	      //     this.back = false;
	      //   }
	      // }
	      // else {
	      //   this.tick+= 1/20;
	      //   // console.log("here");
	      //   this.targetValue = 1;
	      //   this.shader.uniform("back", "float", this.backValue);
	      // }
	      //
	      //
	      // this.backValue += (this.targetValue - this.backValue)* 0.01;
	      //
	      // if(this.tick > 10){
	      //
	      //   this.back = true;
	      // }

	      this.tick++;

	      this.time = Math.cos(this.tick / 200 + Math.PI / 2) * 10;
	      this.shader.uniform("time", "float", this.time);
	      // this.shader.uniform("time", "float", this.tick);
	      // this.sphere.render();
	      GL.draw(this.sphere);
	    }
	  }]);
	  return ViewSphere;
	}();

	exports.default = ViewSphere;
	module.exports = exports['default'];

/***/ },
/* 115 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\nattribute vec4 a_position;\nuniform mat4 u_world;\nuniform mat4 u_worldViewProjection;\n\nuniform float back;\nuniform float time;\nuniform mat4 u_matrix;\n\nvarying vec3 v_normal;\n\n\n\nvoid main() {\n  // Multiply the position by the matrix.\n\n  // v_normal = normalize(a_position.xyz);\n\n  vec3 surfaceWorldPosition = (u_world * a_position).xyz;\n\n  vec3 position = a_position.xyz;\n  v_normal = normalize(position.xyz);\n  // float noise = cos( time / 100.0 * a_position.x ) * sin( time / 200.0 * a_position.y );\n  float noise;\n  //\n  // if(back > 0.0){\n  //\n  // }\n  // else{\n  // }\n    noise = cos(a_position.x * (time / 20.0) * .5) * .5;\n  // noise = sin(a_position.x * (time / 20.0) * .5) * .5;\n\n  // float noise = snoise(a_position.xyz + (time / 20.0) * .5) * .5;\n\n\n/*\n  const float noise_scale = 0.1;\n  const float dist = 5;\n  vec3 offset = snoise(a_position * noise_scale) * dist;\n  a_position += normalize(a_position.xyz) * offset;\n  */\n\n\tposition.x \t+= back * v_normal.x * noise  * 3.0 * 15.0 ;\n\tv_normal.x \t+= back * v_normal.x * noise  * 3.0 * 1.0 ;\n\n  gl_Position =  u_matrix * u_worldViewProjection * vec4(position, 1.0);\n\n\n}\n"

/***/ },
/* 116 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec3 v_normal;\n\nfloat diffuse(vec3 N, vec3 L) {\n  return max(dot(N, normalize(L)), 0.0);\n}\n\nfloat diffuse(vec3 N, vec3 L, float density) {\n  return diffuse(N, L) * density;\n}\n\n\nvec3 diffuse(vec3 N, vec3 L, float density, vec3 color) {\n  return diffuse(N, L, density) * color;\n}\n\n\n#define fade 1.0\n#define LIGHT_YELLOW vec3(fade, fade, -fade)\n#define LIGHT_BLUE vec3(50.0, -fade, 0.0)\n\nvoid main() {\n\n  float _diffuseYellow = diffuse(v_normal, LIGHT_YELLOW, .5);\n  float _diffuseBlue = diffuse(v_normal, LIGHT_BLUE, .5);\n  float _diffuse = _diffuseYellow + _diffuseBlue;\n\n  _diffuse *= 1.6;\n  if(_diffuse < .2){\n    _diffuse = .2;\n  }\n\n  // vec3 color1 = vec3(0, 1, 1);\n  // vec3 color2 = vec3(1, 1, 1);\n  vec3 color = vec3(0,1,1);\n  // vec3 color = mix(color1, color2, _diffuse);\n  gl_FragColor = vec4(color,1);\n  gl_FragColor.rgb *= _diffuse;\n\n}\n"

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(35);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(86);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _GLHelpers = __webpack_require__(2);

	var _GLHelpers2 = _interopRequireDefault(_GLHelpers);

	var _Mesh2 = __webpack_require__(102);

	var _Mesh3 = _interopRequireDefault(_Mesh2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var gl = void 0,
	    pivotX = void 0,
	    pivotY = void 0,
	    axis = void 0;

	var Sphere = function (_Mesh) {
	  (0, _inherits3.default)(Sphere, _Mesh);

	  function Sphere(program, nbVert, radius) {
	    var attribPositionName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "a_position";
	    var drawMode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "GL.gl.TRIANGLES";
	    (0, _classCallCheck3.default)(this, Sphere);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (Sphere.__proto__ || (0, _getPrototypeOf2.default)(Sphere)).call(this, program, drawMode));

	    _this.attribPositionName = attribPositionName;

	    _this.nbVert = nbVert;
	    _this.radius = radius;

	    // this.indexBuffer = gl.createBuffer();


	    _this.sphere();

	    // this.positionLocation = gl.getAttribLocation(this.program, attribPositionName);
	    // gl.enableVertexAttribArray(this.positionLocation);
	    // gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0)

	    return _this;
	  }

	  (0, _createClass3.default)(Sphere, [{
	    key: 'sphere',
	    value: function sphere() {

	      var positions = [];
	      var indices = [];

	      var index = 0;

	      var offset = 0;

	      for (var i = 0; i < this.nbVert; i++) {
	        for (var j = 0; j < this.nbVert; j++) {
	          // for (var i = 0; i < this.nbVert; i++) {
	          // for (var j = 0; j < this.nbVert; j++) {

	          positions.push(this.getAngle(i, j));
	          positions.push(this.getAngle(i + 1, j));
	          positions.push(this.getAngle(i + 1, j + 1));
	          positions.push(this.getAngle(i, j + 1));

	          // works well too
	          // positions.push(this.getAngle(i, j+1));
	          // positions.push(this.getAngle(i+1, j+1));
	          // positions.push(this.getAngle(i+1, j));
	          // positions.push(this.getAngle(i, j));

	          // positions.push(this.getAngle(i, j+1));
	          // positions.push(this.getAngle(i+1, j));
	          // positions.push(this.getAngle(i+1, j+1));
	          // positions.push(this.getAngle(i, j));

	          indices.push(index * 4 + 0);
	          indices.push(index * 4 + 1);
	          indices.push(index * 4 + 2);
	          indices.push(index * 4 + 0);
	          indices.push(index * 4 + 2);
	          indices.push(index * 4 + 3);
	          index++;
	        }
	      }

	      // positions = positions.reverse();
	      // indices = indices.reverse();
	      // var tempPos = []
	      // for (var i = 0; i < positions.length; i++) {
	      //   tempPos[positions.length-1-i] = positions[i];
	      //   // for (var j = 0; j < positions[i].length; j++) {
	      //   //   tempPos.push(positions[i][j])
	      //   // }
	      // }

	      // var pos = new Float32Array(positions);
	      // var pos = new Float32Array(positions);

	      this.bufferIndex(indices);
	      this.bufferVertex(positions, false, this.attribPositionName);
	    }
	  }, {
	    key: 'getAngle',
	    value: function getAngle(i, j) {
	      var isNormal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	      //	rx : -90 ~ 90 , ry : 0 ~ 360


	      var ry = j / this.nbVert * Math.PI * 2 - Math.PI;
	      var rx = i / this.nbVert * Math.PI - Math.PI * 0.5;
	      var r = this.radius;
	      var pos = [];
	      pos[1] = Math.sin(rx) * r;
	      var t = Math.cos(rx) * r;
	      pos[0] = Math.cos(ry) * t;
	      pos[2] = Math.sin(ry) * t;

	      return [pos[0], pos[1], pos[2]];
	    }

	    // getAngle(i, j){
	    //
	    //   var angleA =  Math.PI * 2 / this.nbVert * i;
	    //   var angleB =  -Math.PI + Math.PI*2 / this.nbVert * j;
	    //   var y = Math.sin(angleB) * this.radius + 0;
	    //
	    //   var r = Math.cos(angleB) * this.radius;
	    //   var x = Math.cos(angleA) * r;
	    //   var z = Math.sin(angleA) * r;
	    //
	    //   // console.log(x, y , z);
	    //
	    //   return [x + this.position[0], y + this.position[1], z + this.position[2]];
	    // }

	  }, {
	    key: 'render',
	    value: function render() {
	      // this.sphere();
	      // this.positionLocation = gl.getAttribLocation(this.program, "a_position");
	      //     gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	      // gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0)
	      //     gl.enableVertexAttribArray(this.positionLocation);
	      //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	      //
	      //     gl.drawElements(gl.TRIANGLES, (this.nbVert * this.nbVert * 6), gl.UNSIGNED_SHORT, this.indexBuffer, 0);
	    }
	  }]);
	  return Sphere;
	}(_Mesh3.default);

	exports.default = Sphere;
	module.exports = exports['default'];

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var Easings = function Easings() {
	    this.updating = false;
	    this.iterationCount = 0;

	    this.tweens = [];
	  };

	  Easings.prototype.killTweensOf = function (obj) {
	    for (var i = 0; i < this.tweens.length; i++) {
	      var t = this.tweens[i];
	      // console.log("trytodelete");
	      // same object ?
	      if (t.obj === obj && t.obj.id === obj.id) {
	        // t.delete = true;
	        t = null;
	        this.tweens.splice(i, 1);
	        i--;
	      }
	    }
	  };

	  Easings.prototype.to = function (obj, duration, vars, test) {
	    var tween = {
	      delete: false,
	      currentIteration: 0,
	      isArray: false,
	      obj: obj,
	      vars: vars,
	      delay: vars.delay * 60 || 0,
	      isDelayed: vars.delay && vars.delay > 0 ? true : false,
	      duration: duration * 60,
	      ease: vars.ease || this.easeLinear
	    };

	    if (obj instanceof Array) {

	      tween.isArray = true;

	      var varToTween = [];
	      for (var v in vars) {
	        if (v !== "delay" && v !== "duration" && !this.isFunction(vars[v])) {

	          var object = {
	            var: v,
	            toValue: vars[v]
	          };

	          var values = [];
	          for (var i = 0; i < obj.length; i++) {
	            values.push(obj[i]);
	          }
	          object.value = values;

	          varToTween.push(object);
	        }
	      }
	    } else {
	      var varToTween = [];

	      for (var v in vars) {
	        if (v !== "delay" && v !== "duration" && !this.isFunction(vars[v]) && v !== "forceTween") {

	          for (var i = 0; i < this.tweens.length; i++) {
	            var t = this.tweens[i];

	            // same object ?
	            if (t.obj === obj) {
	              for (var k = 0; k < t.props.length; k++) {
	                var variableToTween = t.props[k];
	                if (variableToTween.var === v && (tween.delay === 0 || tween.vars.forceTween)) {
	                  // tween the same variable ?
	                  t.delete = true;
	                  this.tweens.splice(i, 1);

	                  i--;
	                  // t.props.splice(k, 1);
	                  // k--;
	                }
	              }
	            }
	          }

	          varToTween.push({
	            var: v,
	            value: obj[v],
	            toValue: vars[v]
	          });
	        }
	      }
	    }

	    tween.props = varToTween;

	    // if(!obj.tweens){
	    //   obj.tweens = [
	    //     tween
	    //   ]
	    // }
	    // else {
	    //   obj.tweens.push(tween);
	    // }

	    this.tweens.push(tween);
	    if (!this.updating) {
	      this.updating = true;
	    }
	  };

	  Easings.prototype.isFunction = function (obj) {
	    return !!(obj && obj.constructor && obj.call && obj.apply);
	  };

	  Easings.prototype.updateArray = function (tween) {
	    var o = tween;

	    if (o.delay > 0) {
	      o.delay--;
	    } else {
	      for (var i = 0; i < o.obj.length; i++) {
	        var currentValue = o.obj[i];

	        o.obj[i] = o.ease(o.currentIteration, o.props[0].value[i], o.props[0].toValue[i] - o.props[0].value[i], o.duration);
	      }
	      o.currentIteration++;
	      //
	      if (o.currentIteration > o.duration) {
	        if (o.vars.onComplete) {
	          o.vars.onComplete();
	        }
	        o.delete = true;
	      }
	    }
	  };

	  Easings.prototype.update = function () {

	    if (!this.updating) {
	      return;
	    }
	    for (var i = 0; i < this.tweens.length; i++) {
	      var o = this.tweens[i];

	      if (o.isArray) {
	        this.updateArray(o);
	      } else {
	        if (o.isDelayed) {

	          if (o.delay > 0) {
	            o.delay -= 1; // do something here
	          } else if (o.delay <= 0) {
	            o.isDelayed = false;
	            for (var k = 0; k < o.props.length; k++) {
	              var e = o.props[k];
	              e.value = o.obj[e.var];
	            }
	          }
	        } else {
	          for (var k = 0; k < o.props.length; k++) {
	            var e = o.props[k];

	            o.obj[e.var] = o.ease(o.currentIteration, e.value, e.toValue - e.value, o.duration);
	          }

	          if (o.vars.onUpdate) {
	            o.vars.onUpdate.apply(this, o.vars.onUpdateParams);
	          }

	          o.currentIteration += 1; // do something here
	          if (o.currentIteration > o.duration) {
	            if (o.vars.onComplete) {
	              o.vars.onComplete.apply(this, o.vars.onCompleteParams);
	            }
	            o.delete = true;
	          }
	        }
	      }
	    }

	    for (var i = 0; i < this.tweens.length; i++) {
	      var o = this.tweens[i];
	      if (o.delete) {
	        o = null;
	        this.tweens.splice(i, 1);
	        i--;
	      }
	    }

	    if (this.tweens.length === 0) {
	      this.updating = false;
	    }
	  };

	  Easings.prototype.easeLinear = function (t, b, c, d) {
	    t /= d;
	    return c * t + b;
	  };

	  Easings.prototype.easeInSine = function (t, b, c, d) {
	    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	  };

	  Easings.prototype.easeOutSine = function (t, b, c, d) {
	    return c * Math.sin(t / d * (Math.PI / 2)) + b;
	  };

	  Easings.prototype.easeInExpo = function (t, b, c, d) {
	    return c * Math.pow(2, 10 * (t / d - 1)) + b;
	  };

	  Easings.prototype.elasticOutSoft = function (t, b, c, d) {
	    var s = 1.0158;var p = 0;var a = c;
	    if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
	    if (a < Math.abs(c)) {
	      a = c;var s = p / 4;
	    } else var s = p / (2 * Math.PI) * Math.asin(c / a);
	    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	  };

	  Easings.prototype.easeOutBack = function (t, b, c, d) {
	    // if (s == undefined) s = 1.70158;
	    var s = 1.70158;
	    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	  };

	  Easings.prototype.easeOutBackSoft = function (t, b, c, d) {
	    // if (s == undefined) s = 1.70158;
	    var s = 1.30158;
	    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	  };

	  Easings.prototype.elasticOut = function (t, b, c, d) {
	    var s = 1.70158;var p = 0;var a = c;
	    if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
	    if (a < Math.abs(c)) {
	      a = c;var s = p / 4;
	    } else var s = p / (2 * Math.PI) * Math.asin(c / a);
	    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	  };

	  Easings.prototype.easeInCubic = function (t, b, c, d) {
	    t /= d;
	    return c * t * t * t + b;
	  };

	  Easings.prototype.easeOutCubic = function (t, b, c, d) {
	    t /= d;
	    t--;
	    return c * (t * t * t + 1) + b;
	  };

	  Easings.prototype.easeInOutSine = function (t, b, c, d) {
	    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	  };

	  Easings.prototype.easeInBack = function (x, t, b, c, d, s) {
	    if (s == undefined) s = 1.70158;
	    return c * (t /= d) * t * ((s + 1) * t - s) + b;
	  };

	  Easings.prototype.easeInOutExpo = function (t, b, c, d) {
	    t /= d / 2;
	    if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
	    t--;
	    return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
	  };

	  Easings.prototype.easeInOutQuint = function (t, b, c, d) {
	    t /= d / 2;
	    if (t < 1) return c / 2 * t * t * t * t * t + b;
	    t -= 2;
	    return c / 2 * (t * t * t * t * t + 2) + b;
	  };

	  Easings.prototype.easeInOutCirc = function (t, b, c, d) {
	    t /= d / 2;
	    if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
	    t -= 2;
	    return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
	  };

	  Easings.prototype.easeOutCirc = function (t, b, c, d) {
	    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	  };

	  Easings.instance = new Easings();

	  module.exports = Easings;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _GLShader = __webpack_require__(97);

	var _GLShader2 = _interopRequireDefault(_GLShader);

	var _Line = __webpack_require__(120);

	var _Line2 = _interopRequireDefault(_Line);

	var _bezier = __webpack_require__(121);

	var _bezier2 = _interopRequireDefault(_bezier);

	var _CatmullRomSpline = __webpack_require__(126);

	var _CatmullRomSpline2 = _interopRequireDefault(_CatmullRomSpline);

	var _CurvePoints = __webpack_require__(127);

	var _CurvePoints2 = _interopRequireDefault(_CurvePoints);

	var _Matrices = __webpack_require__(95);

	var _Matrices2 = _interopRequireDefault(_Matrices);

	var _RamerDouglasPeucker = __webpack_require__(128);

	var _RamerDouglasPeucker2 = _interopRequireDefault(_RamerDouglasPeucker);

	var _line = __webpack_require__(129);

	var _line2 = _interopRequireDefault(_line);

	var _line3 = __webpack_require__(130);

	var _line4 = _interopRequireDefault(_line3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var tempArray = [];
	var tempArray2 = [];
	var tempArray3 = [];
	// tempa = new Float32Array

	var ViewLine = function () {
	  function ViewLine() {
	    var _this = this;

	    (0, _classCallCheck3.default)(this, ViewLine);


	    this.spline = new _CurvePoints2.default([]);
	    this.binomialCoefficients = [];

	    this.shader = new _GLShader2.default(_line2.default, _line4.default);
	    this.shader.bind();

	    this.currentPos = [0, 0];
	    this.rdp = _RamerDouglasPeucker2.default.instance;
	    this.tick = 0;

	    this.points = [];

	    for (var i = 0; i < 20; i++) {
	      this.points.push([Math.random() * 2000 - 2000 / 2, Math.random() * 1000 - 1000 / 2, Math.random() * 1200 - 1200 / 2]);
	    }

	    this.ptsForBezier = this.getControlPoints(this.points);
	    this.finalPoints = [];
	    // this.finalPoints = this.getBezierPoints(this.ptsForBezier, this.ptsForBezier.length * 3);

	    var finalP = this.getPoints(this.points);
	    // this.finalPoints = this.getBezierPoints(this.ptsForBezier, this.ptsForBezier.length * 3);


	    this.shader = new _GLShader2.default(_line2.default, _line4.default);
	    this.shader.bind();
	    this.line = new _Line2.default(this.shader.shaderProgram, finalP);

	    // window.onnouse

	    window.addEventListener('mousemove', function (e) {
	      // mouseX = ;
	      // mouseY = (e.clientY/window.innerHeight - 0.5) * 2.0;
	      // console.log(e);
	      _this.mouseMove(e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2);
	    });
	  }

	  (0, _createClass3.default)(ViewLine, [{
	    key: 'normalize',
	    value: function normalize(v) {
	      var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	      // make sure we don't divide by 0.
	      if (length > 0.00001) {
	        tempArray[0] = v[0] / length;
	        tempArray[1] = v[1] / length;
	        tempArray[2] = v[2] / length;
	      }

	      return tempArray;
	    }
	  }, {
	    key: 'subtractVectors',
	    value: function subtractVectors(a, b) {
	      tempArray2[0] = a[0] - b[0];
	      tempArray2[1] = a[1] - b[1];
	      tempArray2[2] = a[2] - b[2];

	      return tempArray2;
	    }
	  }, {
	    key: 'mouseMove',
	    value: function mouseMove(x, y) {
	      this.currentPos = [x, y];

	      this.tick++;

	      this.z = Math.cos(this.tick / 20) * 400;
	      // console.log(this.currentPos);
	    }
	  }, {
	    key: 'getControlPoints',
	    value: function getControlPoints(points) {

	      var pts = [];
	      for (var i = 0; i < points.length; i++) {
	        var p = points[i];
	        if (i === 0) {
	          pts.push(p);
	          pts.push(p);
	        } else if (i === points.length - 1) {
	          pts.push(p);
	          pts.push(p);
	        } else {
	          if (points[i + 1]) {
	            // make the difference
	            var prevCPointDir = this.normalize(this.subtractVectors(p, points[i + 1]));
	            pts.push([p[0] + prevCPointDir[0] * 100, p[1] + prevCPointDir[1] * 100, p[2] + prevCPointDir[2] * 100]);
	          }

	          pts.push(p);
	          pts.push(p);

	          var nextCPointDir = this.normalize(this.subtractVectors(p, points[i - 1]));
	          pts.push([p[0] + nextCPointDir[0] * 100, p[1] + nextCPointDir[1] * 100, p[2] + nextCPointDir[2] * 100]);
	        }
	      }

	      return pts;
	    }
	  }, {
	    key: 'level',
	    value: function level(i) {
	      if (i == 0) return 1;else return i * this.level(i - 1);
	    }
	  }, {
	    key: 'binCoefficientOld',
	    value: function binCoefficientOld(n, i) {
	      return this.level(n) / (this.level(i) * this.level(n - i));
	    }
	  }, {
	    key: 'binCoefficient',
	    value: function binCoefficient(n, k) {
	      if (k > n) throw "exception";
	      if (k == 0) return 1;
	      if (k > n / 2) return this.binCoefficient(n, n - k);

	      return n * this.binCoefficient(n - 1, k - 1) / k;
	    }
	  }, {
	    key: 'getBezierPoints',
	    value: function getBezierPoints(points, numSeg, avoid) {
	      var bezierPoints = [];
	      var numPoints = points.length;
	      var t, tx, ty, tz;
	      var bc, pow1, pow2;
	      var p = [];
	      for (var i = 0; i < numSeg; i++) {
	        t = i / numSeg;

	        tx = ty = tz = 0;
	        for (var j = 0; j < points.length; j++) {

	          // if(!this.binomialCoefficients[i]){
	          //   this.binomialCoefficients[i] = [];
	          // }
	          // else if(!this.binomialCoefficients[i][j]) {
	          //   this.binomialCoefficients[i][j] = bc;
	          // }
	          // else {
	          //   bc = this.binomialCoefficients[i][j];
	          // }

	          bc = this.binCoefficient(numPoints - 1, j);
	          // bc = [j];
	          // if(!avoid){
	          // console.log("bc");
	          // console.log(bc);
	          pow1 = Math.pow(1 - t, numPoints - j - 1);
	          pow2 = Math.pow(t, j);

	          tx += bc * pow1 * pow2 * points[j][0];
	          ty += bc * pow1 * pow2 * points[j][1];
	          tz += bc * pow1 * pow2 * points[j][2];
	          // }
	        }

	        // var p = vec3.fromValues(tx, ty, tz);
	        p = [tx, ty, tz];
	        var index = Math.floor(points.length * t);
	        if (index == points.length) index = points.length - 1;
	        p.distance = points[index].distance;
	        bezierPoints.push(p);
	      }

	      return bezierPoints;
	    }
	  }, {
	    key: 'bezierCurve',
	    value: function bezierCurve(p0, p1, p2, p3, iterations) {

	      iterations = iterations || 4;
	      var pts = [];

	      for (var i = 0; i < iterations; i++) {
	        // define t
	        var t = 1 / iterations * i;

	        var a = _Matrices2.default.multiplyVectorsScalar(Math.pow(1 - t, 3), p0);
	        // console.log("a" + a);
	        var b = _Matrices2.default.multiplyVectorsScalar(3 * (1 - t) * (1 - t) * t, p1);
	        var c = _Matrices2.default.multiplyVectorsScalar(3 * (1 - t) * t * t, p2);
	        var d = _Matrices2.default.multiplyVectorsScalar(t * t * t, p3);

	        var vec1 = _Matrices2.default.addVectors(a, b);
	        var vec2 = _Matrices2.default.addVectors(vec1, c);
	        var vec3 = _Matrices2.default.addVectors(vec2, d);

	        pts.push([vec3[0], vec3[1], vec3[2]]);

	        // Math.pow((1-t), 3) * p0 +
	        // 3 * (1-t) * (1-t) * t * p1 +
	        // 3 * (1- t) * t * t * p2 +
	        // t * t * t * p3 +
	      }

	      return pts;
	    }
	  }, {
	    key: 'getPoints',
	    value: function getPoints(pts) {
	      this.spline.points = pts;

	      var points = [];
	      var index = void 0,
	          n_sub = 12;

	      for (var i = 0; i < pts.length * n_sub; i++) {
	        index = i / (pts.length * n_sub);
	        var position = this.spline.getPoint(index);

	        points.push(position);
	      }

	      return points;
	    }
	  }, {
	    key: 'render',
	    value: function render() {

	      // this.tick++;
	      //
	      // this.z = Math.cos(this.tick/20) * 400;
	      this.shader.bind(); // just to use propgram
	      this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);

	      // if(this.tick % 5 === 0){
	      if (this.currentPos[0]) {
	        this.points.push([this.currentPos[0], this.currentPos[1], this.z]);

	        this.currentPos[0] = this.currentPos[1] = null;
	        // console.log([this.currentPos[0], this.currentPos[1], 1.0]);
	        if (this.points.length > 30) {
	          this.points.shift();
	        }

	        // var bezP = this.getControlPoints(this.points);
	        // var finalP = this.getBezierPoints(bezP, bezP.length * 6);
	        // var finalP = this.getBezierPoints(this.ptsForBezier, this.ptsForBezier.length * 3, true);


	        var finalP = this.getPoints(this.points);
	        console.log(finalP);
	        // console.log(finalP);
	        // this.line.render(finalP);
	      }
	      // this.line.render();
	      // }

	      GL.draw(this.line);
	    }
	  }]);
	  return ViewLine;
	}();

	exports.default = ViewLine;
	module.exports = exports['default'];

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(24);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(35);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(86);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _GLHelpers = __webpack_require__(2);

	var _GLHelpers2 = _interopRequireDefault(_GLHelpers);

	var _Mesh2 = __webpack_require__(102);

	var _Mesh3 = _interopRequireDefault(_Mesh2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var gl = void 0,
	    pivotX = void 0,
	    pivotY = void 0,
	    axis = void 0;

	var Line = function (_Mesh) {
	  (0, _inherits3.default)(Line, _Mesh);

	  function Line(program, vertices) {
	    var attribPositionName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "a_position";
	    var drawMode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "GL.gl.TRIANGLES";
	    (0, _classCallCheck3.default)(this, Line);


	    gl = _GLHelpers2.default.gl;

	    var _this = (0, _possibleConstructorReturn3.default)(this, (Line.__proto__ || (0, _getPrototypeOf2.default)(Line)).call(this, program, _GLHelpers2.default.gl.TRIANGLES));

	    _this.compareV3 = function (a, b) {
	      var aa = a * 6;
	      var ab = b * 6;
	      // console.log(this.positions[ aa ] === this.positions[ ab ] ) && ( this.positions[ aa + 1 ] === this.positions[ ab + 1 ] ) && ( this.positions[ aa + 2 ] === this.positions[ ab + 2 ] );
	      return this.positions[aa] === this.positions[ab] && this.positions[aa + 1] === this.positions[ab + 1] && this.positions[aa + 2] === this.positions[ab + 2];
	    };

	    _this.copyV3 = function (a) {
	      var aa = a * 6;
	      // console.log(this.positions[ aa ], this.positions[ aa + 1 ], this.positions[ aa + 2 ]);
	      return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
	    };

	    _this.attribPositionName = attribPositionName;
	    _this.indices = [];
	    _this.counters = [];
	    var vert = [[0, 0, 0], [100, 250, 0], [50, 200, 0], [0, 200, 0], [-100, 220, 0], [-70, 300, 0]];

	    _this.vertices = vertices || vert;

	    _this.line();

	    return _this;
	  }

	  (0, _createClass3.default)(Line, [{
	    key: 'line',
	    value: function line() {
	      var positions = [];
	      var indices = [];

	      var index = 0;

	      var offset = 0;
	      var v = this.vertices.slice();
	      this.positions = [];

	      for (var i = 0; i < v.length; i++) {

	        this.positions.push(v[i][0], v[i][1], v[i][2]);
	        this.positions.push(v[i][0], v[i][1], v[i][2]);

	        var c = i / v.length;
	        this.counters.push([c]);
	        this.counters.push([c]);
	      }

	      this.process();
	    }
	  }, {
	    key: 'process',
	    value: function process(avoid) {

	      var l = this.positions.length / 6;

	      this.previous = [];
	      this.next = [];
	      // this.width = [];
	      // this.side = [];
	      // this.uvs = [];


	      // for( var j = 0; j < l; j++ ) {
	      // 	this.side.push( [1] );
	      // 	this.side.push( [-1] );
	      // }

	      // var w;
	      // for( var j = 0; j < l; j++ ) {
	      // 	w = 1.0;
	      // 	this.width.push( [w] );
	      // 	this.width.push( [w] );
	      // }

	      // for( var j = 0; j < l; j++ ) {
	      // 	this.uvs.push( j / ( l - 1 ), 0 );
	      // 	this.uvs.push( j / ( l - 1 ), 1 );
	      // }

	      var v;

	      if (this.compareV3(0, l - 1)) {
	        v = this.copyV3(l - 2);
	      } else {
	        v = this.copyV3(0);
	      }

	      this.previous.push(v[0], v[1], v[2]);
	      this.previous.push(v[0], v[1], v[2]);

	      for (var j = 0; j < l - 1; j++) {
	        v = this.copyV3(j);
	        this.previous.push(v[0], v[1], v[2]);
	        this.previous.push(v[0], v[1], v[2]);
	      }

	      for (var j = 1; j < l; j++) {
	        v = this.copyV3(j);
	        this.next.push(v[0], v[1], v[2]);
	        this.next.push(v[0], v[1], v[2]);
	      }

	      if (this.compareV3(l - 1, 0)) {
	        v = this.copyV3(1);
	      } else {
	        v = this.copyV3(l - 1);
	      }

	      this.next.push(this.positions[this.positions.length - 3], this.positions[this.positions.length - 2], this.positions[this.positions.length - 1]);
	      this.next.push(this.positions[this.positions.length - 3], this.positions[this.positions.length - 2], this.positions[this.positions.length - 1]);

	      // this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
	      // this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );


	      for (var j = 0; j < l - 1; j++) {
	        var n = j * 2;

	        // console.log(n, n+1, n+2, n + 2, n + 1, n + 3);
	        this.indices.push(n, n + 1, n + 2);
	        this.indices.push(n + 2, n + 1, n + 3);
	      }

	      // this.next.push([ v[ 0 ], v[ 1 ], v[ 2 ] ]);
	      // this.next.push([ v[ 0 ], v[ 1 ], v[ 2 ] ]);


	      var pos = [];
	      var offsets = [];
	      var directions = [];
	      for (var i = 0; i < this.positions.length; i += 3) {
	        var p = this.positions;
	        pos.push([p[i], p[i + 1], p[i + 2]]);

	        if (i % 2 === 0) {
	          directions.push([1]);
	          offsets.push([0, 0, 0]);
	        } else {
	          directions.push([-1]);
	          offsets.push([Math.random() * 50, Math.random() * 50, Math.random() * 50]);
	        }
	      }
	      // console.log(pos);
	      this.bufferVertex(pos, true, this.attribPositionName);
	      this.bufferData(directions, 'direction', 1, false);
	      // this.bufferVertex(offsets, false, "a_offsets");

	      // console.log(this.width);

	      // console.log(this.previous[20]);
	      // console.log(this.next[20]);
	      // console.log(this.positions[20]);

	      var nextPos = [];
	      for (var i = 0; i < this.next.length; i += 3) {
	        var p = this.next;
	        nextPos.push([p[i], p[i + 1], p[i + 2]]);
	      }

	      this.bufferData(nextPos, 'a_next', 3, true);

	      var prevPos = [];
	      for (var i = 0; i < this.previous.length; i += 3) {
	        var p = this.previous;
	        prevPos.push([p[i], p[i + 1], p[i + 2]]);
	      }

	      this.bufferData(prevPos, 'a_previous', 3, true);

	      this.bufferIndex(this.indices, false);
	      // this.bufferData(this.side, 'a_side', 1, true);
	      // this.bufferData(this.width, 'a_width', 1, true);
	      this.bufferData(this.counters, 'a_counters', 1, true);
	    }

	    // bufferIndex(mArrayIndices, isDynamic = false) {
	    //
	    // 	const drawType        = isDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
	    // 	this._indices         = mArrayIndices;
	    // 	if (!this.iBuffer) {
	    // 		this.iBuffer      = gl.createBuffer();
	    // 	}
	    // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	    // 	// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(9 * 6), drawType);
	    // 	this.iBuffer.itemSize = 1;
	    // 	this.iBuffer.numItems = mArrayIndices.length;
	    //
	    //
	    // 	// if (this._vertices.length > 0 && this.drawType === GL.TRIANGLES) {
	    // 	// 	this._generateFaces();
	    // 	// }
	    // }

	  }, {
	    key: 'render',
	    value: function render(points) {
	      // this.vertices[0] += 1;
	      // console.log(points);
	      // this.vertices = points;
	      // this.vertices = [
	      //   [0, 0, 0],
	      //   [100, 250, 0],
	      //   [50, 200 ,0],
	      //   [0, 200 ,0],
	      //   [-100, 220 ,0],
	      //   [-70, 300 ,0]
	      // ];

	      this.vertices = points;
	      // GL._bindBuffers(this);

	      this.line();
	      // console.log("here");
	    }
	  }]);
	  return Line;
	}(_Mesh3.default);

	exports.default = Line;
	module.exports = exports['default'];

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(122);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _typeof2 = __webpack_require__(36);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	  A javascript Bezier curve library by Pomax.

	  Based on http://pomax.github.io/bezierinfo

	  This code is MIT licensed.
	**/
	(function () {
	  "use strict";

	  // math-inlining.

	  var abs = Math.abs,
	      min = Math.min,
	      max = Math.max,
	      acos = Math.acos,
	      sqrt = Math.sqrt,
	      pi = Math.PI,

	  // a zero coordinate, which is surprisingly useful
	  ZERO = { x: 0, y: 0, z: 0 };

	  // quite needed
	  var utils = __webpack_require__(124);

	  // not quite needed, but eventually this'll be useful...
	  var PolyBezier = __webpack_require__(125);

	  /**
	   * Bezier curve constructor. The constructor argument can be one of three things:
	   *
	   * 1. array/4 of {x:..., y:..., z:...}, z optional
	   * 2. numerical array/8 ordered x1,y1,x2,y2,x3,y3,x4,y4
	   * 3. numerical array/12 ordered x1,y1,z1,x2,y2,z2,x3,y3,z3,x4,y4,z4
	   *
	   */
	  var Bezier = function Bezier(coords) {
	    var args = coords && coords.forEach ? coords : [].slice.call(arguments);
	    var coordlen = false;
	    if ((0, _typeof3.default)(args[0]) === "object") {
	      coordlen = args.length;
	      var newargs = [];
	      args.forEach(function (point) {
	        ['x', 'y', 'z'].forEach(function (d) {
	          if (typeof point[d] !== "undefined") {
	            newargs.push(point[d]);
	          }
	        });
	      });
	      args = newargs;
	    }
	    var higher = false;
	    var len = args.length;
	    if (coordlen) {
	      if (coordlen > 4) {
	        if (arguments.length !== 1) {
	          throw new Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");
	        }
	        higher = true;
	      }
	    } else {
	      if (len !== 6 && len !== 8 && len !== 9 && len !== 12) {
	        if (arguments.length !== 1) {
	          throw new Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");
	        }
	      }
	    }
	    var _3d = !higher && (len === 9 || len === 12) || coords && coords[0] && typeof coords[0].z !== "undefined";
	    this._3d = _3d;
	    var points = [];
	    for (var idx = 0, step = _3d ? 3 : 2; idx < len; idx += step) {
	      var point = {
	        x: args[idx],
	        y: args[idx + 1]
	      };
	      if (_3d) {
	        point.z = args[idx + 2];
	      };
	      points.push(point);
	    }
	    this.order = points.length - 1;
	    this.points = points;
	    var dims = ['x', 'y'];
	    if (_3d) dims.push('z');
	    this.dims = dims;
	    this.dimlen = dims.length;

	    (function (curve) {
	      var order = curve.order;
	      var points = curve.points;
	      var a = utils.align(points, { p1: points[0], p2: points[order] });
	      for (var i = 0; i < a.length; i++) {
	        if (abs(a[i].y) > 0.0001) {
	          curve._linear = false;
	          return;
	        }
	      }
	      curve._linear = true;
	    })(this);

	    this._t1 = 0;
	    this._t2 = 1;
	    this.update();
	  };

	  Bezier.fromSVG = function (svgString) {
	    var list = svgString.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g).map(parseFloat);
	    var relative = /[cq]/.test(svgString);
	    if (!relative) return new Bezier(list);
	    list = list.map(function (v, i) {
	      return i < 2 ? v : v + list[i % 2];
	    });
	    return new Bezier(list);
	  };

	  function getABC(n, S, B, E, t) {
	    if (typeof t === "undefined") {
	      t = 0.5;
	    }
	    var u = utils.projectionratio(t, n),
	        um = 1 - u,
	        C = {
	      x: u * S.x + um * E.x,
	      y: u * S.y + um * E.y
	    },
	        s = utils.abcratio(t, n),
	        A = {
	      x: B.x + (B.x - C.x) / s,
	      y: B.y + (B.y - C.y) / s
	    };
	    return { A: A, B: B, C: C };
	  }

	  Bezier.quadraticFromPoints = function (p1, p2, p3, t) {
	    if (typeof t === "undefined") {
	      t = 0.5;
	    }
	    // shortcuts, although they're really dumb
	    if (t === 0) {
	      return new Bezier(p2, p2, p3);
	    }
	    if (t === 1) {
	      return new Bezier(p1, p2, p2);
	    }
	    // real fitting.
	    var abc = getABC(2, p1, p2, p3, t);
	    return new Bezier(p1, abc.A, p3);
	  };

	  Bezier.cubicFromPoints = function (S, B, E, t, d1) {
	    if (typeof t === "undefined") {
	      t = 0.5;
	    }
	    var abc = getABC(3, S, B, E, t);
	    if (typeof d1 === "undefined") {
	      d1 = utils.dist(B, abc.C);
	    }
	    var d2 = d1 * (1 - t) / t;

	    var selen = utils.dist(S, E),
	        lx = (E.x - S.x) / selen,
	        ly = (E.y - S.y) / selen,
	        bx1 = d1 * lx,
	        by1 = d1 * ly,
	        bx2 = d2 * lx,
	        by2 = d2 * ly;
	    // derivation of new hull coordinates
	    var e1 = { x: B.x - bx1, y: B.y - by1 },
	        e2 = { x: B.x + bx2, y: B.y + by2 },
	        A = abc.A,
	        v1 = { x: A.x + (e1.x - A.x) / (1 - t), y: A.y + (e1.y - A.y) / (1 - t) },
	        v2 = { x: A.x + (e2.x - A.x) / t, y: A.y + (e2.y - A.y) / t },
	        nc1 = { x: S.x + (v1.x - S.x) / t, y: S.y + (v1.y - S.y) / t },
	        nc2 = { x: E.x + (v2.x - E.x) / (1 - t), y: E.y + (v2.y - E.y) / (1 - t) };
	    // ...done
	    return new Bezier(S, nc1, nc2, E);
	  };

	  var getUtils = function getUtils() {
	    return utils;
	  };

	  Bezier.getUtils = getUtils;

	  Bezier.prototype = {
	    getUtils: getUtils,
	    valueOf: function valueOf() {
	      return this.toString();
	    },
	    toString: function toString() {
	      return utils.pointsToString(this.points);
	    },
	    toSVG: function toSVG(relative) {
	      if (this._3d) return false;
	      var p = this.points,
	          x = p[0].x,
	          y = p[0].y,
	          s = ["M", x, y, this.order === 2 ? "Q" : "C"];
	      for (var i = 1, last = p.length; i < last; i++) {
	        s.push(p[i].x);
	        s.push(p[i].y);
	      }
	      return s.join(" ");
	    },
	    update: function update() {
	      // one-time compute derivative coordinates
	      this.dpoints = [];
	      for (var p = this.points, d = p.length, c = d - 1; d > 1; d--, c--) {
	        var list = [];
	        for (var j = 0, dpt; j < c; j++) {
	          dpt = {
	            x: c * (p[j + 1].x - p[j].x),
	            y: c * (p[j + 1].y - p[j].y)
	          };
	          if (this._3d) {
	            dpt.z = c * (p[j + 1].z - p[j].z);
	          }
	          list.push(dpt);
	        }
	        this.dpoints.push(list);
	        p = list;
	      };
	      this.computedirection();
	    },
	    computedirection: function computedirection() {
	      var points = this.points;
	      var angle = utils.angle(points[0], points[this.order], points[1]);
	      this.clockwise = angle > 0;
	    },
	    length: function length() {
	      return utils.length(this.derivative.bind(this));
	    },
	    _lut: [],
	    getLUT: function getLUT(steps) {
	      steps = steps || 100;
	      if (this._lut.length === steps) {
	        return this._lut;
	      }
	      this._lut = [];
	      for (var t = 0; t <= steps; t++) {
	        this._lut.push(this.compute(t / steps));
	      }
	      return this._lut;
	    },
	    on: function on(point, error) {
	      error = error || 5;
	      var lut = this.getLUT(),
	          hits = [],
	          c,
	          t = 0;
	      for (var i = 0; i < lut.length; i++) {
	        c = lut[i];
	        if (utils.dist(c, point) < error) {
	          hits.push(c);
	          t += i / lut.length;
	        }
	      }
	      if (!hits.length) return false;
	      return t /= hits.length;
	    },
	    project: function project(point) {
	      // step 1: coarse check
	      var LUT = this.getLUT(),
	          l = LUT.length - 1,
	          closest = utils.closest(LUT, point),
	          mdist = closest.mdist,
	          mpos = closest.mpos;
	      if (mpos === 0 || mpos === l) {
	        var t = mpos / l,
	            pt = this.compute(t);
	        pt.t = t;
	        pt.d = mdist;
	        return pt;
	      }

	      // step 2: fine check
	      var ft,
	          t,
	          p,
	          d,
	          t1 = (mpos - 1) / l,
	          t2 = (mpos + 1) / l,
	          step = 0.1 / l;
	      mdist += 1;
	      for (t = t1, ft = t; t < t2 + step; t += step) {
	        p = this.compute(t);
	        d = utils.dist(point, p);
	        if (d < mdist) {
	          mdist = d;
	          ft = t;
	        }
	      }
	      p = this.compute(ft);
	      p.t = ft;
	      p.d = mdist;
	      return p;
	    },
	    get: function get(t) {
	      return this.compute(t);
	    },
	    point: function point(idx) {
	      return this.points[idx];
	    },
	    compute: function compute(t) {
	      // shortcuts
	      if (t === 0) {
	        return this.points[0];
	      }
	      if (t === 1) {
	        return this.points[this.order];
	      }

	      var p = this.points;
	      var mt = 1 - t;

	      // linear?
	      if (this.order === 1) {
	        ret = {
	          x: mt * p[0].x + t * p[1].x,
	          y: mt * p[0].y + t * p[1].y
	        };
	        if (this._3d) {
	          ret.z = mt * p[0].z + t * p[1].z;
	        }
	        return ret;
	      }

	      // quadratic/cubic curve?
	      if (this.order < 4) {
	        var mt2 = mt * mt,
	            t2 = t * t,
	            a,
	            b,
	            c,
	            d = 0;
	        if (this.order === 2) {
	          p = [p[0], p[1], p[2], ZERO];
	          a = mt2;
	          b = mt * t * 2;
	          c = t2;
	        } else if (this.order === 3) {
	          a = mt2 * mt;
	          b = mt2 * t * 3;
	          c = mt * t2 * 3;
	          d = t * t2;
	        }
	        var ret = {
	          x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x,
	          y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y
	        };
	        if (this._3d) {
	          ret.z = a * p[0].z + b * p[1].z + c * p[2].z + d * p[3].z;
	        }
	        return ret;
	      }

	      // higher order curves: use de Casteljau's computation
	      var dCpts = JSON.parse((0, _stringify2.default)(this.points));
	      while (dCpts.length > 1) {
	        for (var i = 0; i < dCpts.length - 1; i++) {
	          dCpts[i] = {
	            x: dCpts[i].x + (dCpts[i + 1].x - dCpts[i].x) * t,
	            y: dCpts[i].y + (dCpts[i + 1].y - dCpts[i].y) * t
	          };
	          if (typeof dCpts[i].z !== "undefined") {
	            dCpts[i] = dCpts[i].z + (dCpts[i + 1].z - dCpts[i].z) * t;
	          }
	        }
	        dCpts.splice(dCpts.length - 1, 1);
	      }
	      return dCpts[0];
	    },
	    raise: function raise() {
	      var p = this.points,
	          np = [p[0]],
	          i,
	          k = p.length,
	          pi,
	          pim;
	      for (var i = 1; i < k; i++) {
	        pi = p[i];
	        pim = p[i - 1];
	        np[i] = {
	          x: (k - i) / k * pi.x + i / k * pim.x,
	          y: (k - i) / k * pi.y + i / k * pim.y
	        };
	      }
	      np[k] = p[k - 1];
	      return new Bezier(np);
	    },
	    derivative: function derivative(t) {
	      var mt = 1 - t,
	          a,
	          b,
	          c = 0,
	          p = this.dpoints[0];
	      if (this.order === 2) {
	        p = [p[0], p[1], ZERO];a = mt;b = t;
	      }
	      if (this.order === 3) {
	        a = mt * mt;b = mt * t * 2;c = t * t;
	      }
	      var ret = {
	        x: a * p[0].x + b * p[1].x + c * p[2].x,
	        y: a * p[0].y + b * p[1].y + c * p[2].y
	      };
	      if (this._3d) {
	        ret.z = a * p[0].z + b * p[1].z + c * p[2].z;
	      }
	      return ret;
	    },
	    inflections: function inflections() {
	      return utils.inflections(this.points);
	    },
	    normal: function normal(t) {
	      return this._3d ? this.__normal3(t) : this.__normal2(t);
	    },
	    __normal2: function __normal2(t) {
	      var d = this.derivative(t);
	      var q = sqrt(d.x * d.x + d.y * d.y);
	      return { x: -d.y / q, y: d.x / q };
	    },
	    __normal3: function __normal3(t) {
	      // see http://stackoverflow.com/questions/25453159
	      var r1 = this.derivative(t),
	          r2 = this.derivative(t + 0.01),
	          q1 = sqrt(r1.x * r1.x + r1.y * r1.y + r1.z * r1.z),
	          q2 = sqrt(r2.x * r2.x + r2.y * r2.y + r2.z * r2.z);
	      r1.x /= q1;r1.y /= q1;r1.z /= q1;
	      r2.x /= q2;r2.y /= q2;r2.z /= q2;
	      // cross product
	      var c = {
	        x: r2.y * r1.z - r2.z * r1.y,
	        y: r2.z * r1.x - r2.x * r1.z,
	        z: r2.x * r1.y - r2.y * r1.x
	      };
	      var m = sqrt(c.x * c.x + c.y * c.y + c.z * c.z);
	      c.x /= m;c.y /= m;c.z /= m;
	      // rotation matrix
	      var R = [c.x * c.x, c.x * c.y - c.z, c.x * c.z + c.y, c.x * c.y + c.z, c.y * c.y, c.y * c.z - c.x, c.x * c.z - c.y, c.y * c.z + c.x, c.z * c.z];
	      // normal vector:
	      var n = {
	        x: R[0] * r1.x + R[1] * r1.y + R[2] * r1.z,
	        y: R[3] * r1.x + R[4] * r1.y + R[5] * r1.z,
	        z: R[6] * r1.x + R[7] * r1.y + R[8] * r1.z
	      };
	      return n;
	    },
	    hull: function hull(t) {
	      var p = this.points,
	          _p = [],
	          pt,
	          q = [],
	          idx = 0,
	          i = 0,
	          l = 0;
	      q[idx++] = p[0];
	      q[idx++] = p[1];
	      q[idx++] = p[2];
	      if (this.order === 3) {
	        q[idx++] = p[3];
	      }
	      // we lerp between all points at each iteration, until we have 1 point left.
	      while (p.length > 1) {
	        _p = [];
	        for (i = 0, l = p.length - 1; i < l; i++) {
	          pt = utils.lerp(t, p[i], p[i + 1]);
	          q[idx++] = pt;
	          _p.push(pt);
	        }
	        p = _p;
	      }
	      return q;
	    },
	    split: function split(t1, t2) {
	      // shortcuts
	      if (t1 === 0 && !!t2) {
	        return this.split(t2).left;
	      }
	      if (t2 === 1) {
	        return this.split(t1).right;
	      }

	      // no shortcut: use "de Casteljau" iteration.
	      var q = this.hull(t1);
	      var result = {
	        left: this.order === 2 ? new Bezier([q[0], q[3], q[5]]) : new Bezier([q[0], q[4], q[7], q[9]]),
	        right: this.order === 2 ? new Bezier([q[5], q[4], q[2]]) : new Bezier([q[9], q[8], q[6], q[3]]),
	        span: q
	      };

	      // make sure we bind _t1/_t2 information!
	      result.left._t1 = utils.map(0, 0, 1, this._t1, this._t2);
	      result.left._t2 = utils.map(t1, 0, 1, this._t1, this._t2);
	      result.right._t1 = utils.map(t1, 0, 1, this._t1, this._t2);
	      result.right._t2 = utils.map(1, 0, 1, this._t1, this._t2);

	      // if we have no t2, we're done
	      if (!t2) {
	        return result;
	      }

	      // if we have a t2, split again:
	      t2 = utils.map(t2, t1, 1, 0, 1);
	      var subsplit = result.right.split(t2);
	      return subsplit.left;
	    },
	    extrema: function extrema() {
	      var dims = this.dims,
	          result = {},
	          roots = [],
	          p,
	          mfn;
	      dims.forEach(function (dim) {
	        mfn = function mfn(v) {
	          return v[dim];
	        };
	        p = this.dpoints[0].map(mfn);
	        result[dim] = utils.droots(p);
	        if (this.order === 3) {
	          p = this.dpoints[1].map(mfn);
	          result[dim] = result[dim].concat(utils.droots(p));
	        }
	        result[dim] = result[dim].filter(function (t) {
	          return t >= 0 && t <= 1;
	        });
	        roots = roots.concat(result[dim].sort());
	      }.bind(this));
	      roots = roots.sort().filter(function (v, idx) {
	        return roots.indexOf(v) === idx;
	      });
	      result.values = roots;
	      return result;
	    },
	    bbox: function bbox() {
	      var extrema = this.extrema(),
	          result = {};
	      this.dims.forEach(function (d) {
	        result[d] = utils.getminmax(this, d, extrema[d]);
	      }.bind(this));
	      return result;
	    },
	    overlaps: function overlaps(curve) {
	      var lbbox = this.bbox(),
	          tbbox = curve.bbox();
	      return utils.bboxoverlap(lbbox, tbbox);
	    },
	    offset: function offset(t, d) {
	      if (typeof d !== "undefined") {
	        var c = this.get(t);
	        var n = this.normal(t);
	        var ret = {
	          c: c,
	          n: n,
	          x: c.x + n.x * d,
	          y: c.y + n.y * d
	        };
	        if (this._3d) {
	          ret.z = c.z + n.z * d;
	        };
	        return ret;
	      }
	      if (this._linear) {
	        var nv = this.normal(0);
	        var coords = this.points.map(function (p) {
	          var ret = {
	            x: p.x + t * nv.x,
	            y: p.y + t * nv.y
	          };
	          if (p.z && n.z) {
	            ret.z = p.z + t * nv.z;
	          }
	          return ret;
	        });
	        return [new Bezier(coords)];
	      }
	      var reduced = this.reduce();
	      return reduced.map(function (s) {
	        return s.scale(t);
	      });
	    },
	    simple: function simple() {
	      if (this.order === 3) {
	        var a1 = utils.angle(this.points[0], this.points[3], this.points[1]);
	        var a2 = utils.angle(this.points[0], this.points[3], this.points[2]);
	        if (a1 > 0 && a2 < 0 || a1 < 0 && a2 > 0) return false;
	      }
	      var n1 = this.normal(0);
	      var n2 = this.normal(1);
	      var s = n1.x * n2.x + n1.y * n2.y;
	      if (this._3d) {
	        s += n1.z * n2.z;
	      }
	      var angle = abs(acos(s));
	      return angle < pi / 3;
	    },
	    reduce: function reduce() {
	      var i,
	          t1 = 0,
	          t2 = 0,
	          step = 0.01,
	          segment,
	          pass1 = [],
	          pass2 = [];
	      // first pass: split on extrema
	      var extrema = this.extrema().values;
	      if (extrema.indexOf(0) === -1) {
	        extrema = [0].concat(extrema);
	      }
	      if (extrema.indexOf(1) === -1) {
	        extrema.push(1);
	      }

	      for (t1 = extrema[0], i = 1; i < extrema.length; i++) {
	        t2 = extrema[i];
	        segment = this.split(t1, t2);
	        segment._t1 = t1;
	        segment._t2 = t2;
	        pass1.push(segment);
	        t1 = t2;
	      }

	      // second pass: further reduce these segments to simple segments
	      pass1.forEach(function (p1) {
	        t1 = 0;
	        t2 = 0;
	        while (t2 <= 1) {
	          for (t2 = t1 + step; t2 <= 1 + step; t2 += step) {
	            segment = p1.split(t1, t2);
	            if (!segment.simple()) {
	              t2 -= step;
	              if (abs(t1 - t2) < step) {
	                // we can never form a reduction
	                return [];
	              }
	              segment = p1.split(t1, t2);
	              segment._t1 = utils.map(t1, 0, 1, p1._t1, p1._t2);
	              segment._t2 = utils.map(t2, 0, 1, p1._t1, p1._t2);
	              pass2.push(segment);
	              t1 = t2;
	              break;
	            }
	          }
	        }
	        if (t1 < 1) {
	          segment = p1.split(t1, 1);
	          segment._t1 = utils.map(t1, 0, 1, p1._t1, p1._t2);
	          segment._t2 = p1._t2;
	          pass2.push(segment);
	        }
	      });
	      return pass2;
	    },
	    scale: function scale(d) {
	      var order = this.order;
	      var distanceFn = false;
	      if (typeof d === "function") {
	        distanceFn = d;
	      }
	      if (distanceFn && order === 2) {
	        return this.raise().scale(distanceFn);
	      }

	      // TODO: add special handling for degenerate (=linear) curves.
	      var clockwise = this.clockwise;
	      var r1 = distanceFn ? distanceFn(0) : d;
	      var r2 = distanceFn ? distanceFn(1) : d;
	      var v = [this.offset(0, 10), this.offset(1, 10)];
	      var o = utils.lli4(v[0], v[0].c, v[1], v[1].c);
	      if (!o) {
	        throw new Error("cannot scale this curve. Try reducing it first.");
	      }
	      // move all points by distance 'd' wrt the origin 'o'
	      var points = this.points,
	          np = [];

	      // move end points by fixed distance along normal.
	      [0, 1].forEach(function (t) {
	        var p = np[t * order] = utils.copy(points[t * order]);
	        p.x += (t ? r2 : r1) * v[t].n.x;
	        p.y += (t ? r2 : r1) * v[t].n.y;
	      }.bind(this));

	      if (!distanceFn) {
	        // move control points to lie on the intersection of the offset
	        // derivative vector, and the origin-through-control vector
	        [0, 1].forEach(function (t) {
	          if (this.order === 2 && !!t) return;
	          var p = np[t * order];
	          var d = this.derivative(t);
	          var p2 = { x: p.x + d.x, y: p.y + d.y };
	          np[t + 1] = utils.lli4(p, p2, o, points[t + 1]);
	        }.bind(this));
	        return new Bezier(np);
	      }

	      // move control points by "however much necessary to
	      // ensure the correct tangent to endpoint".
	      [0, 1].forEach(function (t) {
	        if (this.order === 2 && !!t) return;
	        var p = points[t + 1];
	        var ov = {
	          x: p.x - o.x,
	          y: p.y - o.y
	        };
	        var rc = distanceFn ? distanceFn((t + 1) / order) : d;
	        if (distanceFn && !clockwise) rc = -rc;
	        var m = sqrt(ov.x * ov.x + ov.y * ov.y);
	        ov.x /= m;
	        ov.y /= m;
	        np[t + 1] = {
	          x: p.x + rc * ov.x,
	          y: p.y + rc * ov.y
	        };
	      }.bind(this));
	      return new Bezier(np);
	    },
	    outline: function outline(d1, d2, d3, d4) {
	      d2 = typeof d2 === "undefined" ? d1 : d2;
	      var reduced = this.reduce(),
	          len = reduced.length,
	          fcurves = [],
	          bcurves = [],
	          p,
	          alen = 0,
	          tlen = this.length();

	      var graduated = typeof d3 !== "undefined" && typeof d4 !== "undefined";

	      function linearDistanceFunction(s, e, tlen, alen, slen) {
	        return function (v) {
	          var f1 = alen / tlen,
	              f2 = (alen + slen) / tlen,
	              d = e - s;
	          return utils.map(v, 0, 1, s + f1 * d, s + f2 * d);
	        };
	      };

	      // form curve oulines
	      reduced.forEach(function (segment) {
	        slen = segment.length();
	        if (graduated) {
	          fcurves.push(segment.scale(linearDistanceFunction(d1, d3, tlen, alen, slen)));
	          bcurves.push(segment.scale(linearDistanceFunction(-d2, -d4, tlen, alen, slen)));
	        } else {
	          fcurves.push(segment.scale(d1));
	          bcurves.push(segment.scale(-d2));
	        }
	        alen += slen;
	      });

	      // reverse the "return" outline
	      bcurves = bcurves.map(function (s) {
	        p = s.points;
	        if (p[3]) {
	          s.points = [p[3], p[2], p[1], p[0]];
	        } else {
	          s.points = [p[2], p[1], p[0]];
	        }
	        return s;
	      }).reverse();

	      // form the endcaps as lines
	      var fs = fcurves[0].points[0],
	          fe = fcurves[len - 1].points[fcurves[len - 1].points.length - 1],
	          bs = bcurves[len - 1].points[bcurves[len - 1].points.length - 1],
	          be = bcurves[0].points[0],
	          ls = utils.makeline(bs, fs),
	          le = utils.makeline(fe, be),
	          segments = [ls].concat(fcurves).concat([le]).concat(bcurves),
	          slen = segments.length;

	      return new PolyBezier(segments);
	    },
	    outlineshapes: function outlineshapes(d1, d2, curveIntersectionThreshold) {
	      d2 = d2 || d1;
	      var outline = this.outline(d1, d2).curves;
	      var shapes = [];
	      for (var i = 1, len = outline.length; i < len / 2; i++) {
	        var shape = utils.makeshape(outline[i], outline[len - i], curveIntersectionThreshold);
	        shape.startcap.virtual = i > 1;
	        shape.endcap.virtual = i < len / 2 - 1;
	        shapes.push(shape);
	      }
	      return shapes;
	    },
	    intersects: function intersects(curve, curveIntersectionThreshold) {
	      if (!curve) return this.selfintersects(curveIntersectionThreshold);
	      if (curve.p1 && curve.p2) {
	        return this.lineIntersects(curve);
	      }
	      if (curve instanceof Bezier) {
	        curve = curve.reduce();
	      }
	      return this.curveintersects(this.reduce(), curve, curveIntersectionThreshold);
	    },
	    lineIntersects: function lineIntersects(line) {
	      var mx = min(line.p1.x, line.p2.x),
	          my = min(line.p1.y, line.p2.y),
	          MX = max(line.p1.x, line.p2.x),
	          MY = max(line.p1.y, line.p2.y),
	          self = this;
	      return utils.roots(this.points, line).filter(function (t) {
	        var p = self.get(t);
	        return utils.between(p.x, mx, MX) && utils.between(p.y, my, MY);
	      });
	    },
	    selfintersects: function selfintersects(curveIntersectionThreshold) {
	      var reduced = this.reduce();
	      // "simple" curves cannot intersect with their direct
	      // neighbour, so for each segment X we check whether
	      // it intersects [0:x-2][x+2:last].
	      var i,
	          len = reduced.length - 2,
	          results = [],
	          result,
	          left,
	          right;
	      for (i = 0; i < len; i++) {
	        left = reduced.slice(i, i + 1);
	        right = reduced.slice(i + 2);
	        result = this.curveintersects(left, right, curveIntersectionThreshold);
	        results = results.concat(result);
	      }
	      return results;
	    },
	    curveintersects: function curveintersects(c1, c2, curveIntersectionThreshold) {
	      var pairs = [];
	      // step 1: pair off any overlapping segments
	      c1.forEach(function (l) {
	        c2.forEach(function (r) {
	          if (l.overlaps(r)) {
	            pairs.push({ left: l, right: r });
	          }
	        });
	      });
	      // step 2: for each pairing, run through the convergence algorithm.
	      var intersections = [];
	      pairs.forEach(function (pair) {
	        var result = utils.pairiteration(pair.left, pair.right, curveIntersectionThreshold);
	        if (result.length > 0) {
	          intersections = intersections.concat(result);
	        }
	      });
	      return intersections;
	    },
	    arcs: function arcs(errorThreshold) {
	      errorThreshold = errorThreshold || 0.5;
	      var circles = [];
	      return this._iterate(errorThreshold, circles);
	    },
	    _error: function _error(pc, np1, s, e) {
	      var q = (e - s) / 4,
	          c1 = this.get(s + q),
	          c2 = this.get(e - q),
	          ref = utils.dist(pc, np1),
	          d1 = utils.dist(pc, c1),
	          d2 = utils.dist(pc, c2);
	      return abs(d1 - ref) + abs(d2 - ref);
	    },
	    _iterate: function _iterate(errorThreshold, circles) {
	      var s = 0,
	          e = 1,
	          safety;
	      // we do a binary search to find the "good `t` closest to no-longer-good"
	      do {
	        safety = 0;

	        // step 1: start with the maximum possible arc
	        e = 1;

	        // points:
	        var np1 = this.get(s),
	            np2,
	            np3,
	            arc,
	            prev_arc;

	        // booleans:
	        var curr_good = false,
	            prev_good = false,
	            done;

	        // numbers:
	        var m = e,
	            prev_e = 1,
	            step = 0;

	        // step 2: find the best possible arc
	        do {
	          prev_good = curr_good;
	          prev_arc = arc;
	          m = (s + e) / 2;
	          step++;

	          np2 = this.get(m);
	          np3 = this.get(e);

	          arc = utils.getccenter(np1, np2, np3);

	          //also save the t values
	          arc.interval = {
	            start: s,
	            end: e
	          };

	          var error = this._error(arc, np1, s, e);
	          curr_good = error <= errorThreshold;

	          done = prev_good && !curr_good;
	          if (!done) prev_e = e;

	          // this arc is fine: we can move 'e' up to see if we can find a wider arc
	          if (curr_good) {
	            // if e is already at max, then we're done for this arc.
	            if (e >= 1) {
	              prev_e = 1;
	              prev_arc = arc;
	              break;
	            }
	            // if not, move it up by half the iteration distance
	            e = e + (e - s) / 2;
	          }

	          // this is a bad arc: we need to move 'e' down to find a good arc
	          else {
	              e = m;
	            }
	        } while (!done && safety++ < 100);

	        if (safety >= 100) {
	          console.error("arc abstraction somehow failed...");
	          break;
	        }

	        // console.log("[F] arc found", s, prev_e, prev_arc.x, prev_arc.y, prev_arc.s, prev_arc.e);

	        prev_arc = prev_arc ? prev_arc : arc;
	        circles.push(prev_arc);
	        s = prev_e;
	      } while (e < 1);
	      return circles;
	    }
	  };

	  module.exports = Bezier;
	})();

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(123), __esModule: true };

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(10)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _stringify = __webpack_require__(122);

	var _stringify2 = _interopRequireDefault(_stringify);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function () {
	  "use strict";

	  // math-inlining.

	  var abs = Math.abs,
	      cos = Math.cos,
	      sin = Math.sin,
	      acos = Math.acos,
	      atan2 = Math.atan2,
	      sqrt = Math.sqrt,
	      pow = Math.pow,

	  // cube root function yielding real roots
	  crt = function crt(v) {
	    return v < 0 ? -pow(-v, 1 / 3) : pow(v, 1 / 3);
	  },

	  // trig constants
	  pi = Math.PI,
	      tau = 2 * pi,
	      quart = pi / 2,

	  // float precision significant decimal
	  epsilon = 0.000001;

	  // Bezier utility functions
	  var utils = {
	    // Legendre-Gauss abscissae with n=24 (x_i values, defined at i=n as the roots of the nth order Legendre polynomial Pn(x))
	    Tvalues: [-0.0640568928626056260850430826247450385909, 0.0640568928626056260850430826247450385909, -0.1911188674736163091586398207570696318404, 0.1911188674736163091586398207570696318404, -0.3150426796961633743867932913198102407864, 0.3150426796961633743867932913198102407864, -0.4337935076260451384870842319133497124524, 0.4337935076260451384870842319133497124524, -0.5454214713888395356583756172183723700107, 0.5454214713888395356583756172183723700107, -0.6480936519369755692524957869107476266696, 0.6480936519369755692524957869107476266696, -0.7401241915785543642438281030999784255232, 0.7401241915785543642438281030999784255232, -0.8200019859739029219539498726697452080761, 0.8200019859739029219539498726697452080761, -0.8864155270044010342131543419821967550873, 0.8864155270044010342131543419821967550873, -0.9382745520027327585236490017087214496548, 0.9382745520027327585236490017087214496548, -0.9747285559713094981983919930081690617411, 0.9747285559713094981983919930081690617411, -0.9951872199970213601799974097007368118745, 0.9951872199970213601799974097007368118745],

	    // Legendre-Gauss weights with n=24 (w_i values, defined by a function linked to in the Bezier primer article)
	    Cvalues: [0.1279381953467521569740561652246953718517, 0.1279381953467521569740561652246953718517, 0.1258374563468282961213753825111836887264, 0.1258374563468282961213753825111836887264, 0.1216704729278033912044631534762624256070, 0.1216704729278033912044631534762624256070, 0.1155056680537256013533444839067835598622, 0.1155056680537256013533444839067835598622, 0.1074442701159656347825773424466062227946, 0.1074442701159656347825773424466062227946, 0.0976186521041138882698806644642471544279, 0.0976186521041138882698806644642471544279, 0.0861901615319532759171852029837426671850, 0.0861901615319532759171852029837426671850, 0.0733464814110803057340336152531165181193, 0.0733464814110803057340336152531165181193, 0.0592985849154367807463677585001085845412, 0.0592985849154367807463677585001085845412, 0.0442774388174198061686027482113382288593, 0.0442774388174198061686027482113382288593, 0.0285313886289336631813078159518782864491, 0.0285313886289336631813078159518782864491, 0.0123412297999871995468056670700372915759, 0.0123412297999871995468056670700372915759],

	    arcfn: function arcfn(t, derivativeFn) {
	      var d = derivativeFn(t);
	      var l = d.x * d.x + d.y * d.y;
	      if (typeof d.z !== "undefined") {
	        l += d.z * d.z;
	      }
	      return sqrt(l);
	    },

	    between: function between(v, m, M) {
	      return m <= v && v <= M || utils.approximately(v, m) || utils.approximately(v, M);
	    },

	    approximately: function approximately(a, b, precision) {
	      return abs(a - b) <= (precision || epsilon);
	    },

	    length: function length(derivativeFn) {
	      var z = 0.5,
	          sum = 0,
	          len = utils.Tvalues.length,
	          i,
	          t;
	      for (i = 0; i < len; i++) {
	        t = z * utils.Tvalues[i] + z;
	        sum += utils.Cvalues[i] * utils.arcfn(t, derivativeFn);
	      }
	      return z * sum;
	    },

	    map: function map(v, ds, de, ts, te) {
	      var d1 = de - ds,
	          d2 = te - ts,
	          v2 = v - ds,
	          r = v2 / d1;
	      return ts + d2 * r;
	    },

	    lerp: function lerp(r, v1, v2) {
	      var ret = {
	        x: v1.x + r * (v2.x - v1.x),
	        y: v1.y + r * (v2.y - v1.y)
	      };
	      if (!!v1.z && !!v2.z) {
	        ret.z = v1.z + r * (v2.z - v1.z);
	      }
	      return ret;
	    },

	    pointToString: function pointToString(p) {
	      var s = p.x + "/" + p.y;
	      if (typeof p.z !== "undefined") {
	        s += "/" + p.z;
	      }
	      return s;
	    },

	    pointsToString: function pointsToString(points) {
	      return "[" + points.map(utils.pointToString).join(", ") + "]";
	    },

	    copy: function copy(obj) {
	      return JSON.parse((0, _stringify2.default)(obj));
	    },

	    angle: function angle(o, v1, v2) {
	      var dx1 = v1.x - o.x,
	          dy1 = v1.y - o.y,
	          dx2 = v2.x - o.x,
	          dy2 = v2.y - o.y,
	          cross = dx1 * dy2 - dy1 * dx2,
	          m1 = sqrt(dx1 * dx1 + dy1 * dy1),
	          m2 = sqrt(dx2 * dx2 + dy2 * dy2),
	          dot;
	      dx1 /= m1;dy1 /= m1;dx2 /= m2;dy2 /= m2;
	      dot = dx1 * dx2 + dy1 * dy2;
	      return atan2(cross, dot);
	    },

	    // round as string, to avoid rounding errors
	    round: function round(v, d) {
	      var s = '' + v;
	      var pos = s.indexOf(".");
	      return parseFloat(s.substring(0, pos + 1 + d));
	    },

	    dist: function dist(p1, p2) {
	      var dx = p1.x - p2.x,
	          dy = p1.y - p2.y;
	      return sqrt(dx * dx + dy * dy);
	    },

	    closest: function closest(LUT, point) {
	      var mdist = pow(2, 63),
	          mpos,
	          d;
	      LUT.forEach(function (p, idx) {
	        d = utils.dist(point, p);
	        if (d < mdist) {
	          mdist = d;
	          mpos = idx;
	        }
	      });
	      return { mdist: mdist, mpos: mpos };
	    },

	    abcratio: function abcratio(t, n) {
	      // see ratio(t) note on http://pomax.github.io/bezierinfo/#abc
	      if (n !== 2 && n !== 3) {
	        return false;
	      }
	      if (typeof t === "undefined") {
	        t = 0.5;
	      } else if (t === 0 || t === 1) {
	        return t;
	      }
	      var bottom = pow(t, n) + pow(1 - t, n),
	          top = bottom - 1;
	      return abs(top / bottom);
	    },

	    projectionratio: function projectionratio(t, n) {
	      // see u(t) note on http://pomax.github.io/bezierinfo/#abc
	      if (n !== 2 && n !== 3) {
	        return false;
	      }
	      if (typeof t === "undefined") {
	        t = 0.5;
	      } else if (t === 0 || t === 1) {
	        return t;
	      }
	      var top = pow(1 - t, n),
	          bottom = pow(t, n) + top;
	      return top / bottom;
	    },

	    lli8: function lli8(x1, y1, x2, y2, x3, y3, x4, y4) {
	      var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
	          ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
	          d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	      if (d == 0) {
	        return false;
	      }
	      return { x: nx / d, y: ny / d };
	    },

	    lli4: function lli4(p1, p2, p3, p4) {
	      var x1 = p1.x,
	          y1 = p1.y,
	          x2 = p2.x,
	          y2 = p2.y,
	          x3 = p3.x,
	          y3 = p3.y,
	          x4 = p4.x,
	          y4 = p4.y;
	      return utils.lli8(x1, y1, x2, y2, x3, y3, x4, y4);
	    },

	    lli: function lli(v1, v2) {
	      return utils.lli4(v1, v1.c, v2, v2.c);
	    },

	    makeline: function makeline(p1, p2) {
	      var Bezier = __webpack_require__(121);
	      var x1 = p1.x,
	          y1 = p1.y,
	          x2 = p2.x,
	          y2 = p2.y,
	          dx = (x2 - x1) / 3,
	          dy = (y2 - y1) / 3;
	      return new Bezier(x1, y1, x1 + dx, y1 + dy, x1 + 2 * dx, y1 + 2 * dy, x2, y2);
	    },

	    findbbox: function findbbox(sections) {
	      var mx = 99999999,
	          my = mx,
	          MX = -mx,
	          MY = MX;
	      sections.forEach(function (s) {
	        var bbox = s.bbox();
	        if (mx > bbox.x.min) mx = bbox.x.min;
	        if (my > bbox.y.min) my = bbox.y.min;
	        if (MX < bbox.x.max) MX = bbox.x.max;
	        if (MY < bbox.y.max) MY = bbox.y.max;
	      });
	      return {
	        x: { min: mx, mid: (mx + MX) / 2, max: MX, size: MX - mx },
	        y: { min: my, mid: (my + MY) / 2, max: MY, size: MY - my }
	      };
	    },

	    shapeintersections: function shapeintersections(s1, bbox1, s2, bbox2, curveIntersectionThreshold) {
	      if (!utils.bboxoverlap(bbox1, bbox2)) return [];
	      var intersections = [];
	      var a1 = [s1.startcap, s1.forward, s1.back, s1.endcap];
	      var a2 = [s2.startcap, s2.forward, s2.back, s2.endcap];
	      a1.forEach(function (l1) {
	        if (l1.virtual) return;
	        a2.forEach(function (l2) {
	          if (l2.virtual) return;
	          var iss = l1.intersects(l2, curveIntersectionThreshold);
	          if (iss.length > 0) {
	            iss.c1 = l1;
	            iss.c2 = l2;
	            iss.s1 = s1;
	            iss.s2 = s2;
	            intersections.push(iss);
	          }
	        });
	      });
	      return intersections;
	    },

	    makeshape: function makeshape(forward, back, curveIntersectionThreshold) {
	      var bpl = back.points.length;
	      var fpl = forward.points.length;
	      var start = utils.makeline(back.points[bpl - 1], forward.points[0]);
	      var end = utils.makeline(forward.points[fpl - 1], back.points[0]);
	      var shape = {
	        startcap: start,
	        forward: forward,
	        back: back,
	        endcap: end,
	        bbox: utils.findbbox([start, forward, back, end])
	      };
	      var self = utils;
	      shape.intersections = function (s2) {
	        return self.shapeintersections(shape, shape.bbox, s2, s2.bbox, curveIntersectionThreshold);
	      };
	      return shape;
	    },

	    getminmax: function getminmax(curve, d, list) {
	      if (!list) return { min: 0, max: 0 };
	      var min = 0xFFFFFFFFFFFFFFFF,
	          max = -min,
	          t,
	          c;
	      if (list.indexOf(0) === -1) {
	        list = [0].concat(list);
	      }
	      if (list.indexOf(1) === -1) {
	        list.push(1);
	      }
	      for (var i = 0, len = list.length; i < len; i++) {
	        t = list[i];
	        c = curve.get(t);
	        if (c[d] < min) {
	          min = c[d];
	        }
	        if (c[d] > max) {
	          max = c[d];
	        }
	      }
	      return { min: min, mid: (min + max) / 2, max: max, size: max - min };
	    },

	    align: function align(points, line) {
	      var tx = line.p1.x,
	          ty = line.p1.y,
	          a = -atan2(line.p2.y - ty, line.p2.x - tx),
	          d = function d(v) {
	        return {
	          x: (v.x - tx) * cos(a) - (v.y - ty) * sin(a),
	          y: (v.x - tx) * sin(a) + (v.y - ty) * cos(a)
	        };
	      };
	      return points.map(d);
	    },

	    roots: function roots(points, line) {
	      line = line || { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } };
	      var order = points.length - 1;
	      var p = utils.align(points, line);
	      var reduce = function reduce(t) {
	        return 0 <= t && t <= 1;
	      };

	      if (order === 2) {
	        var a = p[0].y,
	            b = p[1].y,
	            c = p[2].y,
	            d = a - 2 * b + c;
	        if (d !== 0) {
	          var m1 = -sqrt(b * b - a * c),
	              m2 = -a + b,
	              v1 = -(m1 + m2) / d,
	              v2 = -(-m1 + m2) / d;
	          return [v1, v2].filter(reduce);
	        } else if (b !== c && d === 0) {
	          return [(2 * b - c) / 2 * (b - c)].filter(reduce);
	        }
	        return [];
	      }

	      // see http://www.trans4mind.com/personal_development/mathematics/polynomials/cubicAlgebra.htm
	      var pa = p[0].y,
	          pb = p[1].y,
	          pc = p[2].y,
	          pd = p[3].y,
	          d = -pa + 3 * pb - 3 * pc + pd,
	          a = (3 * pa - 6 * pb + 3 * pc) / d,
	          b = (-3 * pa + 3 * pb) / d,
	          c = pa / d,
	          p = (3 * b - a * a) / 3,
	          p3 = p / 3,
	          q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
	          q2 = q / 2,
	          discriminant = q2 * q2 + p3 * p3 * p3,
	          u1,
	          v1,
	          x1,
	          x2,
	          x3;
	      if (discriminant < 0) {
	        var mp3 = -p / 3,
	            mp33 = mp3 * mp3 * mp3,
	            r = sqrt(mp33),
	            t = -q / (2 * r),
	            cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
	            phi = acos(cosphi),
	            crtr = crt(r),
	            t1 = 2 * crtr;
	        x1 = t1 * cos(phi / 3) - a / 3;
	        x2 = t1 * cos((phi + tau) / 3) - a / 3;
	        x3 = t1 * cos((phi + 2 * tau) / 3) - a / 3;
	        return [x1, x2, x3].filter(reduce);
	      } else if (discriminant === 0) {
	        u1 = q2 < 0 ? crt(-q2) : -crt(q2);
	        x1 = 2 * u1 - a / 3;
	        x2 = -u1 - a / 3;
	        return [x1, x2].filter(reduce);
	      } else {
	        var sd = sqrt(discriminant);
	        u1 = crt(-q2 + sd);
	        v1 = crt(q2 + sd);
	        return [u1 - v1 - a / 3].filter(reduce);;
	      }
	    },

	    droots: function droots(p) {
	      // quadratic roots are easy
	      if (p.length === 3) {
	        var a = p[0],
	            b = p[1],
	            c = p[2],
	            d = a - 2 * b + c;
	        if (d !== 0) {
	          var m1 = -sqrt(b * b - a * c),
	              m2 = -a + b,
	              v1 = -(m1 + m2) / d,
	              v2 = -(-m1 + m2) / d;
	          return [v1, v2];
	        } else if (b !== c && d === 0) {
	          return [(2 * b - c) / (2 * (b - c))];
	        }
	        return [];
	      }

	      // linear roots are even easier
	      if (p.length === 2) {
	        var a = p[0],
	            b = p[1];
	        if (a !== b) {
	          return [a / (a - b)];
	        }
	        return [];
	      }
	    },

	    inflections: function inflections(points) {
	      if (points.length < 4) return [];

	      // FIXME: TODO: add in inflection abstraction for quartic+ curves?

	      var p = utils.align(points, { p1: points[0], p2: points.slice(-1)[0] }),
	          a = p[2].x * p[1].y,
	          b = p[3].x * p[1].y,
	          c = p[1].x * p[2].y,
	          d = p[3].x * p[2].y,
	          v1 = 18 * (-3 * a + 2 * b + 3 * c - d),
	          v2 = 18 * (3 * a - b - 3 * c),
	          v3 = 18 * (c - a);

	      if (utils.approximately(v1, 0)) return [];

	      var trm = v2 * v2 - 4 * v1 * v3,
	          sq = Math.sqrt(trm),
	          d = 2 * v1;

	      if (utils.approximately(d, 0)) return [];

	      return [(sq - v2) / d, -(v2 + sq) / d].filter(function (r) {
	        return 0 <= r && r <= 1;
	      });
	    },

	    bboxoverlap: function bboxoverlap(b1, b2) {
	      var dims = ['x', 'y'],
	          len = dims.length,
	          i,
	          dim,
	          l,
	          t,
	          d;
	      for (i = 0; i < len; i++) {
	        dim = dims[i];
	        l = b1[dim].mid;
	        t = b2[dim].mid;
	        d = (b1[dim].size + b2[dim].size) / 2;
	        if (abs(l - t) >= d) return false;
	      }
	      return true;
	    },

	    expandbox: function expandbox(bbox, _bbox) {
	      if (_bbox.x.min < bbox.x.min) {
	        bbox.x.min = _bbox.x.min;
	      }
	      if (_bbox.y.min < bbox.y.min) {
	        bbox.y.min = _bbox.y.min;
	      }
	      if (_bbox.z && _bbox.z.min < bbox.z.min) {
	        bbox.z.min = _bbox.z.min;
	      }
	      if (_bbox.x.max > bbox.x.max) {
	        bbox.x.max = _bbox.x.max;
	      }
	      if (_bbox.y.max > bbox.y.max) {
	        bbox.y.max = _bbox.y.max;
	      }
	      if (_bbox.z && _bbox.z.max > bbox.z.max) {
	        bbox.z.max = _bbox.z.max;
	      }
	      bbox.x.mid = (bbox.x.min + bbox.x.max) / 2;
	      bbox.y.mid = (bbox.y.min + bbox.y.max) / 2;
	      if (bbox.z) {
	        bbox.z.mid = (bbox.z.min + bbox.z.max) / 2;
	      }
	      bbox.x.size = bbox.x.max - bbox.x.min;
	      bbox.y.size = bbox.y.max - bbox.y.min;
	      if (bbox.z) {
	        bbox.z.size = bbox.z.max - bbox.z.min;
	      }
	    },

	    pairiteration: function pairiteration(c1, c2, curveIntersectionThreshold) {
	      var c1b = c1.bbox(),
	          c2b = c2.bbox(),
	          r = 100000,
	          threshold = curveIntersectionThreshold || 0.5;
	      if (c1b.x.size + c1b.y.size < threshold && c2b.x.size + c2b.y.size < threshold) {
	        return [(r * (c1._t1 + c1._t2) / 2 | 0) / r + "/" + (r * (c2._t1 + c2._t2) / 2 | 0) / r];
	      }
	      var cc1 = c1.split(0.5),
	          cc2 = c2.split(0.5),
	          pairs = [{ left: cc1.left, right: cc2.left }, { left: cc1.left, right: cc2.right }, { left: cc1.right, right: cc2.right }, { left: cc1.right, right: cc2.left }];
	      pairs = pairs.filter(function (pair) {
	        return utils.bboxoverlap(pair.left.bbox(), pair.right.bbox());
	      });
	      var results = [];
	      if (pairs.length === 0) return results;
	      pairs.forEach(function (pair) {
	        results = results.concat(utils.pairiteration(pair.left, pair.right, threshold));
	      });
	      results = results.filter(function (v, i) {
	        return results.indexOf(v) === i;
	      });
	      return results;
	    },

	    getccenter: function getccenter(p1, p2, p3) {
	      var dx1 = p2.x - p1.x,
	          dy1 = p2.y - p1.y,
	          dx2 = p3.x - p2.x,
	          dy2 = p3.y - p2.y;
	      var dx1p = dx1 * cos(quart) - dy1 * sin(quart),
	          dy1p = dx1 * sin(quart) + dy1 * cos(quart),
	          dx2p = dx2 * cos(quart) - dy2 * sin(quart),
	          dy2p = dx2 * sin(quart) + dy2 * cos(quart);
	      // chord midpoints
	      var mx1 = (p1.x + p2.x) / 2,
	          my1 = (p1.y + p2.y) / 2,
	          mx2 = (p2.x + p3.x) / 2,
	          my2 = (p2.y + p3.y) / 2;
	      // midpoint offsets
	      var mx1n = mx1 + dx1p,
	          my1n = my1 + dy1p,
	          mx2n = mx2 + dx2p,
	          my2n = my2 + dy2p;
	      // intersection of these lines:
	      var arc = utils.lli8(mx1, my1, mx1n, my1n, mx2, my2, mx2n, my2n),
	          r = utils.dist(arc, p1),

	      // arc start/end values, over mid point:
	      s = atan2(p1.y - arc.y, p1.x - arc.x),
	          m = atan2(p2.y - arc.y, p2.x - arc.x),
	          e = atan2(p3.y - arc.y, p3.x - arc.x),
	          _;
	      // determine arc direction (cw/ccw correction)
	      if (s < e) {
	        // if s<m<e, arc(s, e)
	        // if m<s<e, arc(e, s + tau)
	        // if s<e<m, arc(e, s + tau)
	        if (s > m || m > e) {
	          s += tau;
	        }
	        if (s > e) {
	          _ = e;e = s;s = _;
	        }
	      } else {
	        // if e<m<s, arc(e, s)
	        // if m<e<s, arc(s, e + tau)
	        // if e<s<m, arc(s, e + tau)
	        if (e < m && m < s) {
	          _ = e;e = s;s = _;
	        } else {
	          e += tau;
	        }
	      }
	      // assign and done.
	      arc.s = s;
	      arc.e = e;
	      arc.r = r;
	      return arc;
	    }
	  };

	  module.exports = utils;
	})();

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	(function () {
	  "use strict";

	  var utils = __webpack_require__(124);

	  /**
	   * Poly Bezier
	   * @param {[type]} curves [description]
	   */
	  var PolyBezier = function PolyBezier(curves) {
	    this.curves = [];
	    this._3d = false;
	    if (!!curves) {
	      this.curves = curves;
	      this._3d = this.curves[0]._3d;
	    }
	  };

	  PolyBezier.prototype = {
	    valueOf: function valueOf() {
	      return this.toString();
	    },
	    toString: function toString() {
	      return utils.pointsToString(this.points);
	    },
	    addCurve: function addCurve(curve) {
	      this.curves.push(curve);
	      this._3d = this._3d || curve._3d;
	    },
	    length: function length() {
	      return this.curves.map(function (v) {
	        return v.length();
	      }).reduce(function (a, b) {
	        return a + b;
	      });
	    },
	    curve: function curve(idx) {
	      return this.curves[idx];
	    },
	    bbox: function bbox() {
	      var c = this.curves;
	      var bbox = c[0].bbox();
	      for (var i = 1; i < c.length; i++) {
	        utils.expandbox(bbox, c[i].bbox());
	      }
	      return bbox;
	    },
	    offset: function offset(d) {
	      var offset = [];
	      this.curves.forEach(function (v) {
	        offset = offset.concat(v.offset(d));
	      });
	      return new PolyBezier(offset);
	    }
	  };

	  module.exports = PolyBezier;
	})();

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CatmullRomSpline = function () {
	  function CatmullRomSpline(p0, p1, p2, p3) {

	    // this.process(p0, p1, p2, p3, nPoints);

	    var nPoints = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 100;
	    (0, _classCallCheck3.default)(this, CatmullRomSpline);
	  }

	  (0, _createClass3.default)(CatmullRomSpline, [{
	    key: "process",
	    value: function process(p0, p1, p2, p3) {
	      var nPoints = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20;

	      var pts = [];
	      var t0 = 0.0;
	      var t1 = this.getT(t0, p0, p1);
	      var t2 = this.getT(t1, p1, p2);
	      var t3 = this.getT(t2, p2, p3);

	      for (var t = t1; t < t2; t += (t2 - t1) / nPoints) {
	        var A1 = [(t1 - t) / (t1 - t0) * p0[0] + (t - t0) / (t1 - t0) * p1[0], (t1 - t) / (t1 - t0) * p0[1] + (t - t0) / (t1 - t0) * p1[1], (t1 - t) / (t1 - t0) * p0[2] + (t - t0) / (t1 - t0) * p1[2]];

	        var A2 = [(t2 - t) / (t2 - t1) * p1[0] + (t - t1) / (t2 - t1) * p2[0], (t2 - t) / (t2 - t1) * p1[1] + (t - t1) / (t2 - t1) * p2[1], (t2 - t) / (t2 - t1) * p1[2] + (t - t1) / (t2 - t1) * p2[2]];

	        var A3 = [(t3 - t) / (t3 - t2) * p2[0] + (t - t2) / (t3 - t2) * p3[0], (t3 - t) / (t3 - t2) * p2[1] + (t - t2) / (t3 - t2) * p3[1], (t3 - t) / (t3 - t2) * p2[2] + (t - t2) / (t3 - t2) * p3[2]];

	        // let A3 = (t3-t)/(t3-t2)*p2 + (t-t2)/(t3-t2)*p3;

	        // let A2 = (t2-t)/(t2-t1)*p1 + (t-t1)/(t2-t1)*p2;

	        var B1 = [(t2 - t) / (t2 - t0) * A1[0] + (t - t0) / (t2 - t0) * A2[0], (t2 - t) / (t2 - t0) * A1[1] + (t - t0) / (t2 - t0) * A2[1], (t2 - t) / (t2 - t0) * A1[2] + (t - t0) / (t2 - t0) * A2[2]];

	        var B2 = [(t3 - t) / (t3 - t1) * A2[0] + (t - t0) / (t3 - t1) * A3[0], (t3 - t) / (t3 - t1) * A2[1] + (t - t0) / (t3 - t1) * A3[1], (t3 - t) / (t3 - t1) * A2[2] + (t - t0) / (t3 - t1) * A3[2]];

	        // let B1 = (t2-t)/(t2-t0)*A1 + (t-t0)/(t2-t0)*A2;
	        // let B2 = (t3-t)/(t3-t1)*A2 + (t-t1)/(t3-t1)*A3;
	        var C = [(t2 - t) / (t2 - t1) * B1[0] + (t - t1) / (t2 - t1) * B2[0], (t2 - t) / (t2 - t1) * B1[1] + (t - t1) / (t2 - t1) * B2[1], (t2 - t) / (t2 - t1) * B1[2] + (t - t1) / (t2 - t1) * B2[2]];

	        // let C = (t2-t)/(t2-t1)*B1 + (t-t1)/(t2-t1)*B2;

	        pts.push(C);
	      }

	      return pts;
	    }
	  }, {
	    key: "getT",
	    value: function getT(t, p0, p1) {
	      var a = Math.pow(p1[0] - p0[0], 10.0) + Math.pow(p1[1] - p0[1], 10.0) + Math.pow(p1[2] - p0[2], 10.0);
	      var b = Math.pow(a, 0.5);
	      var c = Math.pow(b, .5); //alpha);

	      return c + t;
	    }
	  }]);
	  return CatmullRomSpline;
	}();

	exports.default = CatmullRomSpline;


	CatmullRomSpline.instance = new CatmullRomSpline();
	module.exports = exports['default'];

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _Matrices = __webpack_require__(95);

	var _Matrices2 = _interopRequireDefault(_Matrices);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Spline = function () {
	  function Spline(points) {
	    (0, _classCallCheck3.default)(this, Spline);


	    this.points = points;
	  }

	  (0, _createClass3.default)(Spline, [{
	    key: 'getPoint',
	    value: function getPoint(k) {

	      var c = [],
	          pa,
	          pb,
	          pc,
	          pd,
	          w2,
	          w3,
	          v3 = [];
	      var point = (this.points.length - 1) * k;
	      var intPoint = Math.floor(point);
	      var weight = point - intPoint;

	      c[0] = intPoint === 0 ? intPoint : intPoint - 1;
	      c[1] = intPoint;
	      c[2] = intPoint > this.points.length - 2 ? intPoint : intPoint + 1;
	      c[3] = intPoint > this.points.length - 3 ? intPoint : intPoint + 2;

	      pa = this.points[c[0]];
	      pb = this.points[c[1]];
	      pc = this.points[c[2]];
	      pd = this.points[c[3]];

	      w2 = weight * weight;
	      w3 = weight * w2;

	      // v3.x = interpolate( pa.x, pb.x, pc.x, pd.x, weight, w2, w3 );
	      // v3.y = interpolate( pa.y, pb.y, pc.y, pd.y, weight, w2, w3 );
	      // v3.z = interpolate( pa.z, pb.z, pc.z, pd.z, weight, w2, w3 );

	      v3[0] = this.interpolate(pa[0], pb[0], pc[0], pd[0], weight, w2, w3);
	      v3[1] = this.interpolate(pa[1], pb[1], pc[1], pd[1], weight, w2, w3);
	      v3[2] = this.interpolate(pa[2], pb[2], pc[2], pd[2], weight, w2, w3);

	      return v3;
	    }
	  }, {
	    key: 'interpolate',
	    value: function interpolate(p0, p1, p2, p3, t, t2, t3) {
	      var v0 = (p2 - p0) * 0.5,
	          v1 = (p3 - p1) * 0.5;

	      return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;

	      // var v0 = Matrices.multiplyVectorsScalar(0.5, Matrices.subtractVectors( p2, p0 )),
	      // 	  v1 = Matrices.multiplyVectorsScalar(0.5, Matrices.subtractVectors( p3, p1 ));
	      //
	      //
	      // let p1minusp2 = Matrices.subtractVectors( p1, p2 ); //( p1 - p2 )
	      //
	      // // ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3
	      // let aExpr = Matrices.multiplyVectorsScalar(2, p1minusp2);
	      // let bExpr = Matrices.addVectors(aExpr, Matrices.addVectors(v0, v1));
	      // let firstExpr = Matrices.multiplyVectorsScalar(t3, bExpr);
	      //
	      // console.log("here");
	      // // ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2
	      // let cExpr = Matrices.multiplyVectorsScalar(-3, p1minusp2);
	      // let dExpr = Matrices.multiplyVectorsScalar(-2, v0);
	      // let eExpr = Matrices.addVectors(cExpr, dExpr);
	      // let fExpr = Matrices.subtractVectors(eExpr, v1);
	      // let secondExpr = Matrices.multiplyVectorsScalar(t2, fExpr);
	      //
	      // // v0 * t + p1
	      // let thirdExpr = Matrices.addVectors(Matrices.multiplyVectorsScalar(t, v0), p1);
	      //
	      // let finalPoint = Matrices.addVectors(Matrices.addVectors(firstExpr, secondExpr), thirdExpr);
	      //
	      // return finalPoint;
	    }
	  }]);
	  return Spline;
	}();

	exports.default = Spline;
	module.exports = exports['default'];

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	// https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
	// simplify the set of points

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var RDPAlgorithm = function RDPAlgorithm() {};

	  RDPAlgorithm.prototype.distance = function (a, b) {
	    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
	  };

	  RDPAlgorithm.prototype.point_line_distance = function (point, start, end) {
	    if (start == end) {

	      return this.distance(point, start);
	    } else {
	      n = Math.abs((end.x - start.x) * (start.y - point.y) - (start.x - point.x) * (end.y - start.y));
	      d = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

	      return n / d;
	    }
	  };

	  RDPAlgorithm.prototype.simplify = function (points, epsilon) {
	    var points = this.rdp(points, epsilon);

	    var np = [points[0]];
	    for (var i = 1; i < points.length; i++) {
	      if (points[i].x !== points[i - 1].x && points[i].y !== points[i - 1].y) {
	        np.push(points[i]);
	      }
	    }

	    // np.push(points[points.length-1]);
	    return np;
	  };

	  RDPAlgorithm.prototype.rdp = function (points, epsilon) {

	    // return RDPAlgorithm.instance.simplify(points, 40);

	    // console.log(points);
	    epsilon = epsilon || 40;
	    // Find the point with the maximum distance
	    var returnPoints = [];
	    var dmax = 0;
	    var index = 0;
	    var end = points.length - 1;
	    var d;
	    for (var i = 1; i < end; i++) {
	      d = this.point_line_distance(points[i], points[0], points[end]);
	      if (d > dmax) {
	        index = i;
	        dmax = d;
	      }
	    }

	    // If max distance is greater than epsilon, recursively simplify
	    if (dmax > epsilon) {
	      // Recursive call

	      returnPoints = returnPoints.concat(this.rdp(points.slice(0, index + 1), epsilon));
	      returnPoints = returnPoints.concat(this.rdp(points.slice(index, end + 1), epsilon));

	      // returnPoints = returnPoints.concat(this.simplify( points.slice(0, index), epsilon ) );
	      // returnPoints = returnPoints.concat(this.simplify( points.slice(index, end), epsilon ) );
	    } else {
	      returnPoints = [points[0], points[end]];
	    }

	    return returnPoints;
	  };

	  RDPAlgorithm.instance = new RDPAlgorithm();

	  module.exports = RDPAlgorithm;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 129 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\n// attribute vec4 a_position;\n// attribute vec4 a_previous;\n// attribute vec4 a_next;\n// attribute float a_width;\n// attribute float a_side;\n// attribute float a_counters;\n//\n// uniform float aspect;\n// uniform mat4 u_world;\n// uniform mat4 u_worldViewProjection;\n// // uniform mat4 u_worldInverseTranspose;\n// varying vec3 vPosition;\n// varying float vCounters;\n// varying vec3 vColor;\n//\n// vec2 fix( vec4 i, float aspect ) {\n//     vec2 res = i.xy / i.w;\n//     res.x *= aspect;\n//\n//     vCounters = a_counters;\n//     return res;\n// }\n//\n// void main() {\n//   // float aspect = 1.0;\n//\n//   float lineWidth = 10.0;\n//   vec3 color = vec3(0.0);\n//   float opacity = 1.0;\n//   float near = 1.0;\n//   float far = 1.0;\n//   float sizeAttenuation = 1.0;\n//\n//   mat4 m = u_worldViewProjection;\n//\n//   vec3 position = a_position.xyz;\n//\n//   vec4 finalPosition = m * vec4(position, 1.0);\n//   vec4 prevPos = m * a_previous;\n//   vec4 nextPos = m * a_next;\n//\n//   vec2 currentP = fix( finalPosition, aspect );\n//   vec2 prevP = fix( prevPos, aspect );\n//   vec2 nextP = fix( nextPos, aspect );\n//   float pixelWidth = finalPosition.w * 1.0;//pixelWidthRatio;\n//\n//\n//\n//   float w = 1.8 * pixelWidth * lineWidth * a_width;\n//   if( sizeAttenuation == 1. ) {\n//       w = 1.8 * lineWidth * a_width;\n//   }\n//\n//   vec2 dir;\n//   if( nextP == currentP ) {\n//     dir = normalize( currentP - prevP );\n//     vColor = vec3(1.0, 0.0, 0.0);\n//   }\n//   else if( prevP == currentP ) {\n//     dir = normalize( nextP - currentP );\n//     vColor = vec3(1.0, 1.0, 0.0);\n//   }\n//   else {\n//       vec2 dir1 = normalize( currentP - prevP );\n//       vec2 dir2 = normalize( nextP - currentP );\n//       dir = normalize( dir1 + dir2 );\n//       vec2 perp = vec2( -dir1.y, dir1.x );\n//       vec2 miter = vec2( -dir.y, dir.x );\n//       vColor = vec3(0.0, 0.0, 1.0);\n//\n//       // vColor = dir;\n//       //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * a_width );\n//   }\n//   //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;\n//   vec2 normal = vec2( -dir.y, dir.x );\n//   normal.x /= aspect;\n//   normal *= .5 * w;\n//   vec4 offset = vec4( normal * a_side, 0.0, 1.0 );\n//   finalPosition.xy += offset.xy;\n//\n//\n//   gl_Position = finalPosition;//u_worldViewProjection * vec4(position, position.w);\n//\n//   vPosition = ( u_worldViewProjection * vec4(position, 1.0) ).xyz;\n//   // gl_Position = u_worldViewProjection * vec4(position, position.w);\n//\n// }\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n\n\n\n// uniform mat4 u_world;\n\n\nattribute vec4 a_position;\nattribute float direction;\nattribute vec4 a_previous;\nattribute vec4 a_next;\n// attribute vec4 a_offsets;\nattribute float a_counters;\n\nuniform mat4 u_worldViewProjection;\nuniform float aspect;\n\nvarying vec3 vColor;\nvarying float vCounters;\n\nvoid main() {\n\n  float thickness = 20.0;\n  int miter = 0;\n\n  vec2 aspectVec = vec2(aspect, 1.0);\n  // mat4 projViewModel = u_worldViewProjection;//projection * view * model;\n  vec4 previousProjected = u_worldViewProjection * vec4(a_previous.x, -a_previous.y, a_previous.z, 1.0);\n  vec4 currentProjected = u_worldViewProjection * vec4(a_position.x, -a_position.y, a_position.z, 1.0);\n  vec4 nextProjected = u_worldViewProjection * vec4(a_next.x, -a_next.y, a_next.z, 1.0);\n\n  //get 2D screen space with W divide and aspect correction\n  vec2 currentScreen = currentProjected.xy / currentProjected.w * aspectVec;\n  vec2 previousScreen = previousProjected.xy / previousProjected.w * aspectVec;\n  vec2 nextScreen = nextProjected.xy / nextProjected.w * aspectVec;\n\n  vCounters = a_counters;\n\n  float len = thickness;\n  float orientation = direction;\n\n  //starting point uses (next - current)\n  vColor = vec3(1.0, .0, 0.0);\n  vec2 dir = vec2(0.0);\n  if (currentScreen == previousScreen) {\n    dir = normalize(nextScreen - currentScreen);\n    // vColor = vec3(1.0, 0.0, 0.0);\n  }\n  //ending point uses (current - previous)\n  else if (currentScreen == nextScreen) {\n    dir = normalize(currentScreen - previousScreen);\n    // vColor = vec3(0.0, 1.0, 0.0);\n  }\n  //somewhere in middle, needs a join\n  else {\n    //get directions from (C - B) and (B - A)\n\n    vec2 dirA = normalize((currentScreen - previousScreen));\n    if (miter == 1) {\n      vec2 dirB = normalize((nextScreen - currentScreen));\n      //now compute the miter join normal and length\n      vec2 tangent = normalize(dirA + dirB);\n      vec2 perp = vec2(-dirA.y, dirA.x);\n      vec2 miter = vec2(-tangent.y, tangent.x);\n      dir = tangent;\n      len = thickness / dot(miter, perp);\n    } else {\n      dir = dirA;\n\n    }\n  }\n  vec2 normal = vec2(-dir.y, dir.x);\n  vColor = vec3(normal, 1.0);\n  normal *= len/2.0;\n  normal.x /= aspect;\n\n  vec4 offset = vec4(normal * orientation, 0.0, 1.0);\n  // vColor = vec3(orientation);\n\n\n\n\n\n  gl_Position = currentProjected + offset;\n  gl_PointSize = 2.0;\n}\n"

/***/ },
/* 130 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\n#define GLSLIFY 1\n\n\nuniform float alpha;\n// varying vec3 vPosition;\n// varying vec3 vColor;\n\nvarying float vCounters;\n\nvoid main() {\n  vec3 color = vec3(.2,.2,.2);\n\n  gl_FragColor = vec4(color, 1.0);\n  gl_FragColor.a *= step(vCounters, 1.0);\n}\n"

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(132)
	module.exports.color = __webpack_require__(133)

/***/ },
/* 132 */
/***/ function(module, exports) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	/** @namespace */
	var dat = module.exports = dat || {};

	/** @namespace */
	dat.gui = dat.gui || {};

	/** @namespace */
	dat.utils = dat.utils || {};

	/** @namespace */
	dat.controllers = dat.controllers || {};

	/** @namespace */
	dat.dom = dat.dom || {};

	/** @namespace */
	dat.color = dat.color || {};

	dat.utils.css = (function () {
	  return {
	    load: function (url, doc) {
	      doc = doc || document;
	      var link = doc.createElement('link');
	      link.type = 'text/css';
	      link.rel = 'stylesheet';
	      link.href = url;
	      doc.getElementsByTagName('head')[0].appendChild(link);
	    },
	    inject: function(css, doc) {
	      doc = doc || document;
	      var injected = document.createElement('style');
	      injected.type = 'text/css';
	      injected.innerHTML = css;
	      doc.getElementsByTagName('head')[0].appendChild(injected);
	    }
	  }
	})();


	dat.utils.common = (function () {
	  
	  var ARR_EACH = Array.prototype.forEach;
	  var ARR_SLICE = Array.prototype.slice;

	  /**
	   * Band-aid methods for things that should be a lot easier in JavaScript.
	   * Implementation and structure inspired by underscore.js
	   * http://documentcloud.github.com/underscore/
	   */

	  return { 
	    
	    BREAK: {},
	  
	    extend: function(target) {
	      
	      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
	        
	        for (var key in obj)
	          if (!this.isUndefined(obj[key])) 
	            target[key] = obj[key];
	        
	      }, this);
	      
	      return target;
	      
	    },
	    
	    defaults: function(target) {
	      
	      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
	        
	        for (var key in obj)
	          if (this.isUndefined(target[key])) 
	            target[key] = obj[key];
	        
	      }, this);
	      
	      return target;
	    
	    },
	    
	    compose: function() {
	      var toCall = ARR_SLICE.call(arguments);
	            return function() {
	              var args = ARR_SLICE.call(arguments);
	              for (var i = toCall.length -1; i >= 0; i--) {
	                args = [toCall[i].apply(this, args)];
	              }
	              return args[0];
	            }
	    },
	    
	    each: function(obj, itr, scope) {

	      
	      if (ARR_EACH && obj.forEach === ARR_EACH) { 
	        
	        obj.forEach(itr, scope);
	        
	      } else if (obj.length === obj.length + 0) { // Is number but not NaN
	        
	        for (var key = 0, l = obj.length; key < l; key++)
	          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
	            return;
	            
	      } else {

	        for (var key in obj) 
	          if (itr.call(scope, obj[key], key) === this.BREAK)
	            return;
	            
	      }
	            
	    },
	    
	    defer: function(fnc) {
	      setTimeout(fnc, 0);
	    },
	    
	    toArray: function(obj) {
	      if (obj.toArray) return obj.toArray();
	      return ARR_SLICE.call(obj);
	    },

	    isUndefined: function(obj) {
	      return obj === undefined;
	    },
	    
	    isNull: function(obj) {
	      return obj === null;
	    },
	    
	    isNaN: function(obj) {
	      return obj !== obj;
	    },
	    
	    isArray: Array.isArray || function(obj) {
	      return obj.constructor === Array;
	    },
	    
	    isObject: function(obj) {
	      return obj === Object(obj);
	    },
	    
	    isNumber: function(obj) {
	      return obj === obj+0;
	    },
	    
	    isString: function(obj) {
	      return obj === obj+'';
	    },
	    
	    isBoolean: function(obj) {
	      return obj === false || obj === true;
	    },
	    
	    isFunction: function(obj) {
	      return Object.prototype.toString.call(obj) === '[object Function]';
	    }
	  
	  };
	    
	})();


	dat.controllers.Controller = (function (common) {

	  /**
	   * @class An "abstract" class that represents a given property of an object.
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   *
	   * @member dat.controllers
	   */
	  var Controller = function(object, property) {

	    this.initialValue = object[property];

	    /**
	     * Those who extend this class will put their DOM elements in here.
	     * @type {DOMElement}
	     */
	    this.domElement = document.createElement('div');

	    /**
	     * The object to manipulate
	     * @type {Object}
	     */
	    this.object = object;

	    /**
	     * The name of the property to manipulate
	     * @type {String}
	     */
	    this.property = property;

	    /**
	     * The function to be called on change.
	     * @type {Function}
	     * @ignore
	     */
	    this.__onChange = undefined;

	    /**
	     * The function to be called on finishing change.
	     * @type {Function}
	     * @ignore
	     */
	    this.__onFinishChange = undefined;

	  };

	  common.extend(

	      Controller.prototype,

	      /** @lends dat.controllers.Controller.prototype */
	      {

	        /**
	         * Specify that a function fire every time someone changes the value with
	         * this Controller.
	         *
	         * @param {Function} fnc This function will be called whenever the value
	         * is modified via this Controller.
	         * @returns {dat.controllers.Controller} this
	         */
	        onChange: function(fnc) {
	          this.__onChange = fnc;
	          return this;
	        },

	        /**
	         * Specify that a function fire every time someone "finishes" changing
	         * the value wih this Controller. Useful for values that change
	         * incrementally like numbers or strings.
	         *
	         * @param {Function} fnc This function will be called whenever
	         * someone "finishes" changing the value via this Controller.
	         * @returns {dat.controllers.Controller} this
	         */
	        onFinishChange: function(fnc) {
	          this.__onFinishChange = fnc;
	          return this;
	        },

	        /**
	         * Change the value of <code>object[property]</code>
	         *
	         * @param {Object} newValue The new value of <code>object[property]</code>
	         */
	        setValue: function(newValue) {
	          this.object[this.property] = newValue;
	          if (this.__onChange) {
	            this.__onChange.call(this, newValue);
	          }
	          this.updateDisplay();
	          return this;
	        },

	        /**
	         * Gets the value of <code>object[property]</code>
	         *
	         * @returns {Object} The current value of <code>object[property]</code>
	         */
	        getValue: function() {
	          return this.object[this.property];
	        },

	        /**
	         * Refreshes the visual display of a Controller in order to keep sync
	         * with the object's current value.
	         * @returns {dat.controllers.Controller} this
	         */
	        updateDisplay: function() {
	          return this;
	        },

	        /**
	         * @returns {Boolean} true if the value has deviated from initialValue
	         */
	        isModified: function() {
	          return this.initialValue !== this.getValue()
	        }

	      }

	  );

	  return Controller;


	})(dat.utils.common);


	dat.dom.dom = (function (common) {

	  var EVENT_MAP = {
	    'HTMLEvents': ['change'],
	    'MouseEvents': ['click','mousemove','mousedown','mouseup', 'mouseover'],
	    'KeyboardEvents': ['keydown']
	  };

	  var EVENT_MAP_INV = {};
	  common.each(EVENT_MAP, function(v, k) {
	    common.each(v, function(e) {
	      EVENT_MAP_INV[e] = k;
	    });
	  });

	  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

	  function cssValueToPixels(val) {

	    if (val === '0' || common.isUndefined(val)) return 0;

	    var match = val.match(CSS_VALUE_PIXELS);

	    if (!common.isNull(match)) {
	      return parseFloat(match[1]);
	    }

	    // TODO ...ems? %?

	    return 0;

	  }

	  /**
	   * @namespace
	   * @member dat.dom
	   */
	  var dom = {

	    /**
	     * 
	     * @param elem
	     * @param selectable
	     */
	    makeSelectable: function(elem, selectable) {

	      if (elem === undefined || elem.style === undefined) return;

	      elem.onselectstart = selectable ? function() {
	        return false;
	      } : function() {
	      };

	      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
	      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
	      elem.unselectable = selectable ? 'on' : 'off';

	    },

	    /**
	     *
	     * @param elem
	     * @param horizontal
	     * @param vertical
	     */
	    makeFullscreen: function(elem, horizontal, vertical) {

	      if (common.isUndefined(horizontal)) horizontal = true;
	      if (common.isUndefined(vertical)) vertical = true;

	      elem.style.position = 'absolute';

	      if (horizontal) {
	        elem.style.left = 0;
	        elem.style.right = 0;
	      }
	      if (vertical) {
	        elem.style.top = 0;
	        elem.style.bottom = 0;
	      }

	    },

	    /**
	     *
	     * @param elem
	     * @param eventType
	     * @param params
	     */
	    fakeEvent: function(elem, eventType, params, aux) {
	      params = params || {};
	      var className = EVENT_MAP_INV[eventType];
	      if (!className) {
	        throw new Error('Event type ' + eventType + ' not supported.');
	      }
	      var evt = document.createEvent(className);
	      switch (className) {
	        case 'MouseEvents':
	          var clientX = params.x || params.clientX || 0;
	          var clientY = params.y || params.clientY || 0;
	          evt.initMouseEvent(eventType, params.bubbles || false,
	              params.cancelable || true, window, params.clickCount || 1,
	              0, //screen X
	              0, //screen Y
	              clientX, //client X
	              clientY, //client Y
	              false, false, false, false, 0, null);
	          break;
	        case 'KeyboardEvents':
	          var init = evt.initKeyboardEvent || evt.initKeyEvent; // webkit || moz
	          common.defaults(params, {
	            cancelable: true,
	            ctrlKey: false,
	            altKey: false,
	            shiftKey: false,
	            metaKey: false,
	            keyCode: undefined,
	            charCode: undefined
	          });
	          init(eventType, params.bubbles || false,
	              params.cancelable, window,
	              params.ctrlKey, params.altKey,
	              params.shiftKey, params.metaKey,
	              params.keyCode, params.charCode);
	          break;
	        default:
	          evt.initEvent(eventType, params.bubbles || false,
	              params.cancelable || true);
	          break;
	      }
	      common.defaults(evt, aux);
	      elem.dispatchEvent(evt);
	    },

	    /**
	     *
	     * @param elem
	     * @param event
	     * @param func
	     * @param bool
	     */
	    bind: function(elem, event, func, bool) {
	      bool = bool || false;
	      if (elem.addEventListener)
	        elem.addEventListener(event, func, bool);
	      else if (elem.attachEvent)
	        elem.attachEvent('on' + event, func);
	      return dom;
	    },

	    /**
	     *
	     * @param elem
	     * @param event
	     * @param func
	     * @param bool
	     */
	    unbind: function(elem, event, func, bool) {
	      bool = bool || false;
	      if (elem.removeEventListener)
	        elem.removeEventListener(event, func, bool);
	      else if (elem.detachEvent)
	        elem.detachEvent('on' + event, func);
	      return dom;
	    },

	    /**
	     *
	     * @param elem
	     * @param className
	     */
	    addClass: function(elem, className) {
	      if (elem.className === undefined) {
	        elem.className = className;
	      } else if (elem.className !== className) {
	        var classes = elem.className.split(/ +/);
	        if (classes.indexOf(className) == -1) {
	          classes.push(className);
	          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
	        }
	      }
	      return dom;
	    },

	    /**
	     *
	     * @param elem
	     * @param className
	     */
	    removeClass: function(elem, className) {
	      if (className) {
	        if (elem.className === undefined) {
	          // elem.className = className;
	        } else if (elem.className === className) {
	          elem.removeAttribute('class');
	        } else {
	          var classes = elem.className.split(/ +/);
	          var index = classes.indexOf(className);
	          if (index != -1) {
	            classes.splice(index, 1);
	            elem.className = classes.join(' ');
	          }
	        }
	      } else {
	        elem.className = undefined;
	      }
	      return dom;
	    },

	    hasClass: function(elem, className) {
	      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
	    },

	    /**
	     *
	     * @param elem
	     */
	    getWidth: function(elem) {

	      var style = getComputedStyle(elem);

	      return cssValueToPixels(style['border-left-width']) +
	          cssValueToPixels(style['border-right-width']) +
	          cssValueToPixels(style['padding-left']) +
	          cssValueToPixels(style['padding-right']) +
	          cssValueToPixels(style['width']);
	    },

	    /**
	     *
	     * @param elem
	     */
	    getHeight: function(elem) {

	      var style = getComputedStyle(elem);

	      return cssValueToPixels(style['border-top-width']) +
	          cssValueToPixels(style['border-bottom-width']) +
	          cssValueToPixels(style['padding-top']) +
	          cssValueToPixels(style['padding-bottom']) +
	          cssValueToPixels(style['height']);
	    },

	    /**
	     *
	     * @param elem
	     */
	    getOffset: function(elem) {
	      var offset = {left: 0, top:0};
	      if (elem.offsetParent) {
	        do {
	          offset.left += elem.offsetLeft;
	          offset.top += elem.offsetTop;
	        } while (elem = elem.offsetParent);
	      }
	      return offset;
	    },

	    // http://stackoverflow.com/posts/2684561/revisions
	    /**
	     * 
	     * @param elem
	     */
	    isActive: function(elem) {
	      return elem === document.activeElement && ( elem.type || elem.href );
	    }

	  };

	  return dom;

	})(dat.utils.common);


	dat.controllers.OptionController = (function (Controller, dom, common) {

	  /**
	   * @class Provides a select input to alter the property of an object, using a
	   * list of accepted values.
	   *
	   * @extends dat.controllers.Controller
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   * @param {Object|string[]} options A map of labels to acceptable values, or
	   * a list of acceptable string values.
	   *
	   * @member dat.controllers
	   */
	  var OptionController = function(object, property, options) {

	    OptionController.superclass.call(this, object, property);

	    var _this = this;

	    /**
	     * The drop down menu
	     * @ignore
	     */
	    this.__select = document.createElement('select');

	    if (common.isArray(options)) {
	      var map = {};
	      common.each(options, function(element) {
	        map[element] = element;
	      });
	      options = map;
	    }

	    common.each(options, function(value, key) {

	      var opt = document.createElement('option');
	      opt.innerHTML = key;
	      opt.setAttribute('value', value);
	      _this.__select.appendChild(opt);

	    });

	    // Acknowledge original value
	    this.updateDisplay();

	    dom.bind(this.__select, 'change', function() {
	      var desiredValue = this.options[this.selectedIndex].value;
	      _this.setValue(desiredValue);
	    });

	    this.domElement.appendChild(this.__select);

	  };

	  OptionController.superclass = Controller;

	  common.extend(

	      OptionController.prototype,
	      Controller.prototype,

	      {

	        setValue: function(v) {
	          var toReturn = OptionController.superclass.prototype.setValue.call(this, v);
	          if (this.__onFinishChange) {
	            this.__onFinishChange.call(this, this.getValue());
	          }
	          return toReturn;
	        },

	        updateDisplay: function() {
	          this.__select.value = this.getValue();
	          return OptionController.superclass.prototype.updateDisplay.call(this);
	        }

	      }

	  );

	  return OptionController;

	})(dat.controllers.Controller,
	dat.dom.dom,
	dat.utils.common);


	dat.controllers.NumberController = (function (Controller, common) {

	  /**
	   * @class Represents a given property of an object that is a number.
	   *
	   * @extends dat.controllers.Controller
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   * @param {Object} [params] Optional parameters
	   * @param {Number} [params.min] Minimum allowed value
	   * @param {Number} [params.max] Maximum allowed value
	   * @param {Number} [params.step] Increment by which to change value
	   *
	   * @member dat.controllers
	   */
	  var NumberController = function(object, property, params) {

	    NumberController.superclass.call(this, object, property);

	    params = params || {};

	    this.__min = params.min;
	    this.__max = params.max;
	    this.__step = params.step;

	    if (common.isUndefined(this.__step)) {

	      if (this.initialValue == 0) {
	        this.__impliedStep = 1; // What are we, psychics?
	      } else {
	        // Hey Doug, check this out.
	        this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue)/Math.LN10))/10;
	      }

	    } else {

	      this.__impliedStep = this.__step;

	    }

	    this.__precision = numDecimals(this.__impliedStep);


	  };

	  NumberController.superclass = Controller;

	  common.extend(

	      NumberController.prototype,
	      Controller.prototype,

	      /** @lends dat.controllers.NumberController.prototype */
	      {

	        setValue: function(v) {

	          if (this.__min !== undefined && v < this.__min) {
	            v = this.__min;
	          } else if (this.__max !== undefined && v > this.__max) {
	            v = this.__max;
	          }

	          if (this.__step !== undefined && v % this.__step != 0) {
	            v = Math.round(v / this.__step) * this.__step;
	          }

	          return NumberController.superclass.prototype.setValue.call(this, v);

	        },

	        /**
	         * Specify a minimum value for <code>object[property]</code>.
	         *
	         * @param {Number} minValue The minimum value for
	         * <code>object[property]</code>
	         * @returns {dat.controllers.NumberController} this
	         */
	        min: function(v) {
	          this.__min = v;
	          return this;
	        },

	        /**
	         * Specify a maximum value for <code>object[property]</code>.
	         *
	         * @param {Number} maxValue The maximum value for
	         * <code>object[property]</code>
	         * @returns {dat.controllers.NumberController} this
	         */
	        max: function(v) {
	          this.__max = v;
	          return this;
	        },

	        /**
	         * Specify a step value that dat.controllers.NumberController
	         * increments by.
	         *
	         * @param {Number} stepValue The step value for
	         * dat.controllers.NumberController
	         * @default if minimum and maximum specified increment is 1% of the
	         * difference otherwise stepValue is 1
	         * @returns {dat.controllers.NumberController} this
	         */
	        step: function(v) {
	          this.__step = v;
	          return this;
	        }

	      }

	  );

	  function numDecimals(x) {
	    x = x.toString();
	    if (x.indexOf('.') > -1) {
	      return x.length - x.indexOf('.') - 1;
	    } else {
	      return 0;
	    }
	  }

	  return NumberController;

	})(dat.controllers.Controller,
	dat.utils.common);


	dat.controllers.NumberControllerBox = (function (NumberController, dom, common) {

	  /**
	   * @class Represents a given property of an object that is a number and
	   * provides an input element with which to manipulate it.
	   *
	   * @extends dat.controllers.Controller
	   * @extends dat.controllers.NumberController
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   * @param {Object} [params] Optional parameters
	   * @param {Number} [params.min] Minimum allowed value
	   * @param {Number} [params.max] Maximum allowed value
	   * @param {Number} [params.step] Increment by which to change value
	   *
	   * @member dat.controllers
	   */
	  var NumberControllerBox = function(object, property, params) {

	    this.__truncationSuspended = false;

	    NumberControllerBox.superclass.call(this, object, property, params);

	    var _this = this;

	    /**
	     * {Number} Previous mouse y position
	     * @ignore
	     */
	    var prev_y;

	    this.__input = document.createElement('input');
	    this.__input.setAttribute('type', 'text');

	    // Makes it so manually specified values are not truncated.

	    dom.bind(this.__input, 'change', onChange);
	    dom.bind(this.__input, 'blur', onBlur);
	    dom.bind(this.__input, 'mousedown', onMouseDown);
	    dom.bind(this.__input, 'keydown', function(e) {

	      // When pressing entire, you can be as precise as you want.
	      if (e.keyCode === 13) {
	        _this.__truncationSuspended = true;
	        this.blur();
	        _this.__truncationSuspended = false;
	      }

	    });

	    function onChange() {
	      var attempted = parseFloat(_this.__input.value);
	      if (!common.isNaN(attempted)) _this.setValue(attempted);
	    }

	    function onBlur() {
	      onChange();
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }

	    function onMouseDown(e) {
	      dom.bind(window, 'mousemove', onMouseDrag);
	      dom.bind(window, 'mouseup', onMouseUp);
	      prev_y = e.clientY;
	    }

	    function onMouseDrag(e) {

	      var diff = prev_y - e.clientY;
	      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

	      prev_y = e.clientY;

	    }

	    function onMouseUp() {
	      dom.unbind(window, 'mousemove', onMouseDrag);
	      dom.unbind(window, 'mouseup', onMouseUp);
	    }

	    this.updateDisplay();

	    this.domElement.appendChild(this.__input);

	  };

	  NumberControllerBox.superclass = NumberController;

	  common.extend(

	      NumberControllerBox.prototype,
	      NumberController.prototype,

	      {

	        updateDisplay: function() {

	          this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
	          return NumberControllerBox.superclass.prototype.updateDisplay.call(this);
	        }

	      }

	  );

	  function roundToDecimal(value, decimals) {
	    var tenTo = Math.pow(10, decimals);
	    return Math.round(value * tenTo) / tenTo;
	  }

	  return NumberControllerBox;

	})(dat.controllers.NumberController,
	dat.dom.dom,
	dat.utils.common);


	dat.controllers.NumberControllerSlider = (function (NumberController, dom, css, common, styleSheet) {

	  /**
	   * @class Represents a given property of an object that is a number, contains
	   * a minimum and maximum, and provides a slider element with which to
	   * manipulate it. It should be noted that the slider element is made up of
	   * <code>&lt;div&gt;</code> tags, <strong>not</strong> the html5
	   * <code>&lt;slider&gt;</code> element.
	   *
	   * @extends dat.controllers.Controller
	   * @extends dat.controllers.NumberController
	   * 
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   * @param {Number} minValue Minimum allowed value
	   * @param {Number} maxValue Maximum allowed value
	   * @param {Number} stepValue Increment by which to change value
	   *
	   * @member dat.controllers
	   */
	  var NumberControllerSlider = function(object, property, min, max, step) {

	    NumberControllerSlider.superclass.call(this, object, property, { min: min, max: max, step: step });

	    var _this = this;

	    this.__background = document.createElement('div');
	    this.__foreground = document.createElement('div');
	    


	    dom.bind(this.__background, 'mousedown', onMouseDown);
	    
	    dom.addClass(this.__background, 'slider');
	    dom.addClass(this.__foreground, 'slider-fg');

	    function onMouseDown(e) {

	      dom.bind(window, 'mousemove', onMouseDrag);
	      dom.bind(window, 'mouseup', onMouseUp);

	      onMouseDrag(e);
	    }

	    function onMouseDrag(e) {

	      e.preventDefault();

	      var offset = dom.getOffset(_this.__background);
	      var width = dom.getWidth(_this.__background);
	      
	      _this.setValue(
	        map(e.clientX, offset.left, offset.left + width, _this.__min, _this.__max)
	      );

	      return false;

	    }

	    function onMouseUp() {
	      dom.unbind(window, 'mousemove', onMouseDrag);
	      dom.unbind(window, 'mouseup', onMouseUp);
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }

	    this.updateDisplay();

	    this.__background.appendChild(this.__foreground);
	    this.domElement.appendChild(this.__background);

	  };

	  NumberControllerSlider.superclass = NumberController;

	  /**
	   * Injects default stylesheet for slider elements.
	   */
	  NumberControllerSlider.useDefaultStyles = function() {
	    css.inject(styleSheet);
	  };

	  common.extend(

	      NumberControllerSlider.prototype,
	      NumberController.prototype,

	      {

	        updateDisplay: function() {
	          var pct = (this.getValue() - this.__min)/(this.__max - this.__min);
	          this.__foreground.style.width = pct*100+'%';
	          return NumberControllerSlider.superclass.prototype.updateDisplay.call(this);
	        }

	      }



	  );

	  function map(v, i1, i2, o1, o2) {
	    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	  }

	  return NumberControllerSlider;
	  
	})(dat.controllers.NumberController,
	dat.dom.dom,
	dat.utils.css,
	dat.utils.common,
	".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");


	dat.controllers.FunctionController = (function (Controller, dom, common) {

	  /**
	   * @class Provides a GUI interface to fire a specified method, a property of an object.
	   *
	   * @extends dat.controllers.Controller
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   *
	   * @member dat.controllers
	   */
	  var FunctionController = function(object, property, text) {

	    FunctionController.superclass.call(this, object, property);

	    var _this = this;

	    this.__button = document.createElement('div');
	    this.__button.innerHTML = text === undefined ? 'Fire' : text;
	    dom.bind(this.__button, 'click', function(e) {
	      e.preventDefault();
	      _this.fire();
	      return false;
	    });

	    dom.addClass(this.__button, 'button');

	    this.domElement.appendChild(this.__button);


	  };

	  FunctionController.superclass = Controller;

	  common.extend(

	      FunctionController.prototype,
	      Controller.prototype,
	      {
	        
	        fire: function() {
	          if (this.__onChange) {
	            this.__onChange.call(this);
	          }
	          if (this.__onFinishChange) {
	            this.__onFinishChange.call(this, this.getValue());
	          }
	          this.getValue().call(this.object);
	        }
	      }

	  );

	  return FunctionController;

	})(dat.controllers.Controller,
	dat.dom.dom,
	dat.utils.common);


	dat.controllers.BooleanController = (function (Controller, dom, common) {

	  /**
	   * @class Provides a checkbox input to alter the boolean property of an object.
	   * @extends dat.controllers.Controller
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   *
	   * @member dat.controllers
	   */
	  var BooleanController = function(object, property) {

	    BooleanController.superclass.call(this, object, property);

	    var _this = this;
	    this.__prev = this.getValue();

	    this.__checkbox = document.createElement('input');
	    this.__checkbox.setAttribute('type', 'checkbox');


	    dom.bind(this.__checkbox, 'change', onChange, false);

	    this.domElement.appendChild(this.__checkbox);

	    // Match original value
	    this.updateDisplay();

	    function onChange() {
	      _this.setValue(!_this.__prev);
	    }

	  };

	  BooleanController.superclass = Controller;

	  common.extend(

	      BooleanController.prototype,
	      Controller.prototype,

	      {

	        setValue: function(v) {
	          var toReturn = BooleanController.superclass.prototype.setValue.call(this, v);
	          if (this.__onFinishChange) {
	            this.__onFinishChange.call(this, this.getValue());
	          }
	          this.__prev = this.getValue();
	          return toReturn;
	        },

	        updateDisplay: function() {
	          
	          if (this.getValue() === true) {
	            this.__checkbox.setAttribute('checked', 'checked');
	            this.__checkbox.checked = true;    
	          } else {
	              this.__checkbox.checked = false;
	          }

	          return BooleanController.superclass.prototype.updateDisplay.call(this);

	        }


	      }

	  );

	  return BooleanController;

	})(dat.controllers.Controller,
	dat.dom.dom,
	dat.utils.common);


	dat.color.toString = (function (common) {

	  return function(color) {

	    if (color.a == 1 || common.isUndefined(color.a)) {

	      var s = color.hex.toString(16);
	      while (s.length < 6) {
	        s = '0' + s;
	      }

	      return '#' + s;

	    } else {

	      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

	    }

	  }

	})(dat.utils.common);


	dat.color.interpret = (function (toString, common) {

	  var result, toReturn;

	  var interpret = function() {

	    toReturn = false;

	    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

	    common.each(INTERPRETATIONS, function(family) {

	      if (family.litmus(original)) {

	        common.each(family.conversions, function(conversion, conversionName) {

	          result = conversion.read(original);

	          if (toReturn === false && result !== false) {
	            toReturn = result;
	            result.conversionName = conversionName;
	            result.conversion = conversion;
	            return common.BREAK;

	          }

	        });

	        return common.BREAK;

	      }

	    });

	    return toReturn;

	  };

	  var INTERPRETATIONS = [

	    // Strings
	    {

	      litmus: common.isString,

	      conversions: {

	        THREE_CHAR_HEX: {

	          read: function(original) {

	            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
	            if (test === null) return false;

	            return {
	              space: 'HEX',
	              hex: parseInt(
	                  '0x' +
	                      test[1].toString() + test[1].toString() +
	                      test[2].toString() + test[2].toString() +
	                      test[3].toString() + test[3].toString())
	            };

	          },

	          write: toString

	        },

	        SIX_CHAR_HEX: {

	          read: function(original) {

	            var test = original.match(/^#([A-F0-9]{6})$/i);
	            if (test === null) return false;

	            return {
	              space: 'HEX',
	              hex: parseInt('0x' + test[1].toString())
	            };

	          },

	          write: toString

	        },

	        CSS_RGB: {

	          read: function(original) {

	            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	            if (test === null) return false;

	            return {
	              space: 'RGB',
	              r: parseFloat(test[1]),
	              g: parseFloat(test[2]),
	              b: parseFloat(test[3])
	            };

	          },

	          write: toString

	        },

	        CSS_RGBA: {

	          read: function(original) {

	            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
	            if (test === null) return false;

	            return {
	              space: 'RGB',
	              r: parseFloat(test[1]),
	              g: parseFloat(test[2]),
	              b: parseFloat(test[3]),
	              a: parseFloat(test[4])
	            };

	          },

	          write: toString

	        }

	      }

	    },

	    // Numbers
	    {

	      litmus: common.isNumber,

	      conversions: {

	        HEX: {
	          read: function(original) {
	            return {
	              space: 'HEX',
	              hex: original,
	              conversionName: 'HEX'
	            }
	          },

	          write: function(color) {
	            return color.hex;
	          }
	        }

	      }

	    },

	    // Arrays
	    {

	      litmus: common.isArray,

	      conversions: {

	        RGB_ARRAY: {
	          read: function(original) {
	            if (original.length != 3) return false;
	            return {
	              space: 'RGB',
	              r: original[0],
	              g: original[1],
	              b: original[2]
	            };
	          },

	          write: function(color) {
	            return [color.r, color.g, color.b];
	          }

	        },

	        RGBA_ARRAY: {
	          read: function(original) {
	            if (original.length != 4) return false;
	            return {
	              space: 'RGB',
	              r: original[0],
	              g: original[1],
	              b: original[2],
	              a: original[3]
	            };
	          },

	          write: function(color) {
	            return [color.r, color.g, color.b, color.a];
	          }

	        }

	      }

	    },

	    // Objects
	    {

	      litmus: common.isObject,

	      conversions: {

	        RGBA_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.r) &&
	                common.isNumber(original.g) &&
	                common.isNumber(original.b) &&
	                common.isNumber(original.a)) {
	              return {
	                space: 'RGB',
	                r: original.r,
	                g: original.g,
	                b: original.b,
	                a: original.a
	              }
	            }
	            return false;
	          },

	          write: function(color) {
	            return {
	              r: color.r,
	              g: color.g,
	              b: color.b,
	              a: color.a
	            }
	          }
	        },

	        RGB_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.r) &&
	                common.isNumber(original.g) &&
	                common.isNumber(original.b)) {
	              return {
	                space: 'RGB',
	                r: original.r,
	                g: original.g,
	                b: original.b
	              }
	            }
	            return false;
	          },

	          write: function(color) {
	            return {
	              r: color.r,
	              g: color.g,
	              b: color.b
	            }
	          }
	        },

	        HSVA_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.h) &&
	                common.isNumber(original.s) &&
	                common.isNumber(original.v) &&
	                common.isNumber(original.a)) {
	              return {
	                space: 'HSV',
	                h: original.h,
	                s: original.s,
	                v: original.v,
	                a: original.a
	              }
	            }
	            return false;
	          },

	          write: function(color) {
	            return {
	              h: color.h,
	              s: color.s,
	              v: color.v,
	              a: color.a
	            }
	          }
	        },

	        HSV_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.h) &&
	                common.isNumber(original.s) &&
	                common.isNumber(original.v)) {
	              return {
	                space: 'HSV',
	                h: original.h,
	                s: original.s,
	                v: original.v
	              }
	            }
	            return false;
	          },

	          write: function(color) {
	            return {
	              h: color.h,
	              s: color.s,
	              v: color.v
	            }
	          }

	        }

	      }

	    }


	  ];

	  return interpret;


	})(dat.color.toString,
	dat.utils.common);


	dat.GUI = dat.gui.GUI = (function (css, saveDialogueContents, styleSheet, controllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, OptionController, ColorController, requestAnimationFrame, CenteredDiv, dom, common) {

	  css.inject(styleSheet);

	  /** Outer-most className for GUI's */
	  var CSS_NAMESPACE = 'dg';

	  var HIDE_KEY_CODE = 72;

	  /** The only value shared between the JS and SCSS. Use caution. */
	  var CLOSE_BUTTON_HEIGHT = 20;

	  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

	  var SUPPORTS_LOCAL_STORAGE = (function() {
	    try {
	      return 'localStorage' in window && window['localStorage'] !== null;
	    } catch (e) {
	      return false;
	    }
	  })();

	  var SAVE_DIALOGUE;

	  /** Have we yet to create an autoPlace GUI? */
	  var auto_place_virgin = true;

	  /** Fixed position div that auto place GUI's go inside */
	  var auto_place_container;

	  /** Are we hiding the GUI's ? */
	  var hide = false;

	  /** GUI's which should be hidden */
	  var hideable_guis = [];

	  /**
	   * A lightweight controller library for JavaScript. It allows you to easily
	   * manipulate variables and fire functions on the fly.
	   * @class
	   *
	   * @member dat.gui
	   *
	   * @param {Object} [params]
	   * @param {String} [params.name] The name of this GUI.
	   * @param {Object} [params.load] JSON object representing the saved state of
	   * this GUI.
	   * @param {Boolean} [params.auto=true]
	   * @param {dat.gui.GUI} [params.parent] The GUI I'm nested in.
	   * @param {Boolean} [params.closed] If true, starts closed
	   */
	  var GUI = function(params) {

	    var _this = this;

	    /**
	     * Outermost DOM Element
	     * @type DOMElement
	     */
	    this.domElement = document.createElement('div');
	    this.__ul = document.createElement('ul');
	    this.domElement.appendChild(this.__ul);

	    dom.addClass(this.domElement, CSS_NAMESPACE);

	    /**
	     * Nested GUI's by name
	     * @ignore
	     */
	    this.__folders = {};

	    this.__controllers = [];

	    /**
	     * List of objects I'm remembering for save, only used in top level GUI
	     * @ignore
	     */
	    this.__rememberedObjects = [];

	    /**
	     * Maps the index of remembered objects to a map of controllers, only used
	     * in top level GUI.
	     *
	     * @private
	     * @ignore
	     *
	     * @example
	     * [
	     *  {
	     *    propertyName: Controller,
	     *    anotherPropertyName: Controller
	     *  },
	     *  {
	     *    propertyName: Controller
	     *  }
	     * ]
	     */
	    this.__rememberedObjectIndecesToControllers = [];

	    this.__listening = [];

	    params = params || {};

	    // Default parameters
	    params = common.defaults(params, {
	      autoPlace: true,
	      width: GUI.DEFAULT_WIDTH
	    });

	    params = common.defaults(params, {
	      resizable: params.autoPlace,
	      hideable: params.autoPlace
	    });


	    if (!common.isUndefined(params.load)) {

	      // Explicit preset
	      if (params.preset) params.load.preset = params.preset;

	    } else {

	      params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };

	    }

	    if (common.isUndefined(params.parent) && params.hideable) {
	      hideable_guis.push(this);
	    }

	    // Only root level GUI's are resizable.
	    params.resizable = common.isUndefined(params.parent) && params.resizable;


	    if (params.autoPlace && common.isUndefined(params.scrollable)) {
	      params.scrollable = true;
	    }
	//    params.scrollable = common.isUndefined(params.parent) && params.scrollable === true;

	    // Not part of params because I don't want people passing this in via
	    // constructor. Should be a 'remembered' value.
	    var use_local_storage =
	        SUPPORTS_LOCAL_STORAGE &&
	            localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';

	    Object.defineProperties(this,

	        /** @lends dat.gui.GUI.prototype */
	        {

	          /**
	           * The parent <code>GUI</code>
	           * @type dat.gui.GUI
	           */
	          parent: {
	            get: function() {
	              return params.parent;
	            }
	          },

	          scrollable: {
	            get: function() {
	              return params.scrollable;
	            }
	          },

	          /**
	           * Handles <code>GUI</code>'s element placement for you
	           * @type Boolean
	           */
	          autoPlace: {
	            get: function() {
	              return params.autoPlace;
	            }
	          },

	          /**
	           * The identifier for a set of saved values
	           * @type String
	           */
	          preset: {

	            get: function() {
	              if (_this.parent) {
	                return _this.getRoot().preset;
	              } else {
	                return params.load.preset;
	              }
	            },

	            set: function(v) {
	              if (_this.parent) {
	                _this.getRoot().preset = v;
	              } else {
	                params.load.preset = v;
	              }
	              setPresetSelectIndex(this);
	              _this.revert();
	            }

	          },

	          /**
	           * The width of <code>GUI</code> element
	           * @type Number
	           */
	          width: {
	            get: function() {
	              return params.width;
	            },
	            set: function(v) {
	              params.width = v;
	              setWidth(_this, v);
	            }
	          },

	          /**
	           * The name of <code>GUI</code>. Used for folders. i.e
	           * a folder's name
	           * @type String
	           */
	          name: {
	            get: function() {
	              return params.name;
	            },
	            set: function(v) {
	              // TODO Check for collisions among sibling folders
	              params.name = v;
	              if (title_row_name) {
	                title_row_name.innerHTML = params.name;
	              }
	            }
	          },

	          /**
	           * Whether the <code>GUI</code> is collapsed or not
	           * @type Boolean
	           */
	          closed: {
	            get: function() {
	              return params.closed;
	            },
	            set: function(v) {
	              params.closed = v;
	              if (params.closed) {
	                dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
	              } else {
	                dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
	              }
	              // For browsers that aren't going to respect the CSS transition,
	              // Lets just check our height against the window height right off
	              // the bat.
	              this.onResize();

	              if (_this.__closeButton) {
	                _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
	              }
	            }
	          },

	          /**
	           * Contains all presets
	           * @type Object
	           */
	          load: {
	            get: function() {
	              return params.load;
	            }
	          },

	          /**
	           * Determines whether or not to use <a href="https://developer.mozilla.org/en/DOM/Storage#localStorage">localStorage</a> as the means for
	           * <code>remember</code>ing
	           * @type Boolean
	           */
	          useLocalStorage: {

	            get: function() {
	              return use_local_storage;
	            },
	            set: function(bool) {
	              if (SUPPORTS_LOCAL_STORAGE) {
	                use_local_storage = bool;
	                if (bool) {
	                  dom.bind(window, 'unload', saveToLocalStorage);
	                } else {
	                  dom.unbind(window, 'unload', saveToLocalStorage);
	                }
	                localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
	              }
	            }

	          }

	        });

	    // Are we a root level GUI?
	    if (common.isUndefined(params.parent)) {

	      params.closed = false;

	      dom.addClass(this.domElement, GUI.CLASS_MAIN);
	      dom.makeSelectable(this.domElement, false);

	      // Are we supposed to be loading locally?
	      if (SUPPORTS_LOCAL_STORAGE) {

	        if (use_local_storage) {

	          _this.useLocalStorage = true;

	          var saved_gui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

	          if (saved_gui) {
	            params.load = JSON.parse(saved_gui);
	          }

	        }

	      }

	      this.__closeButton = document.createElement('div');
	      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
	      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
	      this.domElement.appendChild(this.__closeButton);

	      dom.bind(this.__closeButton, 'click', function() {

	        _this.closed = !_this.closed;


	      });


	      // Oh, you're a nested GUI!
	    } else {

	      if (params.closed === undefined) {
	        params.closed = true;
	      }

	      var title_row_name = document.createTextNode(params.name);
	      dom.addClass(title_row_name, 'controller-name');

	      var title_row = addRow(_this, title_row_name);

	      var on_click_title = function(e) {
	        e.preventDefault();
	        _this.closed = !_this.closed;
	        return false;
	      };

	      dom.addClass(this.__ul, GUI.CLASS_CLOSED);

	      dom.addClass(title_row, 'title');
	      dom.bind(title_row, 'click', on_click_title);

	      if (!params.closed) {
	        this.closed = false;
	      }

	    }

	    if (params.autoPlace) {

	      if (common.isUndefined(params.parent)) {

	        if (auto_place_virgin) {
	          auto_place_container = document.createElement('div');
	          dom.addClass(auto_place_container, CSS_NAMESPACE);
	          dom.addClass(auto_place_container, GUI.CLASS_AUTO_PLACE_CONTAINER);
	          document.body.appendChild(auto_place_container);
	          auto_place_virgin = false;
	        }

	        // Put it in the dom for you.
	        auto_place_container.appendChild(this.domElement);

	        // Apply the auto styles
	        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);

	      }


	      // Make it not elastic.
	      if (!this.parent) setWidth(_this, params.width);

	    }

	    dom.bind(window, 'resize', function() { _this.onResize() });
	    dom.bind(this.__ul, 'webkitTransitionEnd', function() { _this.onResize(); });
	    dom.bind(this.__ul, 'transitionend', function() { _this.onResize() });
	    dom.bind(this.__ul, 'oTransitionEnd', function() { _this.onResize() });
	    this.onResize();


	    if (params.resizable) {
	      addResizeHandle(this);
	    }

	    function saveToLocalStorage() {
	      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
	    }

	    var root = _this.getRoot();
	    function resetWidth() {
	        var root = _this.getRoot();
	        root.width += 1;
	        common.defer(function() {
	          root.width -= 1;
	        });
	      }

	      if (!params.parent) {
	        resetWidth();
	      }

	  };

	  GUI.toggleHide = function() {

	    hide = !hide;
	    common.each(hideable_guis, function(gui) {
	      gui.domElement.style.zIndex = hide ? -999 : 999;
	      gui.domElement.style.opacity = hide ? 0 : 1;
	    });
	  };

	  GUI.CLASS_AUTO_PLACE = 'a';
	  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
	  GUI.CLASS_MAIN = 'main';
	  GUI.CLASS_CONTROLLER_ROW = 'cr';
	  GUI.CLASS_TOO_TALL = 'taller-than-window';
	  GUI.CLASS_CLOSED = 'closed';
	  GUI.CLASS_CLOSE_BUTTON = 'close-button';
	  GUI.CLASS_DRAG = 'drag';

	  GUI.DEFAULT_WIDTH = 245;
	  GUI.TEXT_CLOSED = 'Close Controls';
	  GUI.TEXT_OPEN = 'Open Controls';

	  dom.bind(window, 'keydown', function(e) {

	    if (document.activeElement.type !== 'text' &&
	        (e.which === HIDE_KEY_CODE || e.keyCode == HIDE_KEY_CODE)) {
	      GUI.toggleHide();
	    }

	  }, false);

	  common.extend(

	      GUI.prototype,

	      /** @lends dat.gui.GUI */
	      {

	        /**
	         * @param object
	         * @param property
	         * @returns {dat.controllers.Controller} The new controller that was added.
	         * @instance
	         */
	        add: function(object, property) {

	          return add(
	              this,
	              object,
	              property,
	              {
	                factoryArgs: Array.prototype.slice.call(arguments, 2)
	              }
	          );

	        },

	        /**
	         * @param object
	         * @param property
	         * @returns {dat.controllers.ColorController} The new controller that was added.
	         * @instance
	         */
	        addColor: function(object, property) {

	          return add(
	              this,
	              object,
	              property,
	              {
	                color: true
	              }
	          );

	        },

	        /**
	         * @param controller
	         * @instance
	         */
	        remove: function(controller) {

	          // TODO listening?
	          this.__ul.removeChild(controller.__li);
	          this.__controllers.slice(this.__controllers.indexOf(controller), 1);
	          var _this = this;
	          common.defer(function() {
	            _this.onResize();
	          });

	        },

	        destroy: function() {

	          if (this.autoPlace) {
	            auto_place_container.removeChild(this.domElement);
	          }

	        },

	        /**
	         * @param name
	         * @returns {dat.gui.GUI} The new folder.
	         * @throws {Error} if this GUI already has a folder by the specified
	         * name
	         * @instance
	         */
	        addFolder: function(name) {

	          // We have to prevent collisions on names in order to have a key
	          // by which to remember saved values
	          if (this.__folders[name] !== undefined) {
	            throw new Error('You already have a folder in this GUI by the' +
	                ' name "' + name + '"');
	          }

	          var new_gui_params = { name: name, parent: this };

	          // We need to pass down the autoPlace trait so that we can
	          // attach event listeners to open/close folder actions to
	          // ensure that a scrollbar appears if the window is too short.
	          new_gui_params.autoPlace = this.autoPlace;

	          // Do we have saved appearance data for this folder?

	          if (this.load && // Anything loaded?
	              this.load.folders && // Was my parent a dead-end?
	              this.load.folders[name]) { // Did daddy remember me?

	            // Start me closed if I was closed
	            new_gui_params.closed = this.load.folders[name].closed;

	            // Pass down the loaded data
	            new_gui_params.load = this.load.folders[name];

	          }

	          var gui = new GUI(new_gui_params);
	          this.__folders[name] = gui;

	          var li = addRow(this, gui.domElement);
	          dom.addClass(li, 'folder');
	          return gui;

	        },

	        open: function() {
	          this.closed = false;
	        },

	        close: function() {
	          this.closed = true;
	        },

	        onResize: function() {

	          var root = this.getRoot();

	          if (root.scrollable) {

	            var top = dom.getOffset(root.__ul).top;
	            var h = 0;

	            common.each(root.__ul.childNodes, function(node) {
	              if (! (root.autoPlace && node === root.__save_row))
	                h += dom.getHeight(node);
	            });

	            if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
	              dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
	              root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
	            } else {
	              dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
	              root.__ul.style.height = 'auto';
	            }

	          }

	          if (root.__resize_handle) {
	            common.defer(function() {
	              root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
	            });
	          }

	          if (root.__closeButton) {
	            root.__closeButton.style.width = root.width + 'px';
	          }

	        },

	        /**
	         * Mark objects for saving. The order of these objects cannot change as
	         * the GUI grows. When remembering new objects, append them to the end
	         * of the list.
	         *
	         * @param {Object...} objects
	         * @throws {Error} if not called on a top level GUI.
	         * @instance
	         */
	        remember: function() {

	          if (common.isUndefined(SAVE_DIALOGUE)) {
	            SAVE_DIALOGUE = new CenteredDiv();
	            SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
	          }

	          if (this.parent) {
	            throw new Error("You can only call remember on a top level GUI.");
	          }

	          var _this = this;

	          common.each(Array.prototype.slice.call(arguments), function(object) {
	            if (_this.__rememberedObjects.length == 0) {
	              addSaveMenu(_this);
	            }
	            if (_this.__rememberedObjects.indexOf(object) == -1) {
	              _this.__rememberedObjects.push(object);
	            }
	          });

	          if (this.autoPlace) {
	            // Set save row width
	            setWidth(this, this.width);
	          }

	        },

	        /**
	         * @returns {dat.gui.GUI} the topmost parent GUI of a nested GUI.
	         * @instance
	         */
	        getRoot: function() {
	          var gui = this;
	          while (gui.parent) {
	            gui = gui.parent;
	          }
	          return gui;
	        },

	        /**
	         * @returns {Object} a JSON object representing the current state of
	         * this GUI as well as its remembered properties.
	         * @instance
	         */
	        getSaveObject: function() {

	          var toReturn = this.load;

	          toReturn.closed = this.closed;

	          // Am I remembering any values?
	          if (this.__rememberedObjects.length > 0) {

	            toReturn.preset = this.preset;

	            if (!toReturn.remembered) {
	              toReturn.remembered = {};
	            }

	            toReturn.remembered[this.preset] = getCurrentPreset(this);

	          }

	          toReturn.folders = {};
	          common.each(this.__folders, function(element, key) {
	            toReturn.folders[key] = element.getSaveObject();
	          });

	          return toReturn;

	        },

	        save: function() {

	          if (!this.load.remembered) {
	            this.load.remembered = {};
	          }

	          this.load.remembered[this.preset] = getCurrentPreset(this);
	          markPresetModified(this, false);

	        },

	        saveAs: function(presetName) {

	          if (!this.load.remembered) {

	            // Retain default values upon first save
	            this.load.remembered = {};
	            this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);

	          }

	          this.load.remembered[presetName] = getCurrentPreset(this);
	          this.preset = presetName;
	          addPresetOption(this, presetName, true);

	        },

	        revert: function(gui) {

	          common.each(this.__controllers, function(controller) {
	            // Make revert work on Default.
	            if (!this.getRoot().load.remembered) {
	              controller.setValue(controller.initialValue);
	            } else {
	              recallSavedValue(gui || this.getRoot(), controller);
	            }
	          }, this);

	          common.each(this.__folders, function(folder) {
	            folder.revert(folder);
	          });

	          if (!gui) {
	            markPresetModified(this.getRoot(), false);
	          }


	        },

	        listen: function(controller) {

	          var init = this.__listening.length == 0;
	          this.__listening.push(controller);
	          if (init) updateDisplays(this.__listening);

	        }

	      }

	  );

	  function add(gui, object, property, params) {

	    if (object[property] === undefined) {
	      throw new Error("Object " + object + " has no property \"" + property + "\"");
	    }

	    var controller;

	    if (params.color) {

	      controller = new ColorController(object, property);

	    } else {

	      var factoryArgs = [object,property].concat(params.factoryArgs);
	      controller = controllerFactory.apply(gui, factoryArgs);

	    }

	    if (params.before instanceof Controller) {
	      params.before = params.before.__li;
	    }

	    recallSavedValue(gui, controller);

	    dom.addClass(controller.domElement, 'c');

	    var name = document.createElement('span');
	    dom.addClass(name, 'property-name');
	    name.innerHTML = controller.property;

	    var container = document.createElement('div');
	    container.appendChild(name);
	    container.appendChild(controller.domElement);

	    var li = addRow(gui, container, params.before);

	    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
	    dom.addClass(li, typeof controller.getValue());

	    augmentController(gui, li, controller);

	    gui.__controllers.push(controller);

	    return controller;

	  }

	  /**
	   * Add a row to the end of the GUI or before another row.
	   *
	   * @param gui
	   * @param [dom] If specified, inserts the dom content in the new row
	   * @param [liBefore] If specified, places the new row before another row
	   */
	  function addRow(gui, dom, liBefore) {
	    var li = document.createElement('li');
	    if (dom) li.appendChild(dom);
	    if (liBefore) {
	      gui.__ul.insertBefore(li, params.before);
	    } else {
	      gui.__ul.appendChild(li);
	    }
	    gui.onResize();
	    return li;
	  }

	  function augmentController(gui, li, controller) {

	    controller.__li = li;
	    controller.__gui = gui;

	    common.extend(controller, {

	      options: function(options) {

	        if (arguments.length > 1) {
	          controller.remove();

	          return add(
	              gui,
	              controller.object,
	              controller.property,
	              {
	                before: controller.__li.nextElementSibling,
	                factoryArgs: [common.toArray(arguments)]
	              }
	          );

	        }

	        if (common.isArray(options) || common.isObject(options)) {
	          controller.remove();

	          return add(
	              gui,
	              controller.object,
	              controller.property,
	              {
	                before: controller.__li.nextElementSibling,
	                factoryArgs: [options]
	              }
	          );

	        }

	      },

	      name: function(v) {
	        controller.__li.firstElementChild.firstElementChild.innerHTML = v;
	        return controller;
	      },

	      listen: function() {
	        controller.__gui.listen(controller);
	        return controller;
	      },

	      remove: function() {
	        controller.__gui.remove(controller);
	        return controller;
	      }

	    });

	    // All sliders should be accompanied by a box.
	    if (controller instanceof NumberControllerSlider) {

	      var box = new NumberControllerBox(controller.object, controller.property,
	          { min: controller.__min, max: controller.__max, step: controller.__step });

	      common.each(['updateDisplay', 'onChange', 'onFinishChange'], function(method) {
	        var pc = controller[method];
	        var pb = box[method];
	        controller[method] = box[method] = function() {
	          var args = Array.prototype.slice.call(arguments);
	          pc.apply(controller, args);
	          return pb.apply(box, args);
	        }
	      });

	      dom.addClass(li, 'has-slider');
	      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);

	    }
	    else if (controller instanceof NumberControllerBox) {

	      var r = function(returned) {

	        // Have we defined both boundaries?
	        if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {

	          // Well, then lets just replace this with a slider.
	          controller.remove();
	          return add(
	              gui,
	              controller.object,
	              controller.property,
	              {
	                before: controller.__li.nextElementSibling,
	                factoryArgs: [controller.__min, controller.__max, controller.__step]
	              });

	        }

	        return returned;

	      };

	      controller.min = common.compose(r, controller.min);
	      controller.max = common.compose(r, controller.max);

	    }
	    else if (controller instanceof BooleanController) {

	      dom.bind(li, 'click', function() {
	        dom.fakeEvent(controller.__checkbox, 'click');
	      });

	      dom.bind(controller.__checkbox, 'click', function(e) {
	        e.stopPropagation(); // Prevents double-toggle
	      })

	    }
	    else if (controller instanceof FunctionController) {

	      dom.bind(li, 'click', function() {
	        dom.fakeEvent(controller.__button, 'click');
	      });

	      dom.bind(li, 'mouseover', function() {
	        dom.addClass(controller.__button, 'hover');
	      });

	      dom.bind(li, 'mouseout', function() {
	        dom.removeClass(controller.__button, 'hover');
	      });

	    }
	    else if (controller instanceof ColorController) {

	      dom.addClass(li, 'color');
	      controller.updateDisplay = common.compose(function(r) {
	        li.style.borderLeftColor = controller.__color.toString();
	        return r;
	      }, controller.updateDisplay);

	      controller.updateDisplay();

	    }

	    controller.setValue = common.compose(function(r) {
	      if (gui.getRoot().__preset_select && controller.isModified()) {
	        markPresetModified(gui.getRoot(), true);
	      }
	      return r;
	    }, controller.setValue);

	  }

	  function recallSavedValue(gui, controller) {

	    // Find the topmost GUI, that's where remembered objects live.
	    var root = gui.getRoot();

	    // Does the object we're controlling match anything we've been told to
	    // remember?
	    var matched_index = root.__rememberedObjects.indexOf(controller.object);

	    // Why yes, it does!
	    if (matched_index != -1) {

	      // Let me fetch a map of controllers for thcommon.isObject.
	      var controller_map =
	          root.__rememberedObjectIndecesToControllers[matched_index];

	      // Ohp, I believe this is the first controller we've created for this
	      // object. Lets make the map fresh.
	      if (controller_map === undefined) {
	        controller_map = {};
	        root.__rememberedObjectIndecesToControllers[matched_index] =
	            controller_map;
	      }

	      // Keep track of this controller
	      controller_map[controller.property] = controller;

	      // Okay, now have we saved any values for this controller?
	      if (root.load && root.load.remembered) {

	        var preset_map = root.load.remembered;

	        // Which preset are we trying to load?
	        var preset;

	        if (preset_map[gui.preset]) {

	          preset = preset_map[gui.preset];

	        } else if (preset_map[DEFAULT_DEFAULT_PRESET_NAME]) {

	          // Uhh, you can have the default instead?
	          preset = preset_map[DEFAULT_DEFAULT_PRESET_NAME];

	        } else {

	          // Nada.

	          return;

	        }


	        // Did the loaded object remember thcommon.isObject?
	        if (preset[matched_index] &&

	          // Did we remember this particular property?
	            preset[matched_index][controller.property] !== undefined) {

	          // We did remember something for this guy ...
	          var value = preset[matched_index][controller.property];

	          // And that's what it is.
	          controller.initialValue = value;
	          controller.setValue(value);

	        }

	      }

	    }

	  }

	  function getLocalStorageHash(gui, key) {
	    // TODO how does this deal with multiple GUI's?
	    return document.location.href + '.' + key;

	  }

	  function addSaveMenu(gui) {

	    var div = gui.__save_row = document.createElement('li');

	    dom.addClass(gui.domElement, 'has-save');

	    gui.__ul.insertBefore(div, gui.__ul.firstChild);

	    dom.addClass(div, 'save-row');

	    var gears = document.createElement('span');
	    gears.innerHTML = '&nbsp;';
	    dom.addClass(gears, 'button gears');

	    // TODO replace with FunctionController
	    var button = document.createElement('span');
	    button.innerHTML = 'Save';
	    dom.addClass(button, 'button');
	    dom.addClass(button, 'save');

	    var button2 = document.createElement('span');
	    button2.innerHTML = 'New';
	    dom.addClass(button2, 'button');
	    dom.addClass(button2, 'save-as');

	    var button3 = document.createElement('span');
	    button3.innerHTML = 'Revert';
	    dom.addClass(button3, 'button');
	    dom.addClass(button3, 'revert');

	    var select = gui.__preset_select = document.createElement('select');

	    if (gui.load && gui.load.remembered) {

	      common.each(gui.load.remembered, function(value, key) {
	        addPresetOption(gui, key, key == gui.preset);
	      });

	    } else {
	      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
	    }

	    dom.bind(select, 'change', function() {


	      for (var index = 0; index < gui.__preset_select.length; index++) {
	        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
	      }

	      gui.preset = this.value;

	    });

	    div.appendChild(select);
	    div.appendChild(gears);
	    div.appendChild(button);
	    div.appendChild(button2);
	    div.appendChild(button3);

	    if (SUPPORTS_LOCAL_STORAGE) {

	      var saveLocally = document.getElementById('dg-save-locally');
	      var explain = document.getElementById('dg-local-explain');

	      saveLocally.style.display = 'block';

	      var localStorageCheckBox = document.getElementById('dg-local-storage');

	      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
	        localStorageCheckBox.setAttribute('checked', 'checked');
	      }

	      function showHideExplain() {
	        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
	      }

	      showHideExplain();

	      // TODO: Use a boolean controller, fool!
	      dom.bind(localStorageCheckBox, 'change', function() {
	        gui.useLocalStorage = !gui.useLocalStorage;
	        showHideExplain();
	      });

	    }

	    var newConstructorTextArea = document.getElementById('dg-new-constructor');

	    dom.bind(newConstructorTextArea, 'keydown', function(e) {
	      if (e.metaKey && (e.which === 67 || e.keyCode == 67)) {
	        SAVE_DIALOGUE.hide();
	      }
	    });

	    dom.bind(gears, 'click', function() {
	      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
	      SAVE_DIALOGUE.show();
	      newConstructorTextArea.focus();
	      newConstructorTextArea.select();
	    });

	    dom.bind(button, 'click', function() {
	      gui.save();
	    });

	    dom.bind(button2, 'click', function() {
	      var presetName = prompt('Enter a new preset name.');
	      if (presetName) gui.saveAs(presetName);
	    });

	    dom.bind(button3, 'click', function() {
	      gui.revert();
	    });

	//    div.appendChild(button2);

	  }

	  function addResizeHandle(gui) {

	    gui.__resize_handle = document.createElement('div');

	    common.extend(gui.__resize_handle.style, {

	      width: '6px',
	      marginLeft: '-3px',
	      height: '200px',
	      cursor: 'ew-resize',
	      position: 'absolute'
	//      border: '1px solid blue'

	    });

	    var pmouseX;

	    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
	    dom.bind(gui.__closeButton, 'mousedown', dragStart);

	    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);

	    function dragStart(e) {

	      e.preventDefault();

	      pmouseX = e.clientX;

	      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
	      dom.bind(window, 'mousemove', drag);
	      dom.bind(window, 'mouseup', dragStop);

	      return false;

	    }

	    function drag(e) {

	      e.preventDefault();

	      gui.width += pmouseX - e.clientX;
	      gui.onResize();
	      pmouseX = e.clientX;

	      return false;

	    }

	    function dragStop() {

	      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
	      dom.unbind(window, 'mousemove', drag);
	      dom.unbind(window, 'mouseup', dragStop);

	    }

	  }

	  function setWidth(gui, w) {
	    gui.domElement.style.width = w + 'px';
	    // Auto placed save-rows are position fixed, so we have to
	    // set the width manually if we want it to bleed to the edge
	    if (gui.__save_row && gui.autoPlace) {
	      gui.__save_row.style.width = w + 'px';
	    }if (gui.__closeButton) {
	      gui.__closeButton.style.width = w + 'px';
	    }
	  }

	  function getCurrentPreset(gui, useInitialValues) {

	    var toReturn = {};

	    // For each object I'm remembering
	    common.each(gui.__rememberedObjects, function(val, index) {

	      var saved_values = {};

	      // The controllers I've made for thcommon.isObject by property
	      var controller_map =
	          gui.__rememberedObjectIndecesToControllers[index];

	      // Remember each value for each property
	      common.each(controller_map, function(controller, property) {
	        saved_values[property] = useInitialValues ? controller.initialValue : controller.getValue();
	      });

	      // Save the values for thcommon.isObject
	      toReturn[index] = saved_values;

	    });

	    return toReturn;

	  }

	  function addPresetOption(gui, name, setSelected) {
	    var opt = document.createElement('option');
	    opt.innerHTML = name;
	    opt.value = name;
	    gui.__preset_select.appendChild(opt);
	    if (setSelected) {
	      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
	    }
	  }

	  function setPresetSelectIndex(gui) {
	    for (var index = 0; index < gui.__preset_select.length; index++) {
	      if (gui.__preset_select[index].value == gui.preset) {
	        gui.__preset_select.selectedIndex = index;
	      }
	    }
	  }

	  function markPresetModified(gui, modified) {
	    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
	//    console.log('mark', modified, opt);
	    if (modified) {
	      opt.innerHTML = opt.value + "*";
	    } else {
	      opt.innerHTML = opt.value;
	    }
	  }

	  function updateDisplays(controllerArray) {


	    if (controllerArray.length != 0) {

	      requestAnimationFrame(function() {
	        updateDisplays(controllerArray);
	      });

	    }

	    common.each(controllerArray, function(c) {
	      c.updateDisplay();
	    });

	  }

	  return GUI;

	})(dat.utils.css,
	"<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>",
	".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n",
	dat.controllers.factory = (function (OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {

	      return function(object, property) {

	        var initialValue = object[property];

	        // Providing options?
	        if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
	          return new OptionController(object, property, arguments[2]);
	        }

	        // Providing a map?

	        if (common.isNumber(initialValue)) {

	          if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {

	            // Has min and max.
	            return new NumberControllerSlider(object, property, arguments[2], arguments[3]);

	          } else {

	            return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });

	          }

	        }

	        if (common.isString(initialValue)) {
	          return new StringController(object, property);
	        }

	        if (common.isFunction(initialValue)) {
	          return new FunctionController(object, property, '');
	        }

	        if (common.isBoolean(initialValue)) {
	          return new BooleanController(object, property);
	        }

	      }

	    })(dat.controllers.OptionController,
	dat.controllers.NumberControllerBox,
	dat.controllers.NumberControllerSlider,
	dat.controllers.StringController = (function (Controller, dom, common) {

	  /**
	   * @class Provides a text input to alter the string property of an object.
	   *
	   * @extends dat.controllers.Controller
	   *
	   * @param {Object} object The object to be manipulated
	   * @param {string} property The name of the property to be manipulated
	   *
	   * @member dat.controllers
	   */
	  var StringController = function(object, property) {

	    StringController.superclass.call(this, object, property);

	    var _this = this;

	    this.__input = document.createElement('input');
	    this.__input.setAttribute('type', 'text');

	    dom.bind(this.__input, 'keyup', onChange);
	    dom.bind(this.__input, 'change', onChange);
	    dom.bind(this.__input, 'blur', onBlur);
	    dom.bind(this.__input, 'keydown', function(e) {
	      if (e.keyCode === 13) {
	        this.blur();
	      }
	    });
	    

	    function onChange() {
	      _this.setValue(_this.__input.value);
	    }

	    function onBlur() {
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }

	    this.updateDisplay();

	    this.domElement.appendChild(this.__input);

	  };

	  StringController.superclass = Controller;

	  common.extend(

	      StringController.prototype,
	      Controller.prototype,

	      {

	        updateDisplay: function() {
	          // Stops the caret from moving on account of:
	          // keyup -> setValue -> updateDisplay
	          if (!dom.isActive(this.__input)) {
	            this.__input.value = this.getValue();
	          }
	          return StringController.superclass.prototype.updateDisplay.call(this);
	        }

	      }

	  );

	  return StringController;

	})(dat.controllers.Controller,
	dat.dom.dom,
	dat.utils.common),
	dat.controllers.FunctionController,
	dat.controllers.BooleanController,
	dat.utils.common),
	dat.controllers.Controller,
	dat.controllers.BooleanController,
	dat.controllers.FunctionController,
	dat.controllers.NumberControllerBox,
	dat.controllers.NumberControllerSlider,
	dat.controllers.OptionController,
	dat.controllers.ColorController = (function (Controller, dom, Color, interpret, common) {

	  var ColorController = function(object, property) {

	    ColorController.superclass.call(this, object, property);

	    this.__color = new Color(this.getValue());
	    this.__temp = new Color(0);

	    var _this = this;

	    this.domElement = document.createElement('div');

	    dom.makeSelectable(this.domElement, false);

	    this.__selector = document.createElement('div');
	    this.__selector.className = 'selector';

	    this.__saturation_field = document.createElement('div');
	    this.__saturation_field.className = 'saturation-field';

	    this.__field_knob = document.createElement('div');
	    this.__field_knob.className = 'field-knob';
	    this.__field_knob_border = '2px solid ';

	    this.__hue_knob = document.createElement('div');
	    this.__hue_knob.className = 'hue-knob';

	    this.__hue_field = document.createElement('div');
	    this.__hue_field.className = 'hue-field';

	    this.__input = document.createElement('input');
	    this.__input.type = 'text';
	    this.__input_textShadow = '0 1px 1px ';

	    dom.bind(this.__input, 'keydown', function(e) {
	      if (e.keyCode === 13) { // on enter
	        onBlur.call(this);
	      }
	    });

	    dom.bind(this.__input, 'blur', onBlur);

	    dom.bind(this.__selector, 'mousedown', function(e) {

	      dom
	        .addClass(this, 'drag')
	        .bind(window, 'mouseup', function(e) {
	          dom.removeClass(_this.__selector, 'drag');
	        });

	    });

	    var value_field = document.createElement('div');

	    common.extend(this.__selector.style, {
	      width: '122px',
	      height: '102px',
	      padding: '3px',
	      backgroundColor: '#222',
	      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
	    });

	    common.extend(this.__field_knob.style, {
	      position: 'absolute',
	      width: '12px',
	      height: '12px',
	      border: this.__field_knob_border + (this.__color.v < .5 ? '#fff' : '#000'),
	      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
	      borderRadius: '12px',
	      zIndex: 1
	    });
	    
	    common.extend(this.__hue_knob.style, {
	      position: 'absolute',
	      width: '15px',
	      height: '2px',
	      borderRight: '4px solid #fff',
	      zIndex: 1
	    });

	    common.extend(this.__saturation_field.style, {
	      width: '100px',
	      height: '100px',
	      border: '1px solid #555',
	      marginRight: '3px',
	      display: 'inline-block',
	      cursor: 'pointer'
	    });

	    common.extend(value_field.style, {
	      width: '100%',
	      height: '100%',
	      background: 'none'
	    });
	    
	    linearGradient(value_field, 'top', 'rgba(0,0,0,0)', '#000');

	    common.extend(this.__hue_field.style, {
	      width: '15px',
	      height: '100px',
	      display: 'inline-block',
	      border: '1px solid #555',
	      cursor: 'ns-resize'
	    });

	    hueGradient(this.__hue_field);

	    common.extend(this.__input.style, {
	      outline: 'none',
	//      width: '120px',
	      textAlign: 'center',
	//      padding: '4px',
	//      marginBottom: '6px',
	      color: '#fff',
	      border: 0,
	      fontWeight: 'bold',
	      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
	    });

	    dom.bind(this.__saturation_field, 'mousedown', fieldDown);
	    dom.bind(this.__field_knob, 'mousedown', fieldDown);

	    dom.bind(this.__hue_field, 'mousedown', function(e) {
	      setH(e);
	      dom.bind(window, 'mousemove', setH);
	      dom.bind(window, 'mouseup', unbindH);
	    });

	    function fieldDown(e) {
	      setSV(e);
	      // document.body.style.cursor = 'none';
	      dom.bind(window, 'mousemove', setSV);
	      dom.bind(window, 'mouseup', unbindSV);
	    }

	    function unbindSV() {
	      dom.unbind(window, 'mousemove', setSV);
	      dom.unbind(window, 'mouseup', unbindSV);
	      // document.body.style.cursor = 'default';
	    }

	    function onBlur() {
	      var i = interpret(this.value);
	      if (i !== false) {
	        _this.__color.__state = i;
	        _this.setValue(_this.__color.toOriginal());
	      } else {
	        this.value = _this.__color.toString();
	      }
	    }

	    function unbindH() {
	      dom.unbind(window, 'mousemove', setH);
	      dom.unbind(window, 'mouseup', unbindH);
	    }

	    this.__saturation_field.appendChild(value_field);
	    this.__selector.appendChild(this.__field_knob);
	    this.__selector.appendChild(this.__saturation_field);
	    this.__selector.appendChild(this.__hue_field);
	    this.__hue_field.appendChild(this.__hue_knob);

	    this.domElement.appendChild(this.__input);
	    this.domElement.appendChild(this.__selector);

	    this.updateDisplay();

	    function setSV(e) {

	      e.preventDefault();

	      var w = dom.getWidth(_this.__saturation_field);
	      var o = dom.getOffset(_this.__saturation_field);
	      var s = (e.clientX - o.left + document.body.scrollLeft) / w;
	      var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;

	      if (v > 1) v = 1;
	      else if (v < 0) v = 0;

	      if (s > 1) s = 1;
	      else if (s < 0) s = 0;

	      _this.__color.v = v;
	      _this.__color.s = s;

	      _this.setValue(_this.__color.toOriginal());


	      return false;

	    }

	    function setH(e) {

	      e.preventDefault();

	      var s = dom.getHeight(_this.__hue_field);
	      var o = dom.getOffset(_this.__hue_field);
	      var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;

	      if (h > 1) h = 1;
	      else if (h < 0) h = 0;

	      _this.__color.h = h * 360;

	      _this.setValue(_this.__color.toOriginal());

	      return false;

	    }

	  };

	  ColorController.superclass = Controller;

	  common.extend(

	      ColorController.prototype,
	      Controller.prototype,

	      {

	        updateDisplay: function() {

	          var i = interpret(this.getValue());

	          if (i !== false) {

	            var mismatch = false;

	            // Check for mismatch on the interpreted value.

	            common.each(Color.COMPONENTS, function(component) {
	              if (!common.isUndefined(i[component]) &&
	                  !common.isUndefined(this.__color.__state[component]) &&
	                  i[component] !== this.__color.__state[component]) {
	                mismatch = true;
	                return {}; // break
	              }
	            }, this);

	            // If nothing diverges, we keep our previous values
	            // for statefulness, otherwise we recalculate fresh
	            if (mismatch) {
	              common.extend(this.__color.__state, i);
	            }

	          }

	          common.extend(this.__temp.__state, this.__color.__state);

	          this.__temp.a = 1;

	          var flip = (this.__color.v < .5 || this.__color.s > .5) ? 255 : 0;
	          var _flip = 255 - flip;

	          common.extend(this.__field_knob.style, {
	            marginLeft: 100 * this.__color.s - 7 + 'px',
	            marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
	            backgroundColor: this.__temp.toString(),
	            border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip +')'
	          });

	          this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px'

	          this.__temp.s = 1;
	          this.__temp.v = 1;

	          linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());

	          common.extend(this.__input.style, {
	            backgroundColor: this.__input.value = this.__color.toString(),
	            color: 'rgb(' + flip + ',' + flip + ',' + flip +')',
	            textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip +',.7)'
	          });

	        }

	      }

	  );
	  
	  var vendors = ['-moz-','-o-','-webkit-','-ms-',''];
	  
	  function linearGradient(elem, x, a, b) {
	    elem.style.background = '';
	    common.each(vendors, function(vendor) {
	      elem.style.cssText += 'background: ' + vendor + 'linear-gradient('+x+', '+a+' 0%, ' + b + ' 100%); ';
	    });
	  }
	  
	  function hueGradient(elem) {
	    elem.style.background = '';
	    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);'
	    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
	    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
	    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
	    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
	  }


	  return ColorController;

	})(dat.controllers.Controller,
	dat.dom.dom,
	dat.color.Color = (function (interpret, math, toString, common) {

	  var Color = function() {

	    this.__state = interpret.apply(this, arguments);

	    if (this.__state === false) {
	      throw 'Failed to interpret color arguments';
	    }

	    this.__state.a = this.__state.a || 1;


	  };

	  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

	  common.extend(Color.prototype, {

	    toString: function() {
	      return toString(this);
	    },

	    toOriginal: function() {
	      return this.__state.conversion.write(this);
	    }

	  });

	  defineRGBComponent(Color.prototype, 'r', 2);
	  defineRGBComponent(Color.prototype, 'g', 1);
	  defineRGBComponent(Color.prototype, 'b', 0);

	  defineHSVComponent(Color.prototype, 'h');
	  defineHSVComponent(Color.prototype, 's');
	  defineHSVComponent(Color.prototype, 'v');

	  Object.defineProperty(Color.prototype, 'a', {

	    get: function() {
	      return this.__state.a;
	    },

	    set: function(v) {
	      this.__state.a = v;
	    }

	  });

	  Object.defineProperty(Color.prototype, 'hex', {

	    get: function() {

	      if (!this.__state.space !== 'HEX') {
	        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
	      }

	      return this.__state.hex;

	    },

	    set: function(v) {

	      this.__state.space = 'HEX';
	      this.__state.hex = v;

	    }

	  });

	  function defineRGBComponent(target, component, componentHexIndex) {

	    Object.defineProperty(target, component, {

	      get: function() {

	        if (this.__state.space === 'RGB') {
	          return this.__state[component];
	        }

	        recalculateRGB(this, component, componentHexIndex);

	        return this.__state[component];

	      },

	      set: function(v) {

	        if (this.__state.space !== 'RGB') {
	          recalculateRGB(this, component, componentHexIndex);
	          this.__state.space = 'RGB';
	        }

	        this.__state[component] = v;

	      }

	    });

	  }

	  function defineHSVComponent(target, component) {

	    Object.defineProperty(target, component, {

	      get: function() {

	        if (this.__state.space === 'HSV')
	          return this.__state[component];

	        recalculateHSV(this);

	        return this.__state[component];

	      },

	      set: function(v) {

	        if (this.__state.space !== 'HSV') {
	          recalculateHSV(this);
	          this.__state.space = 'HSV';
	        }

	        this.__state[component] = v;

	      }

	    });

	  }

	  function recalculateRGB(color, component, componentHexIndex) {

	    if (color.__state.space === 'HEX') {

	      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

	    } else if (color.__state.space === 'HSV') {

	      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

	    } else {

	      throw 'Corrupted color state';

	    }

	  }

	  function recalculateHSV(color) {

	    var result = math.rgb_to_hsv(color.r, color.g, color.b);

	    common.extend(color.__state,
	        {
	          s: result.s,
	          v: result.v
	        }
	    );

	    if (!common.isNaN(result.h)) {
	      color.__state.h = result.h;
	    } else if (common.isUndefined(color.__state.h)) {
	      color.__state.h = 0;
	    }

	  }

	  return Color;

	})(dat.color.interpret,
	dat.color.math = (function () {

	  var tmpComponent;

	  return {

	    hsv_to_rgb: function(h, s, v) {

	      var hi = Math.floor(h / 60) % 6;

	      var f = h / 60 - Math.floor(h / 60);
	      var p = v * (1.0 - s);
	      var q = v * (1.0 - (f * s));
	      var t = v * (1.0 - ((1.0 - f) * s));
	      var c = [
	        [v, t, p],
	        [q, v, p],
	        [p, v, t],
	        [p, q, v],
	        [t, p, v],
	        [v, p, q]
	      ][hi];

	      return {
	        r: c[0] * 255,
	        g: c[1] * 255,
	        b: c[2] * 255
	      };

	    },

	    rgb_to_hsv: function(r, g, b) {

	      var min = Math.min(r, g, b),
	          max = Math.max(r, g, b),
	          delta = max - min,
	          h, s;

	      if (max != 0) {
	        s = delta / max;
	      } else {
	        return {
	          h: NaN,
	          s: 0,
	          v: 0
	        };
	      }

	      if (r == max) {
	        h = (g - b) / delta;
	      } else if (g == max) {
	        h = 2 + (b - r) / delta;
	      } else {
	        h = 4 + (r - g) / delta;
	      }
	      h /= 6;
	      if (h < 0) {
	        h += 1;
	      }

	      return {
	        h: h * 360,
	        s: s,
	        v: max / 255
	      };
	    },

	    rgb_to_hex: function(r, g, b) {
	      var hex = this.hex_with_component(0, 2, r);
	      hex = this.hex_with_component(hex, 1, g);
	      hex = this.hex_with_component(hex, 0, b);
	      return hex;
	    },

	    component_from_hex: function(hex, componentIndex) {
	      return (hex >> (componentIndex * 8)) & 0xFF;
	    },

	    hex_with_component: function(hex, componentIndex, value) {
	      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
	    }

	  }

	})(),
	dat.color.toString,
	dat.utils.common),
	dat.color.interpret,
	dat.utils.common),
	dat.utils.requestAnimationFrame = (function () {

	  /**
	   * requirejs version of Paul Irish's RequestAnimationFrame
	   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	   */

	  return window.webkitRequestAnimationFrame ||
	      window.mozRequestAnimationFrame ||
	      window.oRequestAnimationFrame ||
	      window.msRequestAnimationFrame ||
	      function(callback, element) {

	        window.setTimeout(callback, 1000 / 60);

	      };
	})(),
	dat.dom.CenteredDiv = (function (dom, common) {


	  var CenteredDiv = function() {

	    this.backgroundElement = document.createElement('div');
	    common.extend(this.backgroundElement.style, {
	      backgroundColor: 'rgba(0,0,0,0.8)',
	      top: 0,
	      left: 0,
	      display: 'none',
	      zIndex: '1000',
	      opacity: 0,
	      WebkitTransition: 'opacity 0.2s linear'
	    });

	    dom.makeFullscreen(this.backgroundElement);
	    this.backgroundElement.style.position = 'fixed';

	    this.domElement = document.createElement('div');
	    common.extend(this.domElement.style, {
	      position: 'fixed',
	      display: 'none',
	      zIndex: '1001',
	      opacity: 0,
	      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear'
	    });


	    document.body.appendChild(this.backgroundElement);
	    document.body.appendChild(this.domElement);

	    var _this = this;
	    dom.bind(this.backgroundElement, 'click', function() {
	      _this.hide();
	    });


	  };

	  CenteredDiv.prototype.show = function() {

	    var _this = this;
	    


	    this.backgroundElement.style.display = 'block';

	    this.domElement.style.display = 'block';
	    this.domElement.style.opacity = 0;
	//    this.domElement.style.top = '52%';
	    this.domElement.style.webkitTransform = 'scale(1.1)';

	    this.layout();

	    common.defer(function() {
	      _this.backgroundElement.style.opacity = 1;
	      _this.domElement.style.opacity = 1;
	      _this.domElement.style.webkitTransform = 'scale(1)';
	    });

	  };

	  CenteredDiv.prototype.hide = function() {

	    var _this = this;

	    var hide = function() {

	      _this.domElement.style.display = 'none';
	      _this.backgroundElement.style.display = 'none';

	      dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
	      dom.unbind(_this.domElement, 'transitionend', hide);
	      dom.unbind(_this.domElement, 'oTransitionEnd', hide);

	    };

	    dom.bind(this.domElement, 'webkitTransitionEnd', hide);
	    dom.bind(this.domElement, 'transitionend', hide);
	    dom.bind(this.domElement, 'oTransitionEnd', hide);

	    this.backgroundElement.style.opacity = 0;
	//    this.domElement.style.top = '48%';
	    this.domElement.style.opacity = 0;
	    this.domElement.style.webkitTransform = 'scale(1.1)';

	  };

	  CenteredDiv.prototype.layout = function() {
	    this.domElement.style.left = window.innerWidth/2 - dom.getWidth(this.domElement) / 2 + 'px';
	    this.domElement.style.top = window.innerHeight/2 - dom.getHeight(this.domElement) / 2 + 'px';
	  };
	  
	  function lockScroll(e) {
	    console.log(e);
	  }

	  return CenteredDiv;

	})(dat.dom.dom,
	dat.utils.common),
	dat.dom.dom,
	dat.utils.common);

/***/ },
/* 133 */
/***/ function(module, exports) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	/** @namespace */
	var dat = module.exports = dat || {};

	/** @namespace */
	dat.color = dat.color || {};

	/** @namespace */
	dat.utils = dat.utils || {};

	dat.utils.common = (function () {
	  
	  var ARR_EACH = Array.prototype.forEach;
	  var ARR_SLICE = Array.prototype.slice;

	  /**
	   * Band-aid methods for things that should be a lot easier in JavaScript.
	   * Implementation and structure inspired by underscore.js
	   * http://documentcloud.github.com/underscore/
	   */

	  return { 
	    
	    BREAK: {},
	  
	    extend: function(target) {
	      
	      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
	        
	        for (var key in obj)
	          if (!this.isUndefined(obj[key])) 
	            target[key] = obj[key];
	        
	      }, this);
	      
	      return target;
	      
	    },
	    
	    defaults: function(target) {
	      
	      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
	        
	        for (var key in obj)
	          if (this.isUndefined(target[key])) 
	            target[key] = obj[key];
	        
	      }, this);
	      
	      return target;
	    
	    },
	    
	    compose: function() {
	      var toCall = ARR_SLICE.call(arguments);
	            return function() {
	              var args = ARR_SLICE.call(arguments);
	              for (var i = toCall.length -1; i >= 0; i--) {
	                args = [toCall[i].apply(this, args)];
	              }
	              return args[0];
	            }
	    },
	    
	    each: function(obj, itr, scope) {

	      
	      if (ARR_EACH && obj.forEach === ARR_EACH) { 
	        
	        obj.forEach(itr, scope);
	        
	      } else if (obj.length === obj.length + 0) { // Is number but not NaN
	        
	        for (var key = 0, l = obj.length; key < l; key++)
	          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
	            return;
	            
	      } else {

	        for (var key in obj) 
	          if (itr.call(scope, obj[key], key) === this.BREAK)
	            return;
	            
	      }
	            
	    },
	    
	    defer: function(fnc) {
	      setTimeout(fnc, 0);
	    },
	    
	    toArray: function(obj) {
	      if (obj.toArray) return obj.toArray();
	      return ARR_SLICE.call(obj);
	    },

	    isUndefined: function(obj) {
	      return obj === undefined;
	    },
	    
	    isNull: function(obj) {
	      return obj === null;
	    },
	    
	    isNaN: function(obj) {
	      return obj !== obj;
	    },
	    
	    isArray: Array.isArray || function(obj) {
	      return obj.constructor === Array;
	    },
	    
	    isObject: function(obj) {
	      return obj === Object(obj);
	    },
	    
	    isNumber: function(obj) {
	      return obj === obj+0;
	    },
	    
	    isString: function(obj) {
	      return obj === obj+'';
	    },
	    
	    isBoolean: function(obj) {
	      return obj === false || obj === true;
	    },
	    
	    isFunction: function(obj) {
	      return Object.prototype.toString.call(obj) === '[object Function]';
	    }
	  
	  };
	    
	})();


	dat.color.toString = (function (common) {

	  return function(color) {

	    if (color.a == 1 || common.isUndefined(color.a)) {

	      var s = color.hex.toString(16);
	      while (s.length < 6) {
	        s = '0' + s;
	      }

	      return '#' + s;

	    } else {

	      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

	    }

	  }

	})(dat.utils.common);


	dat.Color = dat.color.Color = (function (interpret, math, toString, common) {

	  var Color = function() {

	    this.__state = interpret.apply(this, arguments);

	    if (this.__state === false) {
	      throw 'Failed to interpret color arguments';
	    }

	    this.__state.a = this.__state.a || 1;


	  };

	  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

	  common.extend(Color.prototype, {

	    toString: function() {
	      return toString(this);
	    },

	    toOriginal: function() {
	      return this.__state.conversion.write(this);
	    }

	  });

	  defineRGBComponent(Color.prototype, 'r', 2);
	  defineRGBComponent(Color.prototype, 'g', 1);
	  defineRGBComponent(Color.prototype, 'b', 0);

	  defineHSVComponent(Color.prototype, 'h');
	  defineHSVComponent(Color.prototype, 's');
	  defineHSVComponent(Color.prototype, 'v');

	  Object.defineProperty(Color.prototype, 'a', {

	    get: function() {
	      return this.__state.a;
	    },

	    set: function(v) {
	      this.__state.a = v;
	    }

	  });

	  Object.defineProperty(Color.prototype, 'hex', {

	    get: function() {

	      if (!this.__state.space !== 'HEX') {
	        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
	      }

	      return this.__state.hex;

	    },

	    set: function(v) {

	      this.__state.space = 'HEX';
	      this.__state.hex = v;

	    }

	  });

	  function defineRGBComponent(target, component, componentHexIndex) {

	    Object.defineProperty(target, component, {

	      get: function() {

	        if (this.__state.space === 'RGB') {
	          return this.__state[component];
	        }

	        recalculateRGB(this, component, componentHexIndex);

	        return this.__state[component];

	      },

	      set: function(v) {

	        if (this.__state.space !== 'RGB') {
	          recalculateRGB(this, component, componentHexIndex);
	          this.__state.space = 'RGB';
	        }

	        this.__state[component] = v;

	      }

	    });

	  }

	  function defineHSVComponent(target, component) {

	    Object.defineProperty(target, component, {

	      get: function() {

	        if (this.__state.space === 'HSV')
	          return this.__state[component];

	        recalculateHSV(this);

	        return this.__state[component];

	      },

	      set: function(v) {

	        if (this.__state.space !== 'HSV') {
	          recalculateHSV(this);
	          this.__state.space = 'HSV';
	        }

	        this.__state[component] = v;

	      }

	    });

	  }

	  function recalculateRGB(color, component, componentHexIndex) {

	    if (color.__state.space === 'HEX') {

	      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

	    } else if (color.__state.space === 'HSV') {

	      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

	    } else {

	      throw 'Corrupted color state';

	    }

	  }

	  function recalculateHSV(color) {

	    var result = math.rgb_to_hsv(color.r, color.g, color.b);

	    common.extend(color.__state,
	        {
	          s: result.s,
	          v: result.v
	        }
	    );

	    if (!common.isNaN(result.h)) {
	      color.__state.h = result.h;
	    } else if (common.isUndefined(color.__state.h)) {
	      color.__state.h = 0;
	    }

	  }

	  return Color;

	})(dat.color.interpret = (function (toString, common) {

	  var result, toReturn;

	  var interpret = function() {

	    toReturn = false;

	    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

	    common.each(INTERPRETATIONS, function(family) {

	      if (family.litmus(original)) {

	        common.each(family.conversions, function(conversion, conversionName) {

	          result = conversion.read(original);

	          if (toReturn === false && result !== false) {
	            toReturn = result;
	            result.conversionName = conversionName;
	            result.conversion = conversion;
	            return common.BREAK;

	          }

	        });

	        return common.BREAK;

	      }

	    });

	    return toReturn;

	  };

	  var INTERPRETATIONS = [

	    // Strings
	    {

	      litmus: common.isString,

	      conversions: {

	        THREE_CHAR_HEX: {

	          read: function(original) {

	            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
	            if (test === null) return false;

	            return {
	              space: 'HEX',
	              hex: parseInt(
	                  '0x' +
	                      test[1].toString() + test[1].toString() +
	                      test[2].toString() + test[2].toString() +
	                      test[3].toString() + test[3].toString())
	            };

	          },

	          write: toString

	        },

	        SIX_CHAR_HEX: {

	          read: function(original) {

	            var test = original.match(/^#([A-F0-9]{6})$/i);
	            if (test === null) return false;

	            return {
	              space: 'HEX',
	              hex: parseInt('0x' + test[1].toString())
	            };

	          },

	          write: toString

	        },

	        CSS_RGB: {

	          read: function(original) {

	            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	            if (test === null) return false;

	            return {
	              space: 'RGB',
	              r: parseFloat(test[1]),
	              g: parseFloat(test[2]),
	              b: parseFloat(test[3])
	            };

	          },

	          write: toString

	        },

	        CSS_RGBA: {

	          read: function(original) {

	            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
	            if (test === null) return false;

	            return {
	              space: 'RGB',
	              r: parseFloat(test[1]),
	              g: parseFloat(test[2]),
	              b: parseFloat(test[3]),
	              a: parseFloat(test[4])
	            };

	          },

	          write: toString

	        }

	      }

	    },

	    // Numbers
	    {

	      litmus: common.isNumber,

	      conversions: {

	        HEX: {
	          read: function(original) {
	            return {
	              space: 'HEX',
	              hex: original,
	              conversionName: 'HEX'
	            }
	          },

	          write: function(color) {
	            return color.hex;
	          }
	        }

	      }

	    },

	    // Arrays
	    {

	      litmus: common.isArray,

	      conversions: {

	        RGB_ARRAY: {
	          read: function(original) {
	            if (original.length != 3) return false;
	            return {
	              space: 'RGB',
	              r: original[0],
	              g: original[1],
	              b: original[2]
	            };
	          },

	          write: function(color) {
	            return [color.r, color.g, color.b];
	          }

	        },

	        RGBA_ARRAY: {
	          read: function(original) {
	            if (original.length != 4) return false;
	            return {
	              space: 'RGB',
	              r: original[0],
	              g: original[1],
	              b: original[2],
	              a: original[3]
	            };
	          },

	          write: function(color) {
	            return [color.r, color.g, color.b, color.a];
	          }

	        }

	      }

	    },

	    // Objects
	    {

	      litmus: common.isObject,

	      conversions: {

	        RGBA_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.r) &&
	                common.isNumber(original.g) &&
	                common.isNumber(original.b) &&
	                common.isNumber(original.a)) {
	              return {
	                space: 'RGB',
	                r: original.r,
	                g: original.g,
	                b: original.b,
	                a: original.a
	              }
	            }
	            return false;
	          },

	          write: function(color) {
	            return {
	              r: color.r,
	              g: color.g,
	              b: color.b,
	              a: color.a
	            }
	          }
	        },

	        RGB_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.r) &&
	                common.isNumber(original.g) &&
	                common.isNumber(original.b)) {
	              return {
	                space: 'RGB',
	                r: original.r,
	                g: original.g,
	                b: original.b
	              }
	            }
	            return false;
	          },

	          write: function(color) {
	            return {
	              r: color.r,
	              g: color.g,
	              b: color.b
	            }
	          }
	        },

	        HSVA_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.h) &&
	                common.isNumber(original.s) &&
	                common.isNumber(original.v) &&
	                common.isNumber(original.a)) {
	              return {
	                space: 'HSV',
	                h: original.h,
	                s: original.s,
	                v: original.v,
	                a: original.a
	              }
	            }
	            return false;
	          },

	          write: function(color) {
	            return {
	              h: color.h,
	              s: color.s,
	              v: color.v,
	              a: color.a
	            }
	          }
	        },

	        HSV_OBJ: {
	          read: function(original) {
	            if (common.isNumber(original.h) &&
	                common.isNumber(original.s) &&
	                common.isNumber(original.v)) {
	              return {
	                space: 'HSV',
	                h: original.h,
	                s: original.s,
	                v: original.v
	              }
	            }
	            return false;
	          },

	          write: function(color) {
	            return {
	              h: color.h,
	              s: color.s,
	              v: color.v
	            }
	          }

	        }

	      }

	    }


	  ];

	  return interpret;


	})(dat.color.toString,
	dat.utils.common),
	dat.color.math = (function () {

	  var tmpComponent;

	  return {

	    hsv_to_rgb: function(h, s, v) {

	      var hi = Math.floor(h / 60) % 6;

	      var f = h / 60 - Math.floor(h / 60);
	      var p = v * (1.0 - s);
	      var q = v * (1.0 - (f * s));
	      var t = v * (1.0 - ((1.0 - f) * s));
	      var c = [
	        [v, t, p],
	        [q, v, p],
	        [p, v, t],
	        [p, q, v],
	        [t, p, v],
	        [v, p, q]
	      ][hi];

	      return {
	        r: c[0] * 255,
	        g: c[1] * 255,
	        b: c[2] * 255
	      };

	    },

	    rgb_to_hsv: function(r, g, b) {

	      var min = Math.min(r, g, b),
	          max = Math.max(r, g, b),
	          delta = max - min,
	          h, s;

	      if (max != 0) {
	        s = delta / max;
	      } else {
	        return {
	          h: NaN,
	          s: 0,
	          v: 0
	        };
	      }

	      if (r == max) {
	        h = (g - b) / delta;
	      } else if (g == max) {
	        h = 2 + (b - r) / delta;
	      } else {
	        h = 4 + (r - g) / delta;
	      }
	      h /= 6;
	      if (h < 0) {
	        h += 1;
	      }

	      return {
	        h: h * 360,
	        s: s,
	        v: max / 255
	      };
	    },

	    rgb_to_hex: function(r, g, b) {
	      var hex = this.hex_with_component(0, 2, r);
	      hex = this.hex_with_component(hex, 1, g);
	      hex = this.hex_with_component(hex, 0, b);
	      return hex;
	    },

	    component_from_hex: function(hex, componentIndex) {
	      return (hex >> (componentIndex * 8)) & 0xFF;
	    },

	    hex_with_component: function(hex, componentIndex, value) {
	      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
	    }

	  }

	})(),
	dat.color.toString,
	dat.utils.common);

/***/ }
/******/ ]);