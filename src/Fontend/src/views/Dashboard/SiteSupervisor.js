import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import React, { Component } from 'react';
import { Bar, Line, Radar } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
}

class SiteSupervisor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      line: {},
      bar: {},
      radar: {}
    };
  }

  async componentDidMount() {
    const studentsTasks = await ApiServices.Get('/admin/studentsTasks');
    const studentsTasksDone = await ApiServices.Get('/admin/studentsTasksDone');
    const statisticalEvaluationOfSupervisor = await ApiServices.Get('/admin/statisticalEvaluationOfSupervisor');

    if (studentsTasks !== null) {
      var line = {
        labels: studentsTasks.studentEmail,
        datasets: [
          {
            label: 'Số lượng task',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: studentsTasks.countTaskOfStudent,
          },
        ],
      }
      this.setState({
        line: line
      });
    }

    if (statisticalEvaluationOfSupervisor !== null) {
      var datasets = [];

      if (statisticalEvaluationOfSupervisor.length > 0) {
        if (statisticalEvaluationOfSupervisor[0] !== null) {
          let data1 = {
            label: 'Tháng 1',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: statisticalEvaluationOfSupervisor[0].statisticalTypeEvaluation,
          }
          datasets.push(data1);
        }
      }
      if (statisticalEvaluationOfSupervisor.length > 1) {
        if (statisticalEvaluationOfSupervisor[1] !== null) {
          let data2 = {
            label: 'Tháng 2',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: statisticalEvaluationOfSupervisor[1].statisticalTypeEvaluation,
          }
          datasets.push(data2);
        }


      }
      if (statisticalEvaluationOfSupervisor.length > 2) {
        if (statisticalEvaluationOfSupervisor[2] !== null) {
          let data3 = {
            label: 'Tháng 3',
            backgroundColor: '#CCFFFF',
            borderColor: '#00FFFF',
            pointBackgroundColor: '#00FFFF',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#00FFFF',
            data: statisticalEvaluationOfSupervisor[2].statisticalTypeEvaluation,
          }
          datasets.push(data3);
        }
      }
      if (statisticalEvaluationOfSupervisor.length > 3) {
        if (statisticalEvaluationOfSupervisor[3] !== null) {
          let data4 = {
            label: 'Tháng 4',
            backgroundColor: '#FFF68F',
            borderColor: '#CDAD00',
            pointBackgroundColor: '#CDAD00',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#CDAD00',
            data: statisticalEvaluationOfSupervisor[3].statisticalTypeEvaluation,
          }
          datasets.push(data4);
        }
      }
      var radar = {
        labels: ['Xuất sắc', 'Tốt', 'Khá', 'Trung Bình', 'Yếu'],
        datasets: datasets
      }
      this.setState({
        radar: radar,
      });
    }

    if (studentsTasksDone !== null) {
      var bar = {
        labels: studentsTasksDone.studentEmail,
        datasets: [
          {
            label: 'Tỉ lệ %',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: studentsTasksDone.countTaskDoneOfStudent
          },
        ],
      }
      this.setState({
        bar: bar
      });
    }

    this.setState({
      loading: false
    })
  }

  // handleInput = async (event) => {
  //   const { value } = event.target;
  //   const { countStatusTaskInMonth } = this.state;
  //   console.log("countStatusTaskInMonth", countStatusTaskInMonth);
  //   console.log("countStatusTaskInMonth[value]", countStatusTaskInMonth[value]);

  //   if (countStatusTaskInMonth !== null) {
  //     await this.setState({
  //       countStatusTaskInMonthItem: countStatusTaskInMonth[value]
  //     })
  //   }

  //   console.log(this.state.countStatusTaskInMonthItem);

  //   var doughnut = {
  //     labels: [
  //       'Hoàn thành',
  //       'Chưa hoàn thành',
  //       'Chưa bắt đầu'
  //     ],
  //     datasets: [
  //       {
  //         data: this.state.countStatusTaskInMonthItem,
  //         backgroundColor: [
  //           '#36A2EB',
  //           '#FFF68F',
  //           '#FF6384'
  //         ],
  //         hoverBackgroundColor: [
  //           '#36A2EB',
  //           '#FFF68F',
  //           '#FF6384'
  //         ],
  //       }],
  //   }

  //   console.log("doughnut", doughnut.datasets[0].data);
  //   // console.log(countStatusTaskInMonth);
  //   // console.log("doughnut", this.state.doughnut.datasets[0].data);

  //   await this.setState({
  //     // countStatusTaskInMonth: countStatusTaskInMonth,
  //     doughnut: doughnut,
  //   });

  //   console.log("countStatusTaskInMonth", countStatusTaskInMonth);
  // }


  render() {
    const { loading, line, bar, radar } = this.state;
    return (
      loading.toString() === 'true' ? (
        SpinnerLoading.showHashLoader(loading)
      ) : (
          <div className="animated fadeIn">
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    <h6>Thống kê số lượng task giao cho từng sinh viên </h6>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Line data={line} options={options} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    <h6>Tỉ lệ % hoàn thành task của từng sinh viên</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Bar data={bar} options={options} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    <h6>Thống kê các đánh giá của sinh viên thực tập tại doanh nghiệp</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Radar data={radar} options={options} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        )
    );
  }
}

export default SiteSupervisor;
