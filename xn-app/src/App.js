import React,{ Component } from 'react';
import { Route,Switch,Router} from 'react-router-dom';
import {Layout, LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import './App.css';
import Home from './components/Home';
import interrogator from './components/Interrogator';
import Product from './components/Product';
import Police from './components/Police';
import Company from './components/Company';
import Street from './components/Street';
import User from './components/User';
import Pas from './components/Pas';
import District from './components/District';
import PoliceBranch from './components/PoliceBranch';
import BXq from './components/Ba_S_X';
import Left from './components/Left';
import Headers from './components/Header';
import history from './components/history';
const {Content} = Layout;
class App extends Component {
	state = {
		menu : '',
		userId: '',
	}
	shouldComponentUpdate(nextProps) {
		return nextProps.location !== this.props.location;
	}
	componentWillMount() {
		var that = this;
		var data = this.props.location.state;
		const menu = JSON.parse(localStorage.getItem("menu"));
		const userId = localStorage.getItem("userId");
		if(data) {
			that.setState({
				menu: data.menu,
				userId: data.userId,
			})
		} else {
			that.setState({
				menu: menu,
				userId: userId,
			})
		}
		
	}
	
    render() {
        return (
			<LocaleProvider locale={zh_CN}>
					<Layout className="Laystyle">
						<Left comments={this.state.menu} />
						<Layout>
							<Headers/>
							<Content className="contStyle">
								<Router history={history}>
									<Switch>
										<Route exact path='/app' component={Product} />
										<Route exact path='/home' component={Home} />
										<Route exact path='/interrogator' component={interrogator} />
										<Route exact path='/Police' component={Police} />
										<Route exact path='/Company' component={Company} />
										<Route exact path='/Street' component={Street} />
										<Route exact path='/Use' component={User} />
										<Route exact path='/Pas' component={Pas} />
										<Route exact path='/District' component={District} />
										<Route exact path='/PoliceBranch' component={PoliceBranch} />
										<Route exact path='/app/BXq' component={BXq} />
									</Switch>
								</Router>
							</Content>
						</Layout>
					</Layout>
			</LocaleProvider>
        );
    }
}

export default App;