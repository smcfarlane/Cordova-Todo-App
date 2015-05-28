(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Header = require('./components/header.jsx');
var Todos = require('./components/todos.jsx');
var NewTodo = require('./components/new_todo.jsx');
var Router = window.ReactRouter;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var TransitionGroup = React.addons.CSSTransitionGroup;

var App = React.createClass({
  displayName: 'App',

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },
  render: function render() {
    var name = this.context.router.getCurrentPath();
    return React.createElement(
      'div',
      null,
      React.createElement(Header, null),
      React.createElement(
        TransitionGroup,
        { className: 'flex-100', component: 'div', transitionName: 'view' },
        React.createElement(RouteHandler, { key: name })
      )
    );
  }
});

var routes = React.createElement(
  Route,
  { handler: App },
  React.createElement(Route, { name: 'index', path: '/', handler: Todos }),
  React.createElement(Route, { name: 'newtodo', path: '/newtodo', handler: NewTodo })
);

Router.run(routes, Router.HashLocation, function (Root) {
  React.render(React.createElement(Root, null), document.getElementById('app'));
});

document.addEventListener('deviceready', function () {
  if (navigator.notification) {
    // Override default HTML alert with native dialog
    window.alert = function (message) {
      navigator.notification.alert(message, // message
      null, // callback
      'Todos', // title
      'OK' // buttonName
      );
    };
  }
}, false);

},{"./components/header.jsx":3,"./components/new_todo.jsx":4,"./components/todos.jsx":5}],2:[function(require,module,exports){
'use strict';

var Todos = require('./../stores/todo_store.jsx');

var actions = {};

actions.addTodo = function (e) {
  e.preventDefault();
  var input = e.target.getElementsByTagName('input')[0];
  var newTodo = input.value;
  input.value = '';
  Todos.addTodoToStore(newTodo);
  location.assign(location.pathname + '#/');
  console.log('action \'addTodo\' fired');
};

actions.deleteTodo = function (e) {
  console.log(e);
  var parent = e.target.parentElement;
  console.log(parent);
  var swipe = parent.getElementsByClassName('swipe-left-100')[0];
  swipe.className = swipe.className.replace(' swipe-left-100', '');
  Todos.deleteTodoOnStorage(e.target.getAttribute('data-todo-id'));
  console.log('action \'deleteTodo\' fired');
};

module.exports = actions;

},{"./../stores/todo_store.jsx":8}],3:[function(require,module,exports){
'use strict';

var Router = window.ReactRouter;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Header = React.createClass({
  displayName: 'Header',

  render: function render() {
    var s1 = {
      paddingTop: '20px',
      height: '64px'
    };
    if (window.location.hash.substr(1) !== '/') {
      return React.createElement(
        'header',
        { className: 'bar bar-nav', style: s1 },
        React.createElement(
          Link,
          { className: 'btn btn-link btn-nav pull-left', to: '/' },
          React.createElement('span', { className: 'icon icon-left-nav' }),
          'Back'
        ),
        React.createElement(
          'button',
          { className: 'btn pull-right' },
          React.createElement(
            Link,
            { className: 'header-btn', to: 'newtodo' },
            'New Todo'
          )
        ),
        React.createElement(Title, { classes: 'title', text: 'Todo App' })
      );
    }
    return React.createElement(
      'div',
      null,
      React.createElement(
        'header',
        { className: 'bar bar-nav', style: s1 },
        React.createElement(
          'button',
          { className: 'btn pull-right' },
          React.createElement(
            Link,
            { className: 'header-btn', to: 'newtodo' },
            'New Todo'
          )
        ),
        React.createElement(Title, { classes: 'title', text: 'Todo App' })
      )
    );
  }
});

var Title = React.createClass({
  displayName: 'Title',

  render: function render() {
    return React.createElement(
      'h1',
      { className: this.props.classes },
      this.props.text
    );
  }
});

var HeaderBtn = React.createClass({
  displayName: 'HeaderBtn',

  render: function render() {
    return React.createElement(
      'button',
      { className: this.props.classes },
      React.createElement(
        Link,
        { to: 'newTodo' },
        this.props.text
      )
    );
  }
});

module.exports = Header;

},{}],4:[function(require,module,exports){
'use strict';

var actions = require('./../actions/todo_actions.jsx');

var NewTodo = React.createClass({
  displayName: 'NewTodo',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'flex-100' },
      React.createElement(TodoForm, null)
    );
  }
});

