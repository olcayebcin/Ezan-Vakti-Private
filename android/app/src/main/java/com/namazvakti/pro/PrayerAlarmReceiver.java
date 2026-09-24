package com.namazvakti.pro;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Fires scheduled prayer alarms; re-arms them after reboot, clock/timezone changes and app updates. */
public class PrayerAlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (PrayerAlarms.ACTION_FIRE.equals(intent.getAction())) {
            PrayerAlarms.fire(context, intent.getIntExtra(PrayerAlarms.EXTRA_ID, -1));
        } else {
            PrayerAlarms.rearm(context);
        }
    }
}
