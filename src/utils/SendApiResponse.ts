import { Response } from "express";
class ApiResponse {
  msg: string;
  status: number;
  data: any;
  constructor(status: number, data: any, msg = "None") {
    this.msg = msg;
    this.status = status;
    this.data = data;
  }
}

export default  (res: Response, status: number, data: any, msg?: string) => {
  const response = new ApiResponse(status, data, msg);
  return res.status(status).json(response);
};
