import axios from "axios";
import { API } from "../constants/api";
import { fileToBase64 } from "../utils/file";

export class EnvioService {
  static async sendMessage(phone: number, message: string) {
    const res = await axios.post(API.MESSAGE.SEND, {
      phone,
      message,
    });
    return res.data;
  }

  static async sendMessageWithImage(
    phone: number,
    caption: string,
    image: File
  ) {
    const res = await axios.post(API.MESSAGE.SEND_WITH_IMAGE, {
      phone,
      image: await fileToBase64(image),
      caption,
    });
    console.log("res.data", res.data);
    return res.data;
  }

  static sendMessageGeneral(phone: number, caption: string, image?: File) {
    return image
      ? EnvioService.sendMessageWithImage(phone, caption, image)
      : EnvioService.sendMessage(phone, caption);
  }
}
