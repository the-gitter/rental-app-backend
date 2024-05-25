import NotificationModel, { INotification } from "../models/notificationModel";

export default class NotificationsRepository {
  constructor() {
    this.Create = this.Create.bind(this);
    this.Delete = this.Delete.bind(this);
    this.GetNotifications = this.GetNotifications.bind(this);
    this.MarkAsRead = this.MarkAsRead.bind(this);
    this.Get = this.Get.bind(this);
  }

  async Get({ userId }: { userId: string }) {
    return await NotificationModel.find({ user: userId });
  }

  async Create({ data }: { data: Partial<INotification> }) {
    const notification = new NotificationModel(data);
    return await notification.save();
  }

  async Delete({
    notificationId,
    userId,
  }: {
    notificationId: string;
    userId: string;
  }) {
    return await NotificationModel.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });
  }

  async GetNotifications({ userId }: { userId: string }) {
    return await NotificationModel.find({ user: userId });
  }

  async MarkAsRead({ notificationId }: { notificationId: string }) {
    return await NotificationModel.findByIdAndUpdate(notificationId, {
      $set: { read: true },
    });
  }
}
