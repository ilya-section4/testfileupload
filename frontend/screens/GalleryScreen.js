import React, { Component, PureComponent } from 'react';
import { Platform, Image, StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, FlatList } from 'react-native';
import { FileSystem, MediaLibrary, Permissions, Video, Linking } from 'expo';
import { Icon } from 'native-base';
import InfiniteScrollView from 'react-native-infinite-scroll-view';

const dimensions = Dimensions.get('window');
const ScreenWidth = dimensions.width;
const ScreenHeight = dimensions.height;
const pictureSize = 150;
const hitSlopParams = {top: 20, right: 30, bottom: 20, left: 30};

const X_WIDTH = 375;
const SMALL_WIDTH = 320;
const X_HEIGHT = 812;
const X_MAXWIDTH = 414;
const X_MAXHEIGHT = 896;
const PLUS_HEIGHT = 736;
const SE_HEIGHT = 568;

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

const isIPhoneX =
  Platform.OS === 'ios' && (D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH);

const isIPhoneXLarge =
  Platform.OS === 'ios' && (D_HEIGHT === X_MAXHEIGHT && D_WIDTH === X_MAXWIDTH);

const isIPhonePlus =
  Platform.OS === 'ios' && (D_HEIGHT === PLUS_HEIGHT && D_WIDTH === X_MAXWIDTH);

const isIPhoneSmall =
  Platform.OS === 'ios' && (D_HEIGHT === SE_HEIGHT && D_WIDTH === SMALL_WIDTH);

class GalleryItem extends PureComponent {

  render() {
    const { boxSize, selectMedia, item, index, handleErrorCallback, timeForVideo, selectedMedia } = this.props;

    return (
      <View style={{width: boxSize, height: boxSize, margin: 1,}} key={item.id}>
        {item.mediaType === "photo" ? (
          <TouchableOpacity key={item.id} onPress={()=>{selectMedia(item)}}>
            <Image
              key={item.id}
              style={{height: boxSize, width: boxSize}}
              resizeMode="cover"
              source={{
                uri: item.uri
              }}
              />
            </TouchableOpacity>
        ) : (
          <TouchableOpacity key={item.id} onPress={()=>{selectMedia(item)}}>
            <Video
               style={{ height: boxSize, width: boxSize }}
               ref={component => {
                 this.video = component;
               }}
               source={{uri: item.uri}}
               progressUpdateIntervalMillis={10000000}
               onError={(error) => handleErrorCallback(error, index, item.uri)}
               usePoster
               shouldPlay={false}
               resizeMode="cover"
               isMuted={true}
               positionMillis={500}
            />
            <View style={{position: 'absolute', bottom: 10, right: 10}}>
              <Text style={{fontSize: 12}}>{timeForVideo(item)}</Text>
            </View>
          </TouchableOpacity>
        )}

        {this.props.selectedMedia == item && (
          <View style={{position: 'absolute', top: 7.5, right: 7.5, backgroundColor: 'rgb(255,67,7)', width: 20, height: 20, borderRadius: 10, borderWidth: 4, borderColor: 'white'}}/>
        )}
      </View>
    )
  }
}

class GalleryScreen extends Component {
  _mounted = false;
  _afterValue = null;
  _noMore = false;

  constructor(props) {
    super(props)

    this.state = {
      media: [],
      selectedMedia: null,
      galleryPermission: false,
      doNotShow: []
    };

    this.viewabilityConfigCallbackPairs = [
      {
        viewabilityConfig: {
          itemVisiblePercentThreshold: 40,
          waitForInteraction: true
        },
        onViewableItemsChanged: this.handleItemsPartiallyVisible
      }
    ];
  }

  async componentWillMount() {
    this._mounted = false;
  }

  promisedSetState = (newState) => {
     return new Promise((resolve) => {
       this.setState(newState, () => {
         resolve()
       });
     });
   }

  async componentDidMount() {
    this._mounted = true;

    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    this.setState({
      galleryPermission: status === 'granted',
    });

    if(status === 'granted') {
      this._loadMoreItems();
    }
  }

  _loadMoreItems = async () => {
    if(this._noMore) {

    } else {

      let mediaToPush = [];
      let afterValue = this._afterValue;

      let items = {};

      if(!afterValue){
        items = await MediaLibrary.getAssetsAsync({
          first: 10,
          sortBy: [MediaLibrary.SortBy.mediaType],
          mediaType: [MediaLibrary.MediaType.video, MediaLibrary.MediaType.photo]
        })
      } else {
        items = await MediaLibrary.getAssetsAsync({
          first: 10,
          after: afterValue,
          sortBy: [MediaLibrary.SortBy.mediaType],
          mediaType: [MediaLibrary.MediaType.video, MediaLibrary.MediaType.photo]
        })
      }

      this.state.media.map((item) => {
        mediaToPush.push(item)
      })

      items.assets.map((item)=> {
        mediaToPush.push(item)
      })

      let newMedia = mediaToPush;

      if(items.hasNextPage) {
        this._afterValue = items.endCursor
      } else {
        this._noMore = true
      }

      this.setState({
        media: newMedia
      })
    }
  }

