# TIMSUPROJECT (Timbangan Super Project)

Read data from usb serialport *(timbangan)* on android (base sample automatic connection from updated [melihyarikkaya/react-native-serialport: React Native - Usb Serial Port Communication For Android Platform](https://github.com/melihyarikkaya/react-native-serialport)).

## Getting Started

### Installing

```
yarn
yarn link:serialport
```

### Executing program

```
yarn android --deviceId=<ANDROIDDEVICEID>
```

## Step to Reproduce

```console
foo@bar:~$ npx react-native init timsuproject --version 0.68
foo@bar:~$ cd timsuproject
foo@bar:~/timsuproject$ yarn add prajadimas/react-native-serialport
foo@bar:~/timsuproject$ npx react-native link react-native-serialport
foo@bar:~/timsuproject$ npx react-native run-android
```

## License

Who cares...

## Acknowledgments

* [melihyarikkaya/react-native-serialport: React Native - Usb Serial Port Communication For Android Platform](https://github.com/melihyarikkaya/react-native-serialport)
* [Setting up the development environment · React Native](https://reactnative.dev/docs/0.68/environment-setup)