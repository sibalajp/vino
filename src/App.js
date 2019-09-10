import React, { useState, useEffect } from "react";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Login from "../src/pages/login/login";
import Dashboard from "../src/pages/dashboard/dashboard";
import Details from "../src/pages/details/details";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import BottleBatch from "./components/bottleBatch/bottleBatch";
import CreateBottle from "./components/createBottle/createBottle";
import PackagesTable from "./components/packages/packagesTable";
import NewPackage from "./components/newPackage/newPackage";
import CreatePackage from "./components/createPackage/createPackage";
import GeoProvenance from "./components/geoProvenance/geoProvenance";
import { REACT_APP_LANG_CONFIG_URL } from "./config";
import BottleBatchDetails from "./components/bottleBatchDetails/bottleBatchDetails";
import PackageDetails from "./components/packageDetails/packageDetails";
import BottleView from "./components/provenanceGraph/bottleView";
import InventoryIntelligence from "./components/inventoryIntelligence/inventoryIntelligence";

const App = props => {
  const [isAuth, updateLoginStatus] = useState(!!localStorage.getItem("user"));
  const [role, updateRole] = useState(localStorage.getItem("role"));

  // languagese: en and fre
  // to change language props.i18n.changeLanguage("fre");
  useEffect(() => {
    const getLanguages = async () => {
      const res = await fetch(REACT_APP_LANG_CONFIG_URL);
      const lang = await res.json();

      props.i18n.addResourceBundle(
        lang.i18nOptions.lng,
        "translations",
        lang.translations,
        true,
        true
      );
    };

    update();
    getLanguages();
  }, [isAuth, props.i18n]);

  useEffect(() => {
    updateRole(localStorage.getItem("role"));
  }, [role]);

  const login = () => {
    updateLoginStatus(true);
  };

  const logout = () => {
    updateLoginStatus(false);
  };
  const update = () => {
    let token = localStorage.getItem("user");

    if (token) {
      updateLoginStatus(true);
    } else {
      updateLoginStatus(false);
    }

    let roleInfo = localStorage.getItem("role");

    if (roleInfo) {
      updateRole(roleInfo);
    }
  };

  const returnDashboardRoute = () => {
    if (role) {
      switch (role) {
        case "Weightbridge":
          return <PrivateRoute path="/dashboard" component={Dashboard} />;
        case "Production":
          return <PrivateRoute path="/dashboard" component={BottleBatch} />;
        case "Sales":
          return <PrivateRoute path="/dashboard" component={PackagesTable} />;
        case "Governance":
          return (
            <ProvenanceRoute
              path="/dashboard/:pathParam?"
              component={GeoProvenance}
            />
          );
      }
    }
  };

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props => {
        const { staticContext, ...restProps } = props;
        return isAuth === true ? (
          <Component {...restProps} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        );
      }}
    />
  );

  const ProvenanceRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props => {
        const { staticContext, ...restProps } = props;
        return isAuth === true && role === "Governance" ? (
          <Component {...restProps} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        );
      }}
    />
  );

  const LoginRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props => {
        const { staticContext, ...rest } = props;
        return isAuth === true &&
          props.match.path === "/" &&
          props.match.isExact ? (
          <Redirect
            to={{
              pathname: "/dashboard",
              state: { from: props.location }
            }}
          />
        ) : (
          <Component {...rest} login={login} />
        );
      }}
    />
  );

  return (
    <Router>
      <div>
        <Route
          render={props => {
            const { staticContext, ...rest } = props;
            return (
              <Header
                {...rest}
                logout={logout}
                isauth={isAuth ? 1 : 0}
                roledata={role}
              />
            );
          }}
        />
        <LoginRoute exact path="/" component={Login} />
        <PrivateRoute path="/details/:id" component={Details} />
        {returnDashboardRoute()}
        <PrivateRoute path="/create-bottle" component={CreateBottle} />
        <PrivateRoute path="/new-package" component={NewPackage} />
        <PrivateRoute path="/create-package" component={CreatePackage} />
        <ProvenanceRoute
          path="/provenance/:size?/:dist?/:status?/:startDate?/:endDate?/:view?/:id?"
          component={GeoProvenance}
        />
        <PrivateRoute path="/batch-details" component={BottleBatchDetails} />
        <PrivateRoute path="/package-details" component={PackageDetails} />
        <PrivateRoute path="/bottle-view/:id" component={BottleView} />
        <PrivateRoute path="/inventory" component={InventoryIntelligence} />

        <Footer />
      </div>
    </Router>
  );
};

export default App;
