
#ifndef NfcManager_h
#define NfcManager_h

#import <Cordova/CDV.h>
#import <CoreNFC/CoreNFC.h>
#import <WebKit/WebKit.h>

@interface NfcManager : CDVPlugin <NFCNDEFReaderSessionDelegate, NFCTagReaderSessionDelegate> {

}

@property (strong, nonatomic) NFCNDEFReaderSession *session;
@property (strong, nonatomic) NFCTagReaderSession *sessionEx;

- (void)isSupported:(CDVInvokedUrlCommand *)command;
- (void)start:(CDVInvokedUrlCommand *)command;
- (void)requestTechnology:(CDVInvokedUrlCommand *)command;
- (void)cancelTechnologyRequest:(CDVInvokedUrlCommand *)command;
- (void)registerTagEvent:(CDVInvokedUrlCommand *)command;
- (void)unregisterTagEvent:(CDVInvokedUrlCommand *)command;
- (void)registerTagEventEx:(CDVInvokedUrlCommand *)command;
- (void)unregisterTagEventEx:(CDVInvokedUrlCommand *)command;
- (void)invalidateSession:(CDVInvokedUrlCommand *)command;
- (void)invalidateSessionWithError:(CDVInvokedUrlCommand *)command;
- (void)getTag:(CDVInvokedUrlCommand *)command;
- (void)getNdefMessage:(CDVInvokedUrlCommand *)command;
- (void)writeNdefMessage:(CDVInvokedUrlCommand *)command;
- (void)sendMifareCommand:(CDVInvokedUrlCommand *)command;
- (void)sendFelicaCommand:(CDVInvokedUrlCommand *)command;
- (void)sendCommandAPDUBytes:(CDVInvokedUrlCommand *)command;
- (void)sendCommandAPDU:(CDVInvokedUrlCommand *)command;
- (void)setAlertMessage:(CDVInvokedUrlCommand *)command;
- (void)isSessionAvailable:(CDVInvokedUrlCommand *)command;
- (void)isSessionExAvailable:(CDVInvokedUrlCommand *)command;
- (void)iso15693_getSystemInfo:(CDVInvokedUrlCommand *)command;
- (void)iso15693_readSingleBlock:(CDVInvokedUrlCommand *)command;
- (void)iso15693_readMultipleBlocks:(CDVInvokedUrlCommand *)command;
- (void)iso15693_writeSingleBlock:(CDVInvokedUrlCommand *)command;
- (void)iso15693_lockBlock:(CDVInvokedUrlCommand *)command;
- (void)iso15693_writeAFI:(CDVInvokedUrlCommand *)command;
- (void)iso15693_lockAFI:(CDVInvokedUrlCommand *)command;
- (void)iso15693_writeDSFID:(CDVInvokedUrlCommand *)command;
- (void)iso15693_lockDSFID:(CDVInvokedUrlCommand *)command;
- (void)iso15693_resetToReady:(CDVInvokedUrlCommand *)command;
- (void)iso15693_select:(CDVInvokedUrlCommand *)command;
- (void)iso15693_stayQuiet:(CDVInvokedUrlCommand *)command;
- (void)iso15693_customCommand:(CDVInvokedUrlCommand *)command;
- (void)iso15693_extendedReadSingleBlock:(CDVInvokedUrlCommand *)command;
- (void)iso15693_extendedWriteSingleBlock:(CDVInvokedUrlCommand *)command;
- (void)iso15693_extendedLockBlock:(CDVInvokedUrlCommand *)command;

@end

#endif

