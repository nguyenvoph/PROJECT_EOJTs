/* eslint-disable */
import React, { Component } from 'react';
import { Button, Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
class PaginationComponent extends Component {

    render() {
        const { pageNumber, handlePageNumber, handlePagePrevious, handlePageNext, currentPage } = this.props;
        const RenderPagination = [];
        for (let i = 0; i < pageNumber; i++) {
            RenderPagination.push(<PaginationItem active={currentPage === i} key={i}><PaginationLink onClick={() => handlePageNumber(i)} tag="button">{i + 1}</PaginationLink></PaginationItem>)
        }
        return (
            <Pagination>
                {
                    currentPage <= 0 ?
                    <PaginationItem disabled><PaginationLink previous tag="button"><i className="fa fa-angle-double-left"></i></PaginationLink></PaginationItem>
                    :
                    <PaginationItem onClick={() => handlePagePrevious(currentPage - 1)}><PaginationLink previous tag="button"><i className="fa fa-angle-double-left"></i></PaginationLink></PaginationItem>
                }
                
                {
                    RenderPagination.map((item, i) => {
                        return item;
                    })
                }

                {
                    currentPage >= pageNumber - 1 ?
                    <PaginationItem disabled><PaginationLink next tag="button"><i className="fa fa-angle-double-right"></i></PaginationLink></PaginationItem>
                    :
                    <PaginationItem onClick={() => handlePageNext(currentPage + 1)}><PaginationLink next tag="button"><i className="fa fa-angle-double-right"></i></PaginationLink></PaginationItem>
                }
            </Pagination>
        );
    }
}

export default PaginationComponent;
