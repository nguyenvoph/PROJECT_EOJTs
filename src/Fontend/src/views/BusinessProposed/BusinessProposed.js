import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class BusinessProposed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businesses: null,
            searchValue: '',
            loading: true,
            role: '',
        };
    }

    async componentDidMount() {

        const token = localStorage.getItem('id_token');
        let role = '';
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
        }

        this.setState({
            role: role
        });

        if (role === 'ROLE_ADMIN') {
            const businesses = await ApiServices.Get('/heading');
            if (businesses !== null) {
                this.setState({
                    businesses,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        } 
        // else if (role === 'ROLE_HEADTRAINING') {
        //     const businesses = await ApiServices.Get('/heading');
        //     var listBusinesses = [];

        //     businesses && businesses.map((business, index) => {
        //         if (business.isAcceptedByStartupRoom === 'ACCEPTED') {
        //             listBusinesses.push(business);
        //         }
        //     })

        //     if (listBusinesses !== null) {
        //         this.setState({
        //             businesses: listBusinesses,
        //             loading: false
        //         });
        //     } else {
        //         this.setState({
        //             loading: false
        //         });
        //     }
        // } else if (role === 'ROLE_HEADMASTER') {
        //     const businesses = await ApiServices.Get('/heading');
        //     var listBusinesses = [];

        //     businesses && businesses.map((business, index) => {
        //         if (business.isAcceptedByStartupRoom === 'ACCEPTED' && business.isAcceptedByHeadOfTraining === 'ACCEPTED') {
        //             listBusinesses.push(business);
        //         }
        //     })

        //     if (listBusinesses !== null) {
        //         this.setState({
        //             businesses: listBusinesses,
        //             loading: false
        //         });
        //     } else {
        //         this.setState({
        //             loading: false
        //         });
        //     }
        // }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    showStatus(status) {
        if (status === 'ACCEPTED') {
            return (
                <Badge color="success">ĐƯỢC CHẤP NHẬN</Badge>
            )
        } else if (status === 'REJECTED') {
            return (
                <Badge color="danger">BỊ TỪ CHỐI</Badge>
            )
        } else {
            return (
                <Badge color="warning">ĐANG CHỜ PHÊ DUYỆT</Badge>
            )
        }
    }

    render() {
        const { businesses, searchValue, loading, role } = this.state;
        let filteredListBusinesses;
        if (businesses !== null) {
            filteredListBusinesses = businesses.filter(
                (business) => {
                    if (business.business_name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        return business;
                    }
                }
            );
        }
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Danh sách doanh nghiệp đề xuất
                                    </CardHeader>
                                    <CardBody>
                                        <div>
                                            <nav className="navbar navbar-light bg-light justify-content-between">
                                                <form className="form-inline">
                                                    <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                                </form>
                                            </nav>
                                            <Table responsive striped>
                                                <thead>
                                                    <tr>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Tên doanh nghiệp</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Đề xuất bởi</th>
                                                        {/* {
                                                            (role === 'ROLE_STARTUP' || role === 'ROLE_HEADTRAINING' || role === 'ROLE_HEADMASTER') ? (
                                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Ý kiến phòng khởi nghiệp</th>
                                                            ) : (
                                                                    <th></th>
                                                                )
                                                        }
                                                        {
                                                            (role === 'ROLE_HEADTRAINING' || role === 'ROLE_HEADMASTER') ? (
                                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Ý kiến phòng đào tạo</th>
                                                            ) : (
                                                                    <th></th>
                                                                )
                                                        }
                                                        {
                                                            (role === 'ROLE_HEADMASTER') ? (
                                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Ý kiến ban giám hiệu</th>
                                                            ) : (
                                                                    <th></th>
                                                                )
                                                        } */}
                                                        {
                                                            (role === 'ROLE_ADMIN') ? (
                                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Ý kiến của nhà trường</th>
                                                            ) : (
                                                                    <th></th>
                                                                )
                                                        }
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredListBusinesses && filteredListBusinesses.map((business, index) => {
                                                        return (
                                                            <tr>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{business.business_name}</td>
                                                                <td style={{ textAlign: "center" }}>{business.student_proposed.name}</td>
                                                                {
                                                                    (role === 'ROLE_ADMIN') ? (
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {
                                                                                this.showStatus(business.isAcceptedByAdmin)
                                                                            }
                                                                        </td>
                                                                    ) : (
                                                                            <></>
                                                                        )
                                                                }
                                                                {/* {
                                                                    (role === 'ROLE_STARTUP' || role === 'ROLE_HEADTRAINING' || role === 'ROLE_HEADMASTER') ? (
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {
                                                                                this.showStatus(business.isAcceptedByStartupRoom)
                                                                            }
                                                                        </td>
                                                                    ) : (
                                                                            <td></td>
                                                                        )
                                                                }
                                                                {
                                                                    (role === 'ROLE_HEADTRAINING' || role === 'ROLE_HEADMASTER') ? (
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {
                                                                                this.showStatus(business.isAcceptedByHeadOfTraining)
                                                                            }
                                                                        </td>
                                                                    ) : (
                                                                            <td></td>
                                                                        )
                                                                }
                                                                {
                                                                    (role === 'ROLE_HEADMASTER') ? (
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {
                                                                                this.showStatus(business.isAcceptedByHeadMaster)
                                                                            }
                                                                        </td>
                                                                    ) : (
                                                                            <td></td>
                                                                        )
                                                                } */}
                                                                <td style={{ textAlign: "center" }}>
                                                                    <Button style={{ width: "100px" }}
                                                                        color="primary"
                                                                        onClick={() => this.handleDirect(`/admin/business-proposed/${business.id}`)}>
                                                                        Chi tiết
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    {/* <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/hr/invitation")} type="submit" color="primary" block>Trở về</Button>
                                    </Col>
                                </Row>
                            </CardFooter> */}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default BusinessProposed;
