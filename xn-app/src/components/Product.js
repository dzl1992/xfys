import React from 'react';
import { Row, Col, Input, Spin, Select, DatePicker, Button, message, Cascader } from 'antd';
import '../style/Product.less'
import axios from 'axios';
import ProductTable from './ProductTable'
import url from './url.js'
const Search = Input.Search;
const InputGroup = Input.Group;
const options = [];
const { RangePicker } = DatePicker;

const Option = Select.Option;

function handleChange(value) {
  console.log(`selected ${value}`);
  console.log(this.state)
}

function onChange(value) {
    console.log(value);
  }

class Product extends React.Component {
    state={
        id: 0,
        areaCode: '',
        userId: '',
		isLoding: false,
        options: '',
        status: '',
        data: {
            id: 0,
            userId: '',
            status: '',
        }
    }
	componentWillMount() {
		var that = this;
		var userId = localStorage.getItem("userId");
		that.setState({
            userId: userId,
            data: {
                id: 0,//表格组件标识
                userId: userId,
                status: '',
            }
		})
	}
    componentDidMount() {
        const that = this;
        const data = {
            userId: this.state.userId
        };
        axios.post('/config/subdistrict/list',data)
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
            that.setState({
                isLoding: false,
            })
        });
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.btnSearch_Click = this.btnSearch_Click.bind(this);
    }

    // 查询按钮点击
    btnSearch_Click() {
        const value = this.state.status;
        const userId = this.state.userId;
        this.setState ({
            data: {
                id: 0,//表格组件标识
                userId: userId,
                status: value,
            }
        })
    }
    handleChange(value) {
        this.setState ({
            status: value
        })
      }

	render() {
        // console.log(this.state.options)
		return (
            <div className='formBodyP'>
                <Row gutter={150}>
                    <Col className="gutter-row" sm={6}>
                        <Select
                            showSearch
                            allowClear
                            style={{ width: 300,height:40 }}
                            placeholder="审核状态"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value="">全部</Option>
                            <Option value="3">待审核</Option>
                            <Option value="1">已备案</Option>
                            <Option value="2">已退回</Option>
                        </Select>
                    </Col>
                    <Col className="gutter-row" style={{paddingLeft: 0}} sm={6}>
                        <Cascader filedNames={{ label: 'name', value: 'code', children: 'children' }} options={this.state.options} key={this.state.options.name} placeholder="选择区域" onChange={onChange} changeOnSelect />
                    </Col>
                    <Col className="gutter-row" style={{paddingLeft: 0}} sm={7}>
                        <RangePicker className="range"  onChange={this.RangePicker_Select}/>
                    </Col>
                    <Col className="gutter-row" style={{paddingLeft: 0}} sm={5}>
                    <div className='btnOpera'>
                        <Button type="primary" className="cx" onClick={this.btnSearch_Click}>查询</Button>
                    </div>
                    </Col>
                </Row>
                <Row gutter={150}>
                    
                </Row>
                <ProductTable className="table" comments={this.state.data}  onChange={val => this.setState({data: val})}/>
            </div>
		);
	}
}

export default Product;