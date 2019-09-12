import React, { Component } from 'react';
import ApiServices from '../../service/api-service';

class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tests: [],
        };
    }

    async componentDidMount() {
        const tests = await ApiServices.Get('/Exercise/getAllExercise');
        console.log(tests);
        if (tests !== null) {
            this.setState({
                tests: tests,
            });
        }
    }

    render() {
        var { tests } = this.state;
        return (
            <div className="animated fadeIn">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>exercise_id</th>
                            <th>exercise_name</th>
                            <th>exercise_instruction</th>
                            <th>gym_id</th>
                            <th>home_id</th>
                            <th>top_rated_id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tests && tests.map((element, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{element.exercise_id}</td>
                                        <td>{element.exercise_name}</td>
                                        <td>{element.exercise_instruction}</td>
                                        <td>{element.gym_id}</td>
                                        <td>{element.home_id}</td>
                                        <td>{element.top_rated_id}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Test;
