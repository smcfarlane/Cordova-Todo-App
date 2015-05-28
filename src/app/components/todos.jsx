var actions = require('./../actions/todo_actions.jsx');
var todosStore = require('./../stores/todo_store.jsx')

var Todos = React.createClass({
  getInitialState: function() {
    return {todos: []};
  },
  componentDidMount: function () {
    document.addEventListener("todosStoreUpdate", this.todosStoreUpdated);
    todosStore.getTodosFromStorage();
  },
  todosStoreUpdated: function(){
    this.setState({todos: todosStore.data.todos});
    console.log("updated todos component state");
  },
  render: function(){
    console.log(this.state.todos);
    return (
      <div className="flex-100 view">
        <TodoList todos={this.state.todos} />
      </div>
    )
  }
});

var TodoList = React.createClass({
  render: function(){
    var todos = [];
    this.props.todos.forEach(function(todo, index){
      todos.push(<Todo key={index} todoId={index} todo={todo.text} />)
    });
    return (
      <ul className="table-view flex-100">
        {todos}
      </ul>
    )
  }
});

var Todo = React.createClass({
  render: function(){
    var todo = this.props.todo;
    return (
      <li className="table-view-cell li-fix">
        <SwipeDiv>
          <span className="icon icon-check"></span>
          {this.props.todo}
        </SwipeDiv>
        <Delete todoId={this.props.todoId} />
      </li>
    )
  }
});

var Delete = React.createClass({
  componentDidMount: function() {
    var node = this.getDOMNode();
    this.hammer = new Hammer(node);
    this.hammer.on('tap', function(e){
      actions.deleteTodo(e);
    });
  },
  render: function(){
    return (
      <div className="delete" data-todo-id={this.props.todoId}>
        <p>Delete</p>
      </div>
    )
  }
});

var SwipeDiv = React.createClass({
  componentDidMount: function() {
    var node = this.getDOMNode()
    this.hammer = new Hammer(node);
    this.hammer.on('panleft', function(){
      if (node.className.indexOf('-100') === -1) {
        if (node.className.indexOf('reset') !== -1){
          node.className = node.className.replace(" swipe-left-reset", '');
        }
        node.className = node.className + ' swipe-left-100';
      }
    });
    this.hammer.on('panright', function(){
      if (node.className.indexOf('-100') !== -1) {
        node.className = node.className.replace(" swipe-left-100", '');
        if (node.className.indexOf('-reset') === -1){
          node.className = node.className + ' swipe-left-reset';
        }
      }
    });
  },
  render: function(){
    return (
      <div className="swipe-left">{this.props.children}</div>
    )
  }
});

module.exports = Todos;
