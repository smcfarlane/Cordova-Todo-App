var storeUpdateEvent = require('./event.jsx');


var store = {
  data: {},
  getAllData: function(){
    return this.data;
  },
  updated: function(){
    document.dispatchEvent(storeUpdateEvent);
  }
};

module.exports = store;
