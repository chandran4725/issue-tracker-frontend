import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Shield, Mail, Lock, User, KeyRound, ArrowRight } from 'lucide-react';
import { employeeApi } from '../../api/employeeApi';
import { setActiveUserEmail } from '../../api/client';

export function CustomLoginForm() {
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const { notifySuccess, notifyError } = useNotification();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Custom Sign In via Clerk API
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!isSignInLoaded) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
        notifySuccess('Successfully signed in!');
      } else {
        console.log('Additional sign in steps required:', result);
        notifyError('Additional verification required.');
      }
    } catch (err) {
      console.error('Clerk Sign In Error:', err);
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Sign in failed.';
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Custom Sign Up via Clerk API
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isSignUpLoaded) return;

    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setMode('verify');
      notifySuccess('Verification code sent to your email!');
    } catch (err) {
      console.error('Clerk Sign Up Error:', err);
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Sign up failed.';
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Verification Code Submission
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!isSignUpLoaded) return;

    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code,
      });

      if (completeSignUp.status === 'complete') {
        const fullName = `${firstName} ${lastName}`.trim() || email.split('@')[0];

        // Activate Clerk Session
        await setSignUpActive({ session: completeSignUp.createdSessionId });

        // Set active user email header and sync/create Employee in backend database
        if (email) {
          setActiveUserEmail(email);
          try {
            await employeeApi.syncClerk(email, fullName);
          } catch (syncErr) {
            console.warn('Auto employee creation note:', syncErr);
          }
        }

        notifySuccess('Account created, verified, and profile initialized!');
      } else {
        console.log('Verification incomplete:', completeSignUp);
        notifyError('Verification could not be completed.');
      }
    } catch (err) {
      console.error('Clerk Verification Error:', err);
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Verification failed.';
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800/20">
        {/* Top Branding Banner */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 p-8 text-white text-center">
          <div className="mx-auto w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Issue Tracker System</h1>
        </div>

        {/* Tab Selection */}
        {mode !== 'verify' && (
          <div className="grid grid-cols-2 border-b border-slate-100 text-sm font-semibold">
            <button
              onClick={() => setMode('signin')}
              className={`py-3.5 text-center border-b-2 transition-colors ${mode === 'signin'
                ? 'border-brand-600 text-brand-600 bg-brand-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-3.5 text-center border-b-2 transition-colors ${mode === 'signup'
                ? 'border-brand-600 text-brand-600 bg-brand-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form Container */}
        <div className="p-8">
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full mt-2" size="lg" isLoading={loading}>
                Sign In
              </Button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  placeholder="Alex"
                  icon={User}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="Rivera"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full mt-2" size="lg" isLoading={loading}>
                Create Account
              </Button>
            </form>
          )}

          {mode === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 border border-amber-100">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Enter Verification Code</h3>
                <p className="text-xs text-slate-500 mt-1">
                  We sent a 6-digit verification code to <span className="font-semibold text-slate-700">{email}</span>
                </p>
              </div>

              <Input
                label="Verification Code"
                type="text"
                placeholder="e.g. 123456"
                icon={KeyRound}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                Verify & Activate Account
              </Button>

              <button
                type="button"
                onClick={() => setMode('signup')}
                className="w-full text-xs text-slate-500 hover:text-brand-600 transition-colors pt-2 text-center"
              >
                ← Back to Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
