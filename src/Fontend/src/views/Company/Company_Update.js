import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Row } from 'reactstrap';
import SimpleReactValidator from 'simple-react-validator';
import ApiServices from '../../service/api-service';
import Toastify from '../Toastify/Toastify';


class Company extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            timeRegisterAspirations: '',
            timeCompleteInterview: '',
            timeCompanySelection: '',
            timeProcessRemainCase: '',
            timeStartOJT: ''
        }
    }

    // async componentDidMount() {
    //     const parameters = await ApiService.Get("/");

    //     this.setState({

    //     });    
    // }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            timeRegisterAspirations: '',
            timeCompleteInterview: '',
            timeCompanySelection: '',
            timeProcessRemainCase: '',
            timeStartOJT: ''
        })
    }

    handleSubmit = async () => {
        const { timeRegisterAspirations, timeCompleteInterview, timeCompanySelection, timeProcessRemainCase, timeStartOJT } = this.state;

        if (this.validator.allValid()) {
            const ScheduleParameters = {
                timeRegisterAspirations,
                timeCompleteInterview,
                timeCompanySelection,
                timeProcessRemainCase,
                timeStartOJT
            }

            console.log("ScheduleParameters", ScheduleParameters);

            const result = await ApiServices.Post('/scheduleparameters/', ScheduleParameters);
            if (result !== null) {
                Toastify.actionSuccess('Tạo các tham số thành công');
            } else {
                Toastify.actionFail('Tạo các tham số thất bại');
            }

        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        return (
            <div className="animated fadeIn">
                <ToastContainer />
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <h4>Chỉnh sửa thông tin</h4>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Tên doanh nghiệp</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.timeRegisterAspirations} onChange={this.handleInput} type="text" id="timeRegisterAspirations" name="timeRegisterAspirations" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeRegisterAspirations', this.state.timeRegisterAspirations, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Tên tiếng Anh</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.timeCompleteInterview} onChange={this.handleInput} type="text" id="timeCompleteInterview" name="timeCompleteInterview" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeCompleteInterview', this.state.timeCompleteInterview, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Giới thiệu</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.timeStartOJT} onChange={this.handleInput} type="text" id="timeStartOJT" name="timeStartOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStartOJT', this.state.timeStartOJT, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Email</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.timeCompanySelection} onChange={this.handleInput} type="text" id="timeCompanySelection" name="timeCompanySelection" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeCompanySelection', this.state.timeCompanySelection, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Địa chỉ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.timeProcessRemainCase} onChange={this.handleInput} type="text" id="timeProcessRemainCase" name="timeProcessRemainCase" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeProcessRemainCase', this.state.timeProcessRemainCase, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>SĐT</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.timeStartOJT} onChange={this.handleInput} type="text" id="timeStartOJT" name="timeStartOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStartOJT', this.state.timeStartOJT, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Website</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.timeStartOJT} onChange={this.handleInput} type="text" id="timeStartOJT" name="timeStartOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStartOJT', this.state.timeStartOJT, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Logo</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.timeStartOJT} onChange={this.handleInput} type="file" id="timeStartOJT" name="timeStartOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStartOJT', this.state.timeStartOJT, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Image</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.timeStartOJT} onChange={this.handleInput} type="file" id="timeStartOJT" name="timeStartOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStartOJT', this.state.timeStartOJT, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="4" sm="4">
                                        <Button color="secondary" block onClick={() => this.handleDirect("/company")} type="reset">Trở về</Button>
                                    </Col>
                                    <Col xs="4" sm="4">
                                        <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                    </Col>
                                    <Col xs="4" sm="4">
                                        <Button onClick={() => this.handleSubmit()} type="submit" color="success" block>Xác nhận</Button>
                                    </Col>
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Company;
