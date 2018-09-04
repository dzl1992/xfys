import React, { Component } from 'react';
import { Row, Col, Modal, Icon, Select, DatePicker, Button, message, Cascader } from 'antd';
import '../style/personnel.less'
import axios from 'axios';
import Mfrom from './From'
import PersonnelTable from './Personnel.js'
import url from './url.js'


class District extends React.Component {
    state={
        id: 0,
        areaCode: '',
        userId: '',
        options: '',
        status: '',
        visible: false,
        confirmLoading: false,
        data: {
            id: 0,
            status: true,
        },
        form: {
            id: 0,//唯一标识标识 街道管理员
        }
    }
	// componentWillMount() {
	// 	var that = this;
	// 	var areaCode = localStorage.getItem("areaCode");
	// 	that.setState({
    //   areaCode: areaCode,
    //         data: {
    //             id: 0,//表格组件标识---街道管理员
    //             areaCode: areaCode,
    //         }
	// 	})
	// }
    componentDidMount() {
        // const that = this;
        // const data = {
        //     userId: this.state.userId
        // }
        // axios.post('config/subdistrict/list',data)
        // .then(function(res){
        //     console.log(res.data);
        //     if(res.data.resultCode === 1000) {
        //         that.setState({
        //             options: res.data.resultData
        //         })
        //         message.success('获取地区成功!');
        //     } else {
        //         message.error('获取地区失败!');
        //     }
        
        // })
        // .catch(function(err){
               
        // });
    }

    
    // constructor(props) {
    //     super(props);
    // }

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
                    loginName: values.nickname,
                    password: values.password,
                    name: values.name,
                    phone: values.phone,
                    identityCard: values.IdCard,
                    areaCode: values.site,
                    actorId: 4,
                    cardType: 1
                }
                axios.post( url +'/admin/add',data)
                .then(function(res){
                    if(res.data.resultCode === 1000) {
                        const sta = !that.state.data.status
                        message.success('新增成功');
                        that.setState({
                            data: {
                                id: 0,//唯一标识 街道管理员
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

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

	render() {
		return (
        <div className='formperson'>
            <Row gutter={150}>
                
                <Col className="gutter-row" style={{paddingLeft: 0}} sm={5}>
                <div className='btnOpera'>
                    <Button type="primary" style={{width: 100}} className="cx" onClick={this.showModal}>新增</Button>
                </div>
                </Col>
            </Row>
            <Row gutter={150}>
                
            </Row>
            <PersonnelTable comments={this.state.data}  onChange={val => this.setState({data: val})} />
            <Modal className="modal" title="新增用户"
                visible={this.state.visible}
                onOk={this.handleSubmit}
                confirmLoading={this.state.confirmLoading}
                onCancel={this.handleCancel}
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

export default District;