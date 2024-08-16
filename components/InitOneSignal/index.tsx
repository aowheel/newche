"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

const InitOneSignal = () => {
  useEffect(() => {
    (async () => {
      await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID as string,
        safari_web_id: process.env.NEXT_PUBLIC_SAFARI_WEB_ID as string,
        allowLocalhostAsSecureOrigin: true,
        autoResubscribe: true,
        promptOptions: {
          slidedown: {
            prompts: [{
              type: "push",
              text: {
                actionMessage: "練習のリマインド、新着コメントの通知などが受け取れます。",
                acceptButton: "許可",
                cancelButton: "キャンセル"
              }
            }]
          }
        },
        welcomeNotification: {
          message: "通知が許可されました。"
        }
      });
    })();
  }, []);
  return null;
};

export default InitOneSignal;
