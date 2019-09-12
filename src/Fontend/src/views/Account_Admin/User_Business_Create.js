import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../Toastify/Toastify';

class User_Business_Create extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: false,
            email: '',
            business_address: '',
            business_eng_name: '',
            business_name: '',
            business_overview: '',
            business_phone: '',
            business_website: '',
            nameSemester: '',

            isExisted: true,
        }
    }

    async componentDidMount() {
        var month = new Date().getMonth() + 1; //Current Month.
        var year = new Date().getFullYear(); //Current Year.
        // console.log(month);
        let nameSemester = "";
        if (parseInt(month) === 11 || parseInt(month) === 12 || parseInt(month) === 1 || parseInt(month) === 2) {
            nameSemester = "SPRING" + year;
        } else if (parseInt(month) === 3 || parseInt(month) === 4 || parseInt(month) === 5 || parseInt(month) === 6) {
            nameSemester = "SUMMER" + year;
        } else if (parseInt(month) === 7 || parseInt(month) === 8 || parseInt(month) === 9 || parseInt(month) === 10) {
            nameSemester = "FALL" + year;
        }
        const isExisted = await ApiServices.Get(`/admin/checkSemester?semesterName=${nameSemester}`);
        if (isExisted === true) {
            this.setState({
                nameSemester: nameSemester,
                isExisted: true,
            })
        } else {
            this.setState({
                isExisted: false,
            })
        }
        // console.log(this.state.start_choose_option_time);
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
            business_address: '',
            business_eng_name: '',
            business_name: '',
            business_overview: '',
            business_phone: '',
            business_website: '',
            nameSemester: '',
        })
    }

    handleSubmit = async () => {
        const { email, business_address, business_eng_name, business_name,
            business_overview, business_phone, business_website, nameSemester } = this.state;
        const business = {
            email,
            business_address,
            business_eng_name,
            business_name,
            business_overview,
            business_phone,
            business_website,
            nameSemester,
        }

        console.log(business);

        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })
            const result = await ApiServices.Post('/business/new', business);
            if (result.status === 201) {
                Toastify.actionSuccess("Tạo tài khoản mới thành công!");
                this.setState({
                    loading: false
                })
                setTimeout(
                    function () {
                        this.props.history.push('/admin/admin_account/businessList');
                    }
                        .bind(this),
                    2000
                );
            }else if (result.status === 417) {
              Toastify.actionFail("Tài khoản đã tồn tại. Vui lòng thử lại!");
            } else {
                Toastify.actionFail("Tạo tài khoản mới thất bại!");
                this.setState({
                    loading: false
                })
            }
        }  else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }


    render() {
        const { email, business_address, business_eng_name, business_name,
            business_overview, business_phone, business_website, loading, isExisted } = this.state;
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
                                                    <Input value={email} onChange={this.handleInput} type="text" name="email" placeholder="Email" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('email', email, 'required')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_name">Tên doanh nhiệp</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_name} onChange={this.handleInput} type="text" name="business_name" placeholder="Tên doanh nghiệp" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Tên doanh nghiệp', business_name, 'required|min:7|max:50|alpha_num_space')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_eng_name">Tên tiếng anh</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_eng_name} onChange={this.handleInput} type="text" name="business_eng_name" placeholder="Tên tiếng anh" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Tên tiếng Anh', business_eng_name, 'required|min:3|max:15|alpha_num_space')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_website">Website</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_website} onChange={this.handleInput} type="text" name="business_website" placeholder="Website" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Website của doanh nghiệp', business_website, 'required|min:5|max:20')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_phone">SĐT</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_phone} onChange={this.handleInput} type="number" name="business_phone" placeholder="Số điện thoại" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Số điện thoại', business_phone, 'required|min:10|max:11|numeric')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_address">Địa chỉ</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_address} onChange={this.handleInput} type="text" name="business_address" placeholder="Địa chỉ" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Địa chỉ', business_address, 'required|min:7|max:100|alpha_num_dot_splash')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="nameSemester">Học kì</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {isExisted === true ?
                                                        <Input value={this.state.nameSemester} onChange={this.handleInput} type="text" name="nameSemester" placeholder="Học kì" readOnly /> :
                                                        <>
                                                            <Input value={this.state.nameSemester} onChange={this.handleInput} type="text" name="nameSemester" placeholder="Học kì" />
                                                            <span className="form-error is-visible text-danger">
                                                                {this.validator.message('Học kì', this.state.nameSemester, 'required|alpha_num_space|min:8|max:10')}
                                                            </span>
                                                        </>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_overview">Giới thiệu</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={business_overview}
                                                        onChange={(event, editor) => {
                                                            this.setState({
                                                                business_overview: editor.getData(),
                                                            })
                                                        }}
                                                    />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Giới thiệu', business_overview, 'required|max:255')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                        <ToastContainer />
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="4" sm="4">
                                                <Button color="secondary" block onClick={() => this.handleDirect('/admin/admin_account/businessList')}>Trở về</Button>
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

export default User_Business_Create;
