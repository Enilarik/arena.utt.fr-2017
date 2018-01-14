import React from 'react'
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux'
import { Router, Route, Switch } from 'react-router'
import FontFaceObserver from 'fontfaceobserver'

import AuthRequired from './components/AuthRequired'
import ScrollToTop from './components/ScrollToTop'
import Home from './containers/Home'
import Legal from './containers/Legal'

const getFromBundle = function (name) {
  return () => import('./containers/authBundle')
    .then((authBundle) => authBundle[name])
}

const Dashboard = getFromBundle('Dashboard')
const Teamfinder = getFromBundle('Teamfinder')
const TeamManagement = getFromBundle('TeamManagement')
const RequestedTeams = getFromBundle('RequestedTeams')
const Spotlight = getFromBundle('Spotlight')
const EditInfos = getFromBundle('EditInfos')
const Payment = getFromBundle('Payment')
const PaymentStatus = getFromBundle('PaymentStatus')

export default class App extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      import('./fonts.css')
    })

    const font = new FontFaceObserver('MotionControl')

    font.load().then(() => {
      app.className = 'a-motion-loaded'
    })
  }

  render() {
    return (
      <AppContainer>
        <Provider store={ this.props.store }>
          <Router history={ this.props.history }>
            <ScrollToTop>
              <Switch>
                <Route exact path="/" component={ Home }/>

                <Route exact path="/legal" component={ Legal }/>

                <Route exact path="/dashboard" render={() => (
                  <AuthRequired load={Dashboard} />
                )}/>

                <Route exact path="/dashboard/teamfinder" render={() => (
                  <AuthRequired load={Teamfinder} />
                )}/>

                <Route exact path="/dashboard/team" render={() => (
                  <AuthRequired load={TeamManagement} />
                )}/>

                <Route exact path="/dashboard/requests" render={() => (
                  <AuthRequired load={RequestedTeams} />
                )}/>

                <Route exact path="/dashboard/tournaments" render={() => (
                  <AuthRequired load={Spotlight} />
                )}/>

                <Route exact path="/dashboard/user" render={() => (
                  <AuthRequired load={EditInfos} />
                )}/>

                <Route exact path="/dashboard/payment" render={() => (
                  <AuthRequired load={Payment} />
                )}/>

                <Route exact path="/dashboard/payment/success" render={() => (
                  <AuthRequired load={PaymentStatus} />
                )}/>

                <Route exact path="/dashboard/payment/error" render={() => (
                  <AuthRequired load={PaymentStatus} />
                )}/>

                <Route component={ Home }/>
              </Switch>
            </ScrollToTop>
          </Router>
        </Provider>
      </AppContainer>
    )
  }
}
