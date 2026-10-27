require 'rails_helper'

describe Messages::DeleteOnChannelService do
  describe '#perform' do
    it 'deletes the message with the service of its channel' do
      telegram_channel = create(:channel_telegram)
      message = create(:message, conversation: create(:conversation, inbox: telegram_channel.inbox))
      telegram_service = instance_double(Telegram::DeleteMessageService, perform: nil)
      allow(Telegram::DeleteMessageService).to receive(:new).with(message: message).and_return(telegram_service)

      described_class.new(message: message).perform

      expect(telegram_service).to have_received(:perform)
    end

    it 'does nothing for channels without message deletion' do
      message = create(:message)
      allow(Telegram::DeleteMessageService).to receive(:new)

      described_class.new(message: message).perform

      expect(Telegram::DeleteMessageService).not_to have_received(:new)
    end
  end
end
