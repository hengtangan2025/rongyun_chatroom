jQuery(document).ready(function(){
  jQuery(".test-user .user-name").click(function(){
    var token = jQuery(this).val();
    var userId = jQuery(this).attr("id");
    console.log(token);
    console.log(userId);
    // 初始化。
    RongIMClient.init("z3v5yqkbvvpl0");

    // 连接融云服务器。
    RongIMClient.connect(token, {
      onSuccess: function(userId) {
        console.log("Login successfully." + userId);
      },
      onError: function (errorCode,message) {
        var info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时';
            break;
        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = '未知错误';
            break;
        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = '在黑名单中，无法向对方发送消息';
            break;
        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info = '不在讨论组中';
            break;
        case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info = '不在群组中';
            break;
        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = '不在聊天室中';
            break;
        default :
            info = x;
            break;
        }
          console.log('发送失败:' + info);
        }
      }
    );

    // 设置连接监听状态 （ status 标识当前连接状态）
    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        switch (status) {
          //链接成功
          case RongIMLib.ConnectionStatus.CONNECTED:
            console.log('链接成功');
            break;
          //正在链接
          case RongIMLib.ConnectionStatus.CONNECTING:
            console.log('正在链接');
            break;
          //重新链接
          case RongIMLib.ConnectionStatus.DISCONNECTED:
            console.log('断开连接');
            break;
          //其他设备登录
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            console.log('其他设备登录');
            break;
          //网络不可用
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            console.log('网络不可用');
            break;
          }
        }
      }
    );

    // 消息监听器
    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: function (message) {
        // 判断消息类型
        switch(message.messageType){
          case RongIMClient.MessageType.TextMessage:
            // 发送的消息内容将会被打印
            console.log(message);
            console.log(message.content.content);
            break;
          case RongIMClient.MessageType.VoiceMessage:
            // 对声音进行预加载                
            // message.content.content 格式为 AMR 格式的 base64 码
            RongIMLib.RongIMVoice.preLoaded(message.content.content);
            break;
          case RongIMClient.MessageType.ImageMessage:
            // do something...
            break;
          case RongIMClient.MessageType.DiscussionNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.LocationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.RichContentMessage:
            // do something...
            break;
          case RongIMClient.MessageType.DiscussionNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.InformationNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.ContactNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.ProfileNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.CommandNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.CommandMessage:
            // do something...
            break;
          case RongIMClient.MessageType.UnknownMessage:
            // do something...
            break;
          default:
            // 自定义消息
            // do something...
        }
      }
    });
  });

  //获取会话列表
  jQuery(".get-chat-list").click(function(){
    RongIMClient.getInstance().getConversationList({
      onSuccess: function(list) {
        console.log(list);
        // list => 会话列表集合。
      },
      onError: function(error) {
        console.log(error);
         // do something...
      }
    },null);
  });

  //发送消息（单聊）
  var private_targetId = "";
  jQuery(".private .user-name").click(function(){
    private_targetId = jQuery(this).attr("id");
    console.log(private_targetId);
  });
  jQuery(".private .send-private-message").click(function(){
    var message_content = jQuery(".private .message-content").val();
    var msg = new RongIMLib.TextMessage({content:message_content,extra:"附加信息"});
    var conversationtype = RongIMLib.ConversationType.PRIVATE; // 私聊,其他会话选择相应的消息类型即可。
    RongIMClient.getInstance().sendMessage(conversationtype, private_targetId, msg, {
      onSuccess: function (message) {
          console.log(message);
          //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
          console.log("Send successfully");
      },
      onError: function (errorCode,message) {
        var info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
              info = '超时';
              break;
          case RongIMLib.ErrorCode.UNKNOWN_ERROR:
              info = '未知错误';
              break;
          case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
              info = '在黑名单中，无法向对方发送消息';
              break;
          case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
              info = '不在讨论组中';
              break;
          case RongIMLib.ErrorCode.NOT_IN_GROUP:
              info = '不在群组中';
              break;
          case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
              info = '不在聊天室中';
              break;
          default :
              info = x;
              break;
        }
        console.log('发送失败:' + info);
      }
    });
  });

  //创建讨论组
  var chat_room_targetId = "";
  //获取讨论组成员Id和讨论组名称
  var userIds = [];
  jQuery(".check-box").click(function(){
    var token = jQuery(this).val();
    var userId = jQuery(this).attr("id");
    userIds.push(userId);
    console.log(userIds);
  });
  jQuery(".create_chatroom").click(function(){
    var discussionName = jQuery(".discussion-name").val();
    RongIMClient.getInstance().createDiscussion(discussionName,userIds,{
      onSuccess:function(discussionId){
        chat_room_targetId = discussionId;
        console.log(discussionId);
        RongIMClient.getInstance().getDiscussion(discussionId,{
            onSuccess:function(discussion){
              console.log(discussion);
                // discussion => 讨论组信息。
            },
            onError:function(error){
                // error => 获取讨论组失败错误码。
            }
        });
        // discussionId => 讨论组 Id。
      },
      onError:function(error){
        console.log(error);
        // error => 创建讨论组失败错误码。
      }
    });
  });

  //发送消息（群聊）
  jQuery(".chat-room .send-chat-room-message").click(function(){
    var chat_room_message_content = jQuery(".chat-room .message").val();
    console.log(chat_room_message_content);
    var msg = new RongIMLib.TextMessage({content:chat_room_message_content,extra:"附加信息"});
    var conversationtype = RongIMLib.ConversationType.DISCUSSION; // 私聊,其他会话选择相应的消息类型即可。
    RongIMClient.getInstance().sendMessage(conversationtype, chat_room_targetId, msg, {
      onSuccess: function (message) {
          console.log(message);
          //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
          console.log("Send successfully");
      },
      onError: function (errorCode,message) {
        var info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
              info = '超时';
              break;
          case RongIMLib.ErrorCode.UNKNOWN_ERROR:
              info = '未知错误';
              break;
          case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
              info = '在黑名单中，无法向对方发送消息';
              break;
          case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
              info = '不在讨论组中';
              break;
          case RongIMLib.ErrorCode.NOT_IN_GROUP:
              info = '不在群组中';
              break;
          case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
              info = '不在聊天室中';
              break;
          default :
              info = x;
              break;
        }
        console.log('发送失败:' + info);
      }
    });
  });
  
});