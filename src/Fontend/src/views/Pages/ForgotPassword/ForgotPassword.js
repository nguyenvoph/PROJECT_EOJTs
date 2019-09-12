import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import ApiServices from '../../../service/api-service';
import Toastify from '../../Toastify/Toastify';
import SpinnerLoading from '../../../spinnerLoading/SpinnerLoading';

class FotgotPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      emailReset: '',
      messageError: '',
      loading: false,
    };
  }

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.handleReset();
      // alert('Enter pressed');
    }
  }

  handleInput = async (event) => {
    let messageError = '';
    const { name, value } = event.target;
    await this.setState({
      [name]: value,
      messageError: messageError,
    })
  }

  handleBack = async () => {
    this.props.history.push('/login');
  }

  handleReset = async () => {
    this.setState({
      loading: true,
    })
    const emailReset = this.state.emailReset;
    let messageError = '';
    const result = await ApiServices.PutWithoutToken(`/account/reset?email=${emailReset}`);
    console.log(result);
    if (result.status === 200) {
      Toastify.actionSuccess("Một email vừa được gửi đến tài khoản của bạn! Vui lòng kiểm tra!");
      this.setState({
        loading: false,
      })
    } else {
      Toastify.actionFail("Tài khoản đã bị vô hiệu hoá hoặc không tồn tại trong hệ thống!");
      // messageError = "Tài khoản đã bị vô hiệu hoá hoặc không tồn tại trong hệ thống!";
      this.setState({
        // messageError: messageError,
        loading: false,
      })
    }
  }

  render() {
    const { messageError, loading } = this.state;
    return (
      loading.toString() === 'true' ? (
        SpinnerLoading.showHashLoader(loading)
      ) : (
          <div className="app flex-row align-items-center backgroundFPT">
            <Container>
              <Row className="justify-content-center">
                <Col md="9" lg="7" xl="6">
                  <Card className="mx-4 text-white bg-primary">
                    <CardBody className="p-4">
                      <Form>
                        <h1>Quên mật khẩu</h1>
                        <p className="text-muted" style={{fontWeight:"bold"}}>Email khởi tạo mật khẩu mới</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" onChange={this.handleInput} onKeyDown={this.handleKeyDown} name="emailReset" placeholder="Email" autoComplete="Email" />
                        </InputGroup>
                        {/* <span className="form-error is-visible" style={{fontWeight:"bold", color:"#FE8007"}}>
                          {messageError}
                        </span> */}
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
                      <ToastContainer />
                    </CardBody>
                    <CardFooter className="p-4 bg-white">
                      <Row>
                        <Col xs="12" sm="6">
                          <Button onClick={this.handleBack} block color="secondary"><span>Trở về</span></Button>
                        </Col>
                        <Col xs="12" sm="6">
                          <Button color="success" onClick={this.handleReset} block>Đặt lại mật khẩu</Button>
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

export default FotgotPassword;
