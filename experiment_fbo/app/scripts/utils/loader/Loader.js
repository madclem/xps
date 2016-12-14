// Real author of this is Mat Groves <3

import mcgl from 'mcgl';
import Signal from 'signals';
import path from 'path';
import Cache from './Cache';
import ResourceLoader from 'resource-loader';
import FontFaceObserver from 'fontfaceobserver';


class Loader {

    constructor(){
      this.crossdomain = false;

      this.assetsToLoad = [];
      if(window.XDomainRequest && this.crossdomain)
      {
          this.ajaxRequest = new window.XDomainRequest();
          this.ajaxRequest.timeout = 3000;

          this.ajaxRequest.onerror = function(){};

          this.ajaxRequest.ontimeout = function(){};

          this.ajaxRequest.onprogress = function(){};

      }
      else if (window.XMLHttpRequest)
      {
          this.ajaxRequest = new window.XMLHttpRequest();
      }

      this.ajaxRequest.onload = this._onFileLoaded.bind(this)
      this.ajaxRequest.onreadystatechange = function(e){}

      this.fileCount = 0;
      this.filesToLoad = [];

      this.fontsToLoad = [];
      // this.pixiAssetsToLoad = [];
      this.soundsToLoad = [];
      this.customToLoad = [];

      this.onComplete = new Signal();
      this.onProgress = new Signal();
    }

    addFonts(fonts) {
        this.fontsToLoad = this.fontsToLoad.concat(fonts);
        return this;
    }

    addJson(url, id) {
        var id = id || path.basename(url, path.extname(url));

        var fileData = {url:url, id:id, type:Loader.JSON};

        this.filesToLoad.push(fileData);
        return this;
    }

    addAssets = function(assets)
    {
        this.assetsToLoad = this.assetsToLoad.concat(assets);
        return this;
    }

    addCSS(url) {
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = url;
      document.getElementsByTagName("head")[0].appendChild(link);

      return this;
    }

    load() {
      this._loadFonts();

    }

    _loadFiles() {
      this.fileCount = 0;

      if(this.filesToLoad.length) {
          this._loadNextFile();
      }
      else {
          this._loadAssets();
      }
    }

    _loadNextFile() {
      var fileData = this.filesToLoad[this.fileCount];

      if(fileData.type === Loader.CUSTOM)
      {
          fileData.object.onLoaded.addOnce(this._onFileLoaded, this);
          fileData.object.load();
      }
      else
      {
          this.ajaxRequest.open('GET',fileData.url,true);
          this.ajaxRequest.send();
      }
    }

    _onFileLoaded() {
        var fileData = this.filesToLoad[this.fileCount];

        if(fileData.type === Loader.CUSTOM)
        {
            // done!
        }
        else
        {
            if(this.ajaxRequest.status === 0 || this.ajaxRequest.status === 200)
            {
                switch(fileData.type)
                {
                    case Loader.TEXT:

                        var text = this.ajaxRequest.responseText;
                        Cache.addText( text, fileData.id );

                    break;

                    case Loader.JSON:

                   //     console.log(this.ajaxRequest.responseText);
                        var jsonObject = JSON.parse( this.ajaxRequest.responseText );
                        Cache.addJson( jsonObject, fileData.id );

                    break;
                }
            }
            else
            {
                console.warn("Loader: " + fileData.url + " not found")
            }
        }

        this.fileCount++;
        this._onProgress();

        if(this.fileCount === this.filesToLoad.length) {
            // complete!
            this._loadAssets();
        }
        else
        {
            this._loadNextFile();
        }
    }

    _getFonts(fonts) {
      var a = [];
      for (var i = 0; i < fonts.length; i++) {
        a.push(fonts[i].load());
      }

      return a;
    }

    _loadFonts() {
        if(this.fontsToLoad.length === 0) {
          this._loadFiles();
          return;
        }

        var fonts = [];
        for (var i = 0; i < this.fontsToLoad.length; i++) {
          var f = new FontFaceObserver(this.fontsToLoad[i])
          fonts.push(f);
        }

        Promise.all(this._getFonts(fonts)).then((fonts)=> {
          // console.log('Fonts have loaded');
          this._loadFiles();
        }, ()=>{
          // console.log('Issue while loading the fonts');
          this._loadFiles();
        });
    }

    _loadAssets = function()
    {
        if(this.assetsToLoad.length === 0)
        {
            this._onComplete();
            return;
        }

        console.log("here", this.assetsToLoad);
        //this.assetLoader = new PIXI.loaders.Loader();
        this.assetLoader = new ResourceLoader();
        this.assetLoader.add(this.assetsToLoad);
 //       this.assetLoader.onComplete = this._onComplete.bind(this);
   //     this.assetLoader.onProgress = this._onProgress.bind(this);
   //
        this.assetLoader.on('progress', this._onProgress, this)

        this.assetLoader.load( this._onComplete.bind(this) );
    }

    _onComplete(l, r) {
        mcgl.loadedResources = r;
        this.onProgress.dispatch(1);
        this.onComplete.dispatch();
    }

    _onProgress() {
        var total =  this.filesToLoad.length + this.assetsToLoad.length;
        var loaded = this.fileCount;
        // we want a value betwen 0 and 1

        if(this.assetLoader)
        {
            // the new pixi loader gives us a progress
            // property which is a percentage (between 0 and 100)
            loaded = this.assetLoader.progress;
        }

        this.onProgress.dispatch(loaded * 0.01);
    }


}


// some constants..
Loader.TEXT = 0;
Loader.JSON = 1;
Loader.CUSTOM = 2;

export default Loader;
