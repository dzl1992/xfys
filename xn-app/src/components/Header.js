import React, { Component } from 'react';
import { Layout, Icon, Menu, Badge } from 'antd';
import { Link } from 'react-router-dom';
import history from './history';

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

export default class Headers extends Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: props.collapsed,
        }
        this.logout = this.logout.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        this.onCollapse(nextProps.collapsed);
    }
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
        });
    };
    logout(){
        localStorage.removeItem("mspa_user");
        history.push('/');
    }
    render(){
        return(
            <Header style={{ background: '#fff', padding: 0 }} className="header">
                出租房消防预审管理平台
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                >
                <SubMenu 
                    title={<span>
                        <Icon type="user" style={{fontSize:16, color: '#1DA57A' }}/>{this.props.username}
                    </span>}
                    >
                    <Menu.Item key="logout" style={{textAlign:'center'}} className="logout">
                        <span onClick={this.logout}>退出</span>
                    </Menu.Item>
                </SubMenu>
                </Menu>
            </Header>
        )
    }
} 