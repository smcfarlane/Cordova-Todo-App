var Todos = require('./../stores/todo_store.jsx');


var actions = {};

actions.addTodo = function(e){
  e.preventDefault();
  var input = e.target.getElementsByTagName('input')[0];
  var newTodo = input.value;
  input.value = '';
  Todos.addTodoToStore(newTodo);
  location.assign(location.pathname + "#/");
  console.log("action 'addTodo' fired");
};

actions.deleteTodo = function(e){
  console.log(e);
  var parent = e.target.parentElement;
  console.log(parent);
  var swipe = parent.getElementsByClassName('swipe-left-100')[0];
  swipe.className = swipe.className.replace(" swipe-left-100", '');
  Todos.deleteTodoOnStorage(e.target.getAttribute('data-todo-id'));
  console.log("action 'deleteTodo' fired");
}

module.exports = actions;
