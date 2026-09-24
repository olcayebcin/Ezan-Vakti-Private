package com.namazvakti.pro;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@CapacitorPlugin(name = "PrayerWidget")
public class PrayerWidgetPlugin extends Plugin {
    static final String PREFS = "prayer_widget";

    @PluginMethod
    public void update(PluginCall call) {
        String[] names = {"imsak", "sabah", "gunes", "ogle", "ikindi", "aksam", "yatsi"};
        SharedPreferences.Editor editor = getContext()
                .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .edit();

        SharedPreferences prefs = getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        boolean changed = false;

        for (String name : names) {
            String value = call.getString(name, "--:--");
            changed |= !value.equals(prefs.getString(name, ""));
            editor.putString(name, value);
        }
        String nextPrayer = call.getString("nextPrayer", "");
        String cityName = call.getString("cityName", "");
        String remaining = call.getString("remaining", "");
        changed |= !nextPrayer.equals(prefs.getString("nextPrayer", ""));
        changed |= !cityName.equals(prefs.getString("cityName", ""));
        changed |= !remaining.equals(prefs.getString("remaining", ""));
        editor.putString("nextPrayer", nextPrayer);
        editor.putString("cityName", cityName);
        editor.putString("remaining", remaining);
        editor.apply();

        if (changed) {
            getContext().sendBroadcast(new Intent(getContext(), PrayerWidgetProvider.class));
        }
        call.resolve(new JSObject());
    }

    /** Shows/updates the persistent prayer-times notification. days: [{date: "yyyy-MM-dd", times: {imsak, ...}}] */
    @PluginMethod
    public void showOngoing(PluginCall call) {
        JSArray days = call.getArray("days");
        if (days == null) {
            call.reject("days is required");
            return;
        }
        OngoingPrayerNotification.enable(getContext(), call.getString("cityName", "Namaz Vakti"), days.toString());
        call.resolve();
    }

    @PluginMethod
    public void clearOngoing(PluginCall call) {
        OngoingPrayerNotification.disable(getContext());
        call.resolve();
    }

    /** Replaces the scheduled prayer alarms. alarms: [{id, at, title, body, adhan, makam, sound, vibrate}] */
    @PluginMethod
    public void setPrayerAlarms(PluginCall call) {
        JSArray alarms = call.getArray("alarms");
        if (alarms == null) {
            call.reject("alarms is required");
            return;
        }
        PrayerAlarms.set(getContext(), alarms);
        call.resolve();
    }

    /** Plays the given makam as a real prayer alarm after a short delay, so it can be tested with the app closed. */
    @PluginMethod
    public void testAdhan(PluginCall call) {
        try {
            JSONObject entry = new JSONObject()
                    .put("id", PrayerAlarms.TEST_ID)
                    .put("at", System.currentTimeMillis() + call.getInt("delaySeconds", 10) * 1000L)
                    .put("title", "Test: Ezan")
                    .put("body", call.getString("body", "Deneme ezanı"))
                    .put("adhan", true)
                    .put("makam", call.getString("makam", "rast"))
                    .put("sound", true)
                    .put("vibrate", true);
            PrayerAlarms.scheduleTest(getContext(), entry);
            call.resolve();
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void stopAdhan(PluginCall call) {
        getContext().startService(new Intent(getContext(), AdhanService.class).setAction(AdhanService.ACTION_STOP));
        call.resolve();
    }

    /** Which makams are downloaded. makams: ["saba", ...] -> {saba: true, ...} */
    @PluginMethod
    public void getAdhanStatus(PluginCall call) {
        JSArray makams = call.getArray("makams");
        JSObject result = new JSObject();
        if (makams != null) {
            for (int i = 0; i < makams.length(); i++) {
                String makam = makams.optString(i);
                result.put(makam, PrayerAlarms.adhanFile(getContext(), makam).exists());
            }
        }
        call.resolve(result);
    }

    /** Downloads missing adhan recordings. files: [{makam, url}] -> {makam: downloaded} */
    @PluginMethod
    public void downloadAdhans(PluginCall call) {
        JSArray files = call.getArray("files");
        if (files == null) {
            call.reject("files is required");
            return;
        }
        new Thread(() -> {
            JSObject result = new JSObject();
            for (int i = 0; i < files.length(); i++) {
                JSONObject f = files.optJSONObject(i);
                if (f == null) continue;
                String makam = f.optString("makam");
                File target = PrayerAlarms.adhanFile(getContext(), makam);
                if (!target.exists()) {
                    try {
                        download(f.optString("url"), target);
                    } catch (Exception e) {
                        // leave missing; alarms fall back to a normal notification sound
                    }
                }
                result.put(makam, target.exists());
            }
            call.resolve(result);
        }).start();
    }

    private static void download(String url, File target) throws Exception {
        File dir = target.getParentFile();
        if (dir != null && !dir.exists() && !dir.mkdirs()) throw new Exception("mkdir failed");
        File part = new File(target.getPath() + ".part");

        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setInstanceFollowRedirects(true);
        conn.setConnectTimeout(15000);
        conn.setReadTimeout(30000);
        try {
            if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) throw new Exception("HTTP " + conn.getResponseCode());
            try (InputStream in = conn.getInputStream(); OutputStream out = new FileOutputStream(part)) {
                byte[] buf = new byte[64 * 1024];
                int n;
                while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
            }
        } finally {
            conn.disconnect();
        }
        // Guard against error pages saved as audio.
        if (part.length() < 100 * 1024 || !part.renameTo(target)) {
            part.delete();
            throw new Exception("download incomplete");
        }
    }
}