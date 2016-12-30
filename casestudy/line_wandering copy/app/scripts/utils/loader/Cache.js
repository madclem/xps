class Cache {
  constructor(){
    this._json = {}
    this._text = {};
  }

  addJson(json, id) {
    // body...
    this._json[id] = json;
  }

  addText(text, id) {
    this._text[id] = text;
  }

  get(id) {
    return this.getJson(id) || this.getText(id);
  }

  getJson(id) {
    if (this._json[id]) {
        return this._json[id];
    }
    else {
        console.warn('Fido.Cache.getJson: "' + id + '" not found in Cache');
        return null;
    }
  }

  getText(id) {
    if (this._text[id]) {
        return this._text[id];
    }
    else {
        console.warn('Fido.Cache.getText: "' + id + '" not found in Cache');
    }
  }
}

export default Cache;
