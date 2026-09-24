package com.namazvakti.pro;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import android.os.VibrationEffect;
import android.os.Vibrator;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.ServiceCompat;
import androidx.core.content.ContextCompat;

/**
 * Plays a recorded adhan in the foreground so it keeps going while the app is closed.
 * Shows a notification with a "Durdur" action; stops on completion, on that action,
 * when the notification is dismissed, or when another app (e.g. a call) takes audio focus.
 */
public class AdhanService extends Service {
    static final String ACTION_PLAY = "com.namazvakti.pro.ADHAN_PLAY";
    static final String ACTION_STOP = "com.namazvakti.pro.ADHAN_STOP";
    private static final int NOTIFICATION_ID = 7001;

    private MediaPlayer player;
    private AudioManager audioManager;
    private AudioFocusRequest focusRequest;
    private String title = "";
    private String body = "";

    private final AudioManager.OnAudioFocusChangeListener focusListener = change -> {
        if (change == AudioManager.AUDIOFOCUS_LOSS || change == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
            finish();
        }
    };

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null || ACTION_STOP.equals(intent.getAction())) {
            finish();
            return START_NOT_STICKY;
        }

        title = intent.getStringExtra("title");
        body = intent.getStringExtra("body");
        PrayerAlarms.ensureChannels(this);

        ServiceCompat.startForeground(this, NOTIFICATION_ID, buildNotification(true),
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q ? ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK : 0);

        if (intent.getBooleanExtra("vibrate", false)) vibrate();
        play(intent.getStringExtra("path"));
        return START_NOT_STICKY;
    }

    private void play(String path) {
        releasePlayer();
        audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        // Alarm usage: audible at alarm volume even when media volume is down.
        AudioAttributes attrs = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build();
        try {
            player = new MediaPlayer();
            player.setAudioAttributes(attrs);
            player.setDataSource(path);
            player.setOnPreparedListener(mp -> {
                if (requestFocus(attrs)) mp.start();
                else finish();
            });
            player.setOnCompletionListener(mp -> finish());
            player.setOnErrorListener((mp, what, extra) -> {
                finish();
                return true;
            });
            player.prepareAsync();
        } catch (Exception e) {
            finish();
        }
    }

    private boolean requestFocus(AudioAttributes attrs) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            focusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
                    .setAudioAttributes(attrs)
                    .setOnAudioFocusChangeListener(focusListener)
                    .build();
            return audioManager.requestAudioFocus(focusRequest) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
        }
        return audioManager.requestAudioFocus(focusListener, AudioManager.STREAM_ALARM,
                AudioManager.AUDIOFOCUS_GAIN_TRANSIENT) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
    }

    private void vibrate() {
        Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        if (vibrator == null || !vibrator.hasVibrator()) return;
        long[] pattern = {0, 500, 250, 500};
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1));
        } else {
            vibrator.vibrate(pattern, -1);
        }
    }

    private Notification buildNotification(boolean playing) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, PrayerAlarms.CHANNEL_ADHAN)
                .setSmallIcon(R.drawable.ic_stat_namaz)
                .setColor(ContextCompat.getColor(this, R.color.notif_accent))
                .setContentTitle(title)
                .setContentText(playing ? body + " · Ezan okunuyor" : body)
                .setContentIntent(PrayerAlarms.openAppIntent(this))
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC);

        if (playing) {
            PendingIntent stop = PendingIntent.getService(this, 0,
                    new Intent(this, AdhanService.class).setAction(ACTION_STOP),
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            builder.setOngoing(true)
                    .addAction(0, "Durdur", stop)
                    .setDeleteIntent(stop);
        } else {
            builder.setAutoCancel(true);
        }
        return builder.build();
    }

    /** Stops playback and leaves a plain "prayer time" notification behind. */
    private void finish() {
        releasePlayer();
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE);
        if (title != null && !title.isEmpty()) {
            try {
                NotificationManagerCompat.from(this).notify(NOTIFICATION_ID, buildNotification(false));
            } catch (SecurityException ignored) {
                // notification permission revoked
            }
        }
        stopSelf();
    }

    private void releasePlayer() {
        if (player != null) {
            try {
                player.stop();
            } catch (IllegalStateException ignored) {
                // not started yet
            }
            player.release();
            player = null;
        }
        if (audioManager != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && focusRequest != null) {
                audioManager.abandonAudioFocusRequest(focusRequest);
            } else {
                audioManager.abandonAudioFocus(focusListener);
            }
        }
    }

    @Override
    public void onDestroy() {
        releasePlayer();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
