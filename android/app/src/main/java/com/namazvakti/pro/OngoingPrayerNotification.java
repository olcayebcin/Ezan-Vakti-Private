package com.namazvakti.pro;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.SystemClock;
import android.widget.RemoteViews;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Persistent "prayer times" notification with a live countdown to the next prayer.
 * The web app hands over a few days of times; this class re-posts the notification
 * at every prayer boundary via AlarmManager, so it stays correct while the app is closed.
 */
final class OngoingPrayerNotification {
    static final int NOTIFICATION_ID = 4101;
    static final String CHANNEL_ID = "namaz-ongoing";
    static final String ACTION_REFRESH = "com.namazvakti.pro.REFRESH_ONGOING";

    private static final String PREFS = "ongoing_prayer";
    private static final String[] KEYS = {"imsak", "gunes", "ogle", "ikindi", "aksam", "yatsi"};
    private static final String[] LABELS = {"İmsak", "Güneş", "Öğle", "İkindi", "Akşam", "Yatsı"};
    // Turkish dative forms: "<prayer>'a kalan süre"
    private static final String[] UNTIL = {"İmsak'a", "Güneş'e", "Öğle'ye", "İkindi'ye", "Akşam'a", "Yatsı'ya"};

    private static final int[] CELL_IDS = {
            R.id.notif_cell_0, R.id.notif_cell_1, R.id.notif_cell_2,
            R.id.notif_cell_3, R.id.notif_cell_4, R.id.notif_cell_5
    };
    private static final int[] LABEL_IDS = {
            R.id.notif_label_0, R.id.notif_label_1, R.id.notif_label_2,
            R.id.notif_label_3, R.id.notif_label_4, R.id.notif_label_5
    };
    private static final int[] TIME_IDS = {
            R.id.notif_time_0, R.id.notif_time_1, R.id.notif_time_2,
            R.id.notif_time_3, R.id.notif_time_4, R.id.notif_time_5
    };
    private static final int[] SMALL_TIME_IDS = {
            R.id.notif_small_time_0, R.id.notif_small_time_1, R.id.notif_small_time_2,
            R.id.notif_small_time_3, R.id.notif_small_time_4, R.id.notif_small_time_5
    };

    private OngoingPrayerNotification() {}

    static void enable(Context context, String cityName, String daysJson) {
        prefs(context).edit()
                .putBoolean("enabled", true)
                .putString("city", cityName)
                .putString("days", daysJson)
                .apply();
        refresh(context);
    }

