import React from 'react';
import { Row, Table, Col, message,  Button, Divider, Modal} from 'antd';
import '../style/Product.less'
import '../style/inter.less'
import axios from 'axios';
import Mfrom from './From'
import url from './url.js'


class Company extends React.Component {
    state={
        columns: [],
        userId: '',
        visible: false,
        confirmLoading: false,
        table_data: [],
        form: {
            id: 3,//唯一标识标识 单位设置
        }
    }
	componentWillMount() {
		var that = this;
		var userId = localStorage.getItem("userId");
		that.setState({
            userId: userId,
		})
    }
    
    componentDidMount() {
        this.Dwlist()
    }

    //获取单位列表
    Dwlist = () => {
        const that = this;
        const data = {
            userId: this.state.userId
        }
        axios.post(url + '/config/department/list',data)
        .then(function(res){
            if(res.data.resultCode === 1000) {
                const form = res.data.resultData;
                const arr = [];
				for(var i in form) {
                    form[i].key = i
                    var arrayOfSquares = form[i].area.map(function (item) {
                        return item.name;
                      });
                    form[i].sq = arrayOfSquares
                    form[i].sq = form[i].sq.join("-")
                }
				that.setState({
                    table_data: form,
				})
                message.success('获取地区成功!');
            } else {
                message.error('获取地区失败!');
            }
        
        })
        .catch(function(err){
               
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
                const Code=[];
                for(const i in values.names) {
                    Code.push({
                        code:values.names[i][1]
                    })
                }
                const data = {
                    name: values.company,
                    areas: Code,
                    departmentType: 1,
                    needAudit: 0,
                }
                axios.post(url + '/config/department/add',data)
                .then(function(res){
                    if(res.data.resultCode === 1000) {
                        that.Dwlist()
                        message.success('新增成功');
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

        const columns = [{
            title: '单位',
            dataIndex: 'name',
            key: 'name',
            }, {
            title: '关联社区',
            dataIndex: 'sq',
            key: 'sq',
            }, {
                title: '操作',
                dataIndex: 'needAudit',
            key: 'needAudit',
            render: () => (
                <span>
                    <a href="javascript:;"><span>修改</span></a>
                    <Divider type="vertical" />
                    <a href="javascript:;"><span>禁用</span></a>
                </span>
            ),
            }]
		return (
        <div className='formBody'>
            <Row gutter={150}>
                <Col className="gutter-row" style={{ paddingLeft: 100}} sm={6}>
                    <Button type="primary" className="cz" onClick={this.showModal}>新增</Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={this.state.table_data}
                bordered={true}
                className='formTable'
            />
            <Modal className="modal" title="新增单位"
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

export default Company;