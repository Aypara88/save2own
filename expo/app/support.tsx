import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { MessageCircleQuestion, Mail, Phone, MessageCircle, HelpCircle, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react-native';

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

const FAQS: FAQ[] = [
  {
    id: '1',
    question: 'How do I start saving for a product?',
    answer: 'Browse products in the marketplace, select "Save to Own" on any product, then set up your savings plan with your preferred amount and frequency.',
  },
  {
    id: '2',
    question: 'Can I cash out my savings anytime?',
    answer: 'Yes, you can cash out your savings at any time. Go to the Cash Out section and follow the instructions to withdraw to your linked bank account.',
  },
  {
    id: '3',
    question: 'How do I add funds to my wallet?',
    answer: 'Tap "Add Funds" on the home screen, enter the amount, and choose your payment method (bank transfer, card, or USSD).',
  },
  {
    id: '4',
    question: 'Is my money safe?',
    answer: 'Yes, your funds are secured with bank-level encryption and stored in regulated financial institutions. We also use multi-factor authentication to protect your account.',
  },
  {
    id: '5',
    question: 'How do I change my savings goal?',
    answer: 'Go to your savings details, tap "Edit Goal" and adjust your target amount or timeline. Changes will take effect immediately.',
  },
];

export default function SupportScreen() {
  console.log('[SupportScreen] render');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const handleEmail = () => {
    const url = 'mailto:support@savingsapp.com?subject=Help%20with%20my%20account&body=Hi%20Support%20Team,%0A%0APlease%20describe%20your%20issue%20here...';
    Linking.openURL(url).catch((e) => {
      console.log('Email open failed', e);
      Alert.alert('Error', 'Could not open email app. Please contact support@savingsapp.com directly.');
    });
  };

  const handlePhone = () => {
    const phoneNumber = 'tel:+2348012345678';
    Linking.openURL(phoneNumber).catch((e) => {
      console.log('Phone open failed', e);
      Alert.alert('Error', 'Could not open phone app. Please call +234 801 234 5678 directly.');
    });
  };

  const handleWhatsApp = () => {
    const whatsappUrl = 'whatsapp://send?phone=2348012345678&text=Hi,%20I%20need%20help%20with%20my%20savings%20account';
    Linking.openURL(whatsappUrl).catch((e) => {
      console.log('WhatsApp open failed', e);
      Alert.alert('Error', 'WhatsApp not installed. Please install WhatsApp or use other contact methods.');
    });
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const renderFAQ = (faq: FAQ) => (
    <View key={faq.id} style={styles.faqCard}>
      <TouchableOpacity 
        style={styles.faqHeader}
        onPress={() => toggleFAQ(faq.id)}
      >
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        {expandedFAQ === faq.id ? (
          <ChevronUp color="#059669" size={20} />
        ) : (
          <ChevronDown color="#9CA3AF" size={20} />
        )}
      </TouchableOpacity>
      {expandedFAQ === faq.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{faq.answer}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container} testID="support-screen">
      <Stack.Screen 
        options={{ 
          title: 'Help & Support',
          headerStyle: { backgroundColor: '#059669' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <MessageCircleQuestion color="#fff" size={32} />
          <Text style={styles.heroTitle}>We&apos;re Here to Help</Text>
          <Text style={styles.heroSub}>Get support and find answers to common questions</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
            <View style={styles.contactIcon}>
              <Mail color="#059669" size={20} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactDescription}>support@savingsapp.com</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handlePhone}>
            <View style={styles.contactIcon}>
              <Phone color="#059669" size={20} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Phone Support</Text>
              <Text style={styles.contactDescription}>+234 801 234 5678</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp}>
            <View style={styles.contactIcon}>
              <MessageCircle color="#059669" size={20} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>WhatsApp</Text>
              <Text style={styles.contactDescription}>Chat with us instantly</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQS.map(renderFAQ)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Hours</Text>
          <View style={styles.hoursCard}>
            <Text style={styles.hoursTitle}>Customer Support</Text>
            <Text style={styles.hoursText}>Monday - Friday: 8:00 AM - 6:00 PM</Text>
            <Text style={styles.hoursText}>Saturday: 9:00 AM - 4:00 PM</Text>
            <Text style={styles.hoursText}>Sunday: Closed</Text>
            <Text style={styles.hoursNote}>All times are in West Africa Time (WAT)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.emergencyCard}>
            <HelpCircle color="#DC2626" size={24} />
            <Text style={styles.emergencyTitle}>Emergency Support</Text>
            <Text style={styles.emergencyText}>
              For urgent account security issues, please call our 24/7 emergency line at +234 700 SAVINGS
            </Text>
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
  contactCard: {
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
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 12,
  },
  hoursCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  hoursText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  hoursNote: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 8,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#991B1B',
    textAlign: 'center',
    lineHeight: 20,
  },
});