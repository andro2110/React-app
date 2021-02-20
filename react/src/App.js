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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
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
