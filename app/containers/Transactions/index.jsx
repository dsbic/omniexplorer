/**
 *
 * Transactions
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Container } from 'reactstrap';
import styled from 'styled-components';
import TransactionList from 'components/TransactionList';
import TransactionListHeader from 'components/TransactionListHeader';
import ListPagination from 'components/ListPagination';

import LoadingIndicator from 'components/LoadingIndicator';

import { makeSelectLoading, makeSelectTransactions } from './selectors';
import { loadTransactions, setPage } from './actions';

export class Transactions extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    const page = this.getCurrentPage(this.props.location.get('pathname'));
    this.props.loadTransactions(this.props.addr, page);
    console.log('Transactions did mount');
  }

  getCurrentPage(pathname) {
    let page;
    if (pathname.charAt(pathname.length - 1) === '/') {
      page = pathname.slice(0, -1).substr(pathname.lastIndexOf('/') + 1);
    } else {
      page = pathname.substr(pathname.lastIndexOf('/') + 1);
    }
    return (!page || isNaN(page) ? 0 : page);
  }

  render() {
    const StyledContainer = styled(Container)`
      background-color: #F0F3F4;
      overflow: auto;
    `;
    const StyledH3 = styled.h3`
      padding: 3rem 0;
    `;

    let content;

    if (this.props.loading) {
      content = (
        <LoadingIndicator />
      );
    } else if (!this.props.loading && (this.props.transactions.transactions || []).length === 0) {
      content = (
        <StyledH3 className="lead text-center">
          <p className="h3">
          No Omni Protocol transactions found
          </p>
          <p className="h5">
            If the transaction you are searching for was just broadcast it might take a few minutes for the network to pass it around for us to see it.
          </p>
          <p className="h5">
            If the transaction you are searching for is a Bitcoin only transaction you should use a bitcoin block explorer like <a href="https://www.blocktrail.com">blocktrail.com</a>
          </p>
        </StyledH3>
      );
    } else {
      const props = { ...this.props.transactions, addr: this.props.addr };
      content = (
        <div>
          <ListPagination {...props} onSetPage={this.props.onSetPage} />
          <TransactionList {...props} />
          <ListPagination {...props} onSetPage={this.props.onSetPage} />
        </div>
      );
    }

    return (
      <StyledContainer fluid>
        <TransactionListHeader />
        { content }
      </StyledContainer>
    );
  }
}

Transactions.propTypes = {
  loadTransactions: PropTypes.func,
  transactions: PropTypes.object.isRequired,
  onSetPage: PropTypes.func,
  loading: PropTypes.bool,
  addr: PropTypes.string,
  location: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  transactions: makeSelectTransactions(),
  loading: makeSelectLoading(),
  location: (state) => state.get('route').get('location'),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadTransactions: (addr, page) => dispatch(loadTransactions(addr, page)),
    onSetPage: (p, addr) => dispatch(setPage(p, addr)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(Transactions);
