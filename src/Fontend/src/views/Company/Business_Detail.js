import firebase from 'firebase/app';
import 'firebase/storage';
import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Label, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';


// // Your web app's Firebase configuration
// var firebaseConfig = {
//     apiKey: "AIzaSyBZRXJdcBsa3i0QXfFKsvNxWhn_1mKjmmc",
//     authDomain: "eojts-ddc9e.firebaseapp.com",
//     databaseURL: "https://eojts-ddc9e.firebaseio.com",
//     projectId: "eojts-ddc9e",
//     storageBucket: "gs://eojts-ddc9e.appspot.com",
//     messagingSenderId: "365126484633",
//     appId: "1:365126484633:web:623e362d3746d457"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);


const storage = firebase.storage();

class Company extends Component {

    constructor(props) {
        super(props);
        this.state = {
            business: null,
            loading: true,
            role: '',
        }
    }

    async componentDidMount() {
        const businessEmail = window.location.href.split("/").pop();
        let business = await ApiServices.Get(`/business/business?email=${businessEmail}`);
        const token = localStorage.getItem('id_token');
        let role = '';
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
        }
        if (role === "ROLE_HR") {
            business = await ApiServices.Get("/business/getBusiness");
        }
        console.log(role);
        if (business !== null) {
            this.setState({
                business: business,
                loading: false,
                role: role,
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { business, loading, role } = this.state;
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
                                        {/* <FormGroup row>
                                            <Col md="2"> */}
                                        <h4>Thông tin công ty &nbsp;&nbsp;
                                                {role === "ROLE_HR" ?
                                                <Button color="primary" onClick={() => this.handleDirect('/company')}><i className="fa cui-note"></i></Button> :
                                                <></>
                                            }</h4>
                                        {/* </Col>
                                            <Col md="10">
                                            </Col>
                                        </FormGroup> */}
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Logo</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {business === null ?
                                                        <></> :
                                                        (business.logo === null ?
                                                            <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" style={{ width: "160px", height: "160px" }} alt={business.business_name}/> :
                                                            <img src={business.logo} className="img-avatar" style={{ width: "160px", height: "160px" }}  alt={business.business_name}/>
                                                        )
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Email</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {business === null ?
                                                        <></> :
                                                        <Label>{business.email} &nbsp;&nbsp; <Button color="primary" onClick={() => this.handleDirect("/account/changepassword")} outline>Đổi mật khẩu</Button>
                                                        </Label>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Tên doanh nghiệp</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {business === null ?
                                                        <></> :
                                                        <Label>{business.business_name}</Label>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Tên tiếng Anh</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {business === null ?
                                                        <></> :
                                                        <Label>{business.business_eng_name}</Label>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>SĐT</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {business === null ?
                                                        <></> :
                                                        <Label>{business.business_phone}</Label>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Website</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {business === null ?
                                                        <></> :
                                                        <Label>{business.business_website}</Label>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Địa chỉ</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {business === null ?
                                                        <></> :
                                                        <Label>{business.business_address}</Label>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Giới thiệu</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {business === null ?
                                                        <></> :
                                                        <Label>{business.business_overview}</Label>
                                                    }
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
                                    {role === "ROLE_ADMIN" ?
                                        <CardFooter className="p-4">
                                            <FormGroup row>
                                                <Col xs="4" md="4">
                                                    <Button block color="secondary" onClick={() => this.handleDirect('/admin/list_management/business_list')}>
                                                        Trở về
                                                </Button>
                                                </Col>
                                            </FormGroup>
                                        </CardFooter>
                                        : <></>}
                                </Card>
                            </Col>
                        </Row>
                    </div >
                )
        );
    }
}

export default Company;
