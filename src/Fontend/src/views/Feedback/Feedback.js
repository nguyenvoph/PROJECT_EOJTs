import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { FormGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import decode from 'jwt-decode';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class Feedback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            searchValue: '',
        };
    }

    async componentDidMount() {
        this.setState({
            loading: false,
        });
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { loading, searchValue } = this.state;
        // let filteredListStudents;
        // if (students !== null) {
        //     filteredListStudents = students.filter(
        //         (student) => {
        //             if (student.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
        //                 return student;
        //             }
        //         }
        //     );
        // }
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Phản hồi
                                    </CardHeader>
                                    <CardBody>
                                        <div>
                                            <nav className="navbar navbar-light bg-light justify-content-between">
                                                <form className="form-inline">
                                                    <input readOnly onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                                </form>
                                            </nav>
                                            <Table responsive striped>
                                                <thead>
                                                    <tr>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>MSSV</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Họ và tên</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Email</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Chuyên ngành</th>
                                                        {/* <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Mức độ hài lòng</th> */}
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* {filteredListStudents && filteredListStudents.map((student, index) => {
                                                        return ( */}
                                                    <tr>
                                                        <td style={{ textAlign: "center" }}>1</td>
                                                        <td style={{ textAlign: "center" }}>SE60001</td>
                                                        <td style={{ textAlign: "center" }}>Nguyễn Văn A</td>
                                                        <td style={{ textAlign: "center" }}>nguyenvana@gmail.com</td>
                                                        <td style={{ textAlign: "center" }}>IS</td>
                                                        {/* <td style={{ textAlign: "center", fontSize:'18.5px'}}>
                                                            <Badge className="mr-1" color="primary" pill>9.5</Badge>
                                                        </td> */}
                                                        <td style={{ textAlign: "center" }}>
                                                            <Button color="primary" onClick={() => this.handleDirect(`/Feedback/Feedback_Detail/1`)}><i className="fa fa-eye"></i></Button>
                                                        </td>
                                                    </tr>
                                                    {/* )
                                                    })
                                                    } */}
                                                </tbody>
                                            </Table>
                                        </div>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}
export default Feedback;
