import { Actito } from 'react-native-actito';
import { Buffer } from 'buffer';

export async function logCustomBackgroundEvent(
  event: String,
  data: Record<string, any>
) {
  const device = await Actito.device().getCurrentDevice();
  const applicationKey = process.env.APPLICATION_KEY;
  const applicationSecret = process.env.APPLICATION_SECRET;

  if (!device || !applicationKey || !applicationSecret) {
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'Basic ' +
      Buffer.from(`${applicationKey}:${applicationSecret}`).toString('base64')
  );

  const raw = JSON.stringify({
    type: `re.notifica.event.custom.BackgroundEvent_${event}`,
    timestamp: '{{timestampMs}}',
    deviceID: device.id,
    data: data,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(
      'https://push.notifica.re/event',
      requestOptions
    );

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
