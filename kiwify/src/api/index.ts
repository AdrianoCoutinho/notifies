import axios from 'axios';

const ONE_SIGNAL_APP_ID = '25dd4296-7fc9-475e-8fd9-76ade13e630a';
const ONE_SIGNAL_REST_API_KEY =
  'NzhmNjgyYmUtMDFkOC00ODZhLWEyM2QtN2FiNzM0YTRiM2Yx';

export const sendNotification = async (
  userId: string,
  valorTitleInput: string,
  valorMsgInput: string,
  valor: string,
) => {
  const oneSignalApiUrl = 'https://onesignal.com/api/v1/notifications';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${ONE_SIGNAL_REST_API_KEY}`,
  };

  const data = {
    app_id: ONE_SIGNAL_APP_ID,
    include_player_ids: [userId],
    headings: {en: valorTitleInput},
    contents: {
      en: `${valorMsgInput} ${valor}.`,
    },
  };

  try {
    await axios.post(oneSignalApiUrl, data, {headers});
    return 1;
  } catch (error) {
    return 0;
  }
};

export const getStatus = async (playerid: string) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${ONE_SIGNAL_REST_API_KEY}`,
  };

  try {
    const url = `https://onesignal.com/api/v1/players/${playerid}`;
    const response = await axios.get(url, {headers});
    const success = response.data.tags.success;
    return success;
  } catch (error) {
    return null;
  }
};
