import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type UserProfile = {
	id: string;
	email: string;
	display_name?: string;
	username?: string;
	role: 'USER' | 'ADMIN';
};

type AuthContextType = {
	user: UserProfile | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (
		email: string,
		password: string,
		displayName: string,
		username: string
	) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	// 🔁 Equivalent to FirebaseAuth.addAuthStateListener
	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange(
			async (_event, session) => {
				if (!session) {
					setUser(null);
					setLoading(false);
					return;
				}

				const { data: profile } = await supabase
					.from('users')
					.select('*')
					.eq('id', session.user.id)
					.single();

				setUser(profile);
				setLoading(false);
			}
		);

		return () => {
			data.subscription.unsubscribe();
		};
	}, []);

	async function signUp(
		email: string,
		password: string,
		displayName: string,
		username: string
	) {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) throw error;
		if (!data.user) throw new Error('User creation failed');

		await supabase.from('users').insert({
			id: data.user.id,
			email,
			display_name: displayName,
			username,
			role: 'USER',
		});
	}

	async function signIn(email: string, password: string) {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) throw error;
	}

	async function signOut() {
		await supabase.auth.signOut();
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
	return ctx;
}
