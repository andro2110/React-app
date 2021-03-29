import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Narocila from "./components/js/Narocila";
import Homepage from "./components/Homepage";
import SignUp from "./components/js/Signup";
import Login from "./components/js/LogIn";
import Logout from "./components/js/LogOut";
import AdminNarocila from "./components/js/admin/AdminNarocila";
import Blog from "./components/Blog";
import AdminBlog from "./components/js/admin/AdminBlog";
import { ToastContainer } from "react-toastify";
import UserProfile from "./components/js/UserProfile";
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
          <Route path="/profile" component={UserProfile} />
          <Route path="/" component={Homepage} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
