import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table, Pagination, Input, Label } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';

class User_Business extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businesses: [],
            loading: true,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,

            numOfAccBusiness: 0,
            searchingList: [],
            isSearching: false,
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleConfirm = (businessEmail, status) => {

        var messageStatus = '';
        if (status) {
            messageStatus = 'kích hoạt';
        } else {
            messageStatus = 'vô hiệu';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn ${messageStatus} tài khoản '${businessEmail}' ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleUpdateStatus(businessEmail, status)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handleUpdateStatus = async (email, status) => {
        const result = await ApiServices.Put(`/user/updateStatus?email=${email}&isActive=${status}`);
        const { currentPage, rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                pageNumber: businesses.pageNumber,
                loading: false
            });
        }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const numOfAccBusiness = await ApiServices.Get(`/user/searchUser?type=3&valueSearch=${""}`);
        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                pageNumber: businesses.pageNumber,
                loading: false,
                numOfAccBusiness: numOfAccBusiness.length,
            });
        }
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage: 0,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handleInputSearch = async (event) => {
        const { name, value } = event.target;
        if (value === "" || !value.trim()) {
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: false,
            })
        } else {
            const businesses = await ApiServices.Get(`/user/searchUser?type=3&valueSearch=${value.substr(0, 20)}`);
            // console.log(businesses);
            if (businesses !== null) {
                this.setState({
                    [name]: value.substr(0, 20),
                    searchingList: businesses,
                    isSearching: true,
                })
            }
        }
    }

    render() {
        const { businesses, loading, pageNumber, currentPage, rowsPerPage } = this.state;
        const { numOfAccBusiness, isSearching, searchingList } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="15">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách tài khoản doanh nghiệp
                                    </CardHeader>
                                    <CardBody>
                                        <Button color="primary" onClick={() => this.handleDirect('/admin/admin_account/businessList/create')}>Tạo tài khoản mới</Button>
                                        <br />
                                        <br />
                                        <br />
                                        <nav className="navbar navbar-light bg-light justify-content-between">
                                            <form className="form-inline">
                                                <input onChange={this.handleInputSearch} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                            </form>
                                        </nav>
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Email</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Vai trò</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Trạng thái</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isSearching === false ?
                                                    (
                                                        businesses && businesses.map((business, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                                    <td style={{ textAlign: "center" }}>{business.email}</td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {
                                                                            business.roles[0].description === 'ROLE_HR' ? ('HR') : ('')
                                                                        }
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {business.active.toString() === 'true' ? (
                                                                            <Badge color="success">KÍCH HOẠT</Badge>
                                                                        ) : (
                                                                                <Badge color="danger">VÔ HIỆU HOÁ</Badge>
                                                                            )}
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {business.active.toString() === 'true' ? (
                                                                            <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(business.email, false)} type="submit"><i className="fa cui-ban"></i></Button>
                                                                        ) : (
                                                                                <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(business.email, true)} type="submit"><i className="fa cui-circle-check"></i></Button>
                                                                            )}
                                                                        {/* <Button style={{ marginRight: "1.5px" }} type="submit" color="success" onClick={() => this.handleDirect(`/business/update/${business.id}`)}>Update</Button> */}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })) :
                                                    (
                                                        searchingList && searchingList.map((business, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                                    <td style={{ textAlign: "center" }}>{business.email}</td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {
                                                                            business.roles[0].description === 'ROLE_HR' ? ('HR') : ('')
                                                                        }
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {business.active.toString() === 'true' ? (
                                                                            <Badge color="success">KÍCH HOẠT</Badge>
                                                                        ) : (
                                                                                <Badge color="danger">VÔ HIỆU HOÁ</Badge>
                                                                            )}
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {business.active.toString() === 'true' ? (
                                                                            <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(business.email, false)} type="submit"><i className="fa cui-ban"></i></Button>
                                                                        ) : (
                                                                                <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(business.email, true)} type="submit"><i className="fa cui-circle-check"></i></Button>
                                                                            )}
                                                                        {/* <Button style={{ marginRight: "1.5px" }} type="submit" color="success" onClick={() => this.handleDirect(`/business/update/${business.id}`)}>Update</Button> */}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }))
                                                }
                                            </tbody>
                                        </Table>
                                        <ToastContainer />
                                        {businesses && businesses !== null ? (isSearching === false ?
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <Pagination>
                                                            <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                                        </Pagination>
                                                        &emsp;
                                                        <h6 style={{ marginTop: '7px' }}>Số dòng trên trang: </h6>
                                                        &nbsp;&nbsp;
                                                        <Input onChange={this.handleInput} type="select" name="rowsPerPage" style={{ width: "70px" }}>
                                                            <option value={10} selected={rowsPerPage === 10}>10</option>
                                                            <option value={20}>20</option>
                                                            <option value={50}>50</option>
                                                        </Input>
                                                    </Row>
                                                </Col>
                                                <Col>
                                                    <Row className="float-right">
                                                        <Label>Bạn đang xem kết quả từ {currentPage * rowsPerPage + 1} - {currentPage * rowsPerPage + businesses.length} trên tổng số {numOfAccBusiness} kết quả</Label>
                                                    </Row>
                                                </Col>
                                            </Row> : <></>) : <></>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default User_Business;
