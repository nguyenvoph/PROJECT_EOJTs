import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigationHr from '../../_navHr';
import navigationAdmin from '../../_navAdmin';
import navigationSupervisor from '../../_navSupervisor';
import navigationStartup from '../../_navStartup';
import navigationTraining from '../../_navTraining';
import navigationMaster from '../../_navMaster';
// routes config
import routes from '../../routes';
import decode from 'jwt-decode';
import AuthServices from '../../service/auth-service';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault()
    localStorage.removeItem('id_token');
    this.props.history.push('/login')
  }


  constructor(props) {
    super(props);
    this.state = {
      role: ''
    }
  }

  async componentWillMount() {
    const token = localStorage.getItem('id_token');
    if (token !== null) {
      const decoded = decode(token);
      const role = decoded.role;

      this.setState({
        role
      });
    }
  }


  render() {
    const { role } = this.state;
    var navItems = [];
    let home = '';

    if (role === 'ROLE_ADMIN') {
      navItems = navigationAdmin;
      home = "/admin";
    } else if (role === 'ROLE_HR') {
      navItems = navigationHr;
      home = "/hr";
    } else if (role === 'ROLE_SUPERVISOR') {
      navItems = navigationSupervisor;
      home = "/supervisor";
    } else if (role === 'ROLE_STARTUP') {
      navItems = navigationStartup;
      home = "/startup";
    } else if (role === 'ROLE_HEADTRAINING') {
      navItems = navigationTraining;
      home = "/headtraining";
    } else if (role === 'ROLE_HEADMASTER') {
      navItems = navigationMaster;
      home = "/headmaster";
    }
    
    if (AuthServices.isLoggedIn()) {
      return (
        <div className="app">
          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader onLogout={e => this.signOut(e)} />
            </Suspense>
          </AppHeader>
          <div className="app-body creamLayout">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense>
                <AppSidebarNav navConfig={navItems} {...this.props} router={router} />
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <AppBreadcrumb appRoutes={routes} router={router} />
              <Container fluid>
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => (
                            <route.component {...props} />
                          )} />
                      ) : (null);
                    })}
                    <Redirect from="/" to={home} />
                    
                  </Switch>
                </Suspense>
              </Container>
            </main>
            <AppAside fixed>
              <Suspense fallback={this.loading()}>
                <DefaultAside />
              </Suspense>
            </AppAside>
          </div>
          <AppFooter>
            <Suspense fallback={this.loading()}>
              <DefaultFooter />
            </Suspense>
          </AppFooter>
        </div>
      );
    } else {
      return (
        <Redirect from="/" to="/login" />
      )
    }
  }
}

export default DefaultLayout;
