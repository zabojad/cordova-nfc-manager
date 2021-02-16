/**
 * (c) Thomas Fétiveau, 2021
 */
// import {
//   Platform
// } from 'react-native'
// import ByteParser from './ByteParser'
// import NdefParser from './NdefParser'
// import Ndef from './ndef-lib'
// import {NativeNfcManager, NfcManagerEmitter, callNative} from './NativeNfcManager'

var DEFAULT_REGISTER_TAG_EVENT_OPTIONS = {
    alertMessage: 'Please tap NFC tags',
    invalidateAfterFirstRead: false,
    isReaderModeEnabled: false,
    readerModeFlags: 0,
    readerModeDelay: 10,
};

var NfcEvents = {
    DiscoverTag: 'NfcManagerDiscoverTag',
    SessionClosed: 'NfcManagerSessionClosed',
    StateChanged: 'NfcManagerStateChanged',
}

var NfcTech = {
    Ndef: 'Ndef',
    NfcA: 'NfcA',
    NfcB: 'NfcB',
    NfcF: 'NfcF',
    NfcV: 'NfcV',
    IsoDep: 'IsoDep',
    MifareClassic: 'MifareClassic',
    MifareUltralight: 'MifareUltralight',
    MifareIOS: 'mifare',
    Iso15693IOS: 'iso15693',
    FelicaIOS: 'felica',
}

var NfcAdapter = {
    FLAG_READER_NFC_A: 0x1,
    FLAG_READER_NFC_B: 0x2,
    FLAG_READER_NFC_F: 0x4,
    FLAG_READER_NFC_V: 0x8,
    FLAG_READER_NFC_BARCODE: 0x10,
    FLAG_READER_SKIP_NDEF_CHECK: 0x80,
    FLAG_READER_NO_PLATFORM_SOUNDS: 0x100,
};

var Nfc15693RequestFlagIOS = {
    DualSubCarriers: (1 << 0),
    HighDataRate: (1 << 1),
    ProtocolExtension: (1 << 3),
    Select: (1 << 4),
    Address: (1 << 5),
    Option: (1 << 6),
};

var Iso15693HandlerIOS = {
    getSystemInfo: function (requestFlag) {
        return new Promise(function(resolve, reject) {
            // return callNative('iso15693_getSystemInfo', [requestFlag]);
            cordova.exec(resolve, reject, 'NfcManager', 'iso15693_getSystemInfo', [requestFlag]);
        });
    },

    readSingleBlock: function(params) {
        return new Promise(function(resolve, reject) {
            // return callNative('iso15693_readSingleBlock', [{flags, blockNumber}]);
            cordova.exec(resolve, reject, 'NfcManager', 'iso15693_readSingleBlock', [params]);
        });
    },

    readMultipleBlocks: function(params) {
        return new Promise(function(resolve, reject) {
            // return callNative('iso15693_readMultipleBlocks', [{flags, blockNumber, blockCount}]);
            cordova.exec(resolve, reject, 'NfcManager', 'iso15693_readMultipleBlocks', [params]);
        });
    },

    writeSingleBlock: function(params) {
        return new Promise(function(resolve, reject) {
            // return callNative('iso15693_writeSingleBlock', [{flags, blockNumber, dataBlock}]);
            cordova.exec(resolve, reject, 'NfcManager', 'iso15693_writeSingleBlock', [params]);
        });
    },

    lockBlock: function(params) {
        return new Promise(function(resolve, reject) {
            // return callNative('iso15693_lockBlock', [{flags, blockNumber}]);
            cordova.exec(resolve, reject, 'NfcManager', 'iso15693_lockBlock', [params]);
        });
    },

    writeAFI: function({flags, afi}) {
        // return callNative('iso15693_writeAFI', [{flags, afi}]);
    },

    lockAFI: function({flags}) {
        // return callNative('iso15693_lockAFI', [{flags}]);
    },

    writeDSFID: function({flags, dsfid}) {
        // return callNative('iso15693_writeDSFID', [{flags, dsfid}]);
    },

    lockDSFID: function({flags}) {
        // return callNative('iso15693_lockDSFID', [{flags}]);
    },

    resetToReady: function({flags}) {
        // return callNative('iso15693_resetToReady', [{flags}]);
    },

    select: function({flags}) {
        // return callNative('iso15693_select', [{flags}]);
    },

    stayQuite: function() {
        // return callNative('iso15693_stayQuiet');
    },

    customCommand: function(params) {
        return new Promise(function(resolve, reject) {
            // return callNative('iso15693_customCommand', [{flags, customCommandCode, customRequestParameters}]);
            cordova.exec(resolve, reject, 'NfcManager', 'iso15693_customCommand', [params]);
        });
    },

    extendedReadSingleBlock: function(params) {
        return new Promise(function(resolve, reject) {
            // return callNative('iso15693_extendedReadSingleBlock', [{flags, blockNumber}]);
            cordova.exec(resolve, reject, 'NfcManager', 'iso15693_extendedReadSingleBlock', [params]);
        });
    },

    extendedWriteSingleBlock: function(params) {
        return new Promise(function(resolve, reject) {
            // return callNative('iso15693_extendedWriteSingleBlock', [{flags, blockNumber, dataBlock}]);
            cordova.exec(resolve, reject, 'NfcManager', 'iso15693_extendedWriteSingleBlock', [params]);
        });
    },

    extendedLockBlock: function(params) {
        return new Promise(function(resolve, reject) {
            // return callNative('iso15693_extendedLockBlock', [{flags, blockNumber}]);
            cordova.exec(resolve, reject, 'NfcManager', 'iso15693_extendedLockBlock', [params]);
        });
    }
}

