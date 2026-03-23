export interface NotificationMessage {
  pk: number;
  senderUserFk: number;
  senderName: string;
  recipientUserFk: number;
  recipientName: string;
  type: string;
  message: string;
  notificationObjectFk: number;
  unread: boolean;
  createdOn: string;
}
