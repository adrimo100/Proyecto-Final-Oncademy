import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./pages/home";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Subject } from "./pages/subject";
import { PaymentSuccess } from "./pages/paymentSuccess";

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";

  return (
    <div className="min-vh-100 d-flex flex-column">
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <div className="flex-grow-1">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/subject/:subject_id">
                <Subject />
              </Route>
              <Route exact path="/subject/:subject_id/success">
                <PaymentSuccess />
              </Route>
              <Route>
                <h1>Not found!</h1>
              </Route>
            </Switch>
          </div>
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
