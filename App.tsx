import { Text, View, Button } from 'react-native';
import { AuthProvider, useAuth } from './src/features/auth/AuthContext';

import AuthScreen from './src/features/auth/AuthScreen';

function Home() {
	const { user, loading } = useAuth();

	if (loading) return <Text>Loading...</Text>;
	if (!user) return <AuthScreen />;

	return (
		<View style={{ padding: 24 }}>
			<Text>Welcome to Unimate 🎓</Text>
		</View>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<Home />
		</AuthProvider>
	);
}
