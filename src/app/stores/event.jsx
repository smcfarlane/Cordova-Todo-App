

var storeUpdateEvent = function(name, details){
  return new CustomEvent(
  	name,
  	{
  		detail: details,
  		bubbles: true,
  		cancelable: true
  	}
  );
};

module.exports = storeUpdateEvent;