var TodoForm = React.createClass({
  displayName: 'TodoForm',

  render: function render() {
    var s = { marginTop: '40px' };
    return React.createElement(
      'div',
      { className: 'flex-75 center top-40', style: s },
      React.createElement(
        'form',
        { onSubmit: actions.addTodo },
        React.createElement(
          'label',
          { className: 'center' },
          'New Todo'
        ),
        React.createElement('input', { type: 'text', placeholder: 'New Todo Here :)' }),
        React.createElement(
          'button',
          { className: 'btn btn-primary' },
          'Add Todo'
        )
      )
    );
  }
});

module.exports = NewTodo;

},{"./../actions/todo_actions.jsx":2}],5:[function(require,module,exports){
'use strict';

var actions = require('./../actions/todo_actions.jsx');
var todosStore = require('./../stores/todo_store.jsx');

var Todos = React.createClass({
  displayName: 'Todos',

  getInitialState: function getInitialState() {
    return { todos: [] };
  },
  componentDidMount: function componentDidMount() {
    document.addEventListener('todosStoreUpdate', this.todosStoreUpdated);
    todosStore.getTodosFromStorage();
  },
  todosStoreUpdated: function todosStoreUpdated() {
    this.setState({ todos: todosStore.data.todos });
    console.log('updated todos component state');
  },
  render: function render() {
    console.log(this.state.todos);
    return React.createElement(
      'div',
      { className: 'flex-100 view' },
      React.createElement(TodoList, { todos: this.state.todos })
    );
  }
});

var TodoList = React.createClass({
  displayName: 'TodoList',

  render: function render() {
    var todos = [];
    this.props.todos.forEach(function (todo, index) {
      todos.push(React.createElement(Todo, { key: index, todoId: index, todo: todo.text }));
    });
    return React.createElement(
      'ul',
      { className: 'table-view flex-100' },
      todos
    );
  }
});

var Todo = React.createClass({
  displayName: 'Todo',

  render: function render() {
    var todo = this.props.todo;
    return React.createElement(
      'li',
      { className: 'table-view-cell li-fix' },
      React.createElement(
        SwipeDiv,
        null,
        React.createElement('span', { className: 'icon icon-check' }),
        this.props.todo
      ),
      React.createElement(Delete, { todoId: this.props.todoId })
    );
  }
});

var Delete = React.createClass({
  displayName: 'Delete',

  componentDidMount: function componentDidMount() {
    var node = this.getDOMNode();
    this.hammer = new Hammer(node);
    this.hammer.on('tap', function (e) {
      actions.deleteTodo(e);
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'delete', 'data-todo-id': this.props.todoId },
      React.createElement(
        'p',
        null,
        'Delete'
      )
    );
  }
});

var SwipeDiv = React.createClass({
  displayName: 'SwipeDiv',

  componentDidMount: function componentDidMount() {
    var node = this.getDOMNode();
    this.hammer = new Hammer(node);
    this.hammer.on('panleft', function () {
      if (node.className.indexOf('-100') === -1) {
        if (node.className.indexOf('reset') !== -1) {
          node.className = node.className.replace(' swipe-left-reset', '');
        }
        node.className = node.className + ' swipe-left-100';
      }
    });
    this.hammer.on('panright', function () {
      if (node.className.indexOf('-100') !== -1) {
        node.className = node.className.replace(' swipe-left-100', '');
        if (node.className.indexOf('-reset') === -1) {
          node.className = node.className + ' swipe-left-reset';
        }
      }
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'swipe-left' },
      this.props.children
    );
  }
});

module.exports = Todos;

},{"./../actions/todo_actions.jsx":2,"./../stores/todo_store.jsx":8}],6:[function(require,module,exports){
"use strict";

var storeUpdateEvent = function storeUpdateEvent(name, details) {
  return new CustomEvent(name, {
    detail: details,
    bubbles: true,
    cancelable: true
  });
};

module.exports = storeUpdateEvent;

},{}],7:[function(require,module,exports){
'use strict';

var storeUpdateEvent = require('./event.jsx');

var store = {
  data: {},
  getAllData: function getAllData() {
    return this.data;
  },
  updated: function updated() {
    document.dispatchEvent(storeUpdateEvent);
  }
};

module.exports = store;

},{"./event.jsx":6}],8:[function(require,module,exports){
'use strict';

var store = require('./store.jsx');
var storeUpdateEvent = require('./event.jsx');

var todo = {
  done: false,
  text: ''
};

var Todos = Object.create(store);
Todos.data.todos = [];

Todos.event = storeUpdateEvent('todosStoreUpdate', {});

Todos.updated = function () {
  document.dispatchEvent(this.event);
  console.log('event fired');
};

Todos.addTodoToStore = function (text) {
  var t = Object.create(todo);
  t.text = text;
  t.done = false;
  console.log(this.data);
  this.data.todos.push(t);
  this.storeTodos();
  this.updated();
};

Todos.deleteTodoOnStorage = function (i) {
  this.data.todos.splice(i, 1);
  this.storeTodos();
  this.updated();
};

Todos.storeTodos = function () {
  localStorage.setItem('todosStorage', JSON.stringify(this.data));
};

Todos.getTodosFromStorage = function () {
  var storage = localStorage.getItem('todosStorage');
  if (storage !== null) {
    var data = JSON.parse(storage);
    this.data.todos = data.todos;
  }
  this.updated();
};

module.exports = Todos;

},{"./event.jsx":6,"./store.jsx":7}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RldmVubWNmYXJsYW5lL1JlcG9zL2d1bHAtdGVzdC9zcmMvYXBwL2FwcC5qc3giLCIvVXNlcnMvc3RldmVubWNmYXJsYW5lL1JlcG9zL2d1bHAtdGVzdC9zcmMvYXBwL2FjdGlvbnMvdG9kb19hY3Rpb25zLmpzeCIsIi9Vc2Vycy9zdGV2ZW5tY2ZhcmxhbmUvUmVwb3MvZ3VscC10ZXN0L3NyYy9hcHAvY29tcG9uZW50cy9oZWFkZXIuanN4IiwiL1VzZXJzL3N0ZXZlbm1jZmFybGFuZS9SZXBvcy9ndWxwLXRlc3Qvc3JjL2FwcC9jb21wb25lbnRzL25ld190b2RvLmpzeCIsIi9Vc2Vycy9zdGV2ZW5tY2ZhcmxhbmUvUmVwb3MvZ3VscC10ZXN0L3NyYy9hcHAvY29tcG9uZW50cy90b2Rvcy5qc3giLCIvVXNlcnMvc3RldmVubWNmYXJsYW5lL1JlcG9zL2d1bHAtdGVzdC9zcmMvYXBwL3N0b3Jlcy9ldmVudC5qc3giLCIvVXNlcnMvc3RldmVubWNmYXJsYW5lL1JlcG9zL2d1bHAtdGVzdC9zcmMvYXBwL3N0b3Jlcy9zdG9yZS5qc3giLCIvVXNlcnMvc3RldmVubWNmYXJsYW5lL1JlcG9zL2d1bHAtdGVzdC9zcmMvYXBwL3N0b3Jlcy90b2RvX3N0b3JlLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDaEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDOUMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUE7QUFDbEQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUMxQixLQUFLLEdBQXVDLE1BQU0sQ0FBbEQsS0FBSztJQUFFLFlBQVksR0FBeUIs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QztDQUNoQixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBIZWFkZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaGVhZGVyLmpzeCcpO1xudmFyIFRvZG9zID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RvZG9zLmpzeCcpO1xudmFyIE5ld1RvZG8gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvbmV3X3RvZG8uanN4JylcbnZhciBSb3V0ZXIgPSB3aW5kb3cuUmVhY3RSb3V0ZXI7XG52YXIgeyBSb3V0ZSwgRGVmYXVsdFJvdXRlLCBSb3V0ZUhhbmRsZXIsIExpbmsgfSA9IFJvdXRlcjtcbnZhciBUcmFuc2l0aW9uR3JvdXAgPSBSZWFjdC5hZGRvbnMuQ1NTVHJhbnNpdGlvbkdyb3VwXG5cbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGNvbnRleHRUeXBlczoge1xuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIG5hbWUgPSB0aGlzLmNvbnRleHQucm91dGVyLmdldEN1cnJlbnRQYXRoKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxIZWFkZXIgLz5cbiAgICAgICAgPFRyYW5zaXRpb25Hcm91cCBjbGFzc05hbWU9XCJmbGV4LTEwMFwiIGNvbXBvbmVudD1cImRpdlwiIHRyYW5zaXRpb25OYW1lPVwidmlld1wiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIga2V5PXtuYW1lfSAvPlxuICAgICAgICA8L1RyYW5zaXRpb25Hcm91cD5cbiAgICAgIDwvZGl2PlxuICAgICAgKVxuICB9XG59KTtcblxudmFyIHJvdXRlcyA9IChcbiAgPFJvdXRlIGhhbmRsZXI9e0FwcH0+XG4gICAgPFJvdXRlIG5hbWU9XCJpbmRleFwiIHBhdGg9XCIvXCIgaGFuZGxlcj17VG9kb3N9Lz5cbiAgICA8Um91dGUgbmFtZT1cIm5ld3RvZG9cIiBwYXRoPVwiL25ld3RvZG9cIiBoYW5kbGVyPXtOZXdUb2RvfS8+XG4gIDwvUm91dGU+XG4pO1xuXG5Sb3V0ZXIucnVuKHJvdXRlcywgUm91dGVyLkhhc2hMb2NhdGlvbiwgZnVuY3Rpb24gKFJvb3QpIHtcbiAgUmVhY3QucmVuZGVyKDxSb290Lz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSk7XG59KTtcblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgaWYgKG5hdmlnYXRvci5ub3RpZmljYXRpb24pIHsgLy8gT3ZlcnJpZGUgZGVmYXVsdCBIVE1MIGFsZXJ0IHdpdGggbmF0aXZlIGRpYWxvZ1xuICAgICAgd2luZG93LmFsZXJ0ID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICBuYXZpZ2F0b3Iubm90aWZpY2F0aW9uLmFsZXJ0KFxuICAgICAgICAgICAgICBtZXNzYWdlLCAgICAvLyBtZXNzYWdlXG4gICAgICAgICAgICAgIG51bGwsICAgICAgIC8vIGNhbGxiYWNrXG4gICAgICAgICAgICAgIFwiVG9kb3NcIiwgLy8gdGl0bGVcbiAgICAgICAgICAgICAgJ09LJyAgICAgICAgLy8gYnV0dG9uTmFtZVxuICAgICAgICAgICk7XG4gICAgICB9O1xuICB9XG59LCBmYWxzZSk7XG4iLCJ2YXIgVG9kb3MgPSByZXF1aXJlKCcuLy4uL3N0b3Jlcy90b2RvX3N0b3JlLmpzeCcpO1xuXG5cbnZhciBhY3Rpb25zID0ge307XG5cbmFjdGlvbnMuYWRkVG9kbyA9IGZ1bmN0aW9uKGUpe1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIHZhciBpbnB1dCA9IGUudGFyZ2V0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpWzBdO1xuICB2YXIgbmV3VG9kbyA9IGlucHV0LnZhbHVlO1xuICBpbnB1dC52YWx1ZSA9ICcnO1xuICBUb2Rvcy5hZGRUb2RvVG9TdG9yZShuZXdUb2RvKTtcbiAgbG9jYXRpb24uYXNzaWduKGxvY2F0aW9uLnBhdGhuYW1lICsgXCIjL1wiKTtcbiAgY29uc29sZS5sb2coXCJhY3Rpb24gJ2FkZFRvZG8nIGZpcmVkXCIpO1xufTtcblxuYWN0aW9ucy5kZWxldGVUb2RvID0gZnVuY3Rpb24oZSl7XG4gIGNvbnNvbGUubG9nKGUpO1xuICB2YXIgcGFyZW50ID0gZS50YXJnZXQucGFyZW50RWxlbWVudDtcbiAgY29uc29sZS5sb2cocGFyZW50KTtcbiAgdmFyIHN3aXBlID0gcGFyZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3N3aXBlLWxlZnQtMTAwJylbMF07XG4gIHN3aXBlLmNsYXNzTmFtZSA9IHN3aXBlLmNsYXNzTmFtZS5yZXBsYWNlKFwiIHN3aXBlLWxlZnQtMTAwXCIsICcnKTtcbiAgVG9kb3MuZGVsZXRlVG9kb09uU3RvcmFnZShlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9kby1pZCcpKTtcbiAgY29uc29sZS5sb2coXCJhY3Rpb24gJ2RlbGV0ZVRvZG8nIGZpcmVkXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFjdGlvbnM7XG4iLCJ2YXIgUm91dGVyID0gd2luZG93LlJlYWN0Um91dGVyO1xudmFyIHsgUm91dGUsIERlZmF1bHRSb3V0ZSwgUm91dGVIYW5kbGVyLCBMaW5rIH0gPSBSb3V0ZXI7XG5cbnZhciBIZWFkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICB2YXIgczE9e1xuICAgICAgcGFkZGluZ1RvcDogJzIwcHgnLFxuICAgICAgaGVpZ2h0OiAnNjRweCdcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKSAhPT0gXCIvXCIpe1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImJhciBiYXItbmF2XCIgIHN0eWxlPXtzMX0+XG4gICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJidG4gYnRuLWxpbmsgYnRuLW5hdiBwdWxsLWxlZnRcIiB0bz1cIi9cIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWxlZnQtbmF2XCI+PC9zcGFuPlxuICAgICAgICAgICAgICBCYWNrXG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cImhlYWRlci1idG5cIiB0bz1cIm5ld3RvZG9cIj5OZXcgVG9kbzwvTGluaz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPFRpdGxlIGNsYXNzZXM9XCJ0aXRsZVwiIHRleHQ9XCJUb2RvIEFwcFwiIC8+XG4gICAgICAgICAgPC9oZWFkZXI+XG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImJhciBiYXItbmF2XCIgIHN0eWxlPXtzMX0+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwiaGVhZGVyLWJ0blwiIHRvPVwibmV3dG9kb1wiPk5ldyBUb2RvPC9MaW5rPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxUaXRsZSBjbGFzc2VzPVwidGl0bGVcIiB0ZXh0PVwiVG9kbyBBcHBcIiAvPlxuICAgICAgICA8L2hlYWRlcj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufSk7XG5cbnZhciBUaXRsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiA8aDEgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzZXN9Pnt0aGlzLnByb3BzLnRleHR9PC9oMT5cbiAgfVxufSk7XG5cbnZhciBIZWFkZXJCdG4gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3Nlc30+XG4gICAgICAgIDxMaW5rIHRvPVwibmV3VG9kb1wiPnt0aGlzLnByb3BzLnRleHR9PC9MaW5rPlxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXI7XG4iLCJ2YXIgYWN0aW9ucyA9IHJlcXVpcmUoJy4vLi4vYWN0aW9ucy90b2RvX2FjdGlvbnMuanN4Jyk7XG5cbnZhciBOZXdUb2RvID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6ZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEwMFwiPlxuICAgICAgICA8VG9kb0Zvcm0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufSk7XG5cbnZhciBUb2RvRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHZhciBzID0ge21hcmdpblRvcDogJzQwcHgnfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtNzUgY2VudGVyIHRvcC00MFwiIHN0eWxlPXtzfT5cbiAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2FjdGlvbnMuYWRkVG9kb30+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNlbnRlclwiPk5ldyBUb2RvPC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIk5ldyBUb2RvIEhlcmUgOilcIiAvPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCI+QWRkIFRvZG88L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZXdUb2RvO1xuIiwidmFyIGFjdGlvbnMgPSByZXF1aXJlKCcuLy4uL2FjdGlvbnMvdG9kb19hY3Rpb25zLmpzeCcpO1xudmFyIHRvZG9zU3RvcmUgPSByZXF1aXJlKCcuLy4uL3N0b3Jlcy90b2RvX3N0b3JlLmpzeCcpXG5cbnZhciBUb2RvcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge3RvZG9zOiBbXX07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvZG9zU3RvcmVVcGRhdGVcIiwgdGhpcy50b2Rvc1N0b3JlVXBkYXRlZCk7XG4gICAgdG9kb3NTdG9yZS5nZXRUb2Rvc0Zyb21TdG9yYWdlKCk7XG4gIH0sXG4gIHRvZG9zU3RvcmVVcGRhdGVkOiBmdW5jdGlvbigpe1xuICAgIHRoaXMuc2V0U3RhdGUoe3RvZG9zOiB0b2Rvc1N0b3JlLmRhdGEudG9kb3N9KTtcbiAgICBjb25zb2xlLmxvZyhcInVwZGF0ZWQgdG9kb3MgY29tcG9uZW50IHN0YXRlXCIpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS50b2Rvcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xMDAgdmlld1wiPlxuICAgICAgICA8VG9kb0xpc3QgdG9kb3M9e3RoaXMuc3RhdGUudG9kb3N9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pO1xuXG52YXIgVG9kb0xpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICB2YXIgdG9kb3MgPSBbXTtcbiAgICB0aGlzLnByb3BzLnRvZG9zLmZvckVhY2goZnVuY3Rpb24odG9kbywgaW5kZXgpe1xuICAgICAgdG9kb3MucHVzaCg8VG9kbyBrZXk9e2luZGV4fSB0b2RvSWQ9e2luZGV4fSB0b2RvPXt0b2RvLnRleHR9IC8+KVxuICAgIH0pO1xuICAgIHJldHVybiAoXG4gICAgICA8dWwgY2xhc3NOYW1lPVwidGFibGUtdmlldyBmbGV4LTEwMFwiPlxuICAgICAgICB7dG9kb3N9XG4gICAgICA8L3VsPlxuICAgIClcbiAgfVxufSk7XG5cbnZhciBUb2RvID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHRvZG8gPSB0aGlzLnByb3BzLnRvZG87XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaSBjbGFzc05hbWU9XCJ0YWJsZS12aWV3LWNlbGwgbGktZml4XCI+XG4gICAgICAgIDxTd2lwZURpdj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tY2hlY2tcIj48L3NwYW4+XG4gICAgICAgICAge3RoaXMucHJvcHMudG9kb31cbiAgICAgICAgPC9Td2lwZURpdj5cbiAgICAgICAgPERlbGV0ZSB0b2RvSWQ9e3RoaXMucHJvcHMudG9kb0lkfSAvPlxuICAgICAgPC9saT5cbiAgICApXG4gIH1cbn0pO1xuXG52YXIgRGVsZXRlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLmdldERPTU5vZGUoKTtcbiAgICB0aGlzLmhhbW1lciA9IG5ldyBIYW1tZXIobm9kZSk7XG4gICAgdGhpcy5oYW1tZXIub24oJ3RhcCcsIGZ1bmN0aW9uKGUpe1xuICAgICAgYWN0aW9ucy5kZWxldGVUb2RvKGUpO1xuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVsZXRlXCIgZGF0YS10b2RvLWlkPXt0aGlzLnByb3BzLnRvZG9JZH0+XG4gICAgICAgIDxwPkRlbGV0ZTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufSk7XG5cbnZhciBTd2lwZURpdiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBub2RlID0gdGhpcy5nZXRET01Ob2RlKClcbiAgICB0aGlzLmhhbW1lciA9IG5ldyBIYW1tZXIobm9kZSk7XG4gICAgdGhpcy5oYW1tZXIub24oJ3BhbmxlZnQnLCBmdW5jdGlvbigpe1xuICAgICAgaWYgKG5vZGUuY2xhc3NOYW1lLmluZGV4T2YoJy0xMDAnKSA9PT0gLTEpIHtcbiAgICAgICAgaWYgKG5vZGUuY2xhc3NOYW1lLmluZGV4T2YoJ3Jlc2V0JykgIT09IC0xKXtcbiAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9IG5vZGUuY2xhc3NOYW1lLnJlcGxhY2UoXCIgc3dpcGUtbGVmdC1yZXNldFwiLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5jbGFzc05hbWUgPSBub2RlLmNsYXNzTmFtZSArICcgc3dpcGUtbGVmdC0xMDAnO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuaGFtbWVyLm9uKCdwYW5yaWdodCcsIGZ1bmN0aW9uKCl7XG4gICAgICBpZiAobm9kZS5jbGFzc05hbWUuaW5kZXhPZignLTEwMCcpICE9PSAtMSkge1xuICAgICAgICBub2RlLmNsYXNzTmFtZSA9IG5vZGUuY2xhc3NOYW1lLnJlcGxhY2UoXCIgc3dpcGUtbGVmdC0xMDBcIiwgJycpO1xuICAgICAgICBpZiAobm9kZS5jbGFzc05hbWUuaW5kZXhPZignLXJlc2V0JykgPT09IC0xKXtcbiAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9IG5vZGUuY2xhc3NOYW1lICsgJyBzd2lwZS1sZWZ0LXJlc2V0JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3dpcGUtbGVmdFwiPnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PlxuICAgIClcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVG9kb3M7XG4iLCJcblxudmFyIHN0b3JlVXBkYXRlRXZlbnQgPSBmdW5jdGlvbihuYW1lLCBkZXRhaWxzKXtcbiAgcmV0dXJuIG5ldyBDdXN0b21FdmVudChcbiAgXHRuYW1lLFxuICBcdHtcbiAgXHRcdGRldGFpbDogZGV0YWlscyxcbiAgXHRcdGJ1YmJsZXM6IHRydWUsXG4gIFx0XHRjYW5jZWxhYmxlOiB0cnVlXG4gIFx0fVxuICApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZVVwZGF0ZUV2ZW50O1xuIiwidmFyIHN0b3JlVXBkYXRlRXZlbnQgPSByZXF1aXJlKCcuL2V2ZW50LmpzeCcpO1xuXG5cbnZhciBzdG9yZSA9IHtcbiAgZGF0YToge30sXG4gIGdldEFsbERhdGE6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgfSxcbiAgdXBkYXRlZDogZnVuY3Rpb24oKXtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHN0b3JlVXBkYXRlRXZlbnQpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZS5qc3gnKTtcbnZhciBzdG9yZVVwZGF0ZUV2ZW50ID0gcmVxdWlyZSgnLi9ldmVudC5qc3gnKTtcblxudmFyIHRvZG8gPSB7XG4gIGRvbmU6IGZhbHNlLFxuICB0ZXh0OiAnJ1xufVxuXG52YXIgVG9kb3MgPSBPYmplY3QuY3JlYXRlKHN0b3JlKTtcblRvZG9zLmRhdGEudG9kb3MgPSBbXTtcblxuVG9kb3MuZXZlbnQgPSBzdG9yZVVwZGF0ZUV2ZW50KCd0b2Rvc1N0b3JlVXBkYXRlJywge30pO1xuXG5Ub2Rvcy51cGRhdGVkID0gZnVuY3Rpb24oKXtcbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50KTtcbiAgY29uc29sZS5sb2coXCJldmVudCBmaXJlZFwiKVxufTtcblxuVG9kb3MuYWRkVG9kb1RvU3RvcmUgPSBmdW5jdGlvbih0ZXh0KSB7XG4gIHZhciB0ID0gT2JqZWN0LmNyZWF0ZSh0b2RvKTtcbiAgdC50ZXh0ID0gdGV4dDtcbiAgdC5kb25lID0gZmFsc2U7XG4gIGNvbnNvbGUubG9nKHRoaXMuZGF0YSk7XG4gIHRoaXMuZGF0YS50b2Rvcy5wdXNoKHQpO1xuICB0aGlzLnN0b3JlVG9kb3MoKTtcbiAgdGhpcy51cGRhdGVkKCk7XG59O1xuXG5Ub2Rvcy5kZWxldGVUb2RvT25TdG9yYWdlID0gZnVuY3Rpb24oaSl7XG4gIHRoaXMuZGF0YS50b2Rvcy5zcGxpY2UoaSwgMSk7XG4gIHRoaXMuc3RvcmVUb2RvcygpO1xuICB0aGlzLnVwZGF0ZWQoKTtcbn07XG5cblRvZG9zLnN0b3JlVG9kb3MgPSBmdW5jdGlvbigpe1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9kb3NTdG9yYWdlJywgSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhKSk7XG59O1xuXG5Ub2Rvcy5nZXRUb2Rvc0Zyb21TdG9yYWdlID0gZnVuY3Rpb24oKXtcbiAgdmFyIHN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9kb3NTdG9yYWdlJylcbiAgaWYgKHN0b3JhZ2UgIT09IG51bGwpIHtcbiAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2Uoc3RvcmFnZSlcbiAgICB0aGlzLmRhdGEudG9kb3MgPSBkYXRhLnRvZG9zO1xuICB9XG4gIHRoaXMudXBkYXRlZCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUb2RvcztcbiJdfQ==