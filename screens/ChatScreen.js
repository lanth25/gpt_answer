import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const giftedChatRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Welcome to the chat!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
        },
      },
      {
        _id: 2,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
        },
        image: {uri:'https://i.imgur.com/YfeOqp2.jpg'},
      },
    ]);
  }, []);

  const handleSend = (newMessages = []) => {
    const formattedMessages = newMessages.map((message) => {
      if (message.image) {
        const { uri } = message.image;
        const filename = uri.split('/').pop();
        const newImage = `${FileSystem.cacheDirectory}${filename}`;
        return {
          ...message,
          image: newImage,
        };
      }
      return message;
    });

    setMessages((prevMessages) => GiftedChat.append(prevMessages, formattedMessages));
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted') {
       const result = await ImagePicker.launchImageLibraryAsync();
      Alert.alert(result.uri)
      if (!result.cancelled) {
        const localUri = result.uri;
        const filename = localUri.split('/').pop();
        const newMessage = {
          _id: messages.length + 1,
          createdAt: new Date(),
          user: {
            _id: 1,
          },
          image: localUri,
        };

        handleSend([newMessage]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: 1 }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#f0f0f0',
              },
              right: {
                backgroundColor: '#DCF8C6',
              },
            }}
            textStyle={{
              left: {
                color: '#000',
              },
              right: {
                color: '#000',
              },
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              borderTopWidth: 1,
              borderTopColor: '#ccc',
              backgroundColor: '#fff',
            }}
          />
        )}
        renderSend={(props) => (
          <Send {...props} containerStyle={styles.sendContainer}>
            <Text style={styles.sendText}>发送</Text>
          </Send>
        )}
        renderActions={() => (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handlePickImage}>
              <Text style={styles.buttonText}>选择图片</Text>
            </TouchableOpacity>
          </View>
        )}
        renderMessageImage={(props) => <Image {...props} style={styles.messageImage} />}
        ref={giftedChatRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sendText: {
    color: '#0099FF',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
});

export default ChatScreen;
