import { INBOX_TYPES } from 'dashboard/helper/inbox';
import { MESSAGE_TYPE } from 'shared/constants/messages';

// Telegram allows deleting messages sent in the last 48 hours, the backend keeps a small margin before that
export const TELEGRAM_DELETE_WINDOW_SECONDS = 48 * 60 * 60 - 5 * 60;

const isWithinTelegramDeleteWindow = createdAt =>
  Date.now() / 1000 - createdAt < TELEGRAM_DELETE_WINDOW_SECONDS;

/**
 * Whether the message can also be deleted for the customer on the channel.
 * @param {string} channelType - Inbox channel type, e.g. Channel::Telegram
 * @param {Object} message - Message with messageType, private, sourceId and createdAt (in seconds)
 * @returns {boolean}
 */
export const canDeleteMessageOnChannel = (channelType, message) => {
  if (channelType !== INBOX_TYPES.TELEGRAM) return false;

  return (
    message.messageType === MESSAGE_TYPE.OUTGOING &&
    !message.private &&
    !!message.sourceId &&
    isWithinTelegramDeleteWindow(message.createdAt)
  );
};
