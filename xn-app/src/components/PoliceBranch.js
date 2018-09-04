import React from 'react';
import { Row, Col, Modal, Button,message } from 'antd';
import '../style/personnel.less'
import axios from 'axios';
import Mfrom from './From'
import PersonnelTable from './Personnel.js'
import url from './url.js'

class PoliceBranch extends React.Component {
    state={
        id: 1,
        areaCode: '',
        userId: '',
        options: '',
        status: '',
        visible: false,
        confirmLoading: false,
        data: {
            id: 1,
            areaCode: '',
            status: true
        },
        form: {
            id: 1,//唯一标识标识 分局管理员
        }
    }
	componentWillMount() {
		var that = this;
		var areaCode = localStorage.getItem("areaCode");
		that.setState({
      areaCode: areaCode,
            data: {
                id: 1,//表格组件标识---分局管理员
                areaCode: areaCode,
                status: true
            }
		})
	}
    componentDidMount() {
        const that = this;
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
    //     this.btnSearch_Click = this.btnSearch_Click.bind(this);
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
                    actorId: 2,
                    cardType: 1
                }
                axios.post(url + '/admin/add',data)
                .then(function(res){
                    if(res.data.resultCode === 1000) {
                        const sta = !that.state.data.status
                        message.success('新增成功');
                        that.setState({
                            data: {
                                id: 1,//唯一标识 街道管理员
                                status: sta,
                                areaCode: that.state.data.areaCode
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
        console.log('Clicked cancel button');
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

export default PoliceBranch;