import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import ApiServices from '../../../service/api-service';
import SimpleReactValidator from '../../../validator/simple-react-validator';
import Toastify from '../../Toastify/Toastify';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            token: '',
            password: '',
            confirmPassword: '',
            validatorConfirmPassword: '',
        }
    }

    async componentDidMount() {
        const token = window.location.href.split("/").pop();
        const result = await ApiServices.GetWithoutToken(`/account/checkToken?token=${token}`);
        if (result.status !== 200) {
            this.props.history.push('/login');
        }
        this.setState({
            token: token,
        })
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        let validatorConfirmPassword = "";
        await this.setState({
            [name]: value,
            validatorConfirmPassword: validatorConfirmPassword,
        })
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleSubmit = async () => {
        const { password, confirmPassword, token } = this.state;
        let validatorConfirmPassword = "";
        if (this.validator.allValid()) {
            if (confirmPassword !== password) {
                validatorConfirmPassword = "Mật khẩu xác nhận không chính xác!";
                this.setState({
                    validatorConfirmPassword: validatorConfirmPassword,
                });
            } else {
                this.setState({
                    loading: true
                });
                const result = await ApiServices.GetWithoutToken(`/account/createNewPassword?password=${password}&token=${token}`);
                // console.log(result);
                if (result.status === 200) {
                    Toastify.actionSuccess('Tạo mật khẩu mới thành công! Giờ bạn có thể đăng nhập bằng mật khẩu vừa tạo!');
                    this.props.history.push('/login');
                }
                if (result.status === 417) {
                    Toastify.actionFail('Cập nhật mật khẩu thất bại! Link resetpassword hết hiệu lực!');
                    this.setState({
                        loading: false
                    });
                }
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { validatorConfirmPassword } = this.state;
        return (
            <div className="app flex-row align-items-center backgroundFPT">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="9" lg="7" xl="6">
                            <Card className="mx-4  text-white bg-primary">
                                <CardBody className="p-4">
                                    <Form>
                                        <h1>Đặt lại mật khẩu</h1>
                                        <p className="text-muted" style={{fontWeight:"bold"}}>Mật khẩu mới</p>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="password" onKeyDown={this.handleKeyDown} onChange={this.handleInput} placeholder="Mật khẩu" autoComplete="new-password" name="password" />
                                        </InputGroup>
                                        <span className="form-error is-visible" style={{color:"#F69D4B", fontWeight:"bold"}}>
                                            {this.validator.message('Mật khẩu ', this.state.password, 'required|min:6|max:50|alpha_num')}
                                        </span>
                                        <p className="text-muted" style={{fontWeight:"bold"}}>Xác nhận lại mật khẩu</p>
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="password" placeholder="Xác nhận mật khẩu" autoComplete="new-password" onKeyDown={this.handleKeyDown} onChange={this.handleInput} name="confirmPassword" />
                                        </InputGroup>
                                        <span className="form-error is-visible" style={{color:"#F69D4B", fontWeight:"bold"}}>
                                            {validatorConfirmPassword}
                                        </span>
                                        {/* <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Email" autoComplete="email" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password" autoComplete="new-password" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Repeat password" autoComplete="new-password" />
                    </InputGroup> */}
                                    </Form>
                                </CardBody>
                                <CardFooter className="p-4 bg-white">
                                    <Row>
                                        <Col>
                                            <div className="position-relative row form-group" style={{ paddingLeft: '40%' }}>
                                                <Button style={{ width: '110px' }} color="primary" onClick={() => this.handleSubmit()} block><span>Xác nhận</span></Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ResetPassword;
