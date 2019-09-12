import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, Col, Form, FormGroup, Input, Pagination, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';



class Update_Question extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            id: '',
            content: '',
            active: true,
            has_others: true,
            manyOption: true,
            arrayAnswer: [],
        };
    }

    async componentDidMount() {
        const id = window.location.href.split("/").pop();
        const question = await ApiServices.Get(`/admin/question/id?id=${id}`);

        await this.setState({
            id: question.id,
            content: question.content,
            active: question.active,
            has_others: question.has_others,
            manyOption: question.manyOption,
            arrayAnswer: question.answers,
            loading: false
        });
    }

    handleReset = async () => {
        this.state.arrayAnswer.splice(0, this.state.arrayAnswer.length);

        var answer = {
            id: "",
            content: "",
            other: false
        }

        await this.setState({
            content: '',
            active: true,
            has_others: true,
            manyOption: true,
            arrayAnswer: [...this.state.arrayAnswer, answer]
        })

        document.getElementById('btnDelete0').setAttribute("disabled", "disabled");
    }

    addRow = async () => {
        var answer = {
            id: "",
            content: "",
            other: false
        }
        await this.setState({
            arrayAnswer: [...this.state.arrayAnswer, answer],
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
        await this.setState({
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
                var answer = {
                    id: "",
                    content: value,
                    other: false
                }
                arrayAnswer.push(answer);
            } else {
                var answer = {
                    "id": tmpAnswers.id,
                    "content": value,
                    "other": tmpAnswers.other
                }
                arrayAnswer[index] = answer;
            }
        }

        await this.setState({
            arrayAnswer: arrayAnswer
        })

        console.log(this.state.arrayAnswer);
    }

    handleSubmit = async () => {
        const { id, content, has_others, manyOption, arrayAnswer, active } = this.state;
        const answers = arrayAnswer;
        const question = {
            id,
            content,
            has_others,
            manyOption,
            active,
            answers
        }

        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })

            const result = await ApiServices.Put('/admin/question-content', question);
            if (result.status === 200) {                
                this.setState({
                    loading: false
                })
                Toastify.actionSuccess("Chỉnh sửa câu hỏi thành công!");
              setTimeout(
                function () {
                  this.props.history.push('/admin/question');
                }
                  .bind(this),
                2000
              );
            } else {                
                this.setState({
                    loading: false
                })
                Toastify.actionFail("Chỉnh sửa câu hỏi thất bại!");
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
                        <ToastContainer />
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
                                                        <option value={false} selected={has_others === false}>Không</option>
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
                                                        <option value={false} selected={manyOption === false}>Không</option>
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

                                                    answer.other.toString() === 'false' ? (
                                                        <div>
                                                            <tr>
                                                                <td>{index + 1}.</td>
                                                                <td style={{ width: "900px" }}>
                                                                    <Input value={answer.content} onChange={e => { this.handleInputAnswer(e, index) }} type="textarea" name="answer" style={{ width: "850px", marginLeft: "2%" }} rows="3" placeholder="Nhập đáp án cho câu hỏi ..."></Input>
                                                                </td>
                                                                <td>
                                                                    <Button id={'btnDelete' + index} color="danger" style={{ marginLeft: "2%" }} onClick={() => this.deleteAnswer(index)}>Xóa</Button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td></td>
                                                                <td style={{ width: "900px" }}>
                                                                    <span className="form-error is-visible text-danger" style={{ width: "850px", marginBottom: "5%", marginLeft: "2%" }}>
                                                                        {this.validator.message('Nội dung đáp án', answer.content, 'required|max:255')}
                                                                    </span>
                                                                </td>
                                                                <td></td>
                                                            </tr>
                                                        </div>
                                                    ) : (
                                                            <></>
                                                        )
                                                )
                                            }
                                        </Form>
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
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Chỉnh sửa câu hỏi</Button>
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

export default Update_Question;
