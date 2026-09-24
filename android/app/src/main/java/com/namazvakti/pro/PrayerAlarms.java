package com.namazvakti.pro;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.AudioManager;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;

/**
 * Prayer-time alarms that work while the app is closed.
 * The web app sends the next few days of entries:
 *   {id, at (epoch ms), title, body, adhan (bool), makam, sound (bool), vibrate (bool)}
 * At each moment an entry either starts {@link AdhanService} (recorded adhan) or posts a notification.
 */
final class PrayerAlarms {
    static final String ACTION_FIRE = "com.namazvakti.pro.PRAYER_ALARM";
    static final String EXTRA_ID = "id";

    static final String CHANNEL_ADHAN = "namaz-ezan";
    static final String CHANNEL_REMINDER = "namaz-hatirlatma";
    static final String CHANNEL_SILENT_VIBRATE = "namaz-sessiz-titresim";
    static final String CHANNEL_SILENT = "namaz-sessiz";

    private static final String PREFS = "prayer_alarms";
    private static final String KEY_ALARMS = "alarms";
    private static final String KEY_TEST = "test";
    static final int TEST_ID = 6999;

    private PrayerAlarms() {}

    /** Replaces all scheduled prayer alarms. */
    static void set(Context context, JSONArray alarms) {
        cancelAll(context);
        prefs(context).edit().putString(KEY_ALARMS, alarms.toString()).apply();
        armAll(context);
    }

    /** Re-arms stored alarms (after reboot, clock change or app update). */
    static void rearm(Context context) {
        armAll(context);
    }

    static void scheduleTest(Context context, JSONObject entry) {
        prefs(context).edit().putString(KEY_TEST, entry.toString()).apply();
        arm(context, entry);
    }

    static File adhanFile(Context context, String makam) {
        return new File(new File(context.getFilesDir(), "adhan"), makam + ".mp3");
    }

    static void fire(Context context, int id) {
        JSONObject entry = find(context, id);
        if (entry == null) return;

        boolean wantsAdhan = entry.optBoolean("adhan") && entry.optBoolean("sound");
        File file = adhanFile(context, entry.optString("makam"));

        if (wantsAdhan && file.exists() && soundAllowed(context)) {
            Intent intent = new Intent(context, AdhanService.class)
                    .setAction(AdhanService.ACTION_PLAY)
                    .putExtra("title", entry.optString("title"))
                    .putExtra("body", entry.optString("body"))
                    .putExtra("path", file.getAbsolutePath())
                    .putExtra("vibrate", entry.optBoolean("vibrate"));
            try {
                ContextCompat.startForegroundService(context, intent);
                return;
            } catch (Exception e) {
                // Background start refused (e.g. exact-alarm permission missing): fall back to a notification.
            }
        }
        notifyPlain(context, entry);
    }

    /** Ringer on and Do Not Disturb off; the adhan never plays in silent/vibrate mode. */
    private static boolean soundAllowed(Context context) {
        AudioManager audio = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        if (audio == null || audio.getRingerMode() != AudioManager.RINGER_MODE_NORMAL) return false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            NotificationManager nm = context.getSystemService(NotificationManager.class);
            return nm == null || nm.getCurrentInterruptionFilter() == NotificationManager.INTERRUPTION_FILTER_ALL;
        }
        return true;
    }

    static void notifyPlain(Context context, JSONObject entry) {
        ensureChannels(context);
        String channel = entry.optBoolean("sound") ? CHANNEL_REMINDER
                : entry.optBoolean("vibrate") ? CHANNEL_SILENT_VIBRATE : CHANNEL_SILENT;

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channel)
                .setSmallIcon(R.drawable.ic_stat_namaz)
                .setColor(ContextCompat.getColor(context, R.color.notif_accent))
                .setContentTitle(entry.optString("title"))
                .setContentText(entry.optString("body"))
                .setContentIntent(openAppIntent(context))
                .setAutoCancel(true)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .setPriority(NotificationCompat.PRIORITY_HIGH);
        try {
            NotificationManagerCompat.from(context).notify(entry.optInt("id"), builder.build());
        } catch (SecurityException ignored) {
            // notification permission revoked
        }
    }

    static PendingIntent openAppIntent(Context context) {
        Intent open = new Intent(context, MainActivity.class)
                .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(context, 0, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static void ensureChannels(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = context.getSystemService(NotificationManager.class);

        // The adhan itself is played by AdhanService, so its channel makes no sound of its own.
        NotificationChannel adhan = new NotificationChannel(CHANNEL_ADHAN, "Ezan", NotificationManager.IMPORTANCE_HIGH);
        adhan.setDescription("Vakit girdiğinde okunan ezan");
        adhan.setSound(null, null);
        adhan.enableVibration(false);

        NotificationChannel reminder = new NotificationChannel(CHANNEL_REMINDER, "Vakit Hatırlatmaları", NotificationManager.IMPORTANCE_HIGH);
        reminder.setDescription("Vakitten önce ve vakit girdiğinde sesli bildirim");
        reminder.enableVibration(true);

        NotificationChannel silentVibrate = new NotificationChannel(CHANNEL_SILENT_VIBRATE, "Vakit Hatırlatmaları (Titreşim)", NotificationManager.IMPORTANCE_DEFAULT);
        silentVibrate.setSound(null, null);
        silentVibrate.enableVibration(true);

        NotificationChannel silent = new NotificationChannel(CHANNEL_SILENT, "Vakit Hatırlatmaları (Sessiz)", NotificationManager.IMPORTANCE_LOW);
        silent.setSound(null, null);
        silent.enableVibration(false);

        for (NotificationChannel ch : new NotificationChannel[]{adhan, reminder, silentVibrate, silent}) {
            if (nm.getNotificationChannel(ch.getId()) == null) nm.createNotificationChannel(ch);
        }
    }

    private static void armAll(Context context) {
        JSONArray alarms = stored(context);
        long now = System.currentTimeMillis();
        for (int i = 0; i < alarms.length(); i++) {
            JSONObject entry = alarms.optJSONObject(i);
            if (entry != null && entry.optLong("at") > now) arm(context, entry);
        }
    }

    private static void arm(Context context, JSONObject entry) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pi = fireIntent(context, entry.optInt("id"));
        long at = entry.optLong("at");
        boolean exact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || am.canScheduleExactAlarms();
        if (exact) {
            am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        } else {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        }
    }

    private static void cancelAll(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        JSONArray alarms = stored(context);
        for (int i = 0; i < alarms.length(); i++) {
            JSONObject entry = alarms.optJSONObject(i);
            if (entry != null) am.cancel(fireIntent(context, entry.optInt("id")));
        }
    }

    private static PendingIntent fireIntent(Context context, int id) {
        Intent intent = new Intent(context, PrayerAlarmReceiver.class)
                .setAction(ACTION_FIRE)
                .putExtra(EXTRA_ID, id);
        return PendingIntent.getBroadcast(context, id, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static JSONObject find(Context context, int id) {
        if (id == TEST_ID) {
            try {
                return new JSONObject(prefs(context).getString(KEY_TEST, "{}"));
            } catch (Exception e) {
                return null;
            }
        }
        JSONArray alarms = stored(context);
        for (int i = 0; i < alarms.length(); i++) {
            JSONObject entry = alarms.optJSONObject(i);
            if (entry != null && entry.optInt("id") == id) return entry;
        }
        return null;
    }

    private static JSONArray stored(Context context) {
        try {
            return new JSONArray(prefs(context).getString(KEY_ALARMS, "[]"));
        } catch (Exception e) {
            return new JSONArray();
        }
    }

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
