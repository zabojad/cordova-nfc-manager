
#ifndef NfcManager_h
#define NfcManager_h

#import <Cordova/CDV.h>
#import <CoreNFC/CoreNFC.h>
#import <WebKit/WebKit.h>

@interface NfcManager : CDVPlugin <NFCNDEFReaderSessionDelegate, NFCTagReaderSessionDelegate> {

}

@property (strong, nonatomic) NFCNDEFReaderSession *session;
@property (strong, nonatomic) NFCTagReaderSession *sessionEx;

- (void)isSupported:(NSString *)tech callback:(CDVInvokedUrlCommand *)command;
- (void)start:(CDVInvokedUrlCommand *)command;
- (void)requestTechnology:(CDVInvokedUrlCommand *)command;
- (void)cancelTechnologyRequest:(CDVInvokedUrlCommand *)command;
- (void)registerTagEvent:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)unregisterTagEvent:(CDVInvokedUrlCommand *)command;
- (void)registerTagEventEx:(CDVInvokedUrlCommand *)command;
- (void)unregisterTagEventEx:(CDVInvokedUrlCommand *)command;
- (void)invalidateSession:(CDVInvokedUrlCommand *)command;
- (void)invalidateSessionWithError:(NSString *)errorMessage callback:(CDVInvokedUrlCommand *)command;
- (void)getTag:(CDVInvokedUrlCommand *)command;
- (void)getNdefMessage:(CDVInvokedUrlCommand *)command;
- (void)writeNdefMessage:(NSArray*)bytes callback:(CDVInvokedUrlCommand *)command;
- (void)sendMifareCommand:(NSArray *)bytes callback:(CDVInvokedUrlCommand *)command;
- (void)sendFelicaCommand:(NSArray *)bytes callback:(CDVInvokedUrlCommand *)command;
- (void)sendCommandAPDUBytes:(NSArray *)bytes callback:(CDVInvokedUrlCommand *)command;
- (void)sendCommandAPDU:(NSDictionary *)apduData callback:(CDVInvokedUrlCommand *)command;
- (void)setAlertMessage: (NSString *)alertMessage callback:(CDVInvokedUrlCommand *)command;
- (void)isSessionAvailable:(CDVInvokedUrlCommand *)command;
- (void)isSessionExAvailable:(CDVInvokedUrlCommand *)command;
- (void)iso15693_getSystemInfo:(CDVInvokedUrlCommand *)command;
- (void)iso15693_readSingleBlock:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_readMultipleBlocks:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_writeSingleBlock:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_lockBlock:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_writeAFI:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_lockAFI:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_writeDSFID:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_lockDSFID:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_resetToReady:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_select:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_stayQuiet:(CDVInvokedUrlCommand *)command;
- (void)iso15693_customCommand:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_extendedReadSingleBlock:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_extendedWriteSingleBlock:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;
- (void)iso15693_extendedLockBlock:(NSDictionary *)options callback:(CDVInvokedUrlCommand *)command;

@end

#endif

