import React, { Component } from 'react';
import '../App.css';
import Logo from './wlc.gif';
import { Chart } from 'react-google-charts'

const initialState = {
    qNo: -1,
    currentQuestion: '',
    qType: '',
    qId: '',
    initiate: true,
    findResults: false,
    finish: false,
    options: {
        opt1: '',
        opt2: '',
        opt3: '',
        opt4: ''
    },
    ans: '',
    scores: [0, 0, 0, 0]
}

class Survey extends Component {
    constructor(props) {
        super(props);
        this.state = initialState
    }

    getQuestion = (ques_num) => {
        if (this.state.currentQuestion && this.state.ans === '') {
            alert("Enter the Answer before proceeding")
        }
        else {
            this.setState({ currentQuestion: '' });
            if (this.state.ans !== 'previous') {
                this.onSubmitAnswer(this.state.ans);
            }
            this.setState({
                qType: ''
            });
            fetch('http://localhost:3001/question', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qNo: ques_num,
                })
            })
                .then(data => data.json())
                .then((data) => {
                    if (data === 'finish') {
                        this.setState({
                            finish: true
                        })
                    }
                    else {
                        if (data[0].OPT_ID != null) {
                            this.getOptions(data[0].OPT_ID);
                            this.setState({
                                currentQuestion: data[0].QUESTION,
                                qType: data[0].QUE_TYPE,
                                qNo: ques_num,
                                qId: data[0].QUE_ID
                            })
                        }
                        else {
                            this.setState({
                                currentQuestion: data[0].QUESTION,
                                qType: data[0].QUE_TYPE,
                                qNo: ques_num,
                                qId: data[0].QUE_ID
                            })
                        }
                    }

                })
                .catch(err => console.log("Lol", this.state.qNo));
        }
    }

    getOptions = (opt_id) => {
        fetch('http://localhost:3001/options', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                opt_id: opt_id
            })
        })
            .then(data => data.json())
            .then((data) => {
                this.setState(Object.assign(this.state.options, {
                    opt1: data[0].OPT1,
                    opt2: data[0].OPT2,
                    opt3: data[0].OPT3,
                    opt4: data[0].OPT4
                }))
            }
            ).then(console.log("these are the options: ", this.state.options.opt1))
    }

    onSubmitAnswer = (ans) => {
        fetch('http://localhost:3001/answerSubmit', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                qNo: this.state.qNo,
                ans: ans,
                qId: this.state.qId
            })
        }).then(data => data.json())
            .then((data) => { this.setState({ scores: data }); console.log(data) })
            .then(this.clearAnswer())
    }

    clearAnswer = () => {
        this.setState({
            ans: ''
        })
    }

    setAns = (event) => {
        this.setState({
            ans: event.target.value
        })
    }

    setCheckAns = (event) => {
        this.setState({
            ans: this.state.ans + event.target.value + ' '
        })
    }

    reload = () => {
        this.setState(initialState);
        fetch('http://localhost:3001/reload', {
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
        }).then(data => console.log(data))
    }

    render() {
        return (
            <div className='Survey-header pa6'>
                {this.state.finish ?
                    <div>
                        <div className='flex space-between'>
                            <Chart
                                chartType="PieChart"
                                data={[["Categories", "Scores"], ["Arithmetic", this.state.scores[0]], ["Algebra", this.state.scores[1]], ["Geometry", this.state.scores[2]], ["Data Interpretation", this.state.scores[3]]]}
                                width="70%"
                                height="300px"
                                options={{ title: "Score Breakup", pieHole: 0.3, is3D: false }}
                            />
                            <div className='flex flex-column justify-between'>
                                <p>Your Score is : {this.state.scores[0] + this.state.scores[1] + this.state.scores[2] + this.state.scores[3]} out of 10</p>
                                <button className='pa2 ma2 pl4 pr4 bg-red white br4 pointer bw2 b--white' onClick={() => this.reload()}>Start Over</button>
                            </div>
                        </div>
                    </div>
                    :
                    (this.state.qNo === -1 ?
                        <div>
                            <h3> You will be asked quantitative questions based on</h3>
                            <ul>
                                <li>Arithmetic</li>
                                <li>Algebra</li>
                                <li>Geometry</li>
                                <li>Data Analysis</li>
                            </ul>
                            <br></br>
                            <h3> The questions will consist of True/False, Multiple Correct Answers and Integer Input Format</h3>
                            <button className='pa2 ma2 pl4 pr4 bg-red white br4 pointer bw2 b--white' onClick={() => this.getQuestion(0)}>Proceed</button>
                        </div>
                        : (!this.state.currentQuestion ?
                            <div>
                                <img alt='Img' src={Logo} style={{ "height": "64px", "width": "64px" }} className='pl7 pt6 ml7' />
                            </div>
                            :
                            <div>
                                <h3>
                                    Question : {this.state.qNo + 1}
                                </h3>

                                <p>{this.state.currentQuestion}</p>
                                <div className="mb5">
                                    {this.state.qType === 'T/F' ?
                                        <div>
                                            <input type={"radio"} name={"Answer"} value={"True"} onChange={this.setAns} /> True
                                            <br />
                                            <input type={"radio"} name={"Answer"} value={"False"} onChange={this.setAns} /> False
                                        </div>
                                        : (this.state.qType === 'MultipleCorrect' ?
                                            <div>
                                                <input type={"checkbox"} name={"Answer"} onChange={this.setCheckAns} value={`${this.state.options.opt1}`} />{this.state.options.opt1}
                                                <br />
                                                <input type={"checkbox"} name={"Answer"} onChange={this.setCheckAns} value={`${this.state.options.opt2}`} />{this.state.options.opt2}
                                                <br />
                                                <input type={"checkbox"} name={"Answer"} onChange={this.setCheckAns} value={`${this.state.options.opt3}`} />{this.state.options.opt3}
                                                <br />
                                                <input type={"checkbox"} name={"Answer"} onChange={this.setCheckAns} value={`${this.state.options.opt4}`} />{this.state.options.opt4}
                                            </div>
                                            : (this.state.qType === 'INTEGER' ? <input type={"text"} name={"Answer"} id={"Answer"} placeholder={"Enter Integer Answer"} onChange={this.setAns} className="br3 pa2" />
                                                : (this.state.qType === 'OneCorrect' ?
                                                    <div>
                                                        <input type={"radio"} name={"Answer"} onChange={this.setAns}>${this.state.options[0]}</input>
                                                        <input type={"radio"} name={"Answer"} onChange={this.setAns}>${this.state.options[1]}</input>
                                                        <input type={"radio"} name={"Answer"} onChange={this.setAns}>${this.state.options[2]}</input>
                                                        <input type={"radio"} name={"Answer"} onChange={this.setAns}>${this.state.options[3]}</input>
                                                    </div> : <div> </div>)))
                                    }
                                </div>
                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                    {
                                        this.state.qNo > 0 && this.state.qNo < 9
                                            ? <button className='pa2 ma2 pl4 pr4 bg-red white br4 pointer bw2 b--white' onClick={() => { this.setState({ ans: 'previous' }, () => { this.getQuestion(this.state.qNo - 1) }) }}> Previous </button>
                                            : <div> </div>
                                    }<button className='pa2 ma2 pl4 pr4 bg-red white br4 pointer bw2 b--white' onClick={() => { this.getQuestion(this.state.qNo + 1) }}> Submit </button>
                                </div>
                            </div>))
                }
            </div>
        )
    }
}

export default Survey;