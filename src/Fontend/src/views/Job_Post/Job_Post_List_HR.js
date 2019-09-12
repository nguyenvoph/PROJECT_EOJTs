import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../Toastify/Toastify';


class Job_Post_List_HR extends Component {

    constructor(props) {
        super(props);
        this.state = {
            job_posts: null,
            loading: true
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleUpdateStatus = async (id, status) => {
        const result = await ApiServices.Put(`/job_post/status?id=${id}&status=${status}`);
        const job_posts = await ApiServices.Get('/job_post');
        if (job_posts !== null) {
            this.setState({
                job_posts,
            });
        }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const job_posts_business = await ApiServices.Get('/business/getAllJobPostABusiness');
        let job_postList = [];
        for (let i = 0; i < job_posts_business.length; i++) {
            job_postList.push(job_posts_business[i].job_post);
        }

        if (job_posts_business !== null) {
            this.setState({
                job_posts: job_postList,
                loading: false
            });
        }
    }


    render() {
        const { job_posts, loading } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="15">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách bài đăng tuyển dụng
                            </CardHeader>
                                    <CardBody>
                                        <Button color="primary" onClick={() => this.handleDirect('/hr/job_post_list_hr/add_job_post')}>Tạo bài đăng mới</Button>
                                        <br />
                                        <br />
                                        <br />
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Mô tả công việc</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Quy trình tuyển</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Thời gian đăng</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Phúc lợi</th>
                                                    {/* <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Thông tin liên hệ</th> */}
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    job_posts && job_posts.map((job_post, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        job_post.description.length > 30 ? (job_post.description.replace(job_post.description.substr(31, job_post.description.length), " ...")) : (job_post.description)
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        job_post.interview_process.length > 30 ? (job_post.interview_process.replace(job_post.interview_process.substr(31, job_post.interview_process.length), " ...")) : (job_post.interview_process)
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>{job_post.timePost}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        job_post.interest.length > 30 ? (job_post.interest.replace(job_post.interest.substr(31, job_post.interest.length), " ...")) : (job_post.interest)
                                                                    }
                                                                </td>
                                                                {/* <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        job_post.contact.length > 30 ? (job_post.contact.replace(job_post.contact.substr(31, job_post.contact.length), " ...")) : (job_post.contact)
                                                                    }
                                                                </td> */}
                                                                <td style={{ textAlign: "center" }}>
                                                                    <Button type="submit" onClick={() => this.handleDirect(`/job-post/${job_post.id}`)} color="primary"><i className="fa fa-eye"></i></Button>
                                                                    {/* <Button type="submit" style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleDirect(`/product/update/${job_post.id}`)}>Update</Button> */}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                        <ToastContainer />
                                        {/* <Pagination>
                                        <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                    </Pagination> */}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default Job_Post_List_HR;
