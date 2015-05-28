var Header = require('./components/header.jsx');
var Todos = require('./components/todos.jsx');
var NewTodo = require('./components/new_todo.jsx')
var Router = window.ReactRouter;
var { Route, DefaultRoute, RouteHandler, Link } = Router;
var TransitionGroup = React.addons.CSSTransitionGroup

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },
  render: function(){
    var name = this.context.router.getCurrentPath();
    return (
      <div>
        <Header />
        <TransitionGroup className="flex-100" component="div" transitionName="view">
          <RouteHandler key={name} />
        </TransitionGroup>
      </div>
      )
  }
});

var routes = (
  <Route handler={App}>
    <Route name="index" path="/" handler={Todos}/>
    <Route name="newtodo" path="/newtodo" handler={NewTodo}/>
  </Route>
);

Router.run(routes, Router.HashLocation, function (Root) {
  React.render(<Root/>, document.getElementById('app'));
});


document.addEventListener('deviceready', function () {
  if (navigator.notification) { // Override default HTML alert with native dialog
      window.alert = function (message) {
          navigator.notification.alert(
              message,    // message
              null,       // callback
              "Todos", // title
              'OK'        // buttonName
          );
      };
  }
}, false);
