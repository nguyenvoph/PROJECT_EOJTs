const isNullOrUndefined = (obj) => {
    return obj === null || obj === undefined || obj.Lenth < 1;
}

// const ROW_PER_PAGE = 5;


const getPaginationPageNumber = (total, ROW_PER_PAGE) => {
    return Math.ceil(total / ROW_PER_PAGE);
}

const getPaginationNextPageNumber = (currentPage, ROW_PER_PAGE) => {
    return (currentPage + 1) * ROW_PER_PAGE;
}

const getPaginationCurrentPageNumber = (currentPage, ROW_PER_PAGE) => {
    return currentPage * ROW_PER_PAGE;
}

export { isNullOrUndefined, getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber };