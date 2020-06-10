import React, { Component } from "react";
import { connect } from "react-redux";

import Head from "next/head";
import Good from "../components/Good";
import { addToCart } from "../redux/actions/cartActions";
import {
  getGoods,
  deleteGood,
  updateGood,
} from "../redux/actions/goodsActions";

class Home extends Component {
  componentDidMount() {
    this.props.onGetGoods();
  }

  onAddToCart = (e, good) => {
    e.preventDefault();
    this.props.onAddToCart(good);
  };

  render() {
    const goods = this.props.goods.goods;
    const users = this.props.users;

    return (
      <div>
        <Head>
          <title>Test</title>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          />
        </Head>

        <div className="row row-cols-1 row-cols-md-3 container mx-auto">
          {goods.map((good) => (
            <Good
              key={good.id}
              good={good}
              onAddToCart={this.onAddToCart}
              onDeleteGood={this.props.onDeleteGood}
              onUpdateGood={this.props.onUpdateGood}
              user={users}
            />
          ))}
        </div>

        <style jsx>{`
          .row-cols-md-3 {
            margin: 3vh 1.5vw 1.5vh 1.5vw;
          }
        `}</style>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGetGoods: () => {
      dispatch(getGoods());
    },
    onAddToCart: (good) => {
      dispatch(addToCart(good));
    },
    onDeleteGood: (id) => {
      dispatch(deleteGood(id));
    },
    onUpdateGood: (good) => {
      dispatch(updateGood(good));
    },
  };
};

const mapStateToProps = (state) => ({
  goods: state.goods,
  users: state.users,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
