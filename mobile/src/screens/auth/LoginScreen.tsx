import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';

export const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const requestOtp = async () => {
    if (phoneNumber.length < 10) return Alert.alert('Error', 'Enter a valid phone number');
    
    setLoading(true);
    try {
      // Mocking Firebase OTP Request
      // const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setTimeout(() => {
        setStep('OTP');
        setLoading(false);
      }, 1000);
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Error', e.message);
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 4) return Alert.alert('Error', 'Enter valid OTP');
    
    setLoading(true);
    try {
      // Mocking Verification & Backend call
      const mockFirebaseUid = 'mock-uid-' + phoneNumber;
      
      const response = await api.post('/auth/login', {
        firebaseUid: mockFirebaseUid,
        phoneNumber,
        name: 'Farmer ' + phoneNumber.slice(-4),
      });

      if (response.data.success) {
        setAuth(response.data.data.token, response.data.data.user);
      }
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Login Failed', e.response?.data?.error || e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Seeva</Text>
      <Text style={styles.subtitle}>Empowering Farmers with AI</Text>

      {step === 'PHONE' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TouchableOpacity style={styles.button} onPress={requestOtp} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity style={styles.button} onPress={verifyOtp} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8fdf8' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, marginBottom: 20, fontSize: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
