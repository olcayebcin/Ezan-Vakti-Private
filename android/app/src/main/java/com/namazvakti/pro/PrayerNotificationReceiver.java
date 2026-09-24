package com.namazvakti.pro;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Refreshes the ongoing prayer notification at prayer boundaries, after reboot and on clock changes. */
public class PrayerNotificationReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        OngoingPrayerNotification.refresh(context);
    }
}
