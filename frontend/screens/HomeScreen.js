import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  WebBrowser,
  Video
 } from 'expo';
import GalleryScreen from './GalleryScreen';

import { MonoText } from '../components/StyledText';
import HTTP from '../constants/HTTP';
import Spinner from 'react-native-loading-spinner-overlay';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    showGallery: false,
    selectedMedia: null,
    spinner: false,
  }

  promisedSetState = (newState) => {
     return new Promise((resolve) => {
       this.setState(newState, () => {
         resolve()
       });
     });
   }

   _moveMediaToHome = async (mediaObject) => {

     console.log(mediaObject)

     let filenameParts = mediaObject.filename.split('.');
     let fileExt = filenameParts[filenameParts.length-1]
     let filename = Date.now().toString();

     await this.promisedSetState({
       showGallery: false,
     });

     let selectedMediaObject = {
       filename: `${filename}.${fileExt}`,
       uri: mediaObject.uri,
       mediaType: mediaObject.mediaType,
     };

     await this.promisedSetState({
       selectedMedia: selectedMediaObject,
     })

     console.log(this.state.selectedMedia)
   }

   _handleUpload = async () => {
     const { selectedMedia } = this.state;
     let uploadResponse, uploadResult;

     await this.promisedSetState({
       spinner: true
     })

     try {
       uploadResponse = await this._uploadMediaAsync({uri: selectedMedia.uri, filename: selectedMedia.filename, mediaType: selectedMedia.mediaType});
       uploadResult = await uploadResponse.json();
       console.log(uploadResult)
     } catch (e) {
       console.log(e)
     } finally {
       this.setState({
         spinner: false
       })
     }
   };

   _uploadMediaAsync = async ({uri, filename, mediaType}) => {
     let apiUrl = `${HTTP.serverUrl}/api/media/upload`;
     let formData = new FormData();

     let uriParts = filename.split('.');
     let fileType = uriParts[uriParts.length - 1];

     formData.append(mediaType, {
       uri,
       name: encodeURIComponent(`${filename}`),
       type: `${mediaType}/${fileType}`,
     });

     let options = {
       ... HTTP.formDataOptions,
       method: 'POST',
       body: formData,
     };

     console.log(formData)

     return fetch(apiUrl, options);
   };

  _toggleView = async () => {
    await this.promisedSetState({
      showGallery: !this.state.showGallery,
    });
  }

  renderGallery() {
    return <GalleryScreen onPress={this._toggleView.bind(this)} moveMediaToHome={this._moveMediaToHome.bind(this)} />;
  }

  renderHome() {
    const { selectedMedia } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._toggleView} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Open Gallery</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.helpContainer}>
            {selectedMedia && (
              selectedMedia.mediaType === "photo" ? (
                <Image
                  style={{height: 200, width: 200}}
                  resizeMode="cover"
                  source={{
                    uri: selectedMedia.uri
                  }}
                  />
              ) : (
                <Video
                   style={{ height: 200, width: 200 }}
                   ref={component => {
                     this.video = component;
                   }}
                   source={{
                     uri: selectedMedia.uri
                   }}
                   shouldPlay={true}
                   resizeMode="cover"
                   isMuted={true}
                   positionMillis={500}
                />
              )
            )}
          </View>

          {selectedMedia && (
            <View style={styles.helpContainer}>
              <TouchableOpacity onPress={this._handleUpload} style={styles.helpLink}>
                <Text style={styles.helpLinkText}>Upload</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
        <Spinner visible={this.state.spinner} />
      </View>
    )
  }

  render() {
    const content = this.state.showGallery ? this.renderGallery() : this.renderHome();

    return (
      content
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 20,
    color: '#2e78b7',
  },
});
