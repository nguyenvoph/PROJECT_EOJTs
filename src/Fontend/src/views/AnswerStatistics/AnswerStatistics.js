import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import React, { Component } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';


const options = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    maintainAspectRatio: false
}

class AnswerStatistics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            result: [],
        }
    }

    async componentDidMount() {
        const result = await ApiServices.Get("/admin/statisticalQuestionAnswer");
        console.log(result);
        if (result !== null) {
            this.setState({
                loading: false,
                result: result
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { loading, result } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <h5>Thống kê kết quả khảo sát</h5>
                                    </CardHeader>
                                    {
                                        result && result.map((data, index) => {
                                            const others = data.others;
                                            var bar = {
                                                labels: data.answers,
                                                datasets: [
                                                    {
                                                        label: 'Số lượng sinh viên',
                                                        backgroundColor: 'rgba(255,99,132,0.2)',
                                                        borderColor: 'rgba(255,99,132,1)',
                                                        borderWidth: 1,
                                                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                                                        hoverBorderColor: 'rgba(255,99,132,1)',
                                                        data: data.countAnswer
                                                    },
                                                ],
                                            }
                                            var doughnut = {
                                                labels: data.answers,
                                                datasets: [
                                                    {
                                                        data: data.countAnswer,
                                                        backgroundColor: [
                                                            '#FF6384',
                                                            '#36A2EB',
                                                            '#EEE8AA',
                                                            '#00FF00',
                                                            '#C0C0C0'
                                                        ],
                                                        hoverBackgroundColor: [
                                                            '#FF6384',
                                                            '#36A2EB',
                                                            '#EEE8AA',
                                                            '#00FF00',
                                                            '#C0C0C0'
                                                        ],
                                                    }],
                                            }
                                            return (
                                                <CardBody>
                                                    <FormGroup row>
                                                        <h4 dangerouslySetInnerHTML={{ __html: data.question }} />
                                                    </FormGroup>
                                                    <FormGroup row style={{ width: "100%" }}>
                                                        {
                                                            data.manyOption.toString() === 'true' ? (
                                                                <div className="chart-wrapper" style={{ width: "80%", marginLeft: "10%" }}>
                                                                    <Bar data={bar} options={options} />
                                                                </div>
                                                            ) : (
                                                                    <div className="chart-wrapper" style={{ width: "50%", marginLeft: "23%" }}>
                                                                        <Doughnut data={doughnut} />
                                                                    </div>
                                                                )
                                                        }

                                                        {
                                                            others.length !== 0 ? (
                                                                <div style={{ marginLeft: "2%" }}>
                                                                    <h6 style={{ textDecoration: "underline" }}>Những câu trả lời khác: </h6><br />
                                                                    {
                                                                        others && others.map((other, index) => {
                                                                            return (
                                                                                <div>
                                                                                    <label>{'- ' + other}</label> <br />
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            ) : (
                                                                    <div></div>
                                                                )
                                                        }
                                                    </FormGroup>
                                                    <hr />
                                                </CardBody>
                                            )
                                        })
                                    }
                                    <CardFooter className="p-4">
                                        {/* <Row >
                                            <Col xs="4" sm="4">
                                                <Button color="secondary" block onClick={() => this.handleDirect(`/Business_Detail/${email}`)}>Trở về</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Xác nhận</Button>
                                            </Col>
                                        </Row> */}
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default AnswerStatistics;
