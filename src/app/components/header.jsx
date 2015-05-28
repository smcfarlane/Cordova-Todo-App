var Router = window.ReactRouter;
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var Header = React.createClass({
  render: function(){
    var s1={
      paddingTop: '20px',
      height: '64px'
    }
    if (window.location.hash.substr(1) !== "/"){
      return (
          <header className="bar bar-nav"  style={s1}>
            <Link className="btn btn-link btn-nav pull-left" to="/">
              <span className="icon icon-left-nav"></span>
              Back
            </Link>
            <button className="btn pull-right">
              <Link className="header-btn" to="newtodo">New Todo</Link>
            </button>
            <Title classes="title" text="Todo App" />
          </header>
      )
    }
    return (
      <div>
        <header className="bar bar-nav"  style={s1}>
          <button className="btn pull-right">
            <Link className="header-btn" to="newtodo">New Todo</Link>
          </button>
          <Title classes="title" text="Todo App" />
        </header>
      </div>
    )
  }
});

var Title = React.createClass({
  render: function(){
    return <h1 className={this.props.classes}>{this.props.text}</h1>
  }
});

var HeaderBtn = React.createClass({
  render: function(){
    return (
      <button className={this.props.classes}>
        <Link to="newTodo">{this.props.text}</Link>
      </button>
    )
  }
});

module.exports = Header;