    static void disable(Context context) {
        prefs(context).edit().putBoolean("enabled", false).apply();
        NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID);
        alarmManager(context).cancel(refreshIntent(context));
    }

    /** Re-posts the notification for the current moment and schedules the next refresh. */
    static void refresh(Context context) {
        SharedPreferences prefs = prefs(context);
        if (!prefs.getBoolean("enabled", false)) return;

        Next next = findNext(prefs.getString("days", "[]"), System.currentTimeMillis());
        if (next == null) {
            // Stored times ran out; the app hands over fresh ones next time it opens.
            NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID);
            return;
        }

        post(context, prefs.getString("city", "Namaz Vakti"), next);
        scheduleRefresh(context, next.millis + 1000);
    }

    private static final class Next {
        String[] times;   // HH:mm for the day of the next prayer
        int index;        // index into KEYS
        long millis;      // epoch millis of the next prayer
    }

    private static Next findNext(String daysJson, long now) {
        try {
            JSONArray days = new JSONArray(daysJson);
            for (int d = 0; d < days.length(); d++) {
                JSONObject day = days.getJSONObject(d);
                String[] date = day.getString("date").split("-");
                JSONObject times = day.getJSONObject("times");
                String[] dayTimes = new String[KEYS.length];
                for (int i = 0; i < KEYS.length; i++) dayTimes[i] = times.optString(KEYS[i], "--:--");

                for (int i = 0; i < KEYS.length; i++) {
                    String[] hm = dayTimes[i].split(":");
                    if (hm.length != 2) continue;
                    Calendar cal = Calendar.getInstance();
                    cal.set(Integer.parseInt(date[0]), Integer.parseInt(date[1]) - 1, Integer.parseInt(date[2]),
                            Integer.parseInt(hm[0]), Integer.parseInt(hm[1]), 0);
                    cal.set(Calendar.MILLISECOND, 0);
                    if (cal.getTimeInMillis() > now) {
                        Next next = new Next();
                        next.times = dayTimes;
                        next.index = i;
                        next.millis = cal.getTimeInMillis();
                        return next;
                    }
                }
            }
        } catch (Exception ignored) {
            // malformed data: treat as no upcoming prayer
        }
        return null;
    }

    private static void post(Context context, String city, Next next) {
        if (!NotificationManagerCompat.from(context).areNotificationsEnabled()) return;
        ensureChannel(context);

        long chronoBase = SystemClock.elapsedRealtime() + (next.millis - System.currentTimeMillis());
        int accent = ContextCompat.getColor(context, R.color.notif_accent);

        RemoteViews small = new RemoteViews(context.getPackageName(), R.layout.notification_ongoing_small);
        RemoteViews big = new RemoteViews(context.getPackageName(), R.layout.notification_ongoing_big);

        for (RemoteViews v : new RemoteViews[]{small, big}) {
            v.setTextViewText(R.id.notif_city, city);
            v.setTextViewText(R.id.notif_next_label, UNTIL[next.index]);
            v.setChronometer(R.id.notif_countdown, chronoBase, null, true);
            v.setChronometerCountDown(R.id.notif_countdown, true);
        }

        for (int i = 0; i < KEYS.length; i++) {
            small.setTextViewText(SMALL_TIME_IDS[i], next.times[i]);
            big.setTextViewText(LABEL_IDS[i], LABELS[i]);
            big.setTextViewText(TIME_IDS[i], next.times[i]);

            if (i == next.index) {
                small.setTextColor(SMALL_TIME_IDS[i], accent);
                big.setTextColor(LABEL_IDS[i], accent);
                big.setTextColor(TIME_IDS[i], accent);
                big.setInt(CELL_IDS[i], "setBackgroundResource", R.drawable.notif_cell_highlight);
            }
        }

        Intent open = new Intent(context, MainActivity.class)
                .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent contentIntent = PendingIntent.getActivity(context, 0, open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_namaz)
                .setColor(accent)
                .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
                .setCustomContentView(small)
                .setCustomBigContentView(big)
                // Plain-text fallback (accessibility, watches)
                .setContentTitle(city)
                .setContentText(LABELS[next.index] + " " + next.times[next.index])
                .setContentIntent(contentIntent)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setShowWhen(false)
                .setCategory(NotificationCompat.CATEGORY_STATUS)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setPriority(NotificationCompat.PRIORITY_LOW);

        try {
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, builder.build());
        } catch (SecurityException ignored) {
            // POST_NOTIFICATIONS revoked
        }
    }

    private static void ensureChannel(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = context.getSystemService(NotificationManager.class);
        if (nm.getNotificationChannel(CHANNEL_ID) != null) return;
        NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Namaz Vakti", NotificationManager.IMPORTANCE_LOW);
        channel.setDescription("Sonraki namaz vakti ve günlük vakitler");
        channel.setShowBadge(false);
        nm.createNotificationChannel(channel);
    }

    private static void scheduleRefresh(Context context, long atMillis) {
        AlarmManager am = alarmManager(context);
        PendingIntent pi = refreshIntent(context);
        boolean exact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || am.canScheduleExactAlarms();
        if (exact) {
            am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atMillis, pi);
        } else {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atMillis, pi);
        }
    }

    private static PendingIntent refreshIntent(Context context) {
        Intent intent = new Intent(context, PrayerNotificationReceiver.class).setAction(ACTION_REFRESH);
        return PendingIntent.getBroadcast(context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static AlarmManager alarmManager(Context context) {
        return (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
    }

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
