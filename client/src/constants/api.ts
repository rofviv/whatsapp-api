export const API_URL = process.env.REACT_APP_API_URL!;

export const API = {
  MESSAGE: {
    SEND: `${API_URL}/message/send`,
    SEND_WITH_IMAGE: `${API_URL}/message/send/image`,
  },
  AUTH: {
    CLEAR_SESSION: `${API_URL}/auth/clear_session`,
  },
};
