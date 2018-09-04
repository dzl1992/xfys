import React, { Component } from 'react';
import { Row, Select, Col, Input, Modal, DatePicker, Button, message, Popconfirm} from 'antd';
import '../style/Product.less'
import '../style/inter.less'
import ProductTable from './ProductTable'
import axios from 'axios';
import Mfrom from './From'
import url from './url.js'

const Option = Select.Option;
const Search = Input.Search;
const InputGroup = Input.Group;
const options = [];
const { RangePicker } = DatePicker;

class Inter extends React.Component {
    state={
        id: 0,
        areaCode: '',
        userId: '',
		isLoding: false,
        options: '',
        status: '',
        visible: false,
        data: {
            id: 5,//唯一标识 网格员
            userId: '',
            status: true,
        },
        form: {
            id: 5,//唯一标识标识 网格员
        }
    }

    componentDidMount() {
        var userId = localStorage.getItem("userId")
        const that = this;
        const data = {
            userId: userId
        };
        axios.post(url + '/config/subdistrict/list',data)
        .then(function(res){
            if(res.data.resultCode === 1000) {
                that.setState({
                    options: res.data.resultData,
                })
            } else {
               console.log('获取地区失败!');
            }
        
        })
        .catch(function(err){
            that.setState({
                isLoding: false,
            })
        });
    }

    handleChange(value) {
        
    }

    addModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    hideModelHandler = () => {
        this.setState({ visible: false, })
    }

    handleSubmit = (err, values) => {
        var that = this; 
        this.refs.form.validateFields((err, values) => {
            // this.props.onSubmit(err, values)
            if (!err) {
                this.hideModelHandler()
                const data = {
                    loginName: values.loginName,
                    password: values.password,
                    name: values.name,
                    phone: values.phone,
                    identityCard: values.IdCard,
                    areaCode: values.areaCode,
                    actorId: 5
                }
                axios.post(url + '/admin/add',data)
                .then(function(res){
                    if(res.data.resultCode === 1000) {
                        const sta = !that.state.data.status
                        message.success('新增成功');
                        that.setState({
                            data: {
                                id: 5,//唯一标识 网格员
                                userId: '',
                                status: sta,
                            }
                        })
                    } else {
                        message.error(res.data.resultMessage);
                    }
                })
                .catch(function(err){
                    
                });
            }
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

	render() {
		return (
        <div className='formBody'>
            <Row gutter={150}>
                <Col className="gutter-row" sm={8}>
                    <div className="select">
                        <Select placeholder="选择社区" style={{ width: 300 }} onChange={this.handleChange}>
                        {this.state.options && this.state.options.map(province => <Option key={province.code}>{province.name}</Option>)}
                        </Select>
                    </div>
                </Col>
                <Col className="gutter-row" style={{ padding: 0}} sm={6}>
                    <div className='btnOpera' style={{float: "left" }}>
                        <Button type="primary" className="cx" onClick={this.btnSearch_Click}>查询</Button>
                        <Button type="primary" className="cz" onClick={this.addModal}>新增</Button>
                    </div>
                </Col>
            </Row>
            <ProductTable className="table" comments={this.state.data}  onChange={val => this.setState({data: val})}/>
            <Modal className="modal" title="新增用户"
                visible={this.state.visible}
                onOk={this.handleSubmit}
                confirmLoading={this.state.confirmLoading}
                onCancel={this.handleCancel}
                destroyOnClose
                >
                <Mfrom
                data={this.state.form}
                ref="form"
                onSubmit={this.handleSubmit}/>
            </Modal>
      </div>
		);
	}
}

export default Inter;