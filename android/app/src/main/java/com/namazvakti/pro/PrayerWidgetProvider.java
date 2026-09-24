package com.namazvakti.pro;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.widget.RemoteViews;

public class PrayerWidgetProvider extends AppWidgetProvider {
        private static final String[] KEYS = {"imsak", "gunes", "ogle", "ikindi", "aksam", "yatsi"};
    private static final int[] TIME_IDS = {
            R.id.widget_imsak_time, R.id.widget_gunes_time, R.id.widget_ogle_time,
            R.id.widget_ikindi_time, R.id.widget_aksam_time, R.id.widget_yatsi_time
    };
        private static final int[] LABEL_IDS = {
            R.id.widget_imsak_label, R.id.widget_gunes_label, R.id.widget_ogle_label,
            R.id.widget_ikindi_label, R.id.widget_aksam_label, R.id.widget_yatsi_label
    };

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        updateAll(context);
    }

    @Override
    public void onReceive(Context context, android.content.Intent intent) {
        super.onReceive(context, intent);
        updateAll(context);
    }

    private static void updateAll(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        ComponentName provider = new ComponentName(context, PrayerWidgetProvider.class);
        int[] ids = manager.getAppWidgetIds(provider);
        SharedPreferences prefs = context.getSharedPreferences(PrayerWidgetPlugin.PREFS, Context.MODE_PRIVATE);

        for (int id : ids) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.prayer_widget);
            String nextPrayer = prefs.getString("nextPrayer", "");
            views.setTextViewText(R.id.widget_city, prefs.getString("cityName", "Namaz Vakti"));
            views.setTextViewText(R.id.widget_remaining, prefs.getString("remaining", "") + " kaldı");
            for (int i = 0; i < KEYS.length; i++) {
                views.setTextViewText(TIME_IDS[i], prefs.getString(KEYS[i], "--:--"));
                int color = KEYS[i].equals(nextPrayer) ? Color.rgb(249, 115, 22) : Color.WHITE;
                views.setTextColor(LABEL_IDS[i], color);
                views.setTextColor(TIME_IDS[i], color);
            }
            manager.updateAppWidget(id, views);
        }
    }

}