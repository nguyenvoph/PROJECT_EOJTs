import firebase from 'firebase/app';
import 'firebase/storage';
import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Label, Row } from 'reactstrap';
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

class Account_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            logo: null,
            role: '',
            linkProfile: '',
            actor: null,
            loading: true,
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        if (token !== null) {
            const decoded = decode(token);
            const email = decoded.email;
            const role = decoded.role;
            let actor = null;
            let username = '';
            let logo = null;
            let linkProfile = '';
            if (role === "ROLE_ADMIN" || role === "ROLE_STARTUP" || role === "ROLE_HEADTRAINING" || role === "ROLE_HEADMASTER") {
                actor = await ApiServices.Get(`/admin/getCurrentUser`);
                if (actor !== null) {
                    username = actor.name;
                    logo = actor.logo;
                }
            } else if (role === "ROLE_SUPERVISOR") {
                let tmpActor = await ApiServices.Get(`/supervisor`);
                actor = tmpActor.supervisor;
                if (actor !== null) {
                    username = actor.name;
                    logo = actor.logo;
                }
            }
            this.setState({
                loading: false,
                email: email,
                role: role,
                username: username,
                logo: logo,
                linkProfile: linkProfile,
                actor: actor,
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { actor, loading } = this.state;
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
                                        <h4>Thông tin tài khoản &nbsp;&nbsp;<Button color="primary" onClick={() => this.handleDirect('/account_detail/account_update')}><i className="fa cui-note"></i></Button></h4>
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
                                                    {actor === null ?
                                                        <></> :
                                                        (actor.logo === null ?
                                                            <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" style={{ width: "160px", height: "160px" }} alt={actor.name} /> :
                                                            <img src={actor.logo} className="img-avatar" style={{ width: "160px", height: "160px" }} alt={actor.name} />
                                                        )
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Email</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {actor === null ?
                                                        <></> :
                                                        <Label>{actor.email} &nbsp;&nbsp; <Button color="primary" onClick={() => this.handleDirect("/account/changepassword")} outline>Đổi mật khẩu</Button>
                                                        </Label>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Tên</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {actor === null ?
                                                        <></> :
                                                        <Label>{actor.name}</Label>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>SĐT</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {actor === null ?
                                                        <></> :
                                                        <Label>{actor.phone}</Label>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Địa chỉ</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {actor === null ?
                                                        <></> :
                                                        <Label>{actor.address}</Label>
                                                    }
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                    {/* <CardFooter className="p-4">
                                        <FormGroup row>
                                            <Col xs="4" md="4">
                                                <Button block color="secondary" onClick={() => this.handleDirect('/admin/list_management/business_list')}>
                                                    Trở về
                                                </Button>
                                            </Col>
                                        </FormGroup>
                                    </CardFooter> */}
                                </Card>
                            </Col>
                        </Row>
                    </div >
                )
        );
    }
}

export default Account_Detail;
