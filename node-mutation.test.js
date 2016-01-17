"use strict";

const jsdom = require("./lib/jsdom.js").jsdom;

exports["change attributes"] = t => {
  const window = jsdom("<html><body><div id='mutation' test='henrik'></div></body></html>").defaultView;
  let test = window.document.getElementById('mutation');
  let observer = new window.MutationObserver(function(mutations){

      for(var i = 0 ; i < mutations.length; i++){
        console.log(mutations[i].attributeNamespace);
        t.equal(mutations[i].type, 'attributes');
        t.equal(mutations[i].attributeName, 'test');
      }
      //console.log(mutations[]);
      t.done();
  });

  let options = {
    childList:true,
    attributes:true,
    characterData: false,
    subtree:false,
    attributeOldValue: false,
    characterDataOldValue: false
  }
  observer.observe(test, options);
  test.setAttribute('test', "mutation");

  //console.log(window.MutationObserver);


  /*
  add

  */
};
