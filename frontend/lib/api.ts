import axios from "axios";

const BASEURL = process.env.NEXT_PUBLIC_BACKEND_API;

const API = axios.create({
  baseURL: BASEURL,
  withCredentials: true, // this sends cookies automatically
});

export default API;
