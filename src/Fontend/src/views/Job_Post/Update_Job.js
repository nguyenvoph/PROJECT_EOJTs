import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, Col, Form, FormGroup, Input, Label, Pagination, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';



class Update_Job extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            startupArraySkill: [],
            startupArrayQuantity: [],
            arraySkill: [],
            arrayQuantity: [],
            arrayIdJobPostSkill: [],
            isModify: false,
            isError: false,
            updatedId: '',


            description: '',
            views: 0,
            contact: '',
            interview_process: '',
            interest: '',
            job_post_skills: [
            ],


            specializeds: [],
            specializedItem: {},
            skills: [],
            skillItem: {},


            skillsForSave: [],
            numbersForSave: [],

            isChangeSkill: false,
            isChangeSpecialized: false,

            specializedId: 1,

            choseSpecialized: [],
            flagSelect: false,
            isChecked: false,
            // isSelected: false,

            specializedUpdate: [],
            timePost: ''
        };
        this.addRow = this.addRow.bind(this);
    }


    async componentDidMount() {
        const { specializedUpdate, arraySkill, arrayQuantity, choseSpecialized, arrayIdJobPostSkill } = this.state;
        const specializeds = await ApiServices.Get('/specialized');
        const skills = await ApiServices.Get('/skill/notPaging');
        if (specializeds !== null) {
            this.setState({
                specializeds,
                skills,
            });
        }
        // document.getElementById('btnAddRow').setAttribute("disabled", "disabled");

        const updatedId = window.location.href.split("/").pop();
        const data = await ApiServices.Get(`/business/getJobPost?id=${updatedId}`);

        // console.log(data);

        for (let i = 0; i < data.job_post.job_post_skills.length; i++) {
            if (!specializedUpdate.includes(data.job_post.job_post_skills[i].skill.specialized.id)) {
                specializedUpdate.push(data.job_post.job_post_skills[i].skill.specialized.id);
            }
            arraySkill.push(data.job_post.job_post_skills[i].skill);
            arrayQuantity.push(data.job_post.job_post_skills[i].number);
            arrayIdJobPostSkill.push(data.job_post.job_post_skills[i].id);
        }
        // console.log('arraySkill', arraySkill);
        // console.log('arrayQuantity', arrayQuantity);
        console.log('specializedUpdate', specializedUpdate);

        for (let j = 0; j < specializedUpdate.length; j++) {
            const skills = await ApiServices.Get(`/skill/bySpecializedId?specializedId=${specializedUpdate[j]}`);
            if (skills !== null) {
                for (let k = 0; k < skills.length; k++) {
                    choseSpecialized.push(skills[k].id);
                }
            }
        }

        // const skillsUpdate = await ApiServices.Post('/skill/byListSpecializedId', specializedUpdate);
        // if (skillsUpdate !== null) {
        //     for (let k = 0; k < skillsUpdate.length; k++) {
        //         choseSpecialized.push(skillsUpdate[k].id);
        //     }
        // }

        console.log(choseSpecialized);

        this.setState({
            loading: false,
            updatedId: updatedId,
            description: data.job_post.description,
            contact: data.job_post.contact,
            interview_process: data.job_post.interview_process,
            interest: data.job_post.interest,
            specializedUpdate: specializedUpdate,
            choseSpecialized: choseSpecialized,
            arraySkill: arraySkill,
            arrayQuantity: arrayQuantity,
            skillsForSave: arraySkill,
            numbersForSave: arrayQuantity,
            timePost: data.job_post.timePost
        })

    }

    handleReset = async () => {
        this.setState({
            description: '',
            contact: '',
            interview_process: '',
            interest: '',
            arraySkill: [],
            specializedItem: this.state.specializeds[0],
            skillsForSave: [],
            numbersForSave: [],
        })
    }

    addRow = async () => {
        this.setState({
            arraySkill: [...this.state.arraySkill, ""],
            arrayQuantity: [...this.state.arrayQuantity, ""],
            isModify: true,
        })
    }

    deleteSkill = (deleteIndex) => {
        const { skillsForSave, numbersForSave } = this.state;

        console.log(deleteIndex);
        console.log(this.state.arraySkill);


        for (let index = 0; index < this.state.arraySkill.length; index++) {
            if (index === deleteIndex) {
                this.state.arraySkill.splice(index, 1);
                this.setState({
                    arraySkill: this.state.arraySkill,
                    isModify: true,
                })
                break;
            }
        }

        for (let index = 0; index < skillsForSave.length; index++) {
            if (index === deleteIndex) {
                skillsForSave.splice(index, 1);
                this.setState({
                    skillsForSave
                })
                break;
            }
        }

        for (let index = 0; index < numbersForSave.length; index++) {
            if (index === deleteIndex) {
                numbersForSave.splice(index, 1);
                this.setState({
                    numbersForSave
                })
                break;
            }
        }

        console.log(skillsForSave);
        console.log(numbersForSave);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleSelect = async (selectSpecialized) => {

        var indexFound = this.state.specializedUpdate.indexOf(selectSpecialized);
        if (indexFound !== -1) {
            this.state.specializedUpdate.splice(indexFound, 1);
        }

        let isChecked = false;

        for (let l = 0; l < this.state.specializeds.length; l++) {
            if (document.getElementById(`cb${this.state.specializeds[l].id}`).checked) {
                isChecked = true;
                this.setState({
                    isChecked: true
                })
                break;
            } else {
                this.setState({
                    isChecked: false
                })
            }
        }

        if (isChecked) {

            // document.getElementById('btnAddRow').removeAttribute("disabled");

            const skillsChoosen = await ApiServices.Get(`/skill/bySpecializedId?specializedId=${selectSpecialized}`);

            for (let i = 0; i < skillsChoosen.length; i++) {
                if (document.getElementById(`cb${selectSpecialized}`).checked) {
                    await this.setState({
                        choseSpecialized: [...this.state.choseSpecialized, skillsChoosen[i].id],

                    })
                } else {
                    for (let j = 0; j < this.state.choseSpecialized.length; j++) {
                        if (this.state.choseSpecialized[j] === skillsChoosen[i].id) {
                            this.state.choseSpecialized.splice(j, 1);
                        }
                    }
                    this.setState({
                    })
                }
            }
        } else {
            // document.getElementById('btnAddRow').setAttribute("disabled", "disabled");
            this.state.choseSpecialized = [];
            this.setState({
            })
        }
    }

    handleInput = async (event, index) => {
        const { name, value } = event.target;
        const { specializeds, skills, isChangeSkill, isChangeSpecialized } = this.state;

        const { arrayQuantity } = this.state;



        if (name.includes('skill')) {
            await this.setState({
                isChangeSkill: true,
                skillItem: skills[value],
            })
        } else if (name.includes('number')) {
            let numbersForSave = [...this.state.numbersForSave];
            let item = { ...numbersForSave[index] };
            item = value;
            numbersForSave[index] = item;
            await this.setState({
                numbersForSave: numbersForSave
            })
        } else {
            await this.setState({
                [name]: value,
            })
        }
    }

    handleOnBlur = async (event, index) => {
        const { name, value } = event.target;
        const { skillsForSave, numbersForSave, skills } = this.state;
        let tmpSkill = skillsForSave[index];
        let tmpNumber = numbersForSave[index];

        if (name.includes('skill')) {
            if (tmpSkill === null && tmpNumber !== null) {
                skillsForSave.push(skills[value]);
            } else if (tmpSkill === null && tmpNumber === null) {
                numbersForSave.push("");
                skillsForSave.push(skills[value]);
            } else {
                skillsForSave[index] = skills[value];
            }
        } else if (name.includes('number')) {
            if (tmpNumber === null && tmpSkill !== null) {
                numbersForSave.push(value);
            } else if (tmpNumber === null && tmpSkill === null) {
                skillsForSave.push(tmpSkill);
                numbersForSave.push(value);
            } else {
                numbersForSave[index] = value;
            }
        }

        console.log(skillsForSave);
        console.log(numbersForSave);
    }

    handleSubmit = async () => {

        const { skillsForSave, numbersForSave, description, views,
            contact, interview_process, interest, updatedId, arrayIdJobPostSkill, timePost } = this.state;

        let job_post_skills = [];

        console.log(skillsForSave);

        for (let i = 0; i < arrayIdJobPostSkill.length; i++) {
            let job_post_skills_item = {
                id: arrayIdJobPostSkill[i],
                skill: {
                    id: skillsForSave[i].id
                },
                number: numbersForSave[i]
            }
            job_post_skills.push(job_post_skills_item);
        }

        const job_post = {
            id: updatedId,  
            description,
            views,
            contact,
            interview_process,
            interest,
            job_post_skills,
            timePost: timePost
        }

        console.log(job_post);

        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })

            const result = await ApiServices.Put('/business/updateJobPost', job_post);
            if (result.status === 200) {
                Toastify.actionSuccess("Cập nhật bài đăng thành công!");
                this.setState({
                    loading: false
                })
                setTimeout(
                    function () {
                        this.props.history.push('/hr/job_post_list_hr');
                    }
                        .bind(this),
                    2000
                );
            } else {
                Toastify.actionFail("Cập nhật bài đăng thất bại!");
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
        const { skillsForSave, numbersForSave, specializedUpdate, arraySkill, arrayQuantity, description, contact, updatedId, interview_process, interest, specializeds, specializedItem, skills, choseSpecialized, loading } = this.state;
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
                                                    <h6>Mô tả công việc</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={description} onChange={this.handleInput} type="text" id="description" name="description" placeholder="Mô tả công việc" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Mô tả công việc', description, 'required|max:255')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Quy trình tuyển</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={interview_process} onChange={this.handleInput} type="text" id="interview_process" name="interview_process" placeholder="Quy trình tuyển" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Quy trình tuyển', interview_process, 'required')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Phúc lợi:</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={interest} onChange={this.handleInput} type="text" id="interest" name="interest" placeholder="Phúc lợi" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Phúc lợi', interest, 'required')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Thông tin liên hệ</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={contact} onChange={this.handleInput} type="text" id="contact" name="contact" placeholder="Thông tin liên hệ" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Thông tin liên hệ', contact, 'required|max:500')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Ngành tuyển</h6>
                                                </Col>
                                                <Col md="9">
                                                    {/* <Col xs="12" md="4">
                                            <Input onChange={this.handleInput} type="select" name="specialized"> */}
                                                    {specializeds && specializeds.map((specialized, i) => {
                                                        if (specializedUpdate.includes(specialized.id)) {
                                                            return (
                                                                <FormGroup check inline>
                                                                    <Input
                                                                        id={'cb' + specialized.id}
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        checked="true"
                                                                        onChange={() => this.handleSelect(specialized.id)}
                                                                    />
                                                                    <Label className="form-check-label" check htmlFor="inline-checkbox1">{specialized.name}</Label>
                                                                </FormGroup>
                                                            )

                                                        } else {
                                                            return (
                                                                <FormGroup check inline>
                                                                    <Input
                                                                        id={'cb' + specialized.id}
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        onChange={() => this.handleSelect(specialized.id)}
                                                                    />
                                                                    <Label className="form-check-label" check htmlFor="inline-checkbox1">{specialized.name}</Label>
                                                                </FormGroup>
                                                            )
                                                        }
                                                        // <option selected={specializedItem.id === i + 1} value={i}>{specialized.name}</option>

                                                    })}<br></br>
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Ngành tuyển', this.state.isChecked, 'required|accepted')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Kỹ năng - Số lượng:</h6></Col>
                                                <Col xs="12" md="10">
                                                    {/* <Button color="primary" id="btnAddRow" outline onClick={this.addRow}>Thêm</Button> */}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="11">
                                                    {
                                                        arraySkill && arraySkill.map((element, index) =>
                                                            <>
                                                                <tr>
                                                                    <td>{index + 1}.</td>
                                                                    <td style={{ width: "350px" }}>
                                                                        {
                                                                            <Input autoFocus="true" id="selectSkill" onChange={this.handleInput} type="select" name="skill" onBlur={e => { this.handleOnBlur(e, index) }}>
                                                                                {skills && skills.map((skill, i) => {

                                                                                    let a = choseSpecialized.indexOf(skill.id);

                                                                                    if (a !== -1) {
                                                                                        return (
                                                                                            <option selected={choseSpecialized[a] === arraySkill[index].id} id={'op' + i} value={i}>{skill.name}</option>
                                                                                        )
                                                                                    } else {
                                                                                        return (
                                                                                            <option id={'op' + i} value={i} hidden disabled>{skill.name}</option>
                                                                                        )
                                                                                    }
                                                                                })}
                                                                            </Input>
                                                                        }
                                                                    </td>
                                                                    <td>:</td>
                                                                    <td><Input value={numbersForSave[index]} onBlur={e => { this.handleOnBlur(e, index) }} onChange={e => { this.handleInput(e, index) }} type="number" name="number" style={{ width: "170px" }}></Input></td>
                                                                    {/* <td><Button color="danger" onClick={() => this.deleteSkill(index)}>Xoá</Button></td> */}
                                                                </tr>
                                                            </>
                                                        )
                                                    }
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="3" sm="3">
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Cập nhật bài đăng</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                <Button color="danger" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                <Button color="success" block onClick={() => this.handleDirect(`/job-post/${updatedId}`)}>Trở về</Button>
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

export default Update_Job;
