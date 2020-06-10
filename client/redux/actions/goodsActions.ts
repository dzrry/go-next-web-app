import axios from "axios";
import { Dispatch } from "redux";

import {
  FETCH_GOODS_SUCCESS,
  FETCH_GOODS_FAILURE,
  FETCH_GOODS_REQUEST,
  CREATE_GOOD_FAILURE,
  serverUrl,
  DELETE_GOOD_FAILURE,
  UPDATE_GOOD_FAILURE,
} from "../constants";
import { Good, AppActions } from "../types";

export const getGoods = () => async (dispatch) => {
  dispatch({ type: FETCH_GOODS_REQUEST });

  try {
    const msg = await axios.get(serverUrl + "goods");

    return dispatch({ type: FETCH_GOODS_SUCCESS, data: msg.data });
  } catch (err) {
    return dispatch({ type: FETCH_GOODS_FAILURE, data: err });
  }
};

export const createGood = (data: Good) => async (
  dispatch
) => {
  try {
    await axios({
      method: "POST",
      url: serverUrl + "private/" + "goods",
      data: JSON.stringify(data),
      withCredentials: true,
    });

    return dispatch(getGoods());
  } catch (err) {
    dispatch({ type: CREATE_GOOD_FAILURE });
  }
};

export const deleteGood = (id: string) => async (
  dispatch
) => {
  try {
    await axios({
      method: "DELETE",
      url: serverUrl + "private/" + "goods/" + id,
      withCredentials: true,
    });

    return dispatch(getGoods());
  } catch (err) {
    dispatch({ type: DELETE_GOOD_FAILURE, data: err });
  }
};

export const updateGood = (data: Good) => async (
  dispatch
) => {
  try {
    await axios.put(serverUrl + "private/" + "goods", JSON.stringify(data), {
      withCredentials: true,
    });

    return dispatch(getGoods());
  } catch (err) {
    dispatch({ type: UPDATE_GOOD_FAILURE, data: err });
  }
};
