import React, { Component } from 'react';
import { Nav, NavItem, NavLink, Progress, TabContent, TabPane, ListGroup, ListGroupItem, DropdownItem, FormGroup, Col, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { AppSwitch } from '@coreui/react';
import decode from 'jwt-decode';
import ApiServices from '../../service/api-service';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultAside extends Component {

  constructor(props) {
    super(props);
    this.state = {
      informs: null,
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('id_token');
    if (token !== null) {
      const decoded = decode(token);
      const email = decoded.email;
      const role = decoded.role;
      let informs = null;
      if (role === "ROLE_ADMIN" || role === "ROLE_STARTUP" || role === "ROLE_HEADTRAINING" || role === "ROLE_HEADMASTER") {
        if (role === "ROLE_ADMIN") {
          informs = await ApiServices.Get(`/admin/eventsReceivedNotRead`);
        }
      } else if (role === "ROLE_HR") {
        informs = await ApiServices.Get(`/business/eventsReceivedNotRead`);
      } else if (role === "ROLE_SUPERVISOR") {
        informs = await ApiServices.Get(`/supervisor/eventsReceivedNotRead`);
      }
      this.setState({
        informs: informs,
      });
    }
  }

  handleShowString(stringFormat) {
    if (stringFormat.length > 18) {
      var finalString = stringFormat.substr(0, 18);
      finalString += "...";
      return finalString;
    } else {
      return stringFormat;
    }
  }

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const { informs } = this.state;
    var numOfIncomeMessage = 0;
    if (informs !== null) {
      numOfIncomeMessage = informs.length;
    }
    // console.log(informs);
    return (
      <React.Fragment>
        <ListGroup className="list-group-accent" tag={'div'}>
          <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Thông báo đến ({numOfIncomeMessage})</ListGroupItem>
          {this.state.role === "ROLE_ADMIN" ?
            <ListGroupItem action tag="a" href={`/#/admin/InformMessage`} className="list-group-item-accent-secondary text-center font-weight-bold list-group-item-divider" style={{ fontSize: '12px', color: 'DeepSkyBlue', textDecoration: 'underline' }}>Đến trang thông báo</ListGroupItem> :
            (this.state.role === "ROLE_HR" ?
              <ListGroupItem action tag="a" href={`/#/hr/InformMessage`} className="list-group-item-accent-secondary text-center font-weight-bold list-group-item-divider" style={{ fontSize: '12px', color: 'DeepSkyBlue', textDecoration: 'underline' }}>Đến trang thông báo</ListGroupItem> :
              <ListGroupItem action tag="a" href={`/#/supervisor/InformMessage`} className="list-group-item-accent-secondary text-center font-weight-bold list-group-item-divider" style={{ fontSize: '12px', color: 'DeepSkyBlue', textDecoration: 'underline' }}>Đến trang thông báo</ListGroupItem>
            )

          }
          {informs && informs.map((inform, index) => {
            return (
              this.state.role === "ROLE_ADMIN" ?
                <ListGroupItem action tag="a" href={`/#/admin/InformMessage/InformMessage_Detail/${inform.event.id}`} className="list-group-item-accent-danger list-group-item-divider">
                  {inform.studentList && inform.studentList.map((student, index) => {
                    return (
                      student.avatarLink === null ?
                        <>
                          <div className="avatar float-right">
                            <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" alt="usericon" style={{ width: '30px', height: '30px' }} />
                          </div>
                          <div><strong>{student.name}</strong><br /> {this.handleShowString(inform.event.description)} </div></> :
                        <>
                          <div className="avatar float-right">
                            <img src={student.avatarLink} className="img-avatar" alt={student.avatarLink} style={{ width: '30px', height: '30px' }} />
                          </div>
                          <div><strong>{student.name}</strong><br /> {this.handleShowString(inform.event.description)} </div>
                        </>
                    )
                  })}
                </ListGroupItem> :
                (this.state.role === "ROLE_HR" ?
                  <ListGroupItem action tag="a" href={`/#/hr/InformMessage/InformMessage_Detail/${inform.event.id}`} className="list-group-item-accent-danger list-group-item-divider">
                    {inform.studentList && inform.studentList.map((student, index) => {
                      return (
                        student.avatarLink === null ?
                          <>
                            <div className="avatar float-right">
                              <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" alt="usericon" style={{ width: '30px', height: '30px' }} />
                            </div>
                            <div><strong>{student.name}</strong><br /> {this.handleShowString(inform.event.title)} </div></> :
                          <>
                            <div className="avatar float-right">
                              <img src={student.avatarLink} className="img-avatar" alt={student.avatarLink} style={{ width: '30px', height: '30px' }} />
                            </div>
                            <div><strong>{student.name}</strong><br /> {this.handleShowString(inform.event.title)} </div>
                          </>
                      )
                    })}
                  </ListGroupItem> :
                  <ListGroupItem action tag="a" href={`/#/supervisor/InformMessage/InformMessage_Detail/${inform.event.id}`} className="list-group-item-accent-danger list-group-item-divider">
                    {inform.studentList && inform.studentList.map((student, index) => {
                      return (
                        student.avatarLink === null ?
                          <>
                            <div className="avatar float-right">
                              <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" alt="usericon" style={{ width: '30px', height: '30px' }} />
                            </div>
                            <div><strong>{student.name}</strong><br /> {this.handleShowString(inform.event.title)} </div></> :
                          <>
                            <div className="avatar float-right">
                              <img src={student.avatarLink} className="img-avatar" alt={student.avatarLink} style={{ width: '30px', height: '30px' }} />
                            </div>
                            <div><strong>{student.name}</strong><br /> {this.handleShowString(inform.event.title)} </div>
                          </>
                      )
                    })}
                  </ListGroupItem>
                )
            )
          })}
        </ListGroup>
      </React.Fragment>
    );
  }
}

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

export default DefaultAside;