  _goToSettings = async () => {
    Linking.openURL('app-settings:');
  }

  renderNoPermissions = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>

        <TouchableOpacity hitSlop={hitSlopParams} style={{paddingRight: 15, paddingLeft: 15, position: 'absolute', top: 0, right: 10}} onPress={()=>{
          this.setState({ media: [] });
          this.props.onPress();
        }}>
          <Icon name="ios-close" style={{color:"#f2f3f4", fontWeight: "bold", fontSize: 40}} />
        </TouchableOpacity>

        <View style={{justifyContent: 'space-between', alignItems: 'center', flex: 0.1}}>
          {this.state.galleryPermission ? (
            <View>
            <Text style={{ color: '#696969' }}>
              Allow access to photo library
            </Text>
          </View>
        ) : (
            <TouchableOpacity onPress={()=> {this._goToSettings()}}>
              <Text style={{ color: 'white' }}>
                Allow access to photo library
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  _selectMedia = (mediaObject) => {
    this.setState({
      selectedMedia: mediaObject
    })
  }

  timeForVideo = (mediaObject) => {
    let durationInSec = mediaObject.duration;
    let minutes = Math.floor(durationInSec / 60);
    let seconds = (durationInSec % 60).toFixed(0);

    return (
      <Text style={[{color: 'white'}, styles.textWithShadow]}>{minutes}:{seconds < 10 ? '0' : null}{seconds}</Text>
    )
  }

  _handleErrorCallback = async (error, index, uri) => {
    console.log("Video Player Error in ", index, ": ", error)
  }

  _renderGalleryItem = ({item, index}) => {
    let boxSize = (ScreenWidth - 6) / 3;
    let shouldShow = this.state.doNotShow.includes(index) ? false : true;

    return (
      shouldShow ? (
        <GalleryItem
          ref={ref => this[`galleryItem${index}`] = ref}
          boxSize={boxSize}
          item={item}
          index={index}
          selectMedia={this._selectMedia}
          handleErrorCallback={this._handleErrorCallback}
          timeForVideo={this.timeForVideo}
          selectedMedia={this.state.selectedMedia}
        />
      ) : (
        <View
          style={{
            width: boxSize,
            height: boxSize,
            margin: 1
          }}
        />
      )
    )
  }

  handleItemsPartiallyVisible = ({viewableItems, changed}) => {

    changed.map(async(item) => {
      if(!item.isViewable) {
        let currentDoNotShow = this.state.doNotShow;
        currentDoNotShow.push(item.index);
        await this.promisedSetState({
          doNotShow: currentDoNotShow
        })

      } else if(item.isViewable) {
        let currentDoNotShow = this.state.doNotShow;
        let indexInList = currentDoNotShow.findIndex((listItem) => {
          if(listItem == item.index) {
            return true
          }
        })
        if(indexInList != -1) {
          currentDoNotShow.splice(indexInList,1);
          await this.promisedSetState({
            doNotShow: currentDoNotShow
          })
        }
      }
    })
  }

  renderGallery = () => {

    return (
      <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}, (isIPhoneX || isIPhoneXLarge) && {marginTop: 15}]}>

        <View style={{position: 'absolute', top: 0, backgroundColor: 'white', width: '100%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row'}}>
          <Text style={{fontSize: 20, textAlign: 'center', position: 'absolute', right: 0, left: 0}}>Upload</Text>

          <TouchableOpacity hitSlop={hitSlopParams} style={{paddingHorizontal: 20, marginRight: 0}} onPress={ this.props.onPress }>
            <Icon name="ios-close" style={{color:"black", fontWeight: "bold", fontSize: 45}} />
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 50, backgroundColor: 'white'}}>
          <FlatList
             data={this.state.media}
             renderItem={this._renderGalleryItem}
             viewabilityConfigCallbackPairs={this.viewabilityConfigCallbackPairs}
             keyExtractor={(item,index)=> item.id.toString()}
             numColumns={3}
             ref={ref => this._flatListGallery = ref}
             onEndReachedThreshold={0.4}
             onEndReached={(info) => this._loadMoreItems()}
          />
        </View>

        {this.state.selectedMedia && (
          <View style={{position: 'absolute', bottom: 40}}>
            <TouchableOpacity style={{backgroundColor: 'rgb(89,200,250)', borderRadius: 23.5, width: 110, height: 50, alignItems: 'center', justifyContent: 'center'}} onPress={()=>{
              this.props.moveMediaToHome(this.state.selectedMedia);
            }}>
              <Text style={[{color: 'white', fontSize: 18}, styles.textWithShadow]}>Choose</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    )
  }

  render() {
    const galleryContent = this.state.galleryPermission ? this.renderGallery() : this.renderNoPermissions();

    return (
      <View style={styles.container}>
        {galleryContent}
      </View>
    );
  }
}

export default GalleryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'indianred',
  },
  pictures: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  picture: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    resizeMode: 'contain',
  },
  pictureWrapper: {
    width: pictureSize+25,
    height: pictureSize+100,
    margin: 5,
  },
  button: {
    padding: 20,
  },
  textWithShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 2
  }
});
