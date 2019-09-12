import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';

class Account_Create extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            email: '',
            name: '',
            phone: '',
            address: '',
            active: true,
            loading: false
        }
    }

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
            email: '',
            name: '',
            phone: '',
            address: ''
        })
    }

    handleSubmit = async () => {
        const { email, name, phone, address, active } = this.state;
        const supervisor = {
            email,
            name,
            phone,
            address,
            active
        }

        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })

            const result = await ApiServices.Post('/business/createSupervisor', supervisor);
            if (result.status === 201) {
                Toastify.actionSuccess("Tạo tài khoản mới thành công!");
                this.setState({
                    loading: false
                })
              setTimeout(
                function () {
                  this.props.history.push('/hr/manage_account');
                }
                  .bind(this),
                2000
              );
            } else {
                Toastify.actionFail("Tạo tài khoản mới thất bại!");
                this.setState({
                    loading: false
                })
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }


    render() {
        const { loading } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <strong>Tạo tài khoản mới</strong>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="email">Email</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.email} onChange={this.handleInput} type="text" name="email" placeholder="Email" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Email', this.state.email, 'required|email')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="email">Họ và tên</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.name} onChange={this.handleInput} type="text" name="name" placeholder="Họ và tên" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Họ và tên', this.state.name, 'required|min:5|alpha_space')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="phone">SĐT</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.phone} onChange={this.handleInput} type="number" name="phone" placeholder="Số điện thoại" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Số điện thoại', this.state.phone, 'required|min:10|max:11|numeric')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="address">Địa chỉ </Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.address} onChange={this.handleInput} type="text" name="address" placeholder="Địa chỉ" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Địa chỉ', this.state.address, 'required|min:7|max:100|alpha_num_dot_splash')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                        <ToastContainer />
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="4" sm="4">
                                                <Button color="secondary" block onClick={() => this.handleDirect('/hr/manage_account')}>Trở về</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Tạo tài khoản</Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default Account_Create;
