# cordova-nfc-manager

This plugin for Cordova/Phonegap is a WIP port of the excellent [react-native-nfc-manager](https://github.com/whitedogg13/react-native-nfc-manager) module for React Native.

The API of the plugin is almost the same.

For now, only iOS and Android are supported.

PRs are welcome. You can also [hire me](https://github.com/zabojad) to work on this plugin and develop it more.

## Setup

We assume you have a setup Cordova / Phonegap project already.

```sh
cordova plugin add https://github.com/zabojad/cordova-nfc-manager.git
```

## Use

This is a WIP project for now but here is a example of use of this plugin:

You should first call `NfcManager.start()` before calling any other method of the plugin:
```js
NfcManager.start();
```

Request tech:
```js
let tech = NfcManager.NfcTech.Iso15693IOS;
NfcManager
    .requestTechnology(tech,{ alertMessage: 'Ready to scan tag' })
    .then(
        function(resp){
            console.log('got tech: '+JSON.stringify(resp));
        }
    );
```

Get Tag:
```js
NfcManager
    .getTag()
    .then(function(tag){
        console.log('tag: '+JSON.stringify(tag));
    });
```

Use of the ISO 15693 API:
```js
NfcManager.Iso15693HandlerIOS
    .getSystemInfo(NfcManager.Nfc15693RequestFlagIOS.HighDataRate)
    .then(function(resp){
        console.log('SystemInfo: '+JSON.stringify(resp));
    });
```

ISO 15693 readSingleBlock:
```js
NfcManager.Iso15693HandlerIOS
    .readSingleBlock({
        flags: NfcManager.Nfc15693RequestFlagIOS.HighDataRate,
        blockNumber: 0,
    })
    .then(function(resp){
        console.log('readSingleBlock: '+JSON.stringify(resp));
    });
```

ISO 15693 extendedWriteSingleBlock:
```js
NfcManager.Iso15693HandlerIOS
    .extendedWriteSingleBlock({
        flags: NfcManager.Nfc15693RequestFlagIOS.HighDataRate,
        blockNumber: 2,
        dataBlock: [12,34,56,78]
    })
    .then(function(){
        console.log('extendedWriteSingleBlock done');
    });
```

More documentation to be written...
