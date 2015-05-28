var store = require('./store.jsx');
var storeUpdateEvent = require('./event.jsx');

var todo = {
  done: false,
  text: ''
}

var Todos = Object.create(store);
Todos.data.todos = [];

Todos.event = storeUpdateEvent('todosStoreUpdate', {});

Todos.updated = function(){
  document.dispatchEvent(this.event);
  console.log("event fired")
};

Todos.addTodoToStore = function(text) {
  var t = Object.create(todo);
  t.text = text;
  t.done = false;
  console.log(this.data);
  this.data.todos.push(t);
  this.storeTodos();
  this.updated();
};

Todos.deleteTodoOnStorage = function(i){
  this.data.todos.splice(i, 1);
  this.storeTodos();
  this.updated();
};

Todos.storeTodos = function(){
  localStorage.setItem('todosStorage', JSON.stringify(this.data));
};

Todos.getTodosFromStorage = function(){
  var storage = localStorage.getItem('todosStorage')
  if (storage !== null) {
    var data = JSON.parse(storage)
    this.data.todos = data.todos;
  }
  this.updated();
};

module.exports = Todos;
