import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Narocila from "./components/js/Narocila";
import Homepage from "./components/Homepage";
import SignUp from "./components/js/Signup";
import Login from "./components/js/LogIn";
import Logout from "./components/js/LogOut";
import AdminNarocila from "./components/AdminNarocila";
import Blog from "./components/Blog";
import Testing from "./components/Testing";
import AdminBlog from "./components/AdminBlog";
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css"
  rel="stylesheet"
  integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl"
  crossorigin="anonymous"
></link>;

class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/narocila" component={Narocila} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/adminNarocila" component={AdminNarocila} />
          <Route path="/adminBlog" component={AdminBlog} />
          <Route path="/blog" component={Blog} />
          <Route path="/test" component={Testing} />
          <Route path="/" component={Homepage} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
