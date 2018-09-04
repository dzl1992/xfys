import { Form, Input, Tooltip, Icon, Button, Select, Cascader, Upload, message  } from 'antd';
import React, { Component } from 'react';
import '../style/From.less'
import axios from 'axios';
import '../style/Dform.less';
import url from './url.js'
const FormItem = Form.Item;
const Option = Select.Option;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
let uuid = 0;
class UserFrom extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    data: '',
    name: '',
    options: [],
    juese: [],
  };

  constructor(props){
    super(props);
    const that = this;
    console.log(props)
		this.state={
      data:props.data.id,
      name:props.data.arr.name,
      loginName: props.data.arr.loginName,
      phone: props.data.arr.phone,  
      identityCard: props.data.arr.identityCard,
      code: props.data.arr.area.code
    }
  }
  
  // 获取地区
  componentDidMount() {
    const that = this;
    const userId = localStorage.getItem("userId");
    const data = {
      userId: userId
    }

    if(that.state.data == 5 || that.state.data == 0) {
      axios.post(url +'/config/subdistrict/list',data)
      .then(function(res){
          if(res.data.resultCode === 1000) {
            that.setState({
              options: res.data.resultData,
            })
          } else {
              message.error('获取地区失败!');
          }
      
      })
      .catch(function(err){
          
      });
    } else if(that.state.data == 2) {
      axios.post(url +'/config/department/list',data)
      .then(function(res){
          if(res.data.resultCode === 1000) {
            console.log(res.data)
            that.setState({
              options: res.data.resultData,
            })
          } else {
              message.error('获取地区失败!');
          }
      
      })
      .catch(function(err){
          
      });
    }else if(that.state.data == 3) { //单位获取关联社区
      axios.post(url +'/config/subdistrict/list',data)
      .then(function(res){
          if(res.data.resultCode === 1000) {
            console.log(res.data)
            that.setState({
              options: res.data.resultData,
            })
          } else {
              message.error('获取地区失败!');
          }
      
      })
      .catch(function(err){
          
      });
    }
    
  }


  onSecondCityChange = (value) => {
  this.setState({
      secondCity: value,
  });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }

  // 单位新建时的表单增加

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  render() {
    const { getFieldDecorator,getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    if(this.state.data == 5) {
      return (
        <Form className="From" onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                用户名
              </span>
            )}
          >
            {getFieldDecorator('loginName', { initialValue: this.state.loginName }, {
              rules: [{ required: true, message: '请填写你的用户名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                姓名
              </span>
            )}
          >
            {getFieldDecorator('name',{ initialValue: this.state.name }, {
              rules: [{ required: true, message: '请填写你的姓名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号"
          >
            {getFieldDecorator('phone', { initialValue: this.state.phone },{
              rules: [{
                pattern: /^1(3|4|5|7|8)\d{9}$/, message: '手机号格式不正确',
            },{ required: true, message: '请填写你的手机号!' }],
            })(
              <Input style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                身份证号
              </span>
            )}
          >
            {getFieldDecorator('IdCard', { initialValue: this.state.identityCard }, {
              rules: [{
                pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, 
                message: '身份证格式不正确',
            },{ required: true, message: '请填写你的身份证号!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                关联地区
              </span>
            )}
          >
          {getFieldDecorator('areaCode',  { initialValue: this.state.code }, {
              rules: [{ required: true, message: '请选择关联区域!' }],
            })
            (<Select placeholder="请选择" style={{ width: 270 }}>
              {this.state.options && this.state.options.map(val => <Option key={val.code}>{val.name}</Option>)}
          </Select>)}
          </FormItem>
        </Form>
      );
    } else if(this.state.data == 3) {
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      };
      getFieldDecorator('keys', { initialValue: [] });
      const keys = getFieldValue('keys');
      const formItems = keys.map((k, index) => {
        return (
          <FormItem
            className="cascader"
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? '关联社区' : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`names[${k}]`, {
              rules: [{
                type: 'array',
                required: true,
                message: "请选择关联社区",
              }],
            })(
              <Cascader
                filedNames={{ label: 'name', value: 'code', children: 'children' }}
                options={this.state.options} key={this.state.options.name}
                placeholder="选择关联社区"
                changeOnSelect />
            )}
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k)}
              />
            ) : null}
          </FormItem>
        );
      });
      return (
        <Form className="cFrom" onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                单位
              </span>
            )}
          >
            {getFieldDecorator('company', {
              rules: [{ required: true, message: '请填写你的单位!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 增加关联社区
          </Button>
        </FormItem>
        </Form>
      );
    } else if(this.state.data == 2 ) {//派出所列表
      return (
        <Form className="From" onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                用户名
              </span>
            )}
          >
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: '请填写你的用户名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                密码
              </span>
            )}
          >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请填写密码!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                姓名
              </span>
            )}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请填写你的姓名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号"
          >
            {getFieldDecorator('phone', {
              rules: [{
                pattern: /^1(3|4|5|7|8)\d{9}$/, message: '手机号格式不正确',
            },{ required: true, message: '请填写你的手机号!' }],
            })(
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                身份证号
              </span>
            )}
          >
            {getFieldDecorator('IdCard', {
              rules: [{
                pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, 
                message: '身份证格式不正确',
            },{ required: true, message: '请填写你的身份证号!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                单位
              </span>
            )}
          >
          {getFieldDecorator('site', {
              rules: [{ required: true, message: '请选择单位!' }],
            })
            (<Select placeholder="请选择" style={{ width: 270 }}>
              {this.state.options && this.state.options.map(val => <Option key={val.departmentId}>{val.name}</Option>)}
          </Select>)}
          </FormItem>
        </Form>
      );
    } else if(this.state.data == 0) {//街道管理员
      return (
        <Form className="From" onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                用户名
              </span>
            )}
          >
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: '请填写你的用户名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                密码
              </span>
            )}
          >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请填写你的密码!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                姓名
              </span>
            )}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请填写你的姓名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号"
          >
            {getFieldDecorator('phone', {
              rules: [{
                pattern: /^1(3|4|5|7|8)\d{9}$/, message: '手机号格式不正确',
            },{ required: true, message: '请填写你的手机号!' }],
            })(
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                身份证号
              </span>
            )}
          >
            {getFieldDecorator('IdCard', {
              rules: [{
                pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, 
                message: '身份证格式不正确',
            },{ required: true, message: '请填写你的身份证号!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                关联地区
              </span>
            )}
          >
          {getFieldDecorator('site', {
              rules: [{ required: true, message: '请选择关联区域!' }],
            })
            (<Select placeholder="请选择" style={{ width: 270 }}>
              {this.state.options && this.state.options.map(val => <Option key={val.code}>{val.name}</Option>)}
          </Select>)}
          </FormItem>
        </Form>
      );
    } else if(this.state.data == 1) {//分局管理员
      return (
        <Form className="From" onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                用户名
              </span>
            )}
          >
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: '请填写你的用户名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                密码
              </span>
            )}
          >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请填写你的密码!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                姓名
              </span>
            )}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请填写你的姓名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号"
          >
            {getFieldDecorator('phone', {
              rules: [{
                pattern: /^1(3|4|5|7|8)\d{9}$/, message: '手机号格式不正确',
            },{ required: true, message: '请填写你的手机号!' }],
            })(
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                身份证号
              </span>
            )}
          >
            {getFieldDecorator('IdCard', {
              rules: [{
                pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, 
                message: '身份证格式不正确',
            },{ required: true, message: '请填写你的身份证号!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      );
    } 
    
  }
}
const xgfrom = Form.create()(UserFrom);
export default xgfrom;