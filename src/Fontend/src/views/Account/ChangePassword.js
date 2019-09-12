import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Form, FormGroup, FormText, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            email: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            loading: true,
            validatorOldPassword: '',
            validatorConfirmPassword: '',
            account: null,
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        const decoded = decode(token);
        const email = decoded.email;
        const account = await ApiServices.Get('/user/getCurrentAccount');
        this.setState({
            email,
            loading: false,
            account: account,
        });
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        let validatorOldPassword = "";
        let validatorConfirmPassword = "";
        await this.setState({
            [name]: value,
            validatorOldPassword: validatorOldPassword,
            validatorConfirmPassword: validatorConfirmPassword,
        })
    }

    handleReset = async () => {
        this.setState({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        })
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleSubmit = async () => {
        const { newPassword, oldPassword, confirmPassword } = this.state;
        const account = this.state.account;
        let validatorOldPassword = "";
        let validatorConfirmPassword = "";
        if (this.validator.allValid()) {
            if (oldPassword !== account.password ||
                confirmPassword !== newPassword) {
                if (oldPassword !== account.password) {
                    validatorOldPassword = "Mật khẩu hiện tại không chính xác";
                }
                // console.log(account.password);
                // console.log(oldPassword);
                if (confirmPassword !== newPassword) {
                    validatorConfirmPassword = "Mật khẩu xác nhận không chính xác";
                }
                this.setState({
                    validatorOldPassword: validatorOldPassword,
                    validatorConfirmPassword: validatorConfirmPassword,
                });
            } else {

                this.setState({
                    loading: true
                });
    
                const result = await ApiServices.Put(`/user/updatePassword?password=${newPassword}`);
                if (result.status === 200) {
                    Toastify.actionSuccess('Cập nhật mật khẩu thành công');
                    this.props.history.push('/');
                } else {
                    Toastify.actionFail('Cập nhật mật khẩu thất bại');
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
        const { loading, validatorOldPassword, validatorConfirmPassword } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="app flex-row">
                        <Container>
                            <Row className="justify-content-center">
                                <Col md="9" lg="7" xl="6">
                                    <Card className="mx-4">
                                        <CardHeader>
                                            <h1>Đổi mật khẩu</h1>
                                        </CardHeader>
                                        <CardBody className="p-4">
                                            <Form>
                                                <FormGroup>
                                                    <Label htmlFor="nf-email">Email:</Label>
                                                    <InputGroup className="mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>@</InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input value={this.state.email} readOnly="true" type="text" placeholder="Email" autoComplete="email" />
                                                    </InputGroup>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label htmlFor="nf-password">Mật khẩu cũ:</Label>
                                                    <InputGroup className="mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="icon-lock"></i>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input type="password" name="oldPassword" id="oldPassword" placeholder="Mật khẩu cũ" autoComplete="old-password" onChange={this.handleInput} />
                                                    </InputGroup>
                                                    <FormText className="help-block">Mật khẩu hiện tại</FormText>
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Mật khẩu hiện tại', this.state.oldPassword, 'required')}
                                                    </span>
                                                    <span className="form-error is-visible text-danger">
                                                        {validatorOldPassword}
                                                    </span>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label htmlFor="nf-password">Mật khẩu mới:</Label>
                                                    <InputGroup className="mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="icon-lock"></i>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input type="password" name="newPassword" id="newPassword" placeholder="Mật khẩu mới" autoComplete="new-password" onChange={this.handleInput} />
                                                    </InputGroup>
                                                    <FormText className="help-block">Vui lòng nhập mật khẩu mới</FormText>
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Mật khẩu mới', this.state.newPassword, 'required|min:6|max:50|alpha_num')}
                                                    </span>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label htmlFor="nf-password">Xác nhận mật khẩu mới:</Label>
                                                    <InputGroup className="mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="icon-lock"></i>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Nhập lại mật khẩu mới" autoComplete="confirm-password" onChange={this.handleInput} onKeyDown={this.handleKeyDown} />
                                                    </InputGroup>
                                                    <FormText className="help-block">Vui lòng xác nhận lại mật khẩu mới</FormText>
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Nhập lại mật khẩu mới', this.state.confirmPassword, 'required')}
                                                    </span>
                                                    <span className="form-error is-visible text-danger">
                                                        {validatorConfirmPassword}
                                                    </span>
                                                </FormGroup>
                                            </Form>
                                            <ToastContainer />
                                        </CardBody>
                                        <CardFooter className="p-4">
                                            <Row>
                                                <Col xs="12" sm="6">
                                                    <Button type="reset" color="warning" onClick={() => this.handleReset()} type="reset" block><span>Reset</span></Button>
                                                </Col>
                                                <Col xs="12" sm="6">
                                                    <Button onClick={() => this.handleSubmit()} color="primary" block>Đặt lại mật khẩu</Button>
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                )
        );
    }
}

export default ChangePassword;
