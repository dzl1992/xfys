import React from 'react';
import { Row, Col, Checkbox,Button,message } from 'antd';
import '../style/Baxq.less'
import axios from 'axios';
import moment from 'moment';
import url from './url.js'
const CheckboxGroup = Checkbox.Group;
const options = ['1kg干粉灭火器', '20米逃生绳', '防滑手套', '多功能安全手电','30型防毒面具', '烟感设备'];

class BXq extends React.Component {
    state = {
        id: '',
        bh: '',
        presenter: '',
        name: '',
        landlordPhone: '',
        presenterPhone: '',
        modifyTime: '',
        apartmentDesc: '',
        arr: [],
        pics: []
    }
    constructor(props){
        super(props);
        this.PassClick = this.PassClick.bind(this);
        this.NoClick = this.NoClick.bind(this);
        if(this.props.location.id) {
            this.state={
                bh:this.props.location.bh,
                id:this.props.location.id,
            }
            localStorage.setItem("id",this.state.id)
        } else {
            this.state={
                id:localStorage.getItem("id")
            }
            localStorage.setItem("id",this.state.id)
        }
    }

    Axios(data) {
        const that = this;
        axios.post(url + '/pretrial/apply/detail',data)
		.then(function(res){
			if(res.data.resultCode === 1000) {
                const arr = [];
                const arr1 = [];
                const Img = res.data.resultData.pics;
                const check = res.data.resultData.equipments
                for(const i in check) {
                    arr.push(check[i].title)
                }
                for(const i in Img) {
                    arr1.push(Img[i].url)
                }
				that.setState({
                    presenter: res.data.resultData.presenter,
                    name: res.data.resultData.landlordName,
                    landlordPhone: res.data.resultData.landlordPhone,
                    presenterPhone: res.data.resultData.presenterPhone,
                    modifyTime: moment(res.data.resultData.modifyTime).format('YYYY-MM-DD'),
                    apartmentDesc: res.data.resultData.apartmentDesc,
                    arr: arr,
                    pics: res.data.resultData.pics,
				})
					message.success('获取信息成功!');  
					
			} else {
					message.error('获取信息失败!');
			}
	
		})
		.catch(function(err){
			
		});
    }
    
    componentDidMount() {
        const that = this;
        if(that.state.id) {
            const data = {
                id: that.state.id
            }
        this.Axios(data)
        } else {
            const data = {
                id: localStorage.getItem("id")
            }
        this.Axios(data)
        }
    }

    BackClick() {
        window.history.back()
    }

    Click(data,tit,reas) {
        const id = this.state.id
        axios.post(url + '/pretrial/permission',{
            id: id,
            status: data,
            reason:reas
        })
		.then(function(res){
			message.success(tit);
	
		})
		.catch(function(err){
			window.history.back()
		});
    }

    PassClick() {
        const status = {
            value: 5
        }
        let tit = "已通过申请"
        this.Click(status,tit)
        
    }

    NoClick() {
        const status = {
            value: 4
        }
        let tit = "已拒绝申请"
        let reas = '消防不合格'
        this.Click(status,tit,reas)
    }

	render() {
        console.log(this.state.pics)
		return (
            <div className='formBody'>
                <Row gutter={6}>
                    <Col className="gutter-row" sm={6}>
                        房东: {this.state.name}
                    </Col>
                    <Col className="gutter-row" sm={6}>
                        预审员：{this.state.presenter}
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col className="gutter-row" sm={6}>
                        联系电话：{this.state.landlordPhone}
                    </Col>
                    <Col className="gutter-row" sm={6}>
                        联系电话: {this.state.presenterPhone}
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col className="gutter-row" sm={6}>
                        备案时间: {this.state.modifyTime}
                    </Col>
                    <Col className="gutter-row" sm={6}>
                        区域：蒋村街道花园社区
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col className="gutter-row" sm={6}>
                        房屋信息：{this.state.apartmentDesc}
                    </Col>
                </Row>
                <Row>
                    <Col className="gutter-row" sm={12}>
                        <span className="xfName">消防器材:</span>
                        <CheckboxGroup options={options} value={this.state.arr} />
                    </Col>
                </Row>
                <Row>
                    <Col className="gutter-row" span={24}>
                        <span className="xfName">现场照片:</span>
                        <div className="photoQ">
                          {/* {cols} */}
                          {this.state.pics && this.state.pics.map((item, i) =>
                                <Col key={i.toString()} className="ImgF">
                                    <img style={{width: 50,height:50}} src={item.url}/>
                                </Col>
                            )}
                        </div>
                    </Col>
                </Row>
                <Row>
                    {this.state.bh == 0 ? <Col className="gutter-row" style={{marginTop:20}} sm={6}>
                      <Button type="primary" className="cx" onClick={this.PassClick}>通过</Button>
                      <Button type="danger" className="cz" onClick={this.NoClick}>驳回</Button>
                    </Col>:<Col className="gutter-row" style={{marginTop:20}} sm={6}>
                      <Button type="primary" className="cx" onClick={this.BackClick}>返回</Button>
                    </Col>}
                </Row>
            </div>
		);
	}
}

export default BXq;