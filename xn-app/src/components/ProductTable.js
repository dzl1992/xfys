import React, { Component } from 'react';
import { Table, message, Spin, Divider, Modal} from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'; 
import '../style/table.less'
import Xgfrom from './xgForm'
import url from './url.js'
export default class ProductTable extends Component {
	state = {
		comments: '',
		table_data: '',
		columns: [],
		loading: true,
		visible: false,
		form: {
			id: 5,//唯一标识标识 网格员
			arr: {}
	}
	}
	constructor(props){
		super(props);
		this.state={
			// 使用父组件传递过来的初始值，这里可以用短路操作，也可以使用下面提到的defaultProps来进行设置
			comments:props.comments
		}
		console.log(props.comments.id)
		if(props.comments.id == 5 || props.comments.id == 2) {
			this.columns = [
				{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			render: text => <a href="javascript:;">{text}</a>,
		}, {
			title: '联系方式',
			dataIndex: 'phone',
			key: 'phone',
		},{
			title: '用户名',
			dataIndex: 'loginName',
			key: 'loginName',
		}, {
			title: '备案时间',
			dataIndex: 'area',
			key: 'area',
			render: text => <span>{text.name}</span>,
		}, {
			title: '操作',
			dataIndex: 'status',
			key: 'action',
			render: (text, record) => (
				<span>
					<a href="javascript:;" onClick={() => this.handleXg(record)} >修改</a>
					<Divider type="vertical" />
					<a href="javascript:;">禁用</a>
				</span>
			),
		}]
		} else if(props.comments.id == 0) {
			this.columns = [
				{
			title: '预审员',
			dataIndex: 'presenter',
			key: 'name',
			render: text => <a href="javascript:;">{text}</a>,
		}, {
			title: '房屋信息',
			dataIndex: 'apartmentDesc',
			key: 'age',
		},{
			title: '区域信息',
			dataIndex: 'areaName',
			key: 'address',
		}, {
			title: '备案时间',
			dataIndex: 'createTime',
			key: 'time',
			render: text => <a href="javascript:;">{moment(text).format('YYYY-MM-DD')}</a>,
		}, {
			title: '操作',
			dataIndex: 'status',
			key: 'action',
			render: (text, record) => (
				<span>
				{text.value == 3? <span><Link to={{
					pathname: '/app/BXq',
					id: record.id,
					bh: 0
				}}>审批</Link></span>:<Link to={{
					pathname: '/app/BXq',
					id: record.id,
					bh: 1
				}}>
						<span>详情</span>
					</Link>}
				</span>
			),
		}]
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps)
		const that = this;
    const jdata  = this.state.comments.status;
		const newdata = nextProps.comments.status;
		const userId = nextProps.comments.id;
		const areaCode = localStorage.getItem("areaCode");
    if (jdata !== newdata) {
			if(userId == 5) {
				const data = {
					actorId: 5,
					pageCount: 1,
					pageSize: 100,
					areaCode: areaCode
				};
				this.Axios5(url +"/admin/list", data)
			} else if(userId == 2) {
				const data = {
					actorId: 3,
					pageCount: 1,
					pageSize: 100,
					areaCode: areaCode
				};
				this.Axios5(url +"/admin/list", data)
			}
      
		} 
  }

  Axios(url, data) {//备案信息
		const that = this;
		axios.post(url,data)
		.then(function(res){
			if(res.data.resultCode === 1000) {
				const form = res.data.resultData.pretrials
				for(var i in form) {
					form[i].key = i
				}
				that.setState({
					table_data: form,
				})
			} else {
					message.error('获取信息失败!');
			}
			that.setState({
				loading: false,
			})
	
		})
		.catch(function(err){
			that.setState({
				loading: false,
			})
		});
	}

	Axios5(url, data) {//网格员添加
		const that = this;
		axios.post(url,data)
		.then(function(res){
			if(res.data.resultCode === 1000) {
				const form = res.data.resultData.officers;
				for(var i in form) {
					form[i].key = i
				}
				that.setState({
					table_data: form,
				})
			} else {
					message.error('获取信息失败!');
			}
			that.setState({
				loading: false,
			})
	
		})
		.catch(function(err){
			that.setState({
				loading: false,
			})
		});
	}
	
	componentDidMount() {
		const that = this;
		const TableData = this.state.comments.id;
		const userId = this.state.comments.userId;
		const status = this.state.comments.status;
		const areaCode = localStorage.getItem("areaCode");
		console.log(TableData)
		if(TableData == 0) {//备案信息
			const data = {
				userId: userId,
				pageCount: 1,
				pageSize: 100,
				status: status
			};
			this.Axios('/pretrial/area', data)
			this.setState({
				
			})
		} else if(TableData == 1) {   //分局
			this.Axios(url +'/pretrial/statistics')
		} else if(TableData == 5) {    //网格员
			const data = {
				actorId: 5,
				pageCount: 1,
				pageSize: 100,
				areaCode: areaCode
			};
			this.Axios5(url +"/admin/list", data)
		} else if(TableData == 2) {    //派出所
			console.log(0)
			const data = {
				actorId: 3,
				pageCount: 1,
				pageSize: 100,
				areaCode: areaCode
			};
			this.Axios5(url +"/admin/list", data)
		}
	}

	handleXg= (key) => {
		console.log(key)
		this.setState({
				visible: true,
				form: {
					id: 5,//唯一标识标识 网格员
					arr: key
				}
		});
	}

	hideModelHandler = () => {
		this.setState({ visible: false, })
	}

	handleSubmit = (err, values) => {
		var that = this; 
		const officerId = that.state.form.arr.officerId
		this.refs.form.validateFields((err, values) => {
				// this.props.onSubmit(err, values)
				if (!err) {
						this.hideModelHandler()
						const data = {
								loginName: values.loginName,
								name: values.name,
								phone: values.phone,
								identityCard: values.IdCard,
								areaCode: values.areaCode,
								actorId: 5,
								cardType: 1,
								userId: officerId
						}
						axios.post(url +'/admin/modify/info',data)
						.then(function(res){
								if(res.data.resultCode === 1000) {
										message.success('修改成功');
								} else {
										message.error('修改失败!');
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
		const columns = this.columns;
			return(
				<Spin spinning={this.state.loading}>
					<Table
						columns={columns}
						dataSource={this.state.table_data}
						bordered={true}
						className='formTable'
						pagination={{ pageSize: 7 }}
					/>
					<Modal destroyOnClose className="modal" title="新增用户"
                visible={this.state.visible}
                onOk={this.handleSubmit}
                confirmLoading={this.state.confirmLoading}
                onCancel={this.handleCancel}
                >
                <Xgfrom
                data={this.state.form}
                ref="form"
                onSubmit={this.handleSubmit}/>
            </Modal>
				</Spin>
			)
    }
}
