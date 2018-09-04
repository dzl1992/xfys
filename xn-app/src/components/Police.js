import React, { Component } from 'react';
import { Row, Select, Col, Input, Modal, message, Icon, Button,Form } from 'antd';
import '../style/Polics.less'
import PersonnelTable from './Personnel.js'
import Mfrom from './From'
import axios from 'axios';
import ProductTable from './ProductTable'
import url from './url.js'

const Search = Input.Search;
const FormItem = Form.Item;

class Police extends React.Component {
    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
        id: 2,
        areaCode: '',
        userId: '',
        options: '',
        status: '',
        data: {
            id: 2,//唯一标识标识 派出所
            areaCode: '',
            status: true,
        },
        form: {
            id: 2,//唯一标识标识 派出所
        }
    }

    componentWillMount() {
		var that = this;
		var areaCode = localStorage.getItem("areaCode");
		that.setState({
      areaCode: areaCode,
            data: {
                id: 2,//表格组件标识---派出所操作员
                areaCode: areaCode,
            }
		})
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
                console.log(values)
                const data = {
                    areaCode: localStorage.getItem("areaCode"),
                    loginName: values.nickname,
                    password: values.password,
                    name: values.name,
                    phone: values.phone,
                    identityCard: values.IdCard,
                    departmentId: values.site,
                    actorId: 3,
                    cardType: 1
                }
                axios.post(url + '/admin/add',data)
                .then(function(res){
                    if(res.data.resultCode === 1000) {
                        const sta = !that.state.data.status
                        message.success('新增成功');
                        that.setState({
                            data: {
                                id: 2,//唯一标识 派出所
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

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    // handleOk = () => {
    //     this.setState({
    //         ModalText: 'The modal will be closed after two seconds',
    //         confirmLoading: true,
    //     });
    //     setTimeout(() => {
    //         this.setState({
    //         visible: false,
    //         confirmLoading: false,
    //         });
    //     }, 2000);
    // }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }
	render() {
        const { children } = this.props
		return (
        <div className='formBody'>
            <Row gutter={150}>
                <Col className="gutter-row" sm={6}>
                    <Search
                        placeholder="用户名"
                        prefix={<Icon type="user" />}
                        onChange={this.onChangeUserName}
                        onSearch={this.onSearchUserName}
                    />
                </Col>
                <Col className="gutter-row" sm={8}>
                    <div className="select">
                        <Select placeholder="选择派出所" style={{ width: 250,marginRight: 10 }}></Select>
                    </div>
                </Col>
                <Col className="gutter-row" style={{ padding: 0}} sm={6}>
                    <div className='btnOpera' style={{float: "left" }}>
                        <Button type="primary" className="cx" onClick={this.btnSearch_Click}>查询</Button>
                        <Button type="primary" className="cz" onClick={this.showModal}>新增</Button>
                    </div>
                </Col>
            </Row>
            <ProductTable className="table" comments={this.state.data}  onChange={val => this.setState({data: val})}/>
            <Modal className="modal" title="新增用户"
                visible={this.state.visible}
                onOk={this.handleSubmit}
                confirmLoading={this.state.confirmLoading}
                onCancel={this.handleCancel}
                >
                <Mfrom
                data={this.state.form}
                ref="form"
                children={children}
                onSubmit={this.handleSubmit}/>
            </Modal>
        </div>
		);
	}
}

export default Police;