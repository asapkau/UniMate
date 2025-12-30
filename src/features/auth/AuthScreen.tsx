import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useAuth } from './AuthContext';

export default function AuthScreen() {
	const { signIn, signUp } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [displayName, setDisplayName] = useState('');
	const [busy, setBusy] = useState(false);

	async function handleSignUp() {
		try {
			setBusy(true);

			// quick sanity checks so you don't call Supabase with empty strings
			if (!email.includes('@')) throw new Error('Enter a valid email.');
			if (password.length < 6)
				throw new Error('Password must be at least 6 characters.');
			if (!username.trim()) throw new Error('Username is required.');
			if (!displayName.trim()) throw new Error('Display name is required.');

			await signUp(email.trim(), password, displayName.trim(), username.trim());
			Alert.alert('Success', 'Signed up! Check Supabase Auth → Users.');
		} catch (e: any) {
			console.log('SIGN UP ERROR:', e);
			Alert.alert('Sign up failed', e?.message ?? 'Unknown error');
		} finally {
			setBusy(false);
		}
	}

	async function handleSignIn() {
		try {
			setBusy(true);
			await signIn(email.trim(), password);
			Alert.alert('Success', 'Signed in!');
		} catch (e: any) {
			console.log('SIGN IN ERROR:', e);
			Alert.alert('Sign in failed', e?.message ?? 'Unknown error');
		} finally {
			setBusy(false);
		}
	}

	return (
		<View style={{ padding: 24, gap: 10 }}>
			<Text style={{ fontSize: 28, fontWeight: '600' }}>Unimate</Text>

			<TextInput
				placeholder="Email"
				autoCapitalize="none"
				value={email}
				onChangeText={setEmail}
				style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
			/>

			<TextInput
				placeholder="Password (min 6 chars)"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
			/>

			<TextInput
				placeholder="Display Name"
				value={displayName}
				onChangeText={setDisplayName}
				style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
			/>

			<TextInput
				placeholder="Username"
				autoCapitalize="none"
				value={username}
				onChangeText={setUsername}
				style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
			/>

			<Button
				title={busy ? 'Please wait...' : 'Sign Up'}
				onPress={handleSignUp}
				disabled={busy}
			/>
			<Button
				title={busy ? 'Please wait...' : 'Sign In'}
				onPress={handleSignIn}
				disabled={busy}
			/>
		</View>
	);
}