var NfcManager = {
    // constructor() {
    // this.cleanUpTagRegistration = false;
    // this._subscribeNativeEvents();

    // if (Platform.OS === 'ios') {
    //     this._iso15693HandlerIOS = new Iso15693HandlerIOS();
    // }

    // // legacy stuff
    // this._clientTagDiscoveryListener = null;
    // this._clientSessionClosedListener = null;
    // this._subscription = null;
    // }
    cleanUpTagRegistration: false,

    // -------------------------------------
    // public for both platforms
    // -------------------------------------
    setEventListener: function(name, callback){
        var allNfcEvents = Object.keys(NfcEvents).map(k => NfcEvents[k]);
        if (allNfcEvents.indexOf(name) === -1) {
            throw new Error('no such event');
        }

        NfcManager._clientListeners[name] = callback;
    },

    // FIXME
    // get MIFARE_BLOCK_SIZE() { return NativeNfcManager.MIFARE_BLOCK_SIZE };
    //     get MIFARE_ULTRALIGHT_PAGE_SIZE() { return NativeNfcManager.MIFARE_ULTRALIGHT_PAGE_SIZE };
    //     get MIFARE_ULTRALIGHT_TYPE() { return NativeNfcManager.MIFARE_ULTRALIGHT_TYPE };
    //     get MIFARE_ULTRALIGHT_TYPE_C() { return NativeNfcManager.MIFARE_ULTRALIGHT_TYPE_C };
    //     get MIFARE_ULTRALIGHT_TYPE_UNKNOWN() { return NativeNfcManager.MIFARE_ULTRALIGHT_TYPE_UNKNOWN };

    start: function(){
        return new Promise(function(resolve, reject) {
            // callNative('start');
            cordova.exec(resolve, reject, 'NfcManager', 'start', []);
        });
    },

    isSupported: function(tech=''){
        return new Promise(function(resolve, reject) {
            // callNative('isSupported', [tech]);
            cordova.exec(resolve, reject, 'NfcManager', 'isSupported', [tech]);
        });
    },

    // registerTagEvent = (options = {}) => {
    //     const optionsWithDefault = {
    //     ...DEFAULT_REGISTER_TAG_EVENT_OPTIONS,
    //     ...options,
    //     };

    //     return callNative('registerTagEvent', [optionsWithDefault]);
    // }

    // unregisterTagEvent = () => callNative('unregisterTagEvent');

    getTag: function(){
        return new Promise(function(resolve, reject) {
            // callNative('getTag');
            cordova.exec(resolve, reject, 'NfcManager', 'getTag', []);
        });
    },

    requestTechnology: function(tech, options={}){
        return new Promise(function(resolve, reject) {
        
            if (typeof tech === 'string') {
                tech = [tech];
            }
    
            function rt(){
                // return callNative('requestTechnology', [tech]);
                cordova.exec(resolve, reject, 'NfcManager', 'requestTechnology', [tech]);
    
                NfcManager.cleanUpTagRegistration = true;
            }
    
            function rte(sessionAvailable){
                // make sure we do register for tag event 
                if (!sessionAvailable) {
                    if (cordova.platformId === "ios") {
                        NfcManager._registerTagEventExIOS(options, rt, reject);
                    } else if (cordova.platformId === "android") {
                        // TODO
                        // NfcManager.registerTagEvent(options, rt, reject);
                    }
                }
            }
    
            // check if required session is available
            if (cordova.platformId === "ios") {
                NfcManager._isSessionExAvailableIOS(rte, reject);
            }
            else if (cordova.platformId === "android") {
                // NfcManager._hasTagEventRegistrationAndroid(rte, reject);
            }
        });
    },

    cancelTechnologyRequest: function() {
        return new Promise(function(resolve, reject) {
            if (!NfcManager.cleanUpTagRegistration) {
                // await callNative('cancelTechnologyRequest');
                cordova.exec(resolve, reject, 'NfcManager', 'cancelTechnologyRequest', []);
                return;
            }

            NfcManager.cleanUpTagRegistration = false;

            if (cordova.platformId === "ios") {

                function cb2(sessionAvailable) {
                    if (sessionAvailable) {
                        NfcManager.unregisterTagEvent(resolve, reject);
                        return;
                    }
                }
                
                function cb1(sessionAvailable) {
                    if (sessionAvailable) {
                        NfcManager._unregisterTagEventExIOS(resolve, reject);
                        return;
                    }
                    NfcManager._isSessionAvailableIOS(cb2,reject);
                }
                // because we don't know which tech currently requested
                // so we try both, and perform early return when hitting any
                NfcManager._isSessionExAvailableIOS(cb1,reject);
                
            } else if (cordova.platformId === "android") {
                // TODO
                // await callNative('cancelTechnologyRequest');
                // await NfcManager.unregisterTagEvent();
                // return;
            }
        });
    },

    // -------------------------------------
    // public only for Android
    // -------------------------------------
    // isEnabled = () => callNative('isEnabled');

    // goToNfcSetting = () => callNative('goToNfcSetting');

    // getLaunchTagEvent = () => callNative('getLaunchTagEvent');

    // setNdefPushMessage = (bytes) => callNative('setNdefPushMessage', [bytes]);

    // -------------------------------------
    // public only for iOS
    // -------------------------------------
    // setAlertMessageIOS = (alertMessage) => {
    //     if (Platform.OS !== 'ios') {
    //         return Promise.resolve(); //no-op
    //     }
    //     callNative('setAlertMessage', [alertMessage]);
    // }

    // invalidateSessionIOS = () => callNative('invalidateSession');

    // invalidateSessionWithErrorIOS = (errorMessage='Error') => callNative('invalidateSessionWithError', [errorMessage]);

    // -------------------------------------
    // NfcTech.Ndef API
    // -------------------------------------
    // writeNdefMessage = (bytes) => callNative('writeNdefMessage', [bytes]);

    // getNdefMessage = () => callNative('getNdefMessage');

    // -------------------------------------
    // (android) NfcTech.Ndef API
    // -------------------------------------
    // getCachedNdefMessageAndroid = () => callNative('getCachedNdefMessage');

    // makeReadOnlyAndroid = () => callNative('makeReadOnly');

    // -------------------------------------
    // (android) tNfcTech.MifareClassic API
    // -------------------------------------
    // mifareClassicAuthenticateA = (sector, key) => {
    //     if (!key || !Array.isArray(key) || key.length !== 6) {
    //     return Promise.reject('key should be an Array[6] of integers (0 - 255)');
    //     }

    //     return callNative('mifareClassicAuthenticateA', [sector, key]);
    // }

    // mifareClassicAuthenticateB = (sector, key) => {
    //     if (!key || !Array.isArray(key) || key.length !== 6) {
    //     return Promise.reject('key should be an Array[6] of integers (0 - 255)');
    //     }

    //     return callNative('mifareClassicAuthenticateB', [sector, key]);
    // }

    // mifareClassicGetBlockCountInSector = (sector) => callNative('mifareClassicGetBlockCountInSector', [sector]);

    // mifareClassicGetSectorCount = () => callNative('mifareClassicGetSectorCount');

    // mifareClassicSectorToBlock = (sector) => callNative('mifareClassicSectorToBlock', [sector]);

    // mifareClassicReadBlock = (block) => callNative('mifareClassicReadBlock', [block]);

    // mifareClassicReadSector = (sector) => callNative('mifareClassicReadSector', [sector]);

    // mifareClassicWriteBlock = (block, data) => {
    //     if (!data || !Array.isArray(data) || data.length !== NfcManager.MIFARE_BLOCK_SIZE) {
    //     return Promise.reject(`data should be a non-empty Array[${NfcManager.MIFARE_BLOCK_SIZE}] of integers (0 - 255)`);
    //     }

    //     return callNative('mifareClassicWriteBlock', [block, data]);
    // }

    // -------------------------------------
    // (android) NfcTech.MifareUltralight API
    // -------------------------------------
    // mifareUltralightReadPages = (pageOffset) => callNative('mifareUltralightReadPages', [pageOffset]);

    // mifareUltralightWritePage = (pageOffset, data) => {
    //     if (!data || !Array.isArray(data) || data.length !== NfcManager.MIFARE_ULTRALIGHT_PAGE_SIZE) {
    //     return Promise.reject(`data should be a non-empty Array[${NfcManager.MIFARE_ULTRALIGHT_PAGE_SIZE}] of integers (0 - 255)`);
    //     }

    //     return callNative('mifareUltralightWritePage', [pageOffset, data]);
    // }

    // -------------------------------------
    // (android) setTimeout works for NfcA, NfcF, IsoDep, MifareClassic, MifareUltralight
    // -------------------------------------
    // setTimeout = (timeout) => callNative('setTimeout', [timeout]);

    // connect = (techs) => callNative('connect', [techs]);

    // close = () => callNative('close');

    // -------------------------------------
    // (android) transceive works for NfcA, NfcB, NfcF, NfcV, IsoDep and MifareUltralight
    // -------------------------------------
    // transceive = (bytes) => callNative('transceive', [bytes]);

    // getMaxTransceiveLength = () => callNative('getMaxTransceiveLength');

    // -------------------------------------
    // (iOS) NfcTech.MifareIOS API
    // -------------------------------------
    // sendMifareCommandIOS = (bytes) => callNative('sendMifareCommand', [bytes]);

    // -------------------------------------
    // (iOS) NfcTech.FelicaIOS API
    // -------------------------------------
    // sendFelicaCommandIOS = (bytes) => callNative('sendFelicaCommand', [bytes]);

    // -------------------------------------
    // (iOS) NfcTech.Iso15693IOS API
    // -------------------------------------
    getIso15693HandlerIOS: function() {
        return Iso15693HandlerIOS;
    },

    // -------------------------------------
    // (iOS) NfcTech.IsoDep API
    // -------------------------------------
    // sendCommandAPDUIOS = (bytesOrApdu) => {
    //     if (Platform.OS !== 'ios') {
    //     return Promise.reject('not implemented');
    //     }

    //     if (Array.isArray(bytesOrApdu)) {
    //     const bytes = bytesOrApdu;
    //     return new Promise((resolve, reject) => {
    //         NativeNfcManager.sendCommandAPDUBytes(bytes, (err, response, sw1, sw2) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             resolve({response, sw1, sw2});
    //         }
    //         });
    //     })
    //     } else {
    //     const apdu = bytesOrApdu;
    //     return new Promise((resolve, reject) => {
    //         NativeNfcManager.sendCommandAPDU(apdu, (err, response, sw1, sw2) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             resolve({response, sw1, sw2});
    //         }
    //         });
    //     })
    //     }
    // }

    // -------------------------------------
    // private
    // -------------------------------------
    // _subscribeNativeEvents = () => {
    //     NfcManager._subscriptions = {}
    //     NfcManager._clientListeners = {};
    //     NfcManager._subscriptions[NfcEvents.DiscoverTag] = NfcManagerEmitter.addListener(
    //     NfcEvents.DiscoverTag, NfcManager._onDiscoverTag
    //     );

    //     if (Platform.OS === 'ios') {
    //     NfcManager._subscriptions[NfcEvents.SessionClosed] = NfcManagerEmitter.addListener(
    //         NfcEvents.SessionClosed, NfcManager._onSessionClosedIOS
    //     );
    //     }

    //     if (Platform.OS === 'android') {
    //     NfcManager._subscriptions[NfcEvents.StateChanged] = NfcManagerEmitter.addListener(
    //         NfcEvents.StateChanged, NfcManager._onStateChangedAndroid
    //     );
    //     }
    // }

    // _onDiscoverTag = tag => {
    //     const callback = NfcManager._clientListeners[NfcEvents.DiscoverTag];
    //     if (callback) {
    //     callback(tag);
    //     }
    // }

    // _onSessionClosedIOS = () => {
    //     const callback = NfcManager._clientListeners[NfcEvents.SessionClosed];
    //     if (callback) {
    //     callback();
    //     }
    // }

    // _onStateChangedAndroid = state => {
    //     const callback = NfcManager._clientListeners[NfcEvents.StateChanged];
    //     if (callback) {
    //     callback(state);
    //     }
    // }

    // -------------------------------------
    // Android private
    // -------------------------------------
    // _hasTagEventRegistrationAndroid = () => callNative('hasTagEventRegistration');

    // -------------------------------------
    // iOS private
    // -------------------------------------
    _isSessionAvailableIOS: function(success, failure){
        // callNative('isSessionAvailable');
        cordova.exec(success, failure, 'NfcManager', 'isSessionAvailable', []);
    },

    _isSessionExAvailableIOS: function(success, failure){
        // callNative('isSessionExAvailable');
        cordova.exec(success, failure, 'NfcManager', 'isSessionExAvailable', []);
    },

    _registerTagEventExIOS: function(options = {}, success, failure) {
        // const optionsWithDefault = {
        // ...DEFAULT_REGISTER_TAG_EVENT_OPTIONS,
        // ...options,
        // };
        var optionsWithDefault = Object.assign({},DEFAULT_REGISTER_TAG_EVENT_OPTIONS,options);

        // return callNative('registerTagEventEx', [optionsWithDefault]);
        cordova.exec(success, failure, 'NfcManager', 'registerTagEventEx', [optionsWithDefault]);
    },

    _unregisterTagEventExIOS: function(success, failure){
        // callNative('unregisterTagEventEx');
        cordova.exec(success, failure, 'NfcManager', 'unregisterTagEventEx', []);
    }

    // -------------------------------------
    // deprecated APIs 
    // -------------------------------------
    // requestNdefWrite = (bytes, {format=false, formatReadOnly=false}={}) => callNative('requestNdefWrite', [bytes, {format, formatReadOnly}]);

    // cancelNdefWrite = () => callNative('cancelNdefWrite');
}

// export default new NfcManager();

// export {
//   ByteParser,
//   NdefParser,
//   NfcTech,
//   NfcEvents,
//   NfcAdapter,
//   Ndef,
//   Nfc15693RequestFlagIOS,
// }


NfcManager.NfcEvents = NfcEvents;
NfcManager.NfcTech = NfcTech;
NfcManager.NfcAdapter = NfcAdapter;
NfcManager.Nfc15693RequestFlagIOS = Nfc15693RequestFlagIOS;
NfcManager.Iso15693HandlerIOS = Iso15693HandlerIOS;

window.NfcManager = NfcManager;