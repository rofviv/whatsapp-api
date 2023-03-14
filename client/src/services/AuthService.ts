import axios from "axios";
import { API } from "../constants/api";

const AUTH = "isAuth";

export class AuthService {
  static isAuth = false;

  static login() {
    AuthService.isAuth = true;
    sessionStorage.setItem(AUTH, "true");
  }

  static verifyAuth() {
    AuthService.isAuth = sessionStorage.getItem(AUTH) === "true";
    return AuthService.isAuth;
  }

  static async clearSession() {
    sessionStorage.removeItem(AUTH);
    AuthService.isAuth = false;
    const res = await axios.get(API.AUTH.CLEAR_SESSION);
    return res.data;
  }
}
