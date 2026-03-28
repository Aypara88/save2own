import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Settings2, Bell, Moon, Globe, Palette, Download, ChevronRight, Volume2 } from 'lucide-react-native';

export default function SettingsScreen() {
  console.log('[SettingsScreen] render');
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [autoBackup, setAutoBackup] = useState<boolean>(true);

  const handleLanguageChange = () => {
    Alert.alert(
      'Language Settings',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => console.log('English selected') },
        { text: 'Yoruba', onPress: () => console.log('Yoruba selected') },
        { text: 'Hausa', onPress: () => console.log('Hausa selected') },
        { text: 'Igbo', onPress: () => console.log('Igbo selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Theme Settings',
      'Choose your preferred theme',
      [
        { text: 'Light', onPress: () => console.log('Light theme selected') },
        { text: 'Dark', onPress: () => console.log('Dark theme selected') },
        { text: 'System', onPress: () => console.log('System theme selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'Export your savings and transaction data',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Success', 'Data export started. You will receive an email when ready.') },
      ]
    );
  };

  return (
    <View style={styles.container} testID="settings-screen">
      <Stack.Screen 
        options={{ 
          title: 'App Settings',
          headerStyle: { backgroundColor: '#059669' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Settings2 color="#fff" size={32} />
          <Text style={styles.heroTitle}>App Preferences</Text>
          <Text style={styles.heroSub}>Customize your app experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <Bell color="#059669" size={20} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive app notifications</Text>
              </View>
              <Switch 
                value={pushNotifications} 
                onValueChange={setPushNotifications}
                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                thumbColor={pushNotifications ? '#059669' : '#9CA3AF'}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <Volume2 color="#059669" size={20} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Sound Effects</Text>
                <Text style={styles.settingDescription}>Play sounds for actions</Text>
              </View>
              <Switch 
                value={soundEnabled} 
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                thumbColor={soundEnabled ? '#059669' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleThemeChange}>
            <View style={styles.actionIcon}>
              <Palette color="#6B7280" size={20} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Theme</Text>
              <Text style={styles.actionDescription}>Light theme</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleLanguageChange}>
            <View style={styles.actionIcon}>
              <Globe color="#6B7280" size={20} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Language</Text>
              <Text style={styles.actionDescription}>English</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <Download color="#059669" size={20} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Auto Backup</Text>
                <Text style={styles.settingDescription}>Backup data automatically</Text>
              </View>
              <Switch 
                value={autoBackup} 
                onValueChange={setAutoBackup}
                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                thumbColor={autoBackup ? '#059669' : '#9CA3AF'}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.actionCard} onPress={handleDataExport}>
            <View style={styles.actionIcon}>
              <Download color="#6B7280" size={20} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Export Data</Text>
              <Text style={styles.actionDescription}>Download your data</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Last Updated</Text>
            <Text style={styles.infoValue}>Aug 20, 2025</Text>
          </View>
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  infoValue: {
    fontSize: 16,
    color: '#6B7280',
  },
});