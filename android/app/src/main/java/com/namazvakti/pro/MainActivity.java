package com.namazvakti.pro;

import android.os.Bundle;
import android.content.pm.ActivityInfo;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
		registerPlugin(PrayerWidgetPlugin.class);
		super.onCreate(savedInstanceState);
	}
}
