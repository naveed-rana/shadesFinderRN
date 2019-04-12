import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  ImageBackground,
  Image
} from "react-native";
import { RNCamera } from "react-native-camera";
import undo from "./res/undo.png";
import axios from "axios";
import SwipeableViews from "react-swipeable-views-native";
import { Icon } from "native-base";
import ImagePicker from "react-native-image-picker";

export default class BadInstagramCloneApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraFlag: false,
      bgSource: "",
      shareimage: "",
      index: 0,
      loader: false,
      shareStatus: false,
      cardData: [
        [
          "https://www.fentybeauty.com/pro-filtr/soft-matte-longwear-foundation/FB30006.html?dwvar_FB30006_color=FB0240",
          "FENTY BEAUTY     Pro Filt'r Mattee Longwear Foundation",
          "240 Warm"
        ],
        [
          "https://www.sephora.com/product/diorskin-forever-undercover-foundation-P427506?icid2=products%20grid:p427506:product&skuId=2037125",
          "DIOR Diorskin Forever Undercover Foundation",
          "025 Soft Beige - light with neutral undertone"
        ],
        [
          "https://www.sephora.com/product/lock-it-tattoo-foundation-P311138?icid2=products%20grid:p311138:product&skuId=1398874",
          "KAT VON D      Lock-It Foundation",
          "52 Medium - Warm Undertone"
        ],
        [
          "https://www.sephora.com/product/lock-it-foundation-mini-P438613?skuId=2144012",
          "KAT VON D    Lock-It Foundation Mini",
          "52 Medium - Warm Undertone"
        ],
        [
          "https://www.sephora.com/product/shameless-youthful-look-24h-foundation-spf-25-P427500?icid2=products%20grid:p427500:product&skuId=2035806",
          "MARC JACOBS      Shameless Youthful Look Foundation",
          "Medium Y340"
        ],
        [
          "https://www.sephora.com/product/re-marc-able-full-coverage-foundation-concentrate-P398803?icid2=products%20grid:p398803:product&skuId=1711084",
          "MARC JACOBS      Re(marc)able Full Cover Foundation",
          "32 Beige Light"
        ],
        [
          "https://www.sephora.com/product/ultra-hd-invisible-cover-foundation-P398321?icid2=products%20grid:p398321:product&skuId=1708882",
          "MAKE UP FOREVER     ULTRA HD FOUNDATION  INVISIBLE COVER FOUNDATION",
          "Y315 Sand"
        ],
        [
          "https://www.sephora.com/product/water-blend-face-body-foundation-P410512?icid2=products%20grid:p410512:product&skuId=1856343",
          "MAKE UP FOREVER                      Water Blend Face & Body Foundation",
          "R300 Vanella"
        ],
        [
          "https://www.sephora.com/product/matte-velvet-skin-full-coverage-foundation-P434023?icid2=products%20grid:p434023:product&skuId=2106359",
          "MAKE UP FOREVER                Matte Velvet Skin Foundation",
          "R330 Warm Ivory"
        ],
        [
          "https://www.sephora.com/product/hello-happy-soft-blur-foundation-P432858?icid2=products%20grid:p432858:product&skuId=2086502",
          "BENEFIT COSMETICS   Hello Happy Soft Blur Foundation",
          "Medium Warm"
        ]
      ]
    };
  }

  chooseGalleryImage = () => {
    const options = {
      title: "image selection"
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({ cameraFlag: false, bgSource: response.uri });
        this.getFoundations();
      }
    });
  };

  getFoundations = () => {
    this.setState({ loader: true });
    //get foundation axios req
    const data = new FormData();
    data.append("image", {
      uri: this.state.bgSource,
      type: "image/jpg",
      name: `mobile.jpg`
    });

    axios
      .post(`https://www.foundationshadefinder.com/predict`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        console.log("The Response", res.data);
        this.setState({ loader: false, index: 0, cardData: res.data });
      })
      .catch(err => {
        console.log("ERROR", err);
        // this.setState({loader:false,index:0})
        this.setState({ loader: false, index: 0, cardData: "false" });
      });
  };

  handleChangeIndex = index => {
    this.setState({
      index
    });
  };

  showMoreHandler = nextIndex => {
    this.setState({ index: nextIndex });
    this.intervalManager(true);
  };

  urlHandler = url => {
    Linking.openURL(url);
  };

  startCamera = () => {
    this.setState({ cameraFlag: true });
  };

  intervalManager = flag => {
    if (flag)
      intervalID = setInterval(() => {
        this.setState(prevstate => {
          if (prevstate.index === 9) {
            return {
              index: 0
            };
          } else {
            return {
              index: prevstate.index + 1
            };
          }
        });
      }, 3000);
    else clearInterval(intervalID);
  };

  shareToInstagram = () => {
    this.props.navigation.navigate("ShareScreen", {
      src: this.state.bgSource
    });
  };

  render() {
    const {
      cameraFlag,
      bgSource,
      index,
      cardData,
      loader,
      shareStatus
    } = this.state;
    return cameraFlag ? (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          captureAudio={false}
          orientation="portrait"
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.auto}
          permissionDialogTitle={"Permission to use camera"}
          permissionDialogMessage={
            "We need your permission to use your camera phone"
          }
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View>
          <View style={styles.swapContainer}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Foundation Shade Finder
            </Text>

            <Text
              style={{
                marginLeft: 10,
                backgroundColor: "red",
                color: "#fff",
                fontWeight: "bold",
                paddingHorizontal: 12,
                borderRadius: 2
              }}
            >
              A.I
            </Text>
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 0,
              textAlign: "center",
              alignSelf: "center"
            }}
          >
            <View style={styles.capture}>
              <TouchableOpacity onPress={this.takePicture.bind(this)}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "white",
                    borderColor: "#fff",
                    borderWidth: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    fontWeight: "bold"
                  }}
                >
                  {" "}
                  START SHADE FINDER{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.chooseGalleryImage}>
                <Icon
                  style={{ color: "white", marginLeft: 5, fontSize: 40 }}
                  type="Entypo"
                  name="camera"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    ) : (
      <ImageBackground
        source={{ uri: bgSource }}
        style={styles.backgroundImage}
      >
        <View style={styles.swapContainer}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Foundation Shade Finder
          </Text>

          <Text
            style={{
              marginLeft: 10,
              backgroundColor: "red",
              color: "#fff",
              fontWeight: "bold",
              paddingHorizontal: 12,
              borderRadius: 2
            }}
          >
            A.I
          </Text>
        </View>
        {loader ? (
          <View style={styles.containerLoader}>
            <Image
              source={require("./res/loader.gif")}
              style={{ width: 150, height: 150 }}
            />
          </View>
        ) : cardData === "false" ||
          cardData === "not-success" ||
          cardData === "[info] No Face Found. Try Capturing again" ? (
          <View style={styles.containerItems}>
            <Text style={styles.text}>
              Something Went Wrong! Try Capturing again.
            </Text>

            <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
              <Image source={undo} style={styles.undoImage} />
            </TouchableOpacity>
          </View>
        ) : (
          <SwipeableViews
            springConfig={{ tension: 0.01, friction: 50 }}
            enableMouseEvents
            index={index}
            onChangeIndex={this.handleChangeIndex}
          >
            {/* start of swap 0 */}
            <View style={styles.containerItems}>
              <View style={{ flexDirection: "row" }}>
                <Icon
                  style={styles.backArrow}
                  name="ios-arrow-back"
                  type="Ionicons"
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.intervalManager(false)}
                >
                  <Image
                    source={{
                      uri: `https://www.foundationshadefinder.com/static/Shades/1-fentybeauty/${cardData[0][0].slice(
                        -3
                      )}.jpg`
                    }}
                    style={styles.itemImage}
                  />
                </TouchableOpacity>
                <Icon
                  style={styles.forwardArrow}
                  name="ios-arrow-forward"
                  type="Ionicons"
                />
              </View>
              <Text style={styles.text}>Found Your Shade!</Text>
              <Text style={styles.text}>
                FENTY BEAUTY Pro Filt'r Mattee Longwear Foundation
              </Text>

              <Text style={styles.discription}>{cardData[0][2]}</Text>

              {/* <Text
                style={styles.linkStyle}
                onPress={() => this.urlHandler(cardData[0][0])}
              >
                ENTER FENTY BEAUTY
              </Text>

              <Text
                style={styles.moreShade}
                onPress={() => this.showMoreHandler(0)}
              >
                FIND MORE SHADES
              </Text>

              <Text style={styles.linkStyle} onPress={this.shareToInstagram}>
                SHARE ON INSTAGRAM
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
                <Image source={undo} style={styles.undoImage} />
              </TouchableOpacity> */}
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <View>
                  <TouchableOpacity
                    onPress={() => this.urlHandler(cardData[0][0])}
                  >
                    <Image
                      source={require("./res/enter.png")}
                      style={{ width: 40, height: 40 }}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{ color: "white", marginLeft: 4 }}
                    onPress={() => this.urlHandler(cardData[0][0])}
                  >
                    Enter
                  </Text>
                </View>

                <View style={{ marginHorizontal: 20 }}>
                  <TouchableOpacity onPress={this.startCamera}>
                    <Image
                      source={require("./res/cam.png")}
                      style={{ width: 40, height: 40, alignSelf: "center" }}
                    />
                  </TouchableOpacity>

                  <Text style={{ color: "white" }} onPress={this.startCamera}>
                    New photo
                  </Text>
                </View>

                <View>
                  <TouchableOpacity onPress={this.shareToInstagram}>
                    <Image
                      source={require("./res/share.png")}
                      style={{ width: 40, height: 40 }}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{ color: "white" }}
                    onPress={this.shareToInstagram}
                  >
                    Share
                  </Text>
                </View>
              </View>
            </View>
            {/* end of swap 0 */}

            {/* start of swap 1 */}
            <View style={styles.containerItems}>
              <View style={{ flexDirection: "row" }}>
                <Icon
                  style={styles.backArrow}
                  name="ios-arrow-back"
                  type="Ionicons"
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.intervalManager(false)}
                >
                  <Image
                    source={{
                      uri: `https://www.foundationshadefinder.com/static/Shades/10-DIOR/${cardData[1][0].slice(
                        -3
                      )}.jpg`
                    }}
                    style={styles.itemImage}
                  />
                </TouchableOpacity>
                <Icon
                  style={styles.forwardArrow}
                  name="ios-arrow-forward"
                  type="Ionicons"
                />
              </View>
              <Text style={styles.text}>Found Your Shade!</Text>
              <Text style={styles.text}>
                DIOR Diorskin Forever Undercover Foundation
              </Text>

              <Text style={styles.discription}>{cardData[1][2]}</Text>

              {/* <Text
                style={styles.linkStyle}
                onPress={() => this.urlHandler(cardData[1][0])}
              >
                ENTER DIOR
              </Text>

              <Text
                style={styles.moreShade}
                onPress={() => this.showMoreHandler(1)}
              >
                FIND MORE SHADES
              </Text>

              <Text style={styles.linkStyle} onPress={this.shareToInstagram}>
                SHARE ON INSTAGRAM
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
                <Image source={undo} style={styles.undoImage} />
              </TouchableOpacity> */}

              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <View>
                  <TouchableOpacity
                    onPress={() => this.urlHandler(cardData[1][0])}
                  >
                    <Image
                      source={require("./res/enter.png")}
                      style={{ width: 40, height: 40 }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{ color: "white", marginLeft: 4 }}
                    onPress={() => this.urlHandler(cardData[1][0])}
                  >
                    Enter
                  </Text>
                </View>

                <View style={{ marginHorizontal: 20 }}>
                  <TouchableOpacity onPress={this.startCamera}>
                    <Image
                      source={require("./res/cam.png")}
                      style={{ width: 40, height: 40, alignSelf: "center" }}
                    />
                  </TouchableOpacity>

                  <Text style={{ color: "white" }} onPress={this.startCamera}>
                    New photo
                  </Text>
                </View>

                <View>
                  <TouchableOpacity onPress={this.shareToInstagram}>
                    <Image
                      source={require("./res/share.png")}
                      style={{ width: 40, height: 40 }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{ color: "white" }}
                    onPress={this.shareToInstagram}
                  >
                    Share
                  </Text>
                </View>
              </View>
            </View>
            {/* end of swap 1 */}

            {/* start of swap 2 */}
            <View style={styles.containerItems}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.intervalManager(false)}
              >
                <Image
                  source={{
                    uri: `https://www.foundationshadefinder.com/static/Shades/2-KAT VON D/${cardData[2][0].slice(
                      -3
                    )}.jpg`
                  }}
                  style={styles.itemImage}
                />
              </TouchableOpacity>
              <Text style={styles.text}>Found Your Shade!</Text>
              <Text style={styles.text}>KAT VON D Lock-It Foundation</Text>

              <Text style={styles.text}>{cardData[2][2]}</Text>

              <Text
                style={styles.linkStyle}
                onPress={() => this.urlHandler(cardData[2][0])}
              >
                ENTER KAT VON D
              </Text>

              <Text
                style={styles.moreShade}
                onPress={() => this.showMoreHandler(2)}
              >
                FIND MORE SHADES
              </Text>

              <Text style={styles.linkStyle} onPress={this.shareToInstagram}>
                SHARE ON INSTAGRAM
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
                <Image source={undo} style={styles.undoImage} />
              </TouchableOpacity>
            </View>
            {/* end of swap 2 */}

            {/* start of swap 3 */}
            <View style={styles.containerItems}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.intervalManager(false)}
              >
                <Image
                  source={{
                    uri: `https://www.foundationshadefinder.com/static/Shades/3-Mini KAT VON D/${cardData[3][0].slice(
                      -3
                    )}.jpg`
                  }}
                  style={styles.itemImage}
                />
              </TouchableOpacity>
              <Text style={styles.text}>Found Your Shade!</Text>
              <Text style={styles.text}>KAT VON D Lock-It Foundation Mini</Text>

              <Text style={styles.text}>{cardData[3][2]}</Text>

              <Text
                style={styles.linkStyle}
                onPress={() => this.urlHandler(cardData[3][0])}
              >
                ENTER KAT VON D
              </Text>

              <Text
                style={styles.moreShade}
                onPress={() => this.showMoreHandler(3)}
              >
                FIND MORE SHADES
              </Text>

              <Text style={styles.linkStyle} onPress={this.shareToInstagram}>
                SHARE ON INSTAGRAM
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
                <Image source={undo} style={styles.undoImage} />
              </TouchableOpacity>
            </View>
            {/* end of swap 3 */}

            {/* start of swap 4 */}
            <View style={styles.containerItems}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.intervalManager(false)}
              >
                <Image
                  source={{
                    uri: `https://www.foundationshadefinder.com/static/Shades/4-Marc Jacobs Shameless/${cardData[4][0].slice(
                      -3
                    )}.jpg`
                  }}
                  style={styles.itemImage}
                />
              </TouchableOpacity>
              <Text style={styles.text}>Found Your Shade!</Text>
              <Text style={styles.text}>
                MARC JACOBS Shameless Youthful Look Foundation
              </Text>

              <Text style={styles.text}>{cardData[4][2]}</Text>

              <Text
                style={styles.linkStyle}
                onPress={() => this.urlHandler(cardData[4][0])}
              >
                ENTER MARC JACOBS
              </Text>

              <Text
                style={styles.moreShade}
                onPress={() => this.showMoreHandler(4)}
              >
                FIND MORE SHADES
              </Text>

              <Text style={styles.linkStyle} onPress={this.shareToInstagram}>
                SHARE ON INSTAGRAM
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
                <Image source={undo} style={styles.undoImage} />
              </TouchableOpacity>
            </View>
            {/* end of swap 4 */}

            {/* start of swap 5 */}
            <View style={styles.containerItems}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.intervalManager(false)}
              >
                <Image
                  source={{
                    uri: `https://www.foundationshadefinder.com/static/Shades/5-Marc Jacobs Re(marc)able Full Cover Foundation/${cardData[5][0].slice(
                      -3
                    )}.jpg`
                  }}
                  style={styles.itemImage}
                />
              </TouchableOpacity>
              <Text style={styles.text}>Found Your Shade!</Text>
              <Text style={styles.text}>
                MARC JACOBS Re(marc)able Full Cover Foundation
              </Text>

              <Text style={styles.text}>{cardData[5][2]}</Text>

              <Text
                style={styles.linkStyle}
                onPress={() => this.urlHandler(cardData[5][0])}
              >
                ENTER MARC JACOBS
              </Text>

              <Text
                style={styles.moreShade}
                onPress={() => this.showMoreHandler(5)}
              >
                FIND MORE SHADES
              </Text>

              <Text style={styles.linkStyle} onPress={this.shareToInstagram}>
                SHARE ON INSTAGRAM
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
                <Image source={undo} style={styles.undoImage} />
              </TouchableOpacity>
            </View>
            {/* end of swap 5 */}

            {/* start of swap 6 */}
            <View style={styles.containerItems}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.intervalManager(false)}
              >
                <Image
                  source={{
                    uri: `https://www.foundationshadefinder.com/static/Shades/6-MAKE UP FOREVER ULTRA HD FOUNDATION/${cardData[6][0].slice(
                      -3
                    )}.jpg`
                  }}
                  style={styles.itemImage}
                />
              </TouchableOpacity>
              <Text style={styles.text}>Found Your Shade!</Text>
              <Text style={styles.text}>
                MAKE UP FOREVER ULTRA HD FOUNDATION INVISIBLE COVER FOUNDATION
              </Text>

              <Text style={styles.text}>{cardData[6][2]}</Text>

              <Text
                style={styles.linkStyle}
                onPress={() => this.urlHandler(cardData[6][0])}
              >
                ENTER MAKE UP FOREVER
              </Text>

              <Text
                style={styles.moreShade}
                onPress={() => this.showMoreHandler(6)}
              >
                FIND MORE SHADES
              </Text>

              <Text style={styles.linkStyle} onPress={this.shareToInstagram}>
                SHARE ON INSTAGRAM
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
                <Image source={undo} style={styles.undoImage} />
              </TouchableOpacity>
            </View>
            {/* end of swap 6 */}

            {/* start of swap 7 */}
            <View style={styles.containerItems}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.intervalManager(false)}
              >
                <Image
                  source={{
                    uri: `https://www.foundationshadefinder.com/static/Shades/7-MAKE UP FOREVER Water Blend Face & Body FOUNDATION/${cardData[7][0].slice(
                      -3
                    )}.jpg`
                  }}
                  style={styles.itemImage}
                />
              </TouchableOpacity>
              <Text style={styles.text}>Found Your Shade!</Text>
              <Text style={styles.text}>
                MAKE UP FOREVER Water Blend Face & Body Foundation
              </Text>

              <Text style={styles.text}>{cardData[7][2]}</Text>

              <Text
                style={styles.linkStyle}
                onPress={() => this.urlHandler(cardData[7][0])}
              >
                ENTER MAKE UP FOREVER
              </Text>

              <Text
                style={styles.moreShade}
                onPress={() => this.showMoreHandler(7)}
              >
                FIND MORE SHADES
              </Text>

              <Text style={styles.linkStyle} onPress={this.shareToInstagram}>
                SHARE ON INSTAGRAM
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
                <Image source={undo} style={styles.undoImage} />
              </TouchableOpacity>
            </View>
            {/* end of swap 7 */}

            {/* start of swap 8 */}
            <View style={styles.containerItems}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.intervalManager(false)}
              >
                <Image
                  source={{
                    uri: `https://www.foundationshadefinder.com/static/Shades/8-MAKE UP FOREVER Matte Velvet Skin Foundation/${cardData[8][0].slice(
                      -3
                    )}.jpg`
                  }}
                  style={styles.itemImage}
                />
              </TouchableOpacity>
              <Text style={styles.text}>Found Your Shade!</Text>
              <Text style={styles.text}>
                MAKE UP FOREVER Matte Velvet Skin Foundation
              </Text>

              <Text style={styles.text}>{cardData[8][2]}</Text>

              <Text
                style={styles.linkStyle}
                onPress={() => this.urlHandler(cardData[8][0])}
              >
                ENTER MAKE UP FOREVER
              </Text>

              <Text
                style={styles.moreShade}
                onPress={() => this.showMoreHandler(8)}
              >
                FIND MORE SHADES
              </Text>

              <Text style={styles.linkStyle} onPress={this.shareToInstagram}>
                SHARE ON INSTAGRAM
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
                <Image source={undo} style={styles.undoImage} />
              </TouchableOpacity>
            </View>
            {/* end of swap 8 */}

            {/* start of swap 9 */}
            <View style={styles.containerItems}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.intervalManager(false)}
              >
                <Image
                  source={{
                    uri: `https://www.foundationshadefinder.com/static/Shades/9-BENEFIT COSMETICS SOFT BLUR FOUNDATION/${cardData[9][0].slice(
                      -3
                    )}.jpg`
                  }}
                  style={styles.itemImage}
                />
              </TouchableOpacity>
              <Text style={styles.text}>Found Your Shade!</Text>
              <Text style={styles.text}>
                BENEFIT COSMETICS Hello Happy Soft Blur Foundation
              </Text>

              <Text style={styles.text}>{cardData[9][2]}</Text>

              <Text
                style={styles.linkStyle}
                onPress={() => this.urlHandler(cardData[9][0])}
              >
                ENTER BENEFIT COSMETICS
              </Text>

              <Text
                style={styles.moreShade}
                onPress={() => this.showMoreHandler(9)}
              >
                FIND MORE SHADES
              </Text>

              <Text style={styles.linkStyle} onPress={this.shareToInstagram}>
                SHARE ON INSTAGRAM
              </Text>
              <TouchableOpacity activeOpacity={0.5} onPress={this.startCamera}>
                <Image source={undo} style={styles.undoImage} />
              </TouchableOpacity>
            </View>
            {/* end of swap 9 */}
          </SwipeableViews>
        )}
        {/* </View> */}
      </ImageBackground>
    );
  }

  takePicture = async function() {
    if (this.camera) {
      const options = {
        pauseAfterCapture: true,
        mirrorImage: true,
        fixOrientation: true,
        quality: 0.9,
        base64: true
      };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      this.setState({ bgSource: data.uri, cameraFlag: false });
      this.getFoundations();
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },
  swapContainer: {
    position: "absolute",
    bottom: Dimensions.get("window").height - 60,
    zIndex: 1421,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center"
    // backgroundColor:"black"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  capture: {
    color: "white",
    borderColor: "#fff",
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20,
    flexDirection: "row"
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "black"
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "white"
  },
  undoImage: {
    marginVertical: 15,
    width: 40,
    height: 37
  },
  containerItems: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 35
  },

  containerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  text: {
    fontWeight: "bold",
    color: "white"
  },

  linkStyle: {
    marginVertical: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  moreShade: {
    marginVertical: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 30
  },
  discription: {
    fontWeight: "bold",
    color: "red"
  },
  backArrow: {
    color: "white",
    marginTop: 30,
    marginRight: 50
  },

  forwardArrow: {
    color: "white",
    marginTop: 30,
    marginLeft: 50
  }
});
