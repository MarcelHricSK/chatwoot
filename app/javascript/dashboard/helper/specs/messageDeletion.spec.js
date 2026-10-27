import {
  canDeleteMessageOnChannel,
  TELEGRAM_DELETE_WINDOW_SECONDS,
} from 'dashboard/helper/messageDeletion';
import { INBOX_TYPES } from 'dashboard/helper/inbox';
import { MESSAGE_TYPE } from 'shared/constants/messages';

const now = () => Math.floor(Date.now() / 1000);

const telegramMessage = (overrides = {}) => ({
  messageType: MESSAGE_TYPE.OUTGOING,
  private: false,
  sourceId: '101',
  createdAt: now() - 60,
  ...overrides,
});

describe('canDeleteMessageOnChannel', () => {
  it('returns true for a delivered outgoing telegram message inside the window', () => {
    expect(
      canDeleteMessageOnChannel(INBOX_TYPES.TELEGRAM, telegramMessage())
    ).toBe(true);
  });

  it('returns false once the telegram delete window has passed', () => {
    const message = telegramMessage({
      createdAt: now() - TELEGRAM_DELETE_WINDOW_SECONDS - 60,
    });
    expect(canDeleteMessageOnChannel(INBOX_TYPES.TELEGRAM, message)).toBe(
      false
    );
  });

  it('returns false for incoming messages', () => {
    const message = telegramMessage({ messageType: MESSAGE_TYPE.INCOMING });
    expect(canDeleteMessageOnChannel(INBOX_TYPES.TELEGRAM, message)).toBe(
      false
    );
  });

  it('returns false for private notes', () => {
    const message = telegramMessage({ private: true });
    expect(canDeleteMessageOnChannel(INBOX_TYPES.TELEGRAM, message)).toBe(
      false
    );
  });

  it('returns false for messages that never reached telegram', () => {
    const message = telegramMessage({ sourceId: '' });
    expect(canDeleteMessageOnChannel(INBOX_TYPES.TELEGRAM, message)).toBe(
      false
    );
  });

  it('returns false for other channels and unknown inboxes', () => {
    expect(
      canDeleteMessageOnChannel(INBOX_TYPES.WHATSAPP, telegramMessage())
    ).toBe(false);
    expect(canDeleteMessageOnChannel(undefined, telegramMessage())).toBe(false);
  });
});
