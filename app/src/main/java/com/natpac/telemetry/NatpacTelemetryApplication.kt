package com.natpac.telemetry

import android.app.Application
import dagger.hilt.android.HiltAndroidApp
import timber.log.Timber

/**
 * Main Application class for NATPAC Telemetry
 * Initializes app-level dependencies and configurations
 */
@HiltAndroidApp
class NatpacTelemetryApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        
        // Initialize Timber for logging in debug builds
        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }
        
        // Initialize other app-level components
        initializeAppComponents()
        
        Timber.d("NATPAC Telemetry Application initialized")
    }
    
    private fun initializeAppComponents() {
        // Initialize location services configuration
        configureLocationServices()
        
        // Initialize network configuration
        configureNetworkSettings()
        
        // Initialize analytics if needed
        // Analytics.initialize(this)
    }
    
    private fun configureLocationServices() {
        // Set location update intervals and accuracy
        Timber.d("Location services configured")
    }
    
    private fun configureNetworkSettings() {
        // Configure network timeout and retry policies
        Timber.d("Network settings configured")
    }
}
