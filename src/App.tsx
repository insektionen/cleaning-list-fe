import { ToastBar, Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { UserProvider } from './user/user.context';
import SignIn from './views/SignIn';
import ApiErrorManager from './components/ApiErrorManager';
import Home from './views/Home';
import NewUserGenerateSecret from './views/NewUserGenerateSecret';
import NewUser from './views/NewUser';
import ForgotPassword from './views/ForgotPassword';
import CreateUser from './views/CreateUser';
import CreateList from './views/CreateList';
import Navbar from './components/Navbar';
import { roleAtLeast } from './util/minRole';
import UsersList from './views/UsersList';
import UserDetails from './views/UserDetails';
import ListDetails from './views/ListDetails';
import ListList from './views/ListList';
import { TranslationProvider } from './util/translation';
import PasswordReset from './views/PasswordReset';
import Settings from './views/Settings';

function App() {
	return (
		<BrowserRouter>
			<Toaster
				toastOptions={{ duration: 4_000, style: { backgroundColor: '#2d2d2d', color: '#eee' } }}
			/>
			<UserProvider
				providers={(children) => (
					<ApiErrorManager>
						<TranslationProvider>{children}</TranslationProvider>
					</ApiErrorManager>
				)}
				render={(user) => (
					<>
						<Navbar user={user} />
						<Routes>
							<Route path="/password-reset" element={<PasswordReset />} />
							{user ? (
								<>
									<Route path="/" element={<Home />} />
									<Route path="/settings" element={<Settings />} />

									<Route path="/lists" element={<ListList />} />
									<Route path="/lists/:listId" element={<ListDetails />} />
									<Route path="/create-list" element={<CreateList />} />

									{roleAtLeast(user.role, 'MOD') ? (
										<>
											<Route path="/users" element={<UsersList />} />
											<Route path="/users/:handle" element={<UserDetails />} />
											<Route path="/create-user" element={<CreateUser />} />
										</>
									) : (
										<Route path={`/users/${user.handle}`} element={<UserDetails />} />
									)}

									{user.role === 'ADMIN' && (
										<Route path="/generate-secret" element={<NewUserGenerateSecret />} />
									)}

									<Route path="*" element={<Navigate to="/" />} />
								</>
							) : (
								<>
									<Route path="/" element={<SignIn />} />
									<Route path="/forgot-password" element={<ForgotPassword />} />
									<Route path="/new-user" element={<NewUser />} />

									<Route path="*" element={<Navigate to="/" />} />
								</>
							)}
						</Routes>
					</>
				)}
			/>
		</BrowserRouter>
	);
}

export default App;
