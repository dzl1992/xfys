import React, { Component } from 'react';
import { Layout, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';
import history from './history';
import '../style/left.less'
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const menu = JSON.parse(localStorage.getItem('menu'));

export default class left extends Component{
  state = {
    collapsed: false,
    comments: '',
    name: ''
  };
  constructor(props){
		super(props);
		this.state={
				// 使用父组件传递过来的初始值，这里可以用短路操作，也可以使用下面提到的defaultProps来进行设置
				comments:props.comments  
    }
  }
  
  componentWillMount() {
    const userName = localStorage.getItem("userName")
    this.setState({
      name: userName
    })
  }

  recursion(menu) {
    return (
      menu.map((menu, index) => {
        if (menu.children) {
          return (
            <SubMenu key={menu.id} title={<span><Icon type={menu.icon} /><span>{menu.name}</span></span>}>
              {this.recursion(menu.children)}
            </SubMenu>
          )
        } else {
          return (
          <Menu.Item className="Li" key={menu.id}><Link to={menu.url}>
            <Icon type={menu.icon} />
            <span>{menu.name}</span>
          </Link></Menu.Item>)
        }
      })
    )
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  
  render() {
    return (
        <Sider
          className="left"
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="User">
            <img src={require('../style/img/avatar.jpg')} alt="" />
            <div className="name">{this.state.name}</div>
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
          >
          {
            this.recursion(this.props.comments)
          }
          </Menu>
        </Sider>
    );
  }
} 