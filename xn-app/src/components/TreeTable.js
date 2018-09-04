import { Table, message, Divider } from 'antd';
import React, { Component } from 'react';
import axios from 'axios';
import url from './url.js'
// rowSelection objects indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

export default class TreeTable extends Component{
  state={
    userId: '',
    data: {
        userId: '',
    }
}
componentWillMount() {
var that = this;
var userId = localStorage.getItem("userId");
that.setState({
        userId: userId,
        data: []
})
}
componentDidMount() {
    const that = this;
    const data = {
        userId: this.state.userId
    }
    axios.post(url + '/config/subdistrict/list',data)
    .then(function(res){
        console.log(res.data);
        if(res.data.resultCode === 1000) {
          const data = res.data.resultData
          for(var i in data) {
            data[i].key = i
            for(var j in data[i].children) {
              data[i].children[j].key = i + j
              }          
          }
          that.setState({
            data: data
          })
            message.success('获取地区成功!');
        } else {
            message.error('获取地区失败!');
        }
    
    })
    .catch(function(err){
           
    });
}

  render(){
      const columns = [{
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '操作',
        dataIndex: 'address',
        width: '30%',
        key: 'address',
        render: () => <span>
          <a href="javascript:;">编辑</a> 
          <Divider type="vertical" />
          <a href="javascript:;">删除</a>
        </span> 
      }];
    
      const data = [{
        key: 1,
        name: 'John Brown sr.',
        age: 60,
        address: 'New York No. 1 Lake Park',
        children: [{
          key: 11,
          name: 'John Brown',
          age: 42,
          address: 'New York No. 2 Lake Park',
        }, {
          key: 12,
          name: 'John Brown jr.',
          age: 30,
          address: 'New York No. 3 Lake Park',
          children: [{
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park',
          }],
        }, {
          key: 13,
          name: 'Jim Green sr.',
          age: 72,
          address: 'London No. 1 Lake Park',
          children: [{
            key: 131,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [{
              key: 1311,
              name: 'Jim Green jr.',
              age: 25,
              address: 'London No. 3 Lake Park',
            }, {
              key: 1312,
              name: 'Jimmy Green sr.',
              age: 18,
              address: 'London No. 4 Lake Park',
            }],
          }],
        }],
      }, {
        key: 2,
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      }];
      return(
          <Table 
          style={{marginTop: 30}}
          columns={columns} 
          rowSelection={rowSelection} 
          dataSource={this.state.data}
          pagination={false} />
      )
    }
  }