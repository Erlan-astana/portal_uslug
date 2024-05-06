import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class SignService {

    webSocket;
    heartbeat_msg = '--heartbeat--';
    heartbeat_interval = null;
    missed_heartbeats = 0;
    missed_heartbeats_limit_min = 3;
    missed_heartbeats_limit_max = 50;
    missed_heartbeats_limit = this.missed_heartbeats_limit_min;
    callback = null;
    private signCallback = new BehaviorSubject<Object>({ callback: null, result: null });
    sign$ = this.signCallback.asObservable();

    missed_heartbeats_limit$ = new Subject();

    constructor() {
        this.init();
    }

    init() {
        this.webSocket = new WebSocket('wss://127.0.0.1:13579/');
        this.webSocket.onopen = (event) => {
            if (this.heartbeat_interval === null) {
                this.missed_heartbeats = 0;
                this.heartbeat_interval = setInterval(() => {
                    //console.log('pinging...');
                    try {
                        this.missed_heartbeats++;
                        if (this.missed_heartbeats >= this.missed_heartbeats_limit) {
                            throw new Error('Too many missed heartbeats.');
                        }
                        this.webSocket.send(this.heartbeat_msg);
                    } catch (e) {
                        clearInterval(this.heartbeat_interval);
                        this.heartbeat_interval = null;
                        console.warn('Closing connection. Reason: ' + e.message);
                        this.webSocket.close();
                    }
                }, 2000);
            }
            //console.log('Connection opened');
        };

        this.webSocket.onclose = (event) => {
            if (event.wasClean) {
                //console.log('connection has been closed');
            } else {
                //console.log('Connection error');
                this.openDialog();
            }
            console.log('Code: ' + event.code + ' Reason: ' + event.reason);
        };

        this.webSocket.onmessage = (event) => {
            if (event.data === this.heartbeat_msg) {
                this.missed_heartbeats = 0;
                return;
            }

            const result = JSON.parse(event.data);
            const code = result['code'];
            const message = result['message'];
            const responseObject = result['responseObject'];

            if (result != null && this.callback != null) {
                const rw = {
                    code,
                    message,
                    responseObject,
                    getResult: () => {
                        return result;
                    },
                    getMessage: () => {
                        return message;
                    },
                    getResponseObject: () => {
                        return responseObject;
                    },
                    getCode: () => {
                        return code;
                    }
                };
                this.setSignCallback({ callback: this.callback, result: rw });
            }
            //console.log(event);
            this.setMissedHeartbeatsLimitToMin();
        };
    }

    setMissedHeartbeatsLimitToMax() {
        this.missed_heartbeats_limit = this.missed_heartbeats_limit_max;
        this.missed_heartbeats_limit$.next(this.missed_heartbeats_limit);
    }

    setMissedHeartbeatsLimitToMin() {
        this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
        this.missed_heartbeats_limit$.next(this.missed_heartbeats_limit);
    }

    openDialog() {
        if (confirm('Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК') === true) {
            location.reload();
        }
    }

    getActiveTokens(callback) {
        const getActiveTokens = {
            'module': 'kz.gov.pki.knca.commonUtils',
            'method': 'getActiveTokens'
        };
        this.callback = callback;
        this.setMissedHeartbeatsLimitToMax();
        this.webSocket.send(JSON.stringify(getActiveTokens));
    }

    getKeyInfo(storageName, callback) {
        const getKeyInfo = {
            'module': 'kz.gov.pki.knca.commonUtils',
            'method': 'getKeyInfo',
            'args': [storageName]
        };
        this.callback = callback;
        this.setMissedHeartbeatsLimitToMax();
        this.webSocket.send(JSON.stringify(getKeyInfo));
    }

    browseKeyStore(storageName, fileExtension, currentDirectory, callBack) {
        var browseKeyStore = {
            "method": "browseKeyStore",
            "args": [storageName, fileExtension, currentDirectory]
        };
        this.callback = callBack;
        //TODO: CHECK CONNECTION
        this.setMissedHeartbeatsLimitToMax();
        this.webSocket.send(JSON.stringify(browseKeyStore));
    }

    signXml(storageName, keyType, xmlToSign, callback) {
        const signXml = {
            'module': 'kz.gov.pki.knca.commonUtils',
            'method': 'signXml',
            'args': [storageName, keyType, xmlToSign, '', '']
        };
        this.callback = callback;
        this.setMissedHeartbeatsLimitToMax();
        this.webSocket.send(JSON.stringify(signXml));
    }

    createCMSSignatureFromFile(storageName, keyType, filePath, flag, callback) {
        const createCMSSignatureFromFile = {
            'module': 'kz.gov.pki.knca.commonUtils',
            'method': 'createCMSSignatureFromFile',
            'args': [storageName, keyType, filePath, flag]
        };
        this.callback = callback;
        this.setMissedHeartbeatsLimitToMax();
        this.webSocket.send(JSON.stringify(createCMSSignatureFromFile));
    }

    showFileChooser(fileExtension, currentDirectory, callback) {
        const showFileChooser = {
            'module': 'kz.gov.pki.knca.commonUtils',
            'method': 'showFileChooser',
            'args': [fileExtension, currentDirectory]
        };
        this.callback = callback;
        this.setMissedHeartbeatsLimitToMax();
        this.webSocket.send(JSON.stringify(showFileChooser));
    }

    getDsInfoProperty(dsInfo: string, prop: string) {
        const arr = dsInfo.split(',');
        let value = '';
        arr.forEach(element => {
            if (element.includes(prop + '=')) {
                const strs = element.split('=');
                if (strs && strs.length > 1) {
                    value = strs[1];
                }
            }
        });
        return value;
    }

    setSignCallback(value) {
        this.signCallback.next(value);
    }

    getSignCallback() {
        return this.signCallback.asObservable();
    }
}
