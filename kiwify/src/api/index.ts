import axios from 'axios';

const ONE_SIGNAL_APP_ID = 'a95344ea-1552-45da-ab76-75bdddbfb937';
const ONE_SIGNAL_REST_API_KEY =
  'OWVlZDcyMjYtZmExYS00OTU0LThhMWUtMWNlMTA1MjFiZGZi';

export const sendNotification = async (
  userId: string,
  valorTitleInput: string,
  valorMsgInput: string,
  valor: string,
  largeIcon: string,
) => {
  const oneSignalApiUrl = 'https://onesignal.com/api/v1/notifications';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${ONE_SIGNAL_REST_API_KEY}`,
  };

  if (largeIcon === '') {
    largeIcon =
      'https://play-lh.googleusercontent.com/VJOW3rillBsN_OOH-U7DHesvzjinqNNceRBeCFpzXa7rOahD5LUb4YAhV7QQvwzFYgs';
  }

  const data = {
    app_id: ONE_SIGNAL_APP_ID,
    include_player_ids: [userId],
    headings: {en: valorTitleInput},
    contents: {
      en: `${valorMsgInput} ${valor}`,
    },
    large_icon: largeIcon,
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
