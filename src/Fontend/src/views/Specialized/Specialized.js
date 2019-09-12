import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Label, Badge, Button, Card, CardBody, CardHeader, Col, Input, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';

class Specialized extends Component {

    constructor(props) {
        super(props);
        this.state = {
            specializeds: [],
            loading: true,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,
            numOfSpecialized: 0,
            searchingList: [],
            isSearching: false,
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleConfirm = (specialized, status) => {

        var messageStatus = '';
        if (status) {
            messageStatus = 'kích hoạt';
        } else {
            messageStatus = 'vô hiệu';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn ${messageStatus} chuyên ngành '${specialized.name}' ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleUpdateStatus(specialized.id, status)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handleUpdateStatus = async (id, status) => {
        const result = await ApiServices.Put(`/specialized/status?id=${id}&status=${status}`);
        // const specializeds = await ApiServices.Get('/specialized');
        // if (specializeds !== null) {
        //     this.setState({
        //         specializeds,
        //     });
        // }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }

        const { currentPage, rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (specializeds !== null) {
            this.setState({
                specializeds: specializeds.listData,
                currentPage,
                pageNumber: specializeds.pageNumber
            })
        }
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const numOfSpecialized =  await ApiServices.Get(`/specialized/searchSpecialized?valueSearch=${""}`);
        if (specializeds !== null) {
            this.setState({
                specializeds: specializeds.listData,
                pageNumber: specializeds.pageNumber,
                loading: false,
                numOfSpecialized: numOfSpecialized.length,
            });
        }
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        // const { specializeds, rowsPerPage } = this.state;
        if (specializeds !== null) {
            // const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
            // const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
            this.setState({
                //specializedsPagination,
                specializeds: specializeds.listData,
                currentPage,
                pageNumber: specializeds.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        // const { specializeds, rowsPerPage } = this.state;
        if (specializeds !== null) {
            // const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
            // const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
            this.setState({
                //specializedsPagination,
                specializeds: specializeds.listData,
                currentPage,
                pageNumber: specializeds.pageNumber
            })
        }
        // console.log('currentPage', currentPage);

        // const { specializeds, rowsPerPage } = this.state;
        // if (specializeds !== null) {
        //     const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
        //     const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
        //     this.setState({
        //         specializedsPagination,
        //         currentPage,
        //         pageNumber
        //     })
        // }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        // const { specializeds, rowsPerPage } = this.state;
        if (specializeds !== null) {
            // const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
            // const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
            this.setState({
                //specializedsPagination,
                specializeds: specializeds.listData,
                currentPage,
                pageNumber: specializeds.pageNumber
            })
        }
        // console.log('currentPage', currentPage);

        // const { specializeds, rowsPerPage } = this.state;
        // if (specializeds !== null) {
        //     const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
        //     const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
        //     this.setState({
        //         specializedsPagination,
        //         currentPage,
        //         pageNumber
        //     })
        // }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=0&rowsPerPage=${rowsPerPage}`);

        // const { specializeds, rowsPerPage } = this.state;
        if (specializeds !== null) {
            // const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
            // const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
            this.setState({
                //specializedsPagination,
                specializeds: specializeds.listData,
                currentPage: 0,
                pageNumber: specializeds.pageNumber
            })
        }

        // const { specializeds, rowsPerPage } = this.state;
        // if (specializeds !== null) {
        //     const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
        //     const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(0, rowsPerPage), getPaginationNextPageNumber(0, rowsPerPage));
        //     this.setState({
        //         specializedsPagination,
        //         currentPage: 0,
        //         pageNumber
        //     })
        // }

        // console.log(this.state.rowsPerPage);
    }

    handleInputSearch = async (event) => {
        const { name, value } = event.target;
        if (value === "" || !value.trim()) {
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: false,
            })
        } else {
            const specializeds = await ApiServices.Get(`/specialized/searchSpecialized?valueSearch=${value.substr(0, 20)}`);
            // console.log(specializeds);
            if (specializeds !== null) {
                this.setState({
                    [name]: value.substr(0, 20),
                    searchingList: specializeds,
                    isSearching: true,
                })
            }
        }
    }

    render() {
        const { specializeds, loading } = this.state;
        // const { specializedsPagination, pageNumber, currentPage, rowsPerPage } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;
        const { numOfSpecialized, isSearching, searchingList } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="15">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách chuyên ngành
                                    </CardHeader>
                                    <CardBody>
                                        <Button color="primary" onClick={() => this.handleDirect('/admin/specialized/create')}>Tạo chuyên ngành mới</Button>
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
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Tên Ngành</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Trạng thái</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {   isSearching === false ?
                                                    (specializeds && specializeds.map((specialized, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + i + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{specialized.name}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {specialized.status.toString() === 'true' ? (
                                                                        <Badge color="success">KÍCH HOẠT</Badge>
                                                                    ) : (
                                                                            <Badge color="danger">VÔ HIỆU HOÁ</Badge>
                                                                        )}
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {specialized.status.toString() === 'true' ? (
                                                                        <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(specialized, false)} type="submit"><i className="fa cui-ban"></i></Button>
                                                                    ) : (
                                                                            <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(specialized, true)} type="submit"><i className="fa cui-circle-check"></i></Button>
                                                                        )}
                                                                    <Button style={{ marginRight: "1.5px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/admin/specialized/update/${specialized.id}`)}><i className="fa cui-note"></i></Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })) :
                                                    (searchingList && searchingList.map((specialized, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{specialized.name}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {specialized.status.toString() === 'true' ? (
                                                                        <Badge color="success">KÍCH HOẠT</Badge>
                                                                    ) : (
                                                                            <Badge color="danger">VÔ HIỆU HOÁ</Badge>
                                                                        )}
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {specialized.status.toString() === 'true' ? (
                                                                        <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(specialized, false)} type="submit"><i className="fa cui-ban"></i></Button>
                                                                    ) : (
                                                                            <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(specialized, true)} type="submit"><i className="fa cui-circle-check"></i></Button>
                                                                        )}
                                                                    <Button style={{ marginRight: "1.5px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/admin/specialized/update/${specialized.id}`)}><i className="fa cui-note"></i></Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }))
                                                }
                                            </tbody>
                                        </Table>
                                        <ToastContainer />
                                        {specializeds && specializeds !== null ? (isSearching === false ?
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
                                                        <Label>Bạn đang xem kết quả từ {currentPage * rowsPerPage + 1} - {currentPage * rowsPerPage + specializeds.length} trên tổng số {numOfSpecialized} kết quả</Label>
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

export default Specialized;
