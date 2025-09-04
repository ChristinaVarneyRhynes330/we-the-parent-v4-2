import { google } from 'googleapis';
import { getSession } from 'next-auth/react';

export async function addHearingEvent(req, { summary, date }) {
  const session = await getSession({ req });
  if (!session || !session.accessToken) {
    throw new Error('Not authenticated');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const calendar = google.calendar({ version: 'v3', auth });

  return calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary,
      start: { date },
      end: { date },
    },
  });
}