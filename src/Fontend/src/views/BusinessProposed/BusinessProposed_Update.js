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
import Toastify from '../Toastify/Toastify';

const storage = firebase.storage();

class BusinessProposed_Update extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            id: '',
            business_name: '',
            business_eng_name: '',
            business_overview: '',
            email: '',
            business_address: '',
            business_phone: '',
            business_website: '',
            business: ''
        }
    }

    async componentDidMount() {
        const id = window.location.href.split("/").pop();
        const business = await ApiServices.Get(`/heading/id?id=${id}`);

        if (business !== null) {
            this.setState({
                loading: false,
                id: business.id,
                business_name: business.business_name,
                business_eng_name: business.business_eng_name,
                business_overview: business.business_overview,
                email: business.email,
                business_address: business.business_address,
                business_phone: business.business_phone,
                business_website: business.business_website,
                business: business
            });
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
            business_name: '',
            business_eng_name: '',
            business_overview: '',
            business_address: '',
            business_phone: '',
            business_website: ''
        })
    }

    saveBusiness = async () => {
        let { id, business_name, business_eng_name, business_overview, email,
            business_address, business_phone, business_website, business } = this.state;

        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })
            var company = {
                id, business_name, business_eng_name, business_overview, email,
                business_address, business_phone, business_website,
                logo: business.logo,
                business_nationality: business.business_nationality,
                business_field_of_activity: business.business_field_of_activity,
                isAcceptedByStartupRoom: business.isAcceptedByStartupRoom,
                isAcceptedByHeadOfTraining: business.isAcceptedByHeadOfTraining,
                isAcceptedByHeadMaster: business.isAcceptedByHeadMaster,
                student_proposed: business.student_proposed,
                commentStartupRoom: business.commentStartupRoom,
                commentHeadOfTraining: business.commentHeadOfTraining,
                commentHeadOfMaster: business.commentHeadOfMaster,
                scale: business.scale
            }

            const result = await ApiServices.Put('/heading', company);

            if (result.status === 200) {
                Toastify.actionSuccess('Cập nhật thông tin thành công');
                this.setState({
                    loading: false
                })
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
        await this.saveBusiness();
    }

    render() {
        const { id, business_name, business_eng_name, business_overview, email,
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
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Email</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={email} onChange={this.handleInput} type="text" id="email" name="email" />
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
                                        </Form>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="4" md="4">
                                                <Button color="secondary" block onClick={() => this.handleDirect(`/admin/business-proposed/${id}`)} type="submit">Trở về</Button>
                                            </Col>
                                            <Col xs="4" md="4">
                                                <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="4" md="4">
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="success" block>Xác nhận</Button>
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

export default BusinessProposed_Update;
