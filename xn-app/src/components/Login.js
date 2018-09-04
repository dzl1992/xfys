import React, { Component } from 'react';
import '../style/login.less';
import { Form, Icon, Input, Button, message, Spin } from 'antd';
import axios from 'axios';
import url from './url.js'
const FormItem = Form.Item;

class NormalLoginForm extends Component {
    state = {//state:当一个组件 mounts的时候，state如果设置有默认值的会被使用，并且state可能时刻的被改变。一个子控件自身可以管理自己的state，但是需要注意的是，无法管理其子控件的state。所以可以认为，state是子控件自身私有的。
        isLoding:false,
    };
    handleSubmit = (e) => {
        e.preventDefault();//阻止提交表单
        this.props.form.validateFields((err, values) => {//props是一个组件的设置参数，可以在父控件中选择性设置。父组件对子控件的props进行赋值，并且props的值不可改变。一个子控件自身不能改变自己的 props。
            if (!err) {
                let that = this;
                axios.post('/admin/login',{
                    loginName: values.loginName.replace(/(^\s*)|(\s*$)/g, ""),
                    password: values.password.replace(/(^\s*)|(\s*$)/g, "")
                })
                  .then(function(res){ 
                    if(res.data.resultCode === 1000) {
                        const menu = JSON.stringify(res.data.resultData.menu);
                        const Menu = res.data.resultData.menu;
                        message.success('登陆成功!'); //成功信息
                        localStorage.setItem("menu",menu)
                        localStorage.setItem("userName",values.loginName)
                        localStorage.setItem("password",values.password)
                        localStorage.setItem("userId",res.data.resultData.userId)
                        localStorage.setItem("actorId",res.data.resultData.actorId)
                        localStorage.setItem("areaCode",res.data.resultData.areaCode)
                        if(Menu[0].url) {
                            setTimeout(function() { //延迟进入
                                that.props.history.push({pathname:Menu[0].url,state:res.data.resultData});
                            }, 2000);
                        } else if(!Menu[0].url && Menu[0].children) {
                            setTimeout(function() { //延迟进入
                                that.props.history.push({pathname:Menu[0].children[0].url,state:res.data.resultData});
                            }, 2000);
                        }
                        
                    } else {
                        message.error('登录失败!'); //成功信息
                    }
                    
                  })
                  .catch(function(err){
                    that.setState({
                        isLoding: true,   
                    });
                  });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            this.state.isLoding?<Spin size="large" className="loading" />:
            <div className="login">
                <div className="login_Img"></div>
                <div className="login_cen">
                    <div className="login-form">
                        <div className="login-logo">
                            <div className="login-name">登录</div>
                        </div>
                        <Form onSubmit={this.handleSubmit} className="submitStyle">
                            <FormItem>
                                {getFieldDecorator('loginName', {
                                    rules: [{ required: true, message: '请输入用户名!' }],
                                })(
                                    <Input prefix={<Icon type="user" className="IconStyle"/>} placeholder="用户名" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码!' }],
                                })(
                                    <Input prefix={<Icon type="lock" className="IconStyle" />} type="password" placeholder="密码" />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
                
            </div>
        );
    }
}

const Login = Form.create()(NormalLoginForm);
export default Login;