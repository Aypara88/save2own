import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Shield, Lock, Fingerprint, Smartphone, Eye, EyeOff, ChevronRight } from 'lucide-react-native';

export default function SecurityScreen() {
  console.log('[SecurityScreen] render');
  const [pinEnabled, setPinEnabled] = useState<boolean>(true);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [loginNotifications, setLoginNotifications] = useState<boolean>(true);

  const handleChangePIN = () => {
    Alert.alert(
      'Change PIN',
      'You will be redirected to change your PIN',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Navigate to PIN change') },
      ]
    );
  };

  const handleBiometricToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Enable Biometric Authentication',
        'Use your fingerprint or face ID to unlock the app',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Enable', 
            onPress: () => {
              setBiometricEnabled(true);
              Alert.alert('Success', 'Biometric authentication enabled');
            }
          },
        ]
      );
    } else {
      setBiometricEnabled(false);
    }
  };

  const handleTwoFactorToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Enable Two-Factor Authentication',
        'Add an extra layer of security to your account',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Setup', 
            onPress: () => {
              setTwoFactorEnabled(true);
              Alert.alert('Success', 'Two-factor authentication enabled');
            }
          },
        ]
      );
    } else {
      Alert.alert(
        'Disable Two-Factor Authentication',
        'This will reduce your account security. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive',
            onPress: () => setTwoFactorEnabled(false)
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container} testID="security-screen">
      <Stack.Screen 
        options={{ 
          title: 'Security Settings',
          headerStyle: { backgroundColor: '#059669' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Shield color="#fff" size={32} />
          <Text style={styles.heroTitle}>Protect Your Account</Text>
          <Text style={styles.heroSub}>Manage your security settings and preferences</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <Lock color="#059669" size={20} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>PIN Protection</Text>
                <Text style={styles.settingDescription}>Secure your app with a PIN</Text>
              </View>
              <Switch 
                value={pinEnabled} 
                onValueChange={setPinEnabled}
                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                thumbColor={pinEnabled ? '#059669' : '#9CA3AF'}
              />
            </View>
            
            {pinEnabled && (
              <TouchableOpacity style={styles.settingAction} onPress={handleChangePIN}>
                <Text style={styles.actionText}>Change PIN</Text>
                <ChevronRight color="#9CA3AF" size={16} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <Fingerprint color="#059669" size={20} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Biometric Authentication</Text>
                <Text style={styles.settingDescription}>Use fingerprint or face ID</Text>
              </View>
              <Switch 
                value={biometricEnabled} 
                onValueChange={handleBiometricToggle}
                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                thumbColor={biometricEnabled ? '#059669' : '#9CA3AF'}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <Smartphone color="#059669" size={20} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>Extra security via SMS or app</Text>
              </View>
              <Switch 
                value={twoFactorEnabled} 
                onValueChange={handleTwoFactorToggle}
                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                thumbColor={twoFactorEnabled ? '#059669' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Notifications</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <Eye color="#059669" size={20} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Login Notifications</Text>
                <Text style={styles.settingDescription}>Get notified of new logins</Text>
              </View>
              <Switch 
                value={loginNotifications} 
                onValueChange={setLoginNotifications}
                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                thumbColor={loginNotifications ? '#059669' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('Coming Soon', 'Password change feature coming soon!')}
          >
            <View style={styles.actionIcon}>
              <Lock color="#6B7280" size={20} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Change Password</Text>
              <Text style={styles.actionDescription}>Update your account password</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('Coming Soon', 'Security audit feature coming soon!')}
          >
            <View style={styles.actionIcon}>
              <Shield color="#6B7280" size={20} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Security Audit</Text>
              <Text style={styles.actionDescription}>Review your security status</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  hero: { 
    backgroundColor: '#059669', 
    padding: 24, 
    borderRadius: 20, 
    margin: 20, 
    alignItems: 'center' 
  },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 8, marginBottom: 4 },
  heroSub: { fontSize: 14, color: '#D1FAE5', textAlign: 'center' },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});