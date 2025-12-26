package com.natpac.telemetry.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.natpac.telemetry.R
import com.natpac.telemetry.ui.components.GlassmorphicCard
import com.natpac.telemetry.ui.components.IOSButton

@Composable
fun AdminLoginScreen(
    onLoginSuccess: () -> Unit,
    onBackClick: () -> Unit
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var twoFactorCode by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var showTwoFactor by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }

    Box(
        modifier = Modifier.fillMaxSize()
    ) {
        // Background image with blur
        Image(
            painter = painterResource(id = R.drawable.kerala_bg),
            contentDescription = null,
            modifier = Modifier
                .fillMaxSize()
                .blur(20.dp),
            contentScale = ContentScale.Crop
        )

        // Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Back button
            IconButton(
                onClick = onBackClick,
                modifier = Modifier.align(Alignment.Start)
            ) {
                Icon(
                    Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = Color.White
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Admin shield icon
            GlassmorphicCard(
                modifier = Modifier.size(80.dp)
            ) {
                Icon(
                    Icons.Default.Shield,
                    contentDescription = null,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    tint = Color(0xFF8B5CF6)
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Admin Portal",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )

            Text(
                text = "Secure access for administrators",
                fontSize = 14.sp,
                color = Color.White.copy(alpha = 0.7f)
            )

            Spacer(modifier = Modifier.height(32.dp))

            AnimatedContent(
                targetState = showTwoFactor,
                label = "auth_step"
            ) { show2FA ->
                if (!show2FA) {
                    // Login form
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        GlassmorphicCard(
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(24.dp),
                                verticalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                // Username field
                                OutlinedTextField(
                                    value = username,
                                    onValueChange = { username = it },
                                    label = { Text("Admin Username") },
                                    leadingIcon = {
                                        Icon(Icons.Default.Person, null)
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    singleLine = true,
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedBorderColor = Color(0xFF8B5CF6),
                                        unfocusedBorderColor = Color.White.copy(0.3f)
                                    )
                                )

                                // Password field
                                OutlinedTextField(
                                    value = password,
                                    onValueChange = { password = it },
                                    label = { Text("Password") },
                                    leadingIcon = {
                                        Icon(Icons.Default.Lock, null)
                                    },
                                    trailingIcon = {
                                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                            Icon(
                                                if (passwordVisible) Icons.Default.Visibility
                                                else Icons.Default.VisibilityOff,
                                                null
                                            )
                                        }
                                    },
                                    visualTransformation = if (passwordVisible)
                                        VisualTransformation.None
                                    else PasswordVisualTransformation(),
                                    modifier = Modifier.fillMaxWidth(),
                                    singleLine = true,
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedBorderColor = Color(0xFF8B5CF6),
                                        unfocusedBorderColor = Color.White.copy(0.3f)
                                    )
                                )

                                if (errorMessage.isNotEmpty()) {
                                    Text(
                                        text = errorMessage,
                                        color = MaterialTheme.colorScheme.error,
                                        fontSize = 12.sp
                                    )
                                }

                                IOSButton(
                                    text = if (isLoading) "Verifying..." else "Continue",
                                    onClick = {
                                        if (username == "admin" && password == "admin@123") {
                                            showTwoFactor = true
                                            errorMessage = ""
                                        } else {
                                            errorMessage = "Invalid credentials"
                                        }
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    enabled = !isLoading && username.isNotEmpty() && password.isNotEmpty(),
                                    backgroundColor = Color(0xFF8B5CF6)
                                )
                            }
                        }
                    }
                } else {
                    // 2FA form
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        GlassmorphicCard(
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(24.dp),
                                verticalArrangement = Arrangement.spacedBy(16.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Icon(
                                    Icons.Default.Security,
                                    contentDescription = null,
                                    modifier = Modifier.size(48.dp),
                                    tint = Color(0xFF8B5CF6)
                                )

                                Text(
                                    text = "Two-Factor Authentication",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold
                                )

                                Text(
                                    text = "Enter the 6-digit code sent to",
                                    fontSize = 14.sp,
                                    color = Color.White.copy(0.7f)
                                )

                                Text(
                                    text = "+91 971-586-5775",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color(0xFF8B5CF6)
                                )

                                OutlinedTextField(
                                    value = twoFactorCode,
                                    onValueChange = { if (it.length <= 6) twoFactorCode = it },
                                    label = { Text("Verification Code") },
                                    modifier = Modifier.fillMaxWidth(),
                                    singleLine = true,
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedBorderColor = Color(0xFF8B5CF6),
                                        unfocusedBorderColor = Color.White.copy(0.3f)
                                    )
                                )

                                if (errorMessage.isNotEmpty()) {
                                    Text(
                                        text = errorMessage,
                                        color = MaterialTheme.colorScheme.error,
                                        fontSize = 12.sp
                                    )
                                }

                                IOSButton(
                                    text = "Verify & Login",
                                    onClick = {
                                        if (twoFactorCode == "123456") {
                                            onLoginSuccess()
                                        } else {
                                            errorMessage = "Invalid verification code"
                                        }
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    enabled = twoFactorCode.length == 6,
                                    backgroundColor = Color(0xFF8B5CF6)
                                )

                                TextButton(onClick = { showTwoFactor = false }) {
                                    Text("← Back to login", color = Color.White)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
