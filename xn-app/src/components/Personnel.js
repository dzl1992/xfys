import React, { Component } from 'react';
import { Table, message, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import url from './url.js'
import moment from 'moment'; 

export default class PersonnelTable extends Component {
	state = {
		comments: '',
		table_data: ''
	}
	constructor(props){
		super(props);
		console.log(props)
		this.state={
				comments:props.comments
		}
	}

	componentWillReceiveProps(nextProps) {
		const that = this;
    const jdata  = this.state.comments.status;
		const newdata = nextProps.comments.status;
		const userId = nextProps.comments.id;
		const areaCode = localStorage.getItem("areaCode");
    if (jdata !== newdata) {
			if(userId == 0) {
				const data = {
					areaCode: areaCode,
					pageCount: 1,
					pageSize: 100,
					actorId: 4
				};
				this.Axios(url +'/admin/list', data)
			} else if (userId == 1) {
				const data = {
					areaCode: areaCode,
					pageCount: 1,
					pageSize: 100,
					actorId: 2
				};
				this.Axios(url +'/admin/list', data)
			}
		}
  }

  Axios(url, data) {
		const that = this;
		axios.post(url,data)
		.then(function(res){
			if(res.data.resultCode === 1000) {
				const form = res.data.resultData.officers
				for(var i in form) {
					form[i].key = i
				}
				that.setState({
					table_data: form
				})
					// message.success('获取信息成功!');  
					
			} else {
					// message.error('获取信息失败!');
			}
	
		})
		.catch(function(err){
			
		});
	}
	componentDidMount() {
		const TableData = this.state.comments.id;
		const areaCode = localStorage.getItem("areaCode");
		const status = this.state.comments.status;
		if(TableData == 0) {//街道管理员
			const data = {
        areaCode: areaCode,
        pageCount: 1,
        pageSize: 100,
        actorId: 4
      };
			this.Axios(url +'/admin/list', data)

		} else if(TableData == 1) {//分局管理员
			const data = {
        areaCode: areaCode,
        pageCount: 1,
        pageSize: 100,
        actorId: 2
      };
			this.Axios(url + '/admin/list', data)
		} else if(TableData == 2) {
			const data = {
        areaCode: areaCode,
        pageCount: 1,
        pageSize: 100,
        actorId: 2
      };
			this.Axios(url +'/admin/list', data)
		}
	}

	handleDelete = (key,id) => {
		const that = this;
    const data = {
			userId: id,
			userType: 1,
			status: 1
		}
		axios.post(url +"/admin/status",data)
		.then(function(res){
			console.log(res.data)
			if(res.data.resultCode === 1000) {
					message.success('成功!');  
					
			} else {
					message.error('失败!');
			}
	
		})
		.catch(function(err){
			
		});

  }

	render() {
        const columns = [
					{
			  title: '用户名',
			  dataIndex: 'loginName',
			  key: 'loginName',
			  render: text => <a href="javascript:;">{text}</a>,
			}, {
			  title: '姓名',
			  dataIndex: 'name',
			  key: 'name',
			},{
			  title: '电话',
			  dataIndex: 'phone',
			  key: 'phone',
			}, {
			  title: '身份证',
			  dataIndex: 'identityCard',
				key: 'identityCard',
			},{
			  title: '区域',
			  dataIndex: 'area',
				key: 'time',
				render: text => <a href="javascript:;">{text.name}</a>,
			}, {
				title: '操作',
				dataIndex: 'status',
			  key: 'action',
			  render: (text,record) => (
			    <span>
					{text.value == 0? <a href="javascript:;"><span>启用</span></a>:
					<Popconfirm title="确定禁用该用户吗?" onConfirm={() => this.handleDelete(record.key, record.officerId)}>
						<a href="javascript:;">禁用</a>
              </Popconfirm>
          }
			      
			    </span>
			  ),
			}];
			
			return(
				<Table
						columns={columns}
						dataSource={this.state.table_data}
						bordered={true}
						className='formTable'
						pagination={{ pageSize: 7 }}
				/>
			)
    }
}
