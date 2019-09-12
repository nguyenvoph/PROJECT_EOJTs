import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, Col, Form, FormGroup, Input, Pagination, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';



class Add_Question extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            content: '',
            active: true,
            has_others: true,
            manyOption: true,
            arrayAnswer: []
        };
    }

    async componentDidMount() {
        // const specializeds = await ApiServices.Get('/specialized');
        await this.setState({
            arrayAnswer: [...this.state.arrayAnswer, ""],
            loading: false
        });
        document.getElementById('btnDelete0').setAttribute("disabled", "disabled");
    }

    handleReset = async () => {
        this.state.arrayAnswer.splice(0, this.state.arrayAnswer.length);

        await this.setState({
            content: '',
            active: true,
            has_others: true,
            manyOption: true,
            arrayAnswer: [...this.state.arrayAnswer, ""]
        })

        document.getElementById('btnDelete0').setAttribute("disabled", "disabled");
    }

    addRow = async () => {
        await this.setState({
            arrayAnswer: [...this.state.arrayAnswer, ""],
        })

        if (this.state.arrayAnswer.length > 1) {
            document.getElementById('btnDelete0').removeAttribute("disabled", "disabled");
        }
    }

    deleteAnswer = async (deleteIndex) => {
        const { arrayAnswer } = this.state;

        if (arrayAnswer.length !== 1) {
            for (let index = 0; index < arrayAnswer.length; index++) {
                if (index === deleteIndex) {
                    arrayAnswer.splice(index, 1);
                    break;
                }
            }
            await this.setState({
                arrayAnswer: arrayAnswer,
            })
        }

        if (arrayAnswer.length === 1) {
            document.getElementById('btnDelete0').setAttribute("disabled", "disabled");
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        })
    }

    handleInputAnswer = async (event, index) => {
        const { name, value } = event.target;
        const { arrayAnswer } = this.state;

        if (this.state.arrayAnswer.length === 1) {
            document.getElementById('btnDelete0').setAttribute("disabled", "disabled");
        } else {
            document.getElementById('btnDelete0').removeAttribute("disabled", "disabled");
        }

        let tmpAnswers = arrayAnswer[index];

        if (name.includes('answer')) {
            if (tmpAnswers === null) {
                arrayAnswer.push(value);
            } else {
                arrayAnswer[index] = value;
            }
        }

        await this.setState({
            arrayAnswer: arrayAnswer
        })
    }

    handleSubmit = async () => {
        const { content, has_others, manyOption, arrayAnswer, active } = this.state;
        let answers = [];

        arrayAnswer && arrayAnswer.map((answer, index) => {
            var dataAnswer = {
                content: answer,
                other: false
            }
            answers.push(dataAnswer);
        })

        const question = {
            content,
            has_others,
            manyOption,
            active,
            answers
        }

        console.log(question);

        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })

            const result = await ApiServices.Post('/admin/question', question);
            if (result.status === 201) {
                Toastify.actionSuccess("Tạo câu hỏi thành công!");
                this.setState({
                    loading: false
                })
              setTimeout(
                function () {
                  this.props.history.push('/admin/question');
                }
                  .bind(this),
                2000
              );
            } else {
                Toastify.actionFail("Tạo câu hỏi thất bại!");
                this.setState({
                    loading: false
                })
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }


    render() {
        const { loading, content, has_others, manyOption, arrayAnswer } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Nội dung câu hỏi</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={content}
                                                        onChange={(event, editor) => {
                                                            this.setState({
                                                                content: editor.getData(),
                                                            })
                                                        }}
                                                    />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Nội dung câu hỏi', content, 'required')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Ý kiến khác:</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input onChange={this.handleInput} type="select" name="has_others" style={{ width: "20%" }}>
                                                        <option value={true} selected={has_others === true}>Có</option>
                                                        <option value={false}>Không</option>
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Chọn nhiều đáp án:</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input onChange={this.handleInput} type="select" name="manyOption" style={{ width: "20%" }}>
                                                        <option value={true} selected={manyOption === true}>Có</option>
                                                        <option value={false}>Không</option>
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Các đáp án:</h6></Col>
                                                <Col xs="12" md="10">
                                                    <Button color="primary" id="btnAddRow" outline onClick={() => this.addRow()}>Thêm</Button><br></br>
                                                </Col>
                                            </FormGroup>

                                            {
                                                arrayAnswer && arrayAnswer.map((answer, index) =>
                                                    <div>
                                                        <tr>
                                                            <td>{index + 1}.</td>
                                                            <td style={{ width: "900px" }}>
                                                                <Input value={answer} onChange={e => { this.handleInputAnswer(e, index) }} type="textarea" name="answer" style={{ width: "850px", marginLeft: "2%" }} rows="3" placeholder="Nhập đáp án cho câu hỏi ..."></Input>
                                                            </td>
                                                            <td>
                                                                <Button id={'btnDelete' + index} color="danger" style={{ marginLeft: "2%" }} onClick={() => this.deleteAnswer(index)}>Xóa</Button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td style={{ width: "900px" }}>
                                                                <span className="form-error is-visible text-danger" style={{ width: "850px", marginBottom: "5%", marginLeft: "2%" }}>
                                                                    {this.validator.message('Nội dung đáp án', answer, 'required|max:255')}
                                                                </span>
                                                            </td>
                                                            <td></td>
                                                        </tr>
                                                    </div>
                                                )
                                            }
                                        </Form>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="3" sm="3">
                                                <Button color="secondary" block onClick={() => this.handleDirect('/admin/question')}>Trở về</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                <Button color="danger" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Tạo câu hỏi</Button>
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

export default Add_Question;
