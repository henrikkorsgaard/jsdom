"use strict";

class MutationRecordImpl {
  constructor( args, privateData ) {

    this.type = args[ 0 ];
    this.target = args[ 1 ];
    this.addedNodes = args[ 2 ];
    this.removedNodes = args[ 3 ];
    this.previousSibling = args[ 4 ];
    this.nextSibling = args[ 5 ];
    this.attributeName = args[ 6 ] === "null" ? null : args[ 6 ];
    this.attributeNamespace = args[ 7 ] === "null" ? null : args[ 7 ];
    this.oldValue = args[ 8 ] === "null" ? null : args[ 8 ];; //attributeName didn't match expected (object) null but got (string) "null"

  }
}

module.exports = {
  implementation: MutationRecordImpl
};
