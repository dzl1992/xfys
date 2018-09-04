import React, { Component } from 'react';
import { Row, Modal, Col, Input, Icon, message, DatePicker, Button, Tooltip, Popconfirm} from 'antd';
import '../style/Product.less'
import '../style/inter.less'
import TreeTable from './TreeTable'
import axios from 'axios';
import Mfrom from './From'

const Search = Input.Search;
const InputGroup = Input.Group;
const options = [];
const { RangePicker } = DatePicker;

class Street extends React.Component {
    state={
        userId: '',
        visible: false,
        confirmLoading: false,
        form: {
            id: 4,//唯一标识标识 行政设置
        },
        data: {
            userId: '',
        }
    }
	componentWillMount() {
		var that = this;
		var userId = localStorage.getItem("userId");
		that.setState({
            userId: userId,
            data: {
                userId: userId,
            }
		})
    }
    
    handleSubmit = (err, values) => {
        this.refs.form.validateFields((err, values) => {
            // this.props.onSubmit(err, values)
            if (!err) {
                this.hideModelHandler()
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
      <div className='formBody'>
          {/* <Row gutter={150}>
                <Col className="gutter-row" style={{ paddingLeft: 100,}} sm={6}>
                    <Button type="primary" className="cz" onClick={this.showModal}>新增</Button>
                </Col>
          </Row> */}
          <TreeTable data={this.state.userId}/>
          <Modal className="modal" title="新增行政单位"
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

export default Street;