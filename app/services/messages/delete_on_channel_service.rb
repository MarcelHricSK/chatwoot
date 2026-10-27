# Deletes a message for the customer on its channel, for channels that support it.
# A channel service raises CustomExceptions::ChannelMessageDeleteFailed when the channel refuses.
class Messages::DeleteOnChannelService
  CHANNEL_SERVICES = {
    'Channel::Telegram' => ::Telegram::DeleteMessageService
  }.freeze

  pattr_initialize [:message!]

  def perform
    CHANNEL_SERVICES[message.inbox.channel_type]&.new(message: message)&.perform
  end
end
