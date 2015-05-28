var actions = require('./../actions/todo_actions.jsx');

var NewTodo = React.createClass({
  render:function(){
    return (
      <div className="flex-100">
        <TodoForm />
      </div>
    )
  }
});

var TodoForm = React.createClass({
  render: function(){
    var s = {marginTop: '40px'}
    return (
      <div className="flex-75 center top-40" style={s}>
        <form onSubmit={actions.addTodo}>
          <label className="center">New Todo</label>
          <input type="text" placeholder="New Todo Here :)" />
          <button className="btn btn-primary">Add Todo</button>
        </form>
      </div>
    )
  }
});

module.exports = NewTodo;
