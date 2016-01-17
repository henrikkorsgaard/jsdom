"use strict";

const idlUtils = require("../generated/utils");
const NodeImpl = require("./Node-impl").implementation;
const NonDocumentTypeChildNode = require("./NonDocumentTypeChildNode-impl").implementation;

const DOMException = require("../../web-idl/DOMException");
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const MutationRecord = require("../generated/MutationRecord").interface;

class CharacterDataImpl extends NodeImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._data = privateData.data;
  }

  get data() {
    return this._data;
  }
  set data(data) {
    this._setData(data);
  }

  get length() {
    return this._data.length;
  }

  substringData(offset, count) {
    const length = this.length;

    if (offset > length) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
    }

    if (offset + count > length) {
      return this._data.substring(offset);
    }

    return this._data.substring(offset, offset + count);
  }

  appendData(data) {
    this.replaceData(this.length, 0, data);
  }

  insertData(offset, data) {
    this.replaceData(offset, 0, data);
  }

  deleteData(offset, count) {
    this.replaceData(offset, count, "");
  }

  replaceData(offset, count, data) {
    const length = this.length;

    if (offset > length) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
    }

    if (offset + count > length) {
      count = length - offset;
    }

    const start = this._data.substring(0, offset);
    const end = this._data.substring(offset + count);

    this._setData(start + data + end);

    // TODO: range stuff
  }

  _setData(newData) {
    // TODO: remove this once we no longer rely on mutation events internally, since they are nonstandard
    for(let i in this._mutationObserverRegistry){
      let mutationOptions = this._mutationObserverRegistry[i]._options;
      if(mutationOptions.characterData || mutationOptions.characterDataOldValue){
        let oldValueForMutationRecord = null;
        if(mutationOptions.characterDataOldValue){
            oldValueForMutationRecord = this._data;
        }

        const mutationRecord = new MutationRecord("characterData", this, [], [], null, null, null, null, oldValueForMutationRecord);
          this._mutationObserverRegistry[i]._enqueueMutationRecord(mutationRecord);
      }
    }

    const oldData = this._data;
    this._data = newData;

    if (this._ownerDocument &&
        domSymbolTree.parent(this) &&
        this._ownerDocument.implementation._hasFeature("MutationEvents")) {
      const ev = this._ownerDocument.createEvent("MutationEvents");
      ev.initMutationEvent("DOMCharacterDataModified", true, false, this, oldData, newData, null, null);
      this.dispatchEvent(ev);
    }
  }
}

idlUtils.mixin(CharacterDataImpl.prototype, NonDocumentTypeChildNode.prototype);

module.exports = {
  implementation: CharacterDataImpl
};
