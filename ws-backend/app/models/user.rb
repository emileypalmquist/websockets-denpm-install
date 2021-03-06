class User < ApplicationRecord
  # has_many :user_bs, foreign_key: :user_b_id, class_name: "DirectMessage", dependent: :destroy
  # has_many :direct_messages_received, through: :user_bs, source: :user_b
  # has_many :user_as, foreign_key: :user_a_id, class_name: "DirectMessage", dependent: :destroy
  # has_many :direct_message_initiated, through: :user_as, source: :user_a
  has_many :follower_follows, class_name: "DirectMessage", foreign_key: :user_a_id, dependent: :destroy
  # has_many :initiated_direct_messages, class_name: "DirectMessage", foreign_key: :user_a_id, dependent: :destroy
  
  has_many :followers, through: :follower_follows, source: :user_b
  # has_many :user_messaged, through: :follower_follows, source: :user_b
  
  has_many :followee_followers, class_name: "DirectMessage", foreign_key: :user_b_id, dependent: :destroy
  # has_many :received_direct_message, class_name: "DirectMessage", foreign_key: :user_b_id, dependent: :destroy
  
  has_many :following, through: :followee_followers, source: :user_a
  # has_many :user_received_message, through: :followee_followers, source: :user_a

  def chats
    follower_follows + followee_followers
  end
end
