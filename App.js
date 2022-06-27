import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  DeviceEventEmitter
} from "react-native";
import { RNSerialport, definitions, actions } from "react-native-serialport";
import helpers from "./utils/helpers";

// type Props = {};
class ManualConnection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      servisStarted: false,
      connected: false,
      usbAttached: false,
      tempVal: "",
      value: "",
      output: "",
      outputArray: [],
      baudRate: "9600",
      interface: "-1",
      sendText: "HELLO",
      returnedDataType: definitions.RETURNED_DATA_TYPES.HEXSTRING
    };

    this.startUsbListener = this.startUsbListener.bind(this);
    this.stopUsbListener = this.stopUsbListener.bind(this);
  }

  componentDidMount() {
    this.startUsbListener();
  }

  componentWillUnmount() {
    this.stopUsbListener();
  }

  startUsbListener() {
    DeviceEventEmitter.addListener(
      actions.ON_SERVICE_STARTED,
      this.onServiceStarted,
      this
    );
    DeviceEventEmitter.addListener(
      actions.ON_SERVICE_STOPPED,
      this.onServiceStopped,
      this
    );
    DeviceEventEmitter.addListener(
      actions.ON_DEVICE_ATTACHED,
      this.onDeviceAttached,
      this
    );
    DeviceEventEmitter.addListener(
      actions.ON_DEVICE_DETACHED,
      this.onDeviceDetached,
      this
    );
    DeviceEventEmitter.addListener(actions.ON_ERROR, this.onError, this);
    DeviceEventEmitter.addListener(
      actions.ON_CONNECTED,
      this.onConnected,
      this
    );
    DeviceEventEmitter.addListener(
      actions.ON_DISCONNECTED,
      this.onDisconnected,
      this
    );
    DeviceEventEmitter.addListener(actions.ON_READ_DATA, this.onReadData, this);
    RNSerialport.setReturnedDataType(this.state.returnedDataType);
    RNSerialport.setAutoConnectBaudRate(parseInt(this.state.baudRate, 10));
    RNSerialport.setInterface(parseInt(this.state.interface, 10));
    RNSerialport.setAutoConnect(true);
    RNSerialport.startUsbService();
  };

  stopUsbListener = async () => {
    DeviceEventEmitter.removeAllListeners();
    const isOpen = await RNSerialport.isOpen();
    if (isOpen) {
      Alert.alert("isOpen", isOpen);
      RNSerialport.disconnect();
    }
    RNSerialport.stopUsbService();
  };

  onServiceStarted(response) {
    this.setState({ servisStarted: true });
    if (response.deviceAttached) {
      this.onDeviceAttached();
    }
  }
  onServiceStopped() {
    this.setState({ servisStarted: false });
  }
  onDeviceAttached() {
    this.setState({ usbAttached: true });
  }
  onDeviceDetached() {
    this.setState({ usbAttached: false });
  }
  onConnected() {
    this.setState({ connected: true });
  }
  onDisconnected() {
    this.setState({ connected: false });
  }
  onReadData(data) {
    const inc_start_bit = data.payload.includes("02");
    const inc_stop_bit = data.payload.includes("03");
    if (inc_start_bit) {
      if (inc_stop_bit) {
        if (data.payload.indexOf("03") === (data.payload.length - 2)) {
          this.setState({ value: data.payload });
        }
      } else {
        this.setState({ value: data.payload });
      }
    } else {
      if (inc_stop_bit) {
        if (data.payload.indexOf("03") === (data.payload.length - 2)) {
          this.setState({ value: this.state.value + data.payload });
        }
      } else {
        this.setState({ value: this.state.value + data.payload });
      }
    }

    // if (
    //   this.state.returnedDataType === definitions.RETURNED_DATA_TYPES.INTARRAY
    // ) {
    //   const payload = RNSerialport.intArrayToUtf16(data.payload);
    //   this.setState({ output: this.state.output + payload });
    // } else if (
    //   this.state.returnedDataType === definitions.RETURNED_DATA_TYPES.HEXSTRING
    // ) {
    //   const payload = RNSerialport.hexToUtf16(data.payload);
    //   this.setState({ output: this.state.output + payload });
    // }

    if (this.state.value.length === 26) {
      const suValue = helpers.valueAsText(this.state.value);
      this.setState({ output: this.state.output + suValue + ";" });
    }
      // const datasu = this.state.value.substring(2, 24).match(/.{1,2}/g);
      // if (datasu.join("") !== this.state.tempVal) {
      //   let polarity = "+";
      //   let unit = "kg";
      //   datasu[1] === "2B" ? polarity = "+" : polarity = "-";
      //   const commpos = Number(datasu[8].slice(-1));
      //   const suval = [datasu[2], datasu[3], datasu[4], datasu[5], datasu[6], datasu[7]].join("");
      //   let tempval = RNSerialport.hexToUtf16(suval);
      //   // const payload = polarity + "" + (tempval.substring(0, tempval.length - commpos) + "." + tempval.substring(tempval.length - commpos, tempval.length)) + "" + unit;
      //   const payload = (tempval.substring(0, tempval.length - commpos) + "." + tempval.substring(tempval.length - commpos, tempval.length));
      //   this.setState({ output: this.state.output + payload + ";" });
      //   this.setState({ tempVal: datasu.join("") });
      // }
    // }
    // this.setState({ output: this.state.value + ";" });
    // const datasu = data.payload.substring(data.payload.indexOf("02") + 1, data.payload.lastIndexOf("03")).match(/.{1,2}/g);
    // if (datasu) {
    //   if (datasu.length === 11) {
    //     if (datasu.join("") !== this.state.value) {
    //       let polarity = "+";
    //       let unit = "kg";
    //       if (datasu[0] === "0D") {
    //         datasu[1] === "2B" ? polarity = "+" : polarity = "-";
    //         const commpos = Number(datasu[8].slice(-1));
    //         const suval = [datasu[2], datasu[3], datasu[4], datasu[5], datasu[6], datasu[7]].join("");
    //         let tempval = RNSerialport.hexToUtf16(suval);
    //         const payload = polarity + "" + (tempval.substring(0, tempval.length - commpos) + "." + tempval.substring(tempval.length - 1, tempval.length)) + "" + unit;
    //         this.setState({ output: this.state.output + payload });
    //         this.setState({ value: datasu.join("") });
    //       }
    //     }
    //   }
    // }
  }

  onError(error) {
    console.error(error);
  }

  handleConvertButton() {
    // let data = "";
    // if (
    //   this.state.returnedDataType === definitions.RETURNED_DATA_TYPES.HEXSTRING
    // ) {
    //   data = RNSerialport.hexToUtf16(this.state.output);
    // } else if (
    //   this.state.returnedDataType === definitions.RETURNED_DATA_TYPES.INTARRAY
    // ) {
    //   data = RNSerialport.intArrayToUtf16(this.state.outputArray);
    // } else {
    //   return;
    // }
    // this.setState({ output: data });
  }

  handleClearButton() {
    this.setState({ output: "" });
    this.setState({ outputArray: [] });
  }

  buttonStyle = status => {
    return status
      ? styles.button
      : Object.assign({}, styles.button, { backgroundColor: "#C0C0C0" });
  };

  render() {
    return (
      <ScrollView style={styles.body}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.line}>
              <Text style={styles.title}>Service:</Text>
              <Text style={styles.value}>
                {this.state.servisStarted ? "Started" : "Not Started"}
              </Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.title}>Usb:</Text>
              <Text style={styles.value}>
                {this.state.usbAttached ? "Attached" : "Not Attached"}
              </Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.title}>Connection:</Text>
              <Text style={styles.value}>
                {this.state.connected ? "Connected" : "Not Connected"}
              </Text>
            </View>
          </View>
          <ScrollView style={styles.output} nestedScrollEnabled={true}>
            <Text style={styles.full}>
              {this.state.output === "" ? "No Content" : this.state.output}
            </Text>
          </ScrollView>

          <View style={styles.inputContainer}>
            <Text>Send</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setState({ sendText: text })}
              value={this.state.sendText}
              placeholder={"Send Text"}
            />
          </View>
          <View style={styles.line2}>
            <TouchableOpacity
              style={this.buttonStyle(this.state.connected)}
              onPress={() => this.handleSendButton()}
              disabled={!this.state.connected}
            >
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.handleClearButton()}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.handleConvertButton()}
            >
              <Text style={styles.buttonText}>Convert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  full: {
    flex: 1
  },
  body: {
    flex: 1
  },
  container: {
    flex: 1,
    marginTop: 20,
    marginLeft: 16,
    marginRight: 16
  },
  header: {
    display: "flex",
    justifyContent: "center"
    //alignItems: "center"
  },
  line: {
    display: "flex",
    flexDirection: "row"
  },
  line2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    width: 100
  },
  value: {
    marginLeft: 20
  },
  output: {
    marginTop: 10,
    height: 300,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1
  },
  inputContainer: {
    marginTop: 10,
    borderBottomWidth: 2
  },
  textInput: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 40
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
    paddingLeft: 15,
    paddingRight: 15,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#147efb",
    borderRadius: 3
  },
  buttonText: {
    color: "#FFFFFF"
  }
});

export default ManualConnection;
