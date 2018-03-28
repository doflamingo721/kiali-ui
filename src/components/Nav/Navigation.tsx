import * as React from 'react';
import { VerticalNav } from 'patternfly-react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

import IstioRulesPage from '../../pages/IstioRulesList/IstioRuleListPage';
import IstioRuleDetailsPage from '../../pages/IstioRuleDetails/IstioRuleDetailsPage';
import HelpDropdown from './HelpDropdown';
import ServiceDetailsPage from '../../pages/ServiceDetails/ServiceDetailsPage';
import ServiceGraphPage from '../../pages/ServiceGraph/ServiceGraphPage';
import ServiceListPage from '../../pages/ServiceList/ServiceListPage';

const istioRulesPath = '/rules';
export const istioRulesTitle = 'Istio Mixer';
const serviceGraphPath = '/service-graph/istio-system';
export const serviceGraphTitle = 'Graph';
const servicesPath = '/services';
export const servicesTitle = 'Services';

const pfLogo = require('../../img/logo-alt.svg');
const pfBrand = require('../../assets/img/kiali-title.svg');

type PropsType = {
  location: any;
};

type StateType = {
  selectedItem: string;
};

class Navigation extends React.Component<PropsType, StateType> {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props: any) {
    super(props);
    this.navigateTo = this.navigateTo.bind(this);

    // handle initial path from the browser
    const selected = this.parseInitialPath(props.location.pathname);
    this.state = {
      selectedItem: `/${selected}/`
    };
  }

  parseInitialPath = (pathname: string) => {
    let selected = '';
    if (pathname.startsWith('/namespaces') || pathname.startsWith('/services')) {
      selected = servicesTitle;
    } else if (pathname.startsWith('/service-graph')) {
      selected = serviceGraphTitle;
    } else if (pathname.startsWith('/rules')) {
      selected = istioRulesTitle;
    } else {
      selected = serviceGraphTitle;
    }
    return selected;
  };

  setControlledState = event => {
    if (event.activePath) {
      // keep track of path as user clicks on nav bar
      this.setState({ selectedItem: event.activePath });
    }
  };

  navigateTo(e: any) {
    if (e.title === servicesTitle) {
      this.context.router.history.push(servicesPath);
    } else if (e.title === istioRulesTitle) {
      this.context.router.history.push(istioRulesPath);
    } else {
      this.context.router.history.push(serviceGraphPath);
    }
  }

  render() {
    return (
      <div>
        <VerticalNav setControlledState={this.setControlledState} activePath={this.state.selectedItem}>
          <VerticalNav.Masthead title="Kiali">
            <VerticalNav.Brand iconImg={pfLogo} titleImg={pfBrand} />
            <VerticalNav.IconBar>
              <HelpDropdown />
            </VerticalNav.IconBar>
          </VerticalNav.Masthead>
          <VerticalNav.Item title={serviceGraphTitle} iconClass="fa pficon-topology" onClick={this.navigateTo} />
          <VerticalNav.Item title={servicesTitle} iconClass="fa pficon-service" onClick={this.navigateTo} />
          <VerticalNav.Item title={istioRulesTitle} iconClass="fa pficon-migration" onClick={this.navigateTo} />
        </VerticalNav>
        <Switch>
          <Route path="/service-graph/:namespace" component={ServiceGraphPage} />
          <Route path={servicesPath} component={ServiceListPage} />
          <Route path="/namespaces/:namespace/services/:service" component={ServiceDetailsPage} />
          <Route path={istioRulesPath} component={IstioRulesPage} />
          <Route path="/namespaces/:namespace/rules/:rule" component={IstioRuleDetailsPage} />
          <Redirect to={serviceGraphPath} />
        </Switch>
      </div>
    );
  }
}

export default Navigation;
