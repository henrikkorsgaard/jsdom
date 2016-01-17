'use strict';
const idlUtils = require("../generated/utils");

class MutationObserverImpl {

  constructor( args, privateData ) {
      //console.log(privateData);
      this._callback = args[0];
      this._mutationRecords = [];
      this._mutationObserverQueuedFlag = false;
      this._options;

      this._enqueueMutationRecord = function(mutationRecord){
        //console.log("mutationRecord");
        //console.log(mutationRecord); //I have no idea how/why this works!!
        //console.log("mutationRecord");
        this._mutationRecords.push(mutationRecord);
        if(this._mutationObserverQueuedFlag){
            return;
        }
        this._mutationObserverQueuedFlag = true;
        let self = this;
        process.nextTick(function(){
            self._callback(self._mutationRecords);
            self._mutationObserverQueuedFlag = false;
        });
      }
  }

  observe( node, options ) {
    this._options = options;    
    node._registerMutationObserver(this);
  }
}

module.exports = {
  implementation: MutationObserverImpl
};


//https://github.com/WebKit/webkit/blob/master/Source/WebCore/dom/MutationObserver.cpp
//https://github.com/WebKit/webkit/blob/master/Source/WebCore/dom/Node.cpp


/*
attribute mutations



*/
