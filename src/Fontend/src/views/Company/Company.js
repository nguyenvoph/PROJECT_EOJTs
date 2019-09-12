import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { initializeApp } from '../hr/invitation/push-notification';
import CKEditor from '@ckeditor/ckeditor5-react';
import firebase from 'firebase/app';
import 'firebase/storage';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';

const storage = firebase.storage();

class Company extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            image: null,
            logo: '',
            loading: true,
            business_name: '',
            business_eng_name: '',
            business_overview: '',
            email: '',
            business_address: '',
            business_phone: '',
            business_website: '',
        }
    }

    async componentDidMount() {
        const business = await ApiServices.Get("/business/getBusiness");

        if (business !== null) {
            this.setState({
                loading: false,
                logo: business.logo,
                business_name: business.business_name,
                business_eng_name: business.business_eng_name,
                business_overview: business.business_overview,
                email: business.email,
                business_address: business.business_address,
                business_phone: business.business_phone,
                business_website: business.business_website
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleChange = (event) => {
        if (event.target.files[0]) {
            const image = event.target.files[0];
            var output = document.getElementById('img_logo');
            output.src = URL.createObjectURL(image);
            this.setState({
                image: image
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            logo: '',
            business_name: '',
            business_eng_name: '',
            business_overview: '',
            business_address: '',
            business_phone: '',
            business_website: ''
        })
    }

    uploadImageToFireBase = async () => {
        let { image } = this.state;

        if (image !== null) {
            const uploadTask = await storage.ref(`images/${image.name}`).put(image);
            await storage.ref('images').child(image.name).getDownloadURL().then(url => {
                this.setState({
                    logo: url
                })
            })
        }

        // uploadTask.on('state_changed',
        //     (snapshot) => {
        //         // progress function
        //     },
        //     (error) => {
        //         console.log(error);
        //     },
        //     () => {
        //         //complete function
        //         storage.ref('images').child(image.name).getDownloadURL().then(url => {
        //             this.setState({
        //                 logo: url
        //             })
        //             console.log("logo", this.state.logo);
        //         })
        //     })
    }

    saveBusiness = async () => {
        let { logo, business_name, business_eng_name, business_overview, email,
            business_address, business_phone, business_website, loading } = this.state;

        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })
            var company = {
                logo, business_name, business_eng_name, business_overview, email,
                business_address, business_phone, business_website
            }

            const result = await ApiServices.Put('/business/updateBusiness', company);

            if (result.status === 200) {
                Toastify.actionSuccess('Cập nhật thông tin thành công');
                this.props.history.push(`/Business_Detail/${email}`);
            } else {
                Toastify.actionFail('Cập nhật thông tin thất bại');
                this.setState({
                    loading: false
                })
            }

        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    handleSubmit = async () => {
        await this.uploadImageToFireBase();
        await this.saveBusiness();
    }

    render() {
        const { logo, business_name, business_eng_name, business_overview, email,
            business_address, business_phone, business_website, loading } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <ToastContainer />
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <h4>Thông tin công ty</h4>
                                        {/* <Col xs="3" sm="3">
                                    <Button style={{ marginLeft: "800px" }} block color="primary" onClick={() => this.handleDirect("/company/update")}><i className="fa cui-note"></i></Button>
                                </Col> */}
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Logo</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <img src={logo} style={{ width: "160px", height: "160px" }} onChange={this.handleInput} type="file" id="img_logo" name="logo" />
                                                    <br /><br />
                                                    <input onChange={this.handleChange} type="file"/>
                                                    <br /><br />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Logo', logo, 'required')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Email</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <label type="text" id="email" name="email">{email}</label>
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('email', email, 'required|email')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Tên doanh nghiệp</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_name} onChange={this.handleInput} type="text" id="business_name" name="business_name" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Tên doanh nghiệp', business_name, 'required|min:7|max:50|alpha_num_space')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Tên tiếng Anh</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_eng_name} onChange={this.handleInput} type="text" id="business_eng_name" name="business_eng_name" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Tên tiếng Anh', business_eng_name, 'required|min:3|max:15|alpha_num_space')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>SĐT</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_phone} onChange={this.handleInput} type="number" id="business_phone" name="business_phone" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Số điện thoại', business_phone, 'required|min:10|max:11|numeric')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Website</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_website} onChange={this.handleInput} type="text" id="business_website" name="business_website" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Website của doanh nghiệp', business_website, 'required|min:5|max:20')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Địa chỉ</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_address} onChange={this.handleInput} type="text" id="business_address" name="business_address" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Địa chỉ', business_address, 'required|min:7|max:100|alpha_num_dot_splash')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Giới thiệu</h6>
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
                                            {/* <FormGroup row>
                                        <Col md="2">
                                            <h6>Image</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value="Đây là 1 gallery" onChange={this.handleInput} type="text" id="timeStartOJT" name="timeStartOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStartOJT', this.state.timeStartOJT, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup> */}
                                        </Form>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row >
                                            <Col xs="4" sm="4">
                                                <Button color="secondary" block onClick={() => this.handleDirect(`/Business_Detail/${email}`)}>Trở về</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Xác nhận</Button>
                                            </Col>
                                            {/* <Col xs="3" sm="3">
                                        <Button color="success" block onClick={() => this.handleDirect("/company")} type="reset">Trở về</Button>
                                    </Col> */}
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

export default Company;
