// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            let url = decodeURIComponent(details.url);
            let dnsIndex = url.indexOf('q=dns://');
            if (dnsIndex > 0) {
                dnsIndex += 'q=dns://'.length;
                let andIndex = url.indexOf('&');
                url = andIndex > 0 ? url.substring(dnsIndex, andIndex) : url.substring(dnsIndex);
                // alert(`detected ${url}`);
                return {cancel: true};
            } else {
                return {cancel: false};
            }
        },
        {urls: ["*://*/*"]},
        ["blocking"]
    );
});
